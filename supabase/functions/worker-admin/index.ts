// Deploy as Supabase Edge Function "worker-admin".
// Uses the caller's JWT and verifies their admin role server-side.
import { createClient } from 'npm:@supabase/supabase-js@2';
const origin = Deno.env.get('PUBLIC_SITE_ORIGIN') || 'https://inventuraskladu.pages.dev';
const cors = { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers':'authorization,apikey,content-type,prefer,x-client-info', 'Access-Control-Allow-Methods':'POST,OPTIONS','Content-Type':'application/json' };
const respond = (status:number, data:unknown) => new Response(JSON.stringify(data), {status,headers:cors});
const sha256 = async (text:string) => [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(n=>n.toString(16).padStart(2,'0')).join('');
Deno.serve(async req => {
  if (req.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
  if (req.method!=='POST') return respond(405,{error:'Method not allowed'});
  if (req.headers.get('origin') && req.headers.get('origin')!==origin) return respond(403,{error:'Origin not allowed'});
  const project = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!project || !serviceKey) return respond(503,{error:'Service unavailable'});
  const jwt = (req.headers.get('Authorization')||'').replace(/^Bearer\s+/i,'');
  const db = createClient(project,serviceKey,{auth:{autoRefreshToken:false,persistSession:false}});
  const {data:authentication,error:authError} = await db.auth.getUser(jwt);
  if (authError || !authentication.user) return respond(401,{error:'Unauthorized'});
  const {data:profile,error:profileError}=await db.from('profiles').select('role').eq('id',authentication.user.id).maybeSingle();
  if (profileError || profile?.role!=='admin') return respond(403,{error:'Admin required'});
  let body:{action?:string;user_id?:string}={};
  try {body=await req.json()} catch {return respond(400,{error:'Invalid JSON'})}
  if(body.action==='list'){
    const {data,error}=await db.from('profiles').select('id,name,role').order('name');
    if(error) return respond(500,{error:'Unable to list users'});
    return respond(200,{users:data});
  }
  if(body.action==='invite'){
    const bytes=crypto.getRandomValues(new Uint8Array(18));
    const code=[...bytes].map(n=>n.toString(16).padStart(2,'0')).join('');
    const {error}=await db.from('worker_invitations').insert({code_hash:await sha256(code),expires_at:new Date(Date.now()+7*86400000).toISOString()});
    if(error) return respond(500,{error:'Unable to create invitation'});
    return respond(200,{invitation_code:code,expires_in_days:7});
  }
  if(body.action==='disable' || body.action==='enable'){
    const uid=String(body.user_id||'');
    if(!/^[0-9a-f-]{36}$/i.test(uid)) return respond(400,{error:'Invalid user ID'});
    if(uid===authentication.user.id) return respond(400,{error:'Cannot disable own account'});
    const {data:target}=await db.from('profiles').select('role').eq('id',uid).maybeSingle();
    if(!target || target.role==='admin') return respond(403,{error:'Only worker accounts can be managed'});
    const {error}=await db.auth.admin.updateUserById(uid,{ban_duration:body.action==='disable'?'876000h':'none'});
    if(error) return respond(500,{error:'Unable to change account status'});
    return respond(200,{ok:true});
  }
  return respond(400,{error:'Unknown operation'});
});
