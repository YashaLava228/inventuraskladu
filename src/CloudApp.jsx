import React, { useEffect, useState } from 'react';
import { Search, LogOut, RefreshCcw, Plus, Minus, Save, ScanLine, History } from 'lucide-react';

const url = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '');
const key = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const languageStorage = 'alemar_language';
const translations = {"cs":{"subtitle":"Alemar Food Group · LOUIE","refresh":"Obnovit","logout":"Odhlásit","scanTitle":"Skenování čárového kódu","scanHelp":"Namiřte kameru na čárový kód. Pokud skenování nefunguje, zadejte kód ručně.","cameraHelp":"Zkontrolujte oprávnění kamery v Safari.","manual":"Zadat kód ručně","find":"Vyhledat","closeCamera":"Zavřít kameru","current":"Aktuální stav","add":"Přidat","remove":"Odebrat","set":"Nastavit","newQty":"Nový přesný stav","howAdd":"Kolik přidat","howRemove":"Kolik odebrat","saveDb":"Uložit do databáze","close":"Zavřít","signIn":"Přihlášení","password":"Heslo","login":"Přihlásit se","noProfile":"profil nenalezen","products":"Sklad","history":"Historie změn","search":"Název, kód nebo čárový kód","scan":"Skenovat","positions":"položek","items":"položek","empty":"Databáze je prázdná.","open":"Otevřít položku","save":"Uložit","cancel":"Zrušit","all":"Všechny položky","boxes":"Krabice a obaly","labels":"Etikety LOUIE","pouches":"Kapsičky LOUIE","ontario":"Etikety Ontario","other":"Ostatní materiál","saved":"Změna uložena do Supabase","found":"Nalezeno: ","notFound":"Kód nebyl nalezen: ","notFoundSuffix":". Je potřeba ho propojit s položkou.","badNumber":"Zadejte platné celé množství.","conflict":"Stav mezitím změnil jiný pracovník. Obnovte údaje a zkuste to znovu.","cloud":"Skladová evidence","cameraError":"Kameru se nepodařilo spustit: ","scannerLib":"Knihovnu skeneru se nepodařilo načíst","scannerUnavailable":"Skener není dostupný"},"ua":{"subtitle":"Alemar Food Group · LOUIE","refresh":"Оновити","logout":"Вийти","scanTitle":"Сканування штрихкоду","scanHelp":"Наведи камеру на штрихкод. Якщо сканування недоступне, введи код вручну.","cameraHelp":"Перевір дозвіл камери в Safari.","manual":"Ввести код вручну","find":"Знайти","closeCamera":"Закрити камеру","current":"Поточний залишок","add":"Додати","remove":"Списати","set":"Встановити","newQty":"Новий точний залишок","howAdd":"Скільки додати","howRemove":"Скільки списати","saveDb":"{t.saveDb}","close":"Закрити","signIn":"Вхід","password":"Пароль","login":"Увійти","noProfile":"профіль відсутній","products":"Склад","history":"Історія змін","search":"Назва, код або штрихкод","scan":"Сканувати","positions":"позицій","items":"товарів","empty":"База поки порожня.","open":"Відкрити товар","save":"Зберегти","cancel":"Скасувати","all":"Усі товари","boxes":"Коробки та упаковка","labels":"Етикетки LOUIE","pouches":"Паучі LOUIE","ontario":"Етикетки Ontario","other":"Інші матеріали","saved":"Зміну збережено в Supabase","found":"Знайдено: ","notFound":"Код не знайдено: ","notFoundSuffix":". Потрібно прив'язати штрихкод до товару.","badNumber":"Введи правильну цілу кількість.","conflict":"Залишок змінив інший працівник. Онови дані та повтори.","cloud":"Облік складу","cameraError":"Камера не запустилась: ","scannerLib":"Не вдалося завантажити бібліотеку сканера","scannerUnavailable":"Сканер недоступний"},"en":{"subtitle":"Alemar Food Group · LOUIE","refresh":"Refresh","logout":"Sign out","scanTitle":"Scan barcode","scanHelp":"Point the camera at a barcode. If scanning fails, enter the code manually.","cameraHelp":"Check camera permissions in Safari.","manual":"Enter code manually","find":"Find","closeCamera":"Close camera","current":"Current stock","add":"Add","remove":"Remove","set":"Set","newQty":"New exact quantity","howAdd":"Amount to add","howRemove":"Amount to remove","saveDb":"Save to database","close":"Close","signIn":"Sign in","password":"Password","login":"Sign in","noProfile":"profile missing","products":"Stock","history":"History","search":"Name, product code or barcode","scan":"Scan","positions":"items","items":"items","empty":"The database is empty.","open":"Open item","save":"Save","cancel":"Cancel","all":"All products","boxes":"Boxes and packaging","labels":"LOUIE labels","pouches":"LOUIE pouches","ontario":"Ontario labels","other":"Other materials","saved":"Change saved to Supabase","found":"Found: ","notFound":"Code not found: ","notFoundSuffix":". Link this barcode to the product.","badNumber":"Enter a valid whole quantity.","conflict":"Another worker updated the stock. Refresh and try again.","cloud":"Warehouse inventory","cameraError":"Camera failed to start: ","scannerLib":"Could not load scanner library","scannerUnavailable":"Scanner unavailable"}};
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
  const [lang, setLang] = useState(() => localStorage.getItem(languageStorage) || 'cs');
  const t = translations[lang] || translations.cs;
  useEffect(() => { localStorage.setItem(languageStorage, lang); document.documentElement.lang = lang === 'cs' ? 'cs' : lang === 'ua' ? 'uk' : 'en'; }, [lang]);
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
  const [category, setCategory] = useState('all');
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [operationType, setOperationType] = useState('set');
  const categories = [
    { id: 'all', title: t.all, emoji: '🏬' },
    { id: 'boxes', title: t.boxes, emoji: '📦' },
    { id: 'louie-konzervy', title: t.labels, emoji: '🏷️' },
    { id: 'louie-kapsicky', title: t.pouches, emoji: '🧃' },
    { id: 'ontario', title: t.ontario, emoji: '🐾' },
    { id: 'ostatni', title: t.other, emoji: '🧰' }
  ];
  const selectedProduct = products.find(p => p.id === selectedProductId);
  function openProduct(product) {
    setSelectedProductId(product.id);
    setOperationType('set');
    setAmount(String(product.quantity));
  }

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
      setError(t.badNumber); return;
    }
    setBusy(item.id); setError(''); setNotice('');
    try {
      const path = mode === 'set' ? 'set_stock_quantity' : 'adjust_stock';
      const body = mode === 'set'
        ? { p_product_id: item.id, p_new_quantity: delta, p_expected_quantity: item.quantity }
        : { p_product_id: item.id, p_delta: delta };
      await request('/rest/v1/rpc/' + path, { method: 'POST', body });
      setEditing(null); setAmount('');
      setNotice(t.saved);
      await load();
    } catch (e) {
      setError(e.message.includes('Stock changed') ? t.conflict : e.message);
      await load();
    } finally { setBusy(''); }
  }

  const shown = products.filter(p =>
    (category === 'all' || p.category === category) &&
    (p.name + ' ' + p.id + ' ' + (p.barcode || '')).toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

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
    setSearch('');
    setCategory('all');
    setScannerOpen(false);
    const normalized = value.toUpperCase().replace(/\s+/g, '');
    const match = products.find(p =>
      [p.barcode, p.id].some(code => String(code || '').toUpperCase().replace(/\s+/g, '') === normalized)
    );
    if (match) {
      openProduct(match);
      setNotice(t.found + match.name);
    } else {
      setNotice(t.notFound + value + t.notFoundSuffix);
      setSearch(value);
    }
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
            script.onerror = () => reject(new Error(t.scannerLib));
            document.head.appendChild(script);
          });
        }
        if (canceled) return;
        if (!window.Html5Qrcode) throw new Error(t.scannerUnavailable);
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
        if (!canceled) setScannerError(t.cameraError + (err?.message || String(err)));
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
          <div><h1 className="text-2xl font-bold">ALEMAR FOOD GROUP</h1><p className="text-sm font-semibold text-fuchsia-300">LOUIE · {t.cloud}</p><p className="text-xs text-gray-400">{t.subtitle}</p></div>
          <label className="flex items-center gap-2 text-sm text-gray-300"><span>🌐</span><select aria-label="Language / Jazyk" value={lang} onChange={e=>setLang(e.target.value)} className="rounded-lg border border-white/20 bg-[#24182e] text-white p-2"><option value="cs">Čeština</option><option value="ua">Українська</option><option value="en">English</option></select></label>
          {session && <div className="flex gap-2"><button className={css.button} onClick={load}> <RefreshCcw size={16} className="inline"/> {t.refresh}</button><button className={css.button} onClick={logout}><LogOut size={16} className="inline"/> {t.logout}</button></div>}
        </header>
        {error && <div role="alert" className="p-3 rounded-lg bg-red-900/50 border border-red-500">{error}</div>}
        {notice && <div className="p-3 rounded-lg bg-emerald-900/40">{notice}</div>}
        {scannerOpen && <div className="fixed inset-0 z-50 bg-black/85 flex justify-center items-center p-4" role="dialog" aria-modal="true" aria-label={t.scanTitle}>
          <div className="w-full max-w-lg bg-[#1c1326] border border-white/20 rounded-2xl p-5 space-y-3">
            <h2 className="text-xl font-bold">{t.scanTitle}</h2>
            <p className="text-sm text-gray-300">{t.scanHelp}</p>
            <div className="relative rounded-xl overflow-hidden aspect-video bg-black">
              <div id="cloud-barcode-reader" className="w-full h-full"/>
              <div className="absolute inset-x-[5%] top-[15%] bottom-[15%] border-2 border-fuchsia-400 rounded-xl pointer-events-none"/>
            </div>
            {scannerError && <p role="alert" className="text-amber-300 text-sm">{scannerError}. {t.cameraHelp}</p>}
            <form onSubmit={e=>{e.preventDefault();resolveCode(scanInput)}} className="flex gap-2">
              <input className={css.input} value={scanInput} onChange={e=>setScanInput(e.target.value)} placeholder={t.manual} autoFocus/>
              <button type="submit" className={css.button}>{t.find}</button>
            </form>
            <button className={join(css.button,'w-full')} onClick={closeScanner}>{t.closeCamera}</button>
          </div>
        </div>}
        {selectedProduct && <div className="fixed inset-0 z-40 bg-black/85 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={t.open}>
          <div className="w-full max-w-lg rounded-2xl bg-[#21162d] border border-fuchsia-400/40 p-5 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between gap-4 items-start">
              <div><div className="text-sm text-fuchsia-300 font-semibold">{selectedProduct.id}</div><h2 className="text-xl font-bold mt-1">{selectedProduct.name}</h2><p className="text-sm text-gray-400">{selectedProduct.category}</p></div>
              <button className="p-2 rounded-lg bg-white/10" onClick={()=>setSelectedProductId(null)} aria-label={t.close}>✕</button>
            </div>
            <div className="bg-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-300">{t.current}</p>
              <div className="text-4xl font-extrabold">{selectedProduct.quantity} <span className="text-xl text-gray-300">{selectedProduct.unit}</span></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[{id:'add',label:'➕ '+t.add},{id:'remove',label:'➖ '+t.remove},{id:'set',label:'✏️ '+t.set}].map(o=>
                <button key={o.id} onClick={()=>{setOperationType(o.id);setAmount(o.id==='set' ? String(selectedProduct.quantity) : '1')}} className={'p-2.5 text-sm rounded-xl border ' + (operationType===o.id?'bg-fuchsia-700 border-fuchsia-300':'bg-white/5 border-white/20')}>{o.label}</button>
              )}
            </div>
            <label className="block text-sm text-gray-300">{operationType==='set' ? t.newQty : operationType==='add' ? t.howAdd : t.howRemove} ({selectedProduct.unit})</label>
            <input type="number" min={operationType==='set'?0:1} step="1" inputMode="numeric" className={css.input} value={amount} onChange={e=>setAmount(e.target.value)}/>
            <button className={join(css.button,'w-full')} disabled={!!busy || amount.trim()==='' || !Number.isSafeInteger(Number(amount)) || Number(amount)<(operationType==='set'?0:1)} onClick={()=>change(selectedProduct,operationType==='set' ? Number(amount) : operationType==='add' ? Number(amount) : -Number(amount), operationType==='set'?'set':'delta')}>
              <Save size={17} className="inline"/> {t.saveDb}
            </button>
            {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
            <button className="w-full text-gray-300 py-2" onClick={()=>setSelectedProductId(null)}>{t.close}</button>
          </div>
        </div>}
        {!session ? <form onSubmit={login} className="max-w-sm space-y-3 bg-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-semibold">{t.signIn}</h2>
          <input className={css.input} type="email" required placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
          <input className={css.input} type="password" required placeholder={t.password} value={password} onChange={e=>setPassword(e.target.value)} />
          <button disabled={!!busy} className={css.button}>{t.login}</button>
        </form> : <>
          <div className="flex gap-2 items-center flex-wrap">
            <span className="text-sm text-gray-300">{profile?.name || session.user?.email} • {profile?.role || t.noProfile}</span>
            <button className={css.button} onClick={()=>setView('stock')}>{t.products}</button>
            <button className={css.button} onClick={()=>setView('history')}><History size={16} className="inline"/> {t.history}</button>
          </div>
          {view === 'stock' ? <>
            <div className="flex gap-2 items-center">
              <div className="relative grow"><Search size={18} className="absolute top-3.5 left-3 text-gray-400"/><input className={join(css.input,'pl-10')} placeholder={t.search} value={search} onChange={e=>setSearch(e.target.value)}/></div>
              <button className={css.button} title={t.scan} onClick={()=>{setError("");setScanInput("");setScannerError("");setScannerOpen(true)}}><ScanLine/></button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {categories.map(c => <button key={c.id} onClick={()=>{setCategory(c.id);setSearch('')}} className={'text-left p-3 rounded-xl border transition-colors ' + (category===c.id ? 'border-fuchsia-400 bg-fuchsia-900/50' : 'border-white/10 bg-white/5')}>
                <span aria-hidden="true">{c.emoji}</span> <span className="font-medium">{c.title}</span>
                <span className="block text-xs text-gray-400 mt-1">{c.id==='all' ? products.length : products.filter(p=>p.category===c.id).length} {t.positions}</span>
              </button>)}
            </div>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{categories.find(c=>c.id===category)?.title}</h2>
              <span className="text-sm text-gray-400">{shown.length} {t.items}</span>
            </div>
            {products.length === 0 && !busy && <p className="text-amber-300">{t.empty}</p>}
            <div className="grid gap-3">
            {shown.map(item => <section key={item.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
              <div className="flex justify-between gap-3 items-start">
                <div><h2 className="font-semibold">{item.name}</h2><p className="text-gray-400 text-sm">{item.id} • {item.category}</p></div>
                <div className="text-right min-w-24"><div className="text-2xl font-bold">{item.quantity}</div><div className="text-gray-400">{item.unit}</div></div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <button disabled={!!busy} className={css.button} onClick={()=>change(item,-1,'delta')}><Minus size={16} className="inline"/> 1</button>
                <button disabled={!!busy} className={css.button} onClick={()=>change(item,1,'delta')}><Plus size={16} className="inline"/> 1</button>
                <button disabled={!!busy} className={css.button} onClick={()=>openProduct(item)}>{t.open}</button>
              </div>
              {editing===item.id && <div className="flex gap-2 items-center mt-3 flex-wrap">
                <input type="number" min="0" step="1" className={join(css.input,'max-w-36')} value={amount} onChange={e=>setAmount(e.target.value)}/>
                <button className={css.button} disabled={!!busy || amount.trim()==='' || !Number.isSafeInteger(Number(amount)) || Number(amount)<0} onClick={()=>change(item,Number(amount),'set')}><Save size={16} className="inline"/> {t.save}</button>
                <button onClick={()=>setEditing(null)}>{t.cancel}</button>
              </div>}
            </section>)}
            </div>
          </> : <div className="space-y-2">{history.map(h => <div key={h.id} className="p-3 bg-white/5 rounded-xl"><b>{h.product_id}</b> • {h.old_quantity} → {h.new_quantity} ({h.change_amount > 0 ? '+' : ''}{h.change_amount})<div className="text-xs text-gray-400">{h.action} • {new Date(h.created_at).toLocaleString()}</div></div>)}</div>}
        </>}
      </main>
    </div>
  );
}
