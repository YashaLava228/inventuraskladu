import React, { useEffect, useState } from 'react';
import { Search, LogOut, RefreshCcw, Plus, Minus, Save, ScanLine, History } from 'lucide-react';

const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const tokenStorage = 'inventuraskladu_cloud_session_v1';
const css = {
  input: 'w-full p-3 rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:border-fuchsia-400',
  button: 'px-4 py-2.5 rounded-xl bg-fuchsia-700 hover:bg-fuchsia-600 disabled:opacity-40 text-white font-semibold',
};
const join = (...parts) => parts.join(' ');
const getSession = () => {
  try { return JSON.parse(sessionStorage.getItem(tokenStorage) || 'null'); }
  catch { return null; }
};

async function api(path, { method = 'GET', body, token } = {}) {
  if (!url || !key) throw new Error('Supabase configuration missing');
  const response = await fetch(url + path, {
    method,
    headers: {
      apikey: key,
      Authorization: 'Bearer ' + (token || key),
      'Content-Type': 'application/json',
      ...(method !== 'GET' ? { Prefer: 'return=representation' } : {})
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {})
  });
  const raw = await response.text();
  let data;
  try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }
  if (!response.ok) throw new Error(data?.message || data?.error_description || data?.error || 'Request failed');
  return data;
}

async function signIn(email, password) {
  return api('/auth/v1/token?grant_type=password', { method: 'POST', body: { email, password } });
}

export default function CloudApp() {
  const [session, setSession] = useState(getSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState([]);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [editing, setEditing] = useState(null);
  const [amount, setAmount] = useState('');
  const [view, setView] = useState('stock');

  async function request(path, opts) {
    if (!session) throw new Error('Please sign in');
    let current = session;
    if (current.expires_at && current.expires_at < Math.floor(Date.now() / 1000) + 60) {
      const refreshed = await api('/auth/v1/token?grant_type=refresh_token', {
        method: 'POST', body: { refresh_token: current.refresh_token }
      });
      current = { ...refreshed, expires_at: Math.floor(Date.now() / 1000) + refreshed.expires_in };
      sessionStorage.setItem(tokenStorage, JSON.stringify(current));
      setSession(current);
    }
    return api(path, { ...opts, token: current.access_token });
  }

  async function load() {
    if (!session) return;
    setBusy('load'); setError('');
    try {
      const [p, h, me] = await Promise.all([
        request('/rest/v1/products?select=*&order=name.asc'),
        request('/rest/v1/stock_history?select=*&order=created_at.desc&limit=100'),
        request('/rest/v1/profiles?select=id,name,role&id=eq.' + encodeURIComponent(session.user.id))
      ]);
      setProducts(p || []);
      setHistory(h || []);
      setProfile(me?.[0] || null);
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  }

  useEffect(() => { if (session) load(); }, [session?.user?.id]);

  async function login(e) {
    e.preventDefault(); setBusy('login'); setError('');
    try {
      const result = await signIn(email.trim(), password);
      const auth = { ...result, expires_at: Math.floor(Date.now() / 1000) + result.expires_in };
      sessionStorage.setItem(tokenStorage, JSON.stringify(auth));
      setSession(auth); setPassword('');
    } catch (e) { setError(e.message); }
    finally { setBusy(''); }
  }

  function logout() {
    sessionStorage.removeItem(tokenStorage);
    setSession(null); setProducts([]); setHistory([]); setProfile(null); setEditing(null);
  }

  async function change(item, delta, mode) {
    if (!Number.isSafeInteger(delta) || (mode === 'set' ? delta < 0 : delta === 0)) {
      setError('Введіть правильну цілу кількість'); return;
    }
    setBusy(item.id); setError(''); setNotice('');
    try {
      const path = mode === 'set' ? 'set_stock_quantity' : 'adjust_stock';
      const body = mode === 'set'
        ? { p_product_id: item.id, p_new_quantity: delta, p_expected_quantity: item.quantity }
        : { p_product_id: item.id, p_delta: delta };
      await request('/rest/v1/rpc/' + path, { method: 'POST', body });
      setEditing(null); setAmount('');
      setNotice('Зміну збережено в Supabase');
      await load();
    } catch (e) {
      setError(e.message.includes('Stock changed') ? 'Залишок змінив інший працівник. Оновіть дані та повторіть.' : e.message);
      await load();
    } finally { setBusy(''); }
  }

  const shown = products.filter(p => (p.name + ' ' + p.id + ' ' + (p.barcode || '')).toLocaleLowerCase().includes(search.toLocaleLowerCase()));

  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scannerError, setScannerError] = useState('');
  const scannerRef = React.useRef(null);
  const startingRef = React.useRef(false);
  const scanHandledRef = React.useRef(false);

  function resolveCode(raw) {
    const value = String(raw || '').trim();
    if (!value || scanHandledRef.current) return;
    scanHandledRef.current = true;
    setSearch(value);
    setScannerOpen(false);
    const normalized = value.toUpperCase().replace(/\s+/g, '');
    const match = products.find(p =>
      [p.barcode, p.id].some(code => String(code || '').toUpperCase().replace(/\s+/g, '') === normalized)
    );
    setNotice(match ? 'Знайдено: ' + match.name : 'Код ' + value + ' не знайдено. Потрібно зв’язати штрихкод з артикулом.');
  }

  useEffect(() => {
    if (!scannerOpen) return;
    let canceled = false;
    scanHandledRef.current = false;
    setScannerError('');
    async function open() {
      try {
        // Use a JS-based decoder rather than Safari's unavailable BarcodeDetector API.
        if (!window.Html5Qrcode) {
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/html5-qrcode.min.js';
            script.async = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Не вдалося завантажити бібліотеку сканера'));
            document.head.appendChild(script);
          });
        }
        if (canceled) return;
        if (!window.Html5Qrcode) throw new Error('Бібліотека сканера недоступна');
        const scanner = new window.Html5Qrcode('cloud-barcode-reader', { verbose: false });
        scannerRef.current = scanner;
        startingRef.current = true;
        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, disableFlip: false, videoConstraints: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } },
          result => resolveCode(result),
          () => {}
        );
        startingRef.current = false;
        if (canceled) {
          await scanner.stop().catch(() => {});
          scanner.clear();
        }
      } catch (err) {
        startingRef.current = false;
        if (!canceled) setScannerError('Камера не запустилась: ' + (err?.message || String(err)));
      }
    }
    open();
    return () => {
      canceled = true;
      const scanner = scannerRef.current;
      scannerRef.current = null;
      if (scanner) {
        Promise.resolve().then(async () => {
          try {
            if (scanner.getState?.() === 2) await scanner.stop();
          } catch (err) { console.warn('Scanner cleanup', err); }
          try { scanner.clear(); } catch (err) { console.warn('Scanner clear', err); }
        });
      }
    };
  }, [scannerOpen]);

  function closeScanner() {
    setScannerOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#110b19] text-white p-4 md:p-8">
      <main className="max-w-5xl mx-auto space-y-5">
        <header className="flex flex-wrap justify-between items-center gap-3">
          <div><h1 className="text-2xl font-bold">Inventura Skladu</h1><p className="text-sm text-gray-400">Хмарна тестова версія • Supabase</p></div>
          {session && <div className="flex gap-2"><button className={css.button} onClick={load}> <RefreshCcw size={16} className="inline"/> Оновити</button><button className={css.button} onClick={logout}><LogOut size={16} className="inline"/> Вийти</button></div>}
        </header>
        {error && <div role="alert" className="p-3 rounded-lg bg-red-900/50 border border-red-500">{error}</div>}
        {notice && <div className="p-3 rounded-lg bg-emerald-900/40">{notice}</div>}
        {scannerOpen && <div className="fixed inset-0 z-50 bg-black/85 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-label="Сканування штрихкоду">
          <div className="w-full max-w-lg bg-[#1c1326] border border-white/20 rounded-2xl p-5 space-y-3">
            <h2 className="text-xl font-bold">Сканування штрихкоду</h2>
            <p className="text-sm text-gray-300">Наведи камеру на код етикетки. Якщо сканування недоступне, введи код нижче.</p>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
              <div id="cloud-barcode-reader" className="w-full h-full"/>
              <div className="absolute inset-x-[5%] top-[15%] bottom-[15%] border-2 border-fuchsia-400 rounded-xl pointer-events-none"/>
            </div>
            {scannerError && <p role="alert" className="text-amber-300 text-sm">{scannerError}. Перевірте дозвіл камери в Safari → Налаштування вебсайту.</p>}
            <form onSubmit={e=>{e.preventDefault();resolveCode(scanInput)}} className="flex gap-2">
              <input className={css.input} value={scanInput} onChange={e=>setScanInput(e.target.value)} placeholder="Ввести код вручну" autoFocus/>
              <button type="submit" className={css.button}>Знайти</button>
            </form>
            <button className={join(css.button,'w-full')} onClick={closeScanner}>Закрити камеру</button>
          </div>
        </div>}
        {!session ? <form onSubmit={login} className="max-w-sm space-y-3 bg-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">Вхід через Supabase Auth</h2>
          <input className={css.input} type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className={css.input} type="password" required placeholder="Пароль" value={password} onChange={e=>setPassword(e.target.value)} />
          <button disabled={!!busy} className={css.button}>Увійти</button>
        </form> : <>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm text-gray-300">{profile?.name || session.user?.email} • {profile?.role || 'профіль відсутній'}</span>
            <button className={css.button} onClick={()=>setView('stock')}>Товари</button>
            <button className={css.button} onClick={()=>setView('history')}><History size={16} className="inline"/> Історія</button>
          </div>
          {view === 'stock' ? <>
            <div className="flex gap-2 items-center">
              <div className="relative grow"><Search size={18} className="absolute top-3.5 left-3 text-gray-400"/><input className={join(css.input,'pl-10')} placeholder="Назва, код або штрихкод" value={search} onChange={e=>setSearch(e.target.value)}/></div>
              <button className={css.button} title="Сканувати" onClick={()=>{setError("");setScanInput("");setScannerError("");setScannerOpen(true)}}><ScanLine/></button>
            </div>
            {products.length === 0 && !busy && <p className="text-amber-300">База поки порожня. Перед імпортом перевіримо умовні кількості.</p>}
            <div className="grid gap-3">
            {shown.map(item => <section key={item.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex justify-between gap-3 items-start">
                <div><h2 className="font-semibold">{item.name}</h2><p className="text-gray-400 text-sm">{item.id} • {item.category}</p></div>
                <div className="text-right min-w-24"><div className="text-2xl font-bold">{item.quantity}</div><div className="text-gray-400">{item.unit}</div></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button disabled={!!busy} className={css.button} onClick={()=>change(item,-1,'delta')}><Minus size={16} className="inline"/> 1</button>
                <button disabled={!!busy} className={css.button} onClick={()=>change(item,1,'delta')}><Plus size={16} className="inline"/> 1</button>
                <button disabled={!!busy} className={css.button} onClick={()=>{setEditing(item.id);setAmount(String(item.quantity));}}>Вписати кількість</button>
              </div>
              {editing===item.id && <div className="flex gap-2 items-center mt-3 flex-wrap">
                <input type="number" min="0" step="1" className={join(css.input,'max-w-36')} value={amount} onChange={e=>setAmount(e.target.value)}/>
                <button className={css.button} disabled={!!busy || amount.trim()==='' || !Number.isSafeInteger(Number(amount)) || Number(amount)<0} onClick={()=>change(item,Number(amount),'set')}><Save size={16} className="inline"/> Зберегти</button>
                <button onClick={()=>setEditing(null)}>Скасувати</button>
              </div>}
            </section>)}
            </div>
          </> : <div className="space-y-2">{history.map(h => <div key={h.id} className="p-3 bg-white/5 rounded-xl"><b>{h.product_id}</b> • {h.old_quantity} → {h.new_quantity} ({h.change_amount > 0 ? '+' : ''}{h.change_amount})<div className="text-xs text-gray-400">{h.action} • {new Date(h.created_at).toLocaleString()}</div></div>)}</div>}
        </>}
      </main>
    </div>
  );
}
