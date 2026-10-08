import TemperatureMonitor from './TemperatureMonitor';
import React, { useState, useEffect } from 'react';
import { 
  Plus, Minus, Search, AlertTriangle, Settings, 
  Globe, UserCheck, Shield, Send, Trash2, LogOut, Key, User,
  History, Users, ShieldAlert, Layers, Filter, Warehouse,
  Package, Barcode, Tag, Box
} from 'lucide-react';
import { initialItems } from './itemsData';

// Геометричний логотип ALEMARE
const AlemareLogo = () => (
  <svg className="w-8 h-8 text-fuchsia-300 drop-shadow-md" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="50,30 35,15 27,35" />
    <polygon points="50,30 65,15 73,35" />
    <line x1="50" y1="30" x2="50" y2="70" />
    <line x1="35" y1="15" x2="50" y2="30" />
    <line x1="65" y1="15" x2="50" y2="30" />
    <polyline points="27,35 20,60 38,70 50,84 62,70 80,60 73,35" />
    <line x1="27" y1="35" x2="50" y2="48" />
    <line x1="73" y1="35" x2="50" y2="48" />
    <line x1="20" y1="60" x2="50" y2="48" />
    <line x1="80" y1="60" x2="50" y2="48" />
    <line x1="20" y1="60" x2="38" y2="70" />
    <line x1="80" y1="60" x2="62" y2="70" />
    <line x1="38" y1="70" x2="62" y2="70" />
    <line x1="40" y1="76" x2="60" y2="76" />
    <line x1="38" y1="70" x2="42" y2="84" />
    <line x1="62" y1="70" x2="58" y2="84" />
    <line x1="42" y1="84" x2="58" y2="84" />
  </svg>
);

const defaultUsers = [
  { username: 'admin', password: '9999', name: 'Hlavní Admin', role: 'admin' },
  { username: 'pracovnik1', password: '1111', name: 'Skladník Jan', role: 'worker' }
];

// Словник складських одиниць виміру
const unitsMap = {
  cs: { pal: 'palet', krab: 'krabic', bal: 'balíků', ks: 'ks' },
  ua: { pal: 'палет', krab: 'коробок', bal: 'баліків', ks: 'шт.' },
  en: { pal: 'pallets', krab: 'boxes', bal: 'packs', ks: 'pcs' }
};

const translations = {
  cs: {
    title: 'LOUIE SkladEvidence',
    subTitle: 'ALEMARE Warehouse System',
    worker: 'Pracovník',
    manager: 'Vedoucí',
    admin: 'Admin',
    searchPlaceholder: 'Hledat název nebo kód (např. LOU 11009)...',
    lowStock: 'Nízký stav',
    minLimit: 'Min.',
    addItem: 'Přidat položku',
    itemName: 'Název / Kód',
    category: 'Kategorie',
    telegramSettings: 'Nastavení Telegramu',
    botToken: 'Bot Token',
    chatId: 'Chat ID',
    allCategories: 'Všechny regály',
    boxes: '📦 Krabice a Obaly (palety)',
    louieKonzervy: '🏷️ LOUIE Etikety Konzerv (balíky)',
    louieKapsicky: '👛 LOUIE Kapsičky (krabice)',
    ontario: '🏷️ Ontario Etikety Konzerv (balíky)',
    confirmDelete: 'Smazat položku?',
    loginTitle: 'Vstup do LOUIE Sklad',
    usernamePlaceholder: 'Uživatelské jméno',
    passwordPlaceholder: 'Heslo / PIN',
    loginBtn: 'Přihlásit se',
    wrongPassword: 'Špatné heslo!',
    logout: 'Odhlásit',
    loginAs: 'Přihlášen:',
    clearCache: 'Obnovit výchozí sklad',
    historyTab: 'Historie změn',
    usersTab: 'Uživatelé',
    stockTab: 'Sklad (Regály)',
    allWeights: 'Všechny gramáže',
    itemsCount: 'položek',
    totalStock: 'Celkem položek',
    totalItems: 'Aktivní SKU',
    lowStockAlerts: 'Kritické položky',
    shelfPrefix: 'REGÁL'
  },
  ua: {
    title: 'LOUIE СкладОблік',
    subTitle: 'Система ALEMARE',
    worker: 'Працівник',
    manager: 'Керівник',
    admin: 'Адмін',
    searchPlaceholder: 'Пошук назви чи артикулу...',
    lowStock: 'Малий залишок',
    minLimit: 'Мін.',
    addItem: 'Додати позицію',
    itemName: 'Назва / Артикул',
    category: 'Категорія',
    telegramSettings: 'Налаштування Telegram',
    botToken: 'Bot Token',
    chatId: 'Chat ID',
    allCategories: 'Усі полиці',
    boxes: '📦 Krabice (Палети)',
    louieKonzervy: '🏷️ LOUIE Етикетки (Баліки)',
    louieKapsicky: '👛 LOUIE Паучі (Коробки)',
    ontario: '🏷️ Ontario Етикетки (Баліки)',
    confirmDelete: 'Видалити позицію?',
    loginTitle: 'Вхід у LOUIE Склад',
    usernamePlaceholder: 'Логін',
    passwordPlaceholder: 'Пароль / PIN',
    loginBtn: 'Увійти',
    wrongPassword: 'Невірний пароль!',
    logout: 'Вийти',
    loginAs: 'Увійшов:',
    clearCache: 'Оновити початковий склад',
    historyTab: 'Історія дій',
    usersTab: 'Користувачі',
    stockTab: 'Склад (Полиці)',
    allWeights: 'Усі ваги',
    itemsCount: 'позицій',
    totalStock: 'Всього матеріалів',
    totalItems: 'Активні SKU',
    lowStockAlerts: 'Критичні залишки',
    shelfPrefix: 'СТЕЛАЖ'
  },
  en: {
    title: 'LOUIE StockTracker',
    subTitle: 'ALEMARE Warehouse System',
    worker: 'Worker',
    manager: 'Manager',
    admin: 'Admin',
    searchPlaceholder: 'Search name or code...',
    lowStock: 'Low Stock',
    minLimit: 'Min',
    addItem: 'Add Item',
    itemName: 'Item Name / Code',
    category: 'Category',
    telegramSettings: 'Telegram Settings',
    botToken: 'Bot Token',
    chatId: 'Chat ID',
    allCategories: 'All Shelves',
    boxes: '📦 Krabice (Pallets)',
    louieKonzervy: '🏷️ LOUIE Can Labels (Packs)',
    louieKapsicky: '👛 LOUIE Pouches (Boxes)',
    ontario: '🏷️ Ontario Can Labels (Packs)',
    confirmDelete: 'Delete item?',
    loginTitle: 'LOUIE Inventory Login',
    usernamePlaceholder: 'Username',
    passwordPlaceholder: 'Password / PIN',
    loginBtn: 'Login',
    wrongPassword: 'Incorrect password!',
    logout: 'Logout',
    loginAs: 'Logged in:',
    clearCache: 'Reset default stock',
    historyTab: 'Audit Log',
    usersTab: 'Users',
    stockTab: 'Stock Shelves',
    allWeights: 'All weights',
    itemsCount: 'items',
    totalStock: 'Total Materials Stocked',
    totalItems: 'Active SKUs',
    lowStockAlerts: 'Low Stock Alerts',
    shelfPrefix: 'SHELF'
  }
};

export default function App() {
  const [lang, setLang] = useState('cs');
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState('stock');

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('louie_users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('louie_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('louie_items');
    return saved ? JSON.parse(saved) : initialItems;
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('louie_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedWeight, setSelectedWeight] = useState('all');

  const [tgToken, setTgToken] = useState(() => localStorage.getItem('tg_token') || '');
  const [tgChatId, setTgChatId] = useState(() => localStorage.getItem('tg_chat_id') || '');
  const [showSettings, setShowSettings] = useState(false);

  const [newItem, setNewItem] = useState({ name: '', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 });

  useEffect(() => {
    localStorage.setItem('louie_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('louie_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('louie_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('louie_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('louie_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('tg_token', tgToken);
    localStorage.setItem('tg_chat_id', tgChatId);
  }, [tgToken, tgChatId]);

  const logAction = (actionText, details = '') => {
    const newLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleString('cs-CZ'),
      userName: currentUser ? currentUser.name : 'Systém',
      userRole: currentUser ? currentUser.role : 'system',
      action: actionText,
      details: details
    };
    setHistory(prev => [newLog, ...prev]);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const uName = loginUsername.trim();
    const uPass = loginPassword.trim();

    if (!uName || !uPass) return;

    if (uName.toLowerCase() === 'admin') {
      if (uPass === '9999') {
        const adminAcc = { username: 'admin', password: '9999', name: 'Admin ALEMARE', role: 'admin' };
        setCurrentUser(adminAcc);
        setLoginError('');
        setLoginUsername('');
        setLoginPassword('');
        return;
      } else {
        setLoginError(t.wrongPassword);
        return;
      }
    }

    const existingUser = users.find(u => u.username.toLowerCase() === uName.toLowerCase());

    if (existingUser) {
      if (existingUser.password === uPass) {
        setCurrentUser(existingUser);
        setLoginError('');
        setLoginUsername('');
        setLoginPassword('');
      } else {
        setLoginError(t.wrongPassword);
      }
    } else {
      const newUser = { username: uName, password: uPass, name: uName, role: 'worker' };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setLoginError('');
      setLoginUsername('');
      setLoginPassword('');
      logAction(`Nový uživatel zaregistrován: ${uName}`);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowSettings(false);
    setActiveTab('stock');
  };

  const handleUserRoleChange = (targetUsername, newRole) => {
    setUsers(prev => prev.map(u => u.username === targetUsername ? { ...u, role: newRole } : u));
    if (currentUser && currentUser.username === targetUsername) {
      setCurrentUser(prev => ({ ...prev, role: newRole }));
    }
    logAction(`Změna role pro ${targetUsername}`, `Nová role: ${newRole.toUpperCase()}`);
  };

  const getUnitName = (u) => {
    const langUnits = unitsMap[lang] || unitsMap.cs;
    return langUnits[u] || u || 'ks';
  };

  const sendTelegramAlert = async (itemName, currentQty, minQty, unit) => {
    if (!tgToken || !tgChatId) return;
    const unitText = getUnitName(unit);
    const text = `⚠️ *Pozor! Nízký stav na skladě LOUIE!*\n\n📦 *Položka:* ${itemName}\n📉 *Zůstává:* ${currentQty} ${unitText}\n🚨 *Min. limit:* ${minQty} ${unitText}`;
    
    try {
      await fetch(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: tgChatId, text: text, parse_mode: 'Markdown' })
      });
    } catch (err) {
      console.error('Telegram error:', err);
    }
  };

  const updateQuantity = (id, delta) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        const sign = delta > 0 ? `+${delta}` : `${delta}`;
        const unitName = getUnitName(item.unit);
        
        logAction(`Změna množství: ${item.name}`, `${item.quantity} ${unitName} ➔ ${newQty} ${unitName} (${sign})`);

        if (newQty < item.minLimit && item.quantity >= item.minLimit) {
          sendTelegramAlert(item.name, newQty, item.minLimit, item.unit);
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.name.trim()) return;
    const item = {
      id: Date.now().toString(),
      name: newItem.name,
      category: newItem.category,
      weight: newItem.weight,
      unit: newItem.unit,
      quantity: Number(newItem.quantity),
      minLimit: Number(newItem.minLimit)
    };
    setItems([...items, item]);
    logAction(`Přidána položka`, `${item.name} (${item.quantity} ${getUnitName(item.unit)})`);
    setNewItem({ name: '', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 });
  };

  const handleDelete = (id) => {
    const itemToDelete = items.find(i => i.id === id);
    if (confirm(t.confirmDelete)) {
      setItems(items.filter(i => i.id !== id));
      if (itemToDelete) logAction(`Smazána položka`, `${itemToDelete.name}`);
    }
  };

  const handleResetData = () => {
    if (confirm('Obnovit kompletní seznam zboží z itemsData.js?')) {
      localStorage.removeItem('louie_items');
      setItems(initialItems);
      logAction('Obnoven kompletní sklad z itemsData.js');
    }
  };

  const filteredItems = items.filter(item => {
  const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
  const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
  
  // Якщо вибрано 'all' АБО якщо у елемента немає ваги / 'N/A', він проходить перевірку
  const matchesWeight = selectedWeight === 'all' || item.weight === selectedWeight || item.weight === 'N/A' || !item.weight;
  
  return matchesSearch && matchesCat && matchesWeight;
});
  const totalStockQty = items.reduce((sum, i) => sum + i.quantity, 0);
  const lowStockCount = items.filter(i => i.quantity < i.minLimit).length;

  const shelves = [
    { key: 'boxes', code: 'A-01', title: t.boxes, items: filteredItems.filter(i => i.category === 'boxes') },
    { key: 'louie-kapsicky', code: 'B-02', title: t.louieKapsicky, items: filteredItems.filter(i => i.category === 'louie-kapsicky') },
    { key: 'louie-konzervy', code: 'C-03', title: t.louieKonzervy, items: filteredItems.filter(i => i.category === 'louie-konzervy') },
    { key: 'ontario', code: 'D-04', title: t.ontario, items: filteredItems.filter(i => i.category === 'ontario') },
    { key: 'ostatni', code: 'E-05', title: t.ostatni || 'Ostatní', items: filteredItems.filter(i => i.category === 'ostatni') },
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#150a18] text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-[#210f27] p-8 rounded-3xl border border-[#9d1c6a]/40 shadow-2xl max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-4 bg-[#9d1c6a] rounded-2xl mb-2 shadow-lg shadow-[#9d1c6a]/40">
              <AlemareLogo />
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">{t.loginTitle}</h2>
            <p className="text-xs text-fuchsia-300 font-bold uppercase tracking-widest">{t.subTitle}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-3">
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-3.5 text-fuchsia-300/60" />
                <input
                  type="text"
                  placeholder={t.usernamePlaceholder}
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="w-full bg-[#150a18] border border-[#9d1c6a]/40 pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:border-[#9d1c6a] transition"
                  required
                />
              </div>

              <div className="relative">
                <Key className="w-4 h-4 absolute left-3 top-3.5 text-fuchsia-300/60" />
                <input
                  type="password"
                  placeholder={t.passwordPlaceholder}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-[#150a18] border border-[#9d1c6a]/40 pl-10 pr-4 py-3 rounded-xl text-sm text-white focus:outline-none focus:border-[#9d1c6a] transition"
                  required
                />
              </div>
            </div>

            {loginError && (
              <p className="text-xs text-red-400 text-center font-medium bg-red-950/40 p-2.5 rounded-xl border border-red-500/30">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#9d1c6a] hover:bg-[#b01e7b] text-white font-black p-3.5 rounded-xl transition shadow-lg shadow-[#9d1c6a]/30 active:scale-[0.99] uppercase tracking-wider"
            >
              {t.loginBtn}
            </button>
          </form>

          <div className="flex justify-center items-center gap-2 pt-4 border-t border-fuchsia-950">
            <Globe className="w-4 h-4 text-fuchsia-400/60" />
            {['cs', 'ua', 'en'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 text-xs rounded-lg uppercase font-bold transition ${
                  lang === l ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#150a18] text-slate-100 font-sans p-3 md:p-8">
      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* ШАПКА */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#210f27] p-4 rounded-3xl border border-[#9d1c6a]/30 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#9d1c6a] text-white rounded-2xl shadow-md shadow-[#9d1c6a]/30">
              <AlemareLogo />
            </div>
            <div>
              <h1 className="text-lg font-black text-white tracking-wide">{t.title}</h1>
              <p className="text-xs text-fuchsia-300/80 font-semibold">
                {t.loginAs} <span className="text-emerald-400 font-bold">{currentUser.name}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
              currentUser.role === 'admin' 
                ? 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300' 
                : currentUser.role === 'manager'
                ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                : 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
            }`}>
              {currentUser.role === 'admin' ? <ShieldAlert className="w-3.5 h-3.5" /> : currentUser.role === 'manager' ? <Shield className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
              {currentUser.role === 'admin' ? t.admin : currentUser.role === 'manager' ? t.manager : t.worker}
            </span>

            <div className="flex items-center bg-[#150a18] rounded-xl p-1 border border-[#9d1c6a]/30 text-xs">
              <Globe className="w-3.5 h-3.5 ml-1.5 text-fuchsia-400/60" />
              {['cs', 'ua', 'en'].map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-lg uppercase font-bold transition ${
                    lang === l ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 bg-[#150a18] hover:bg-purple-950/60 rounded-xl border border-[#9d1c6a]/30 transition text-slate-300"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={handleLogout}
              className="p-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 rounded-xl border border-red-500/30 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* НАВІГАЦІЯ ВКЛАДОК */}
        <div className="flex items-center justify-between bg-[#210f27] p-1.5 rounded-2xl border border-[#9d1c6a]/20">
          <button
            onClick={() => setActiveTab('stock')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'stock' ? 'bg-[#9d1c6a] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            {t.stockTab}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
              activeTab === 'history' ? 'bg-[#9d1c6a] text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-4 h-4" />
            {t.historyTab}
          </button>

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'users' ? 'bg-[#9d1c6a] text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              {t.usersTab}
            </button>
          )}
        </div>

        {/* НАЛАШТУВАННЯ TELEGRAM */}
        {showSettings && (currentUser.role === 'admin' || currentUser.role === 'manager') && (
          <div className="bg-[#210f27] border border-[#9d1c6a]/40 p-4 rounded-2xl space-y-3 shadow-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xs text-fuchsia-300 flex items-center gap-2">
                <Send className="w-4 h-4" /> {t.telegramSettings}
              </h3>
              <button
                onClick={handleResetData}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                {t.clearCache}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder={t.botToken}
                value={tgToken}
                onChange={(e) => setTgToken(e.target.value)}
                className="bg-[#150a18] border border-[#9d1c6a]/30 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#9d1c6a]"
              />
              <input
                type="text"
                placeholder={t.chatId}
                value={tgChatId}
                onChange={(e) => setTgChatId(e.target.value)}
                className="bg-[#150a18] border border-[#9d1c6a]/30 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-[#9d1c6a]"
              />
            </div>
          </div>
        )}

        {/* ВКЛАДКА: СКЛАД (ПОЛИЧКИ) */}
        {activeTab === 'stock' && (
          <div className="space-y-4">

            {/* МЕТРИКИ СКЛАДУ */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-[#210f27]/90 border border-[#9d1c6a]/30 p-3 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-[#9d1c6a]/20 text-fuchsia-300 rounded-xl hidden sm:block">
                  <Warehouse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.totalStock}</p>
                  <p className="text-lg font-black text-white">{totalStockQty}</p>
                </div>
              </div>

              <div className="bg-[#210f27]/90 border border-[#9d1c6a]/30 p-3 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-[#9d1c6a]/20 text-fuchsia-300 rounded-xl hidden sm:block">
                  <Barcode className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.totalItems}</p>
                  <p className="text-lg font-black text-fuchsia-300">{filteredItems.length} <span className="text-xs font-normal text-slate-400">SKU</span></p>
                </div>
              </div>

              <div className="bg-[#210f27]/90 border border-[#9d1c6a]/30 p-3 rounded-2xl flex items-center gap-3">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl hidden sm:block">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{t.lowStockAlerts}</p>
                  <p className={`text-lg font-black ${lowStockCount > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {lowStockCount}
                  </p>
                </div>
              </div>
            </div>
            
            {/* ФІЛЬТРИ ТА ПОШУК */}
            <div className="space-y-3 bg-[#210f27] p-3.5 rounded-3xl border border-[#9d1c6a]/20">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-fuchsia-400/60" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#150a18] border border-[#9d1c6a]/30 pl-10 pr-4 py-2.5 rounded-2xl text-sm text-white focus:outline-none focus:border-[#9d1c6a] transition"
                />
              </div>

              {/* КНОПКИ ГРАМАЖІ */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-slate-400 text-[11px] font-bold mr-1 flex items-center gap-1">
                  <Filter className="w-3 h-3 text-fuchsia-400" /> Вага:
                </span>
                {['all', '150g', '200g', '300g', '400g', '800g'].map(w => (
                  <button
                    key={w}
                    onClick={() => setSelectedWeight(w)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                      selectedWeight === w 
                        ? 'bg-[#9d1c6a] text-white shadow' 
                        : 'bg-[#150a18] text-slate-400 hover:text-white border border-[#9d1c6a]/20'
                    }`}
                  >
                    {w === 'all' ? t.allWeights : w}
                  </button>
                ))}
              </div>
            </div>

            {/* ВІДОБРАЖЕННЯ ПО ПОЛИЧКАХ */}
            {shelves.map(shelf => {
              if (selectedCategory !== 'all' && selectedCategory !== shelf.key) return null;
              if (shelf.items.length === 0) return null;

              return (
                <div key={shelf.key} className="bg-[#210f27]/90 rounded-3xl border border-[#9d1c6a]/30 p-4 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-[#9d1c6a]/20">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-black text-slate-950 bg-fuchsia-300 px-2 py-0.5 rounded-md tracking-wider">
                        {t.shelfPrefix} {shelf.code}
                      </span>
                      <h2 className="font-extrabold text-sm text-fuchsia-200 tracking-wide uppercase">
                        {shelf.title}
                      </h2>
                    </div>

                    <span className="text-[11px] font-bold text-slate-400 bg-[#150a18] px-2.5 py-1 rounded-xl border border-[#9d1c6a]/20">
                      {shelf.items.length} {t.itemsCount}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {shelf.items.map(item => {
                      const isLow = item.quantity < item.minLimit;
                      const unitName = getUnitName(item.unit);

                      return (
                        <div
                          key={item.id}
                          className={`bg-[#150a18] p-3.5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            isLow ? 'border-amber-500/60 bg-amber-950/10' : 'border-[#9d1c6a]/20 hover:border-[#9d1c6a]/40'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-sm text-white">{item.name}</span>
                              {item.weight && (
                                <span className="text-[10px] font-extrabold bg-[#210f27] text-fuchsia-300 border border-[#9d1c6a]/40 px-2 py-0.5 rounded-md">
                                  {item.weight}
                                </span>
                              )}
                              {isLow && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
                                  <AlertTriangle className="w-3 h-3" /> {t.lowStock}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-400">
                              {t.minLimit}: <span className="text-fuchsia-300 font-semibold">{item.minLimit} {unitName}</span>
                            </p>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <div className="flex items-center gap-1.5 bg-[#210f27] border border-[#9d1c6a]/30 p-1 rounded-2xl">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="p-2 bg-[#150a18] hover:bg-purple-900/50 active:bg-purple-800 rounded-xl transition text-slate-200"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              
                              <div className="w-16 text-center leading-none">
                                <span className={`font-black text-base ${isLow ? 'text-amber-400' : 'text-emerald-400'}`}>
                                  {item.quantity}
                                </span>
                                <span className="block text-[9px] text-slate-400 uppercase font-bold mt-0.5">
                                  {unitName}
                                </span>
                              </div>

                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="p-2 bg-[#1b8a47] hover:bg-[#1bbd5c] active:bg-emerald-600 rounded-xl transition text-white"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="p-2 text-slate-500 hover:text-red-400 transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* ФОРМА ДОДАВАННЯ НОВОГО МАТЕРІАЛУ */}
            {(currentUser.role === 'admin' || currentUser.role === 'manager') && (
              <form onSubmit={handleAddItem} className="bg-[#210f27] border border-[#9d1c6a]/30 p-4 rounded-3xl space-y-3 mt-6">
                <h3 className="font-bold text-xs text-fuchsia-300 uppercase tracking-wider">{t.addItem}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                  <input
                    type="text"
                    placeholder={t.itemName}
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    className="bg-[#150a18] border border-[#9d1c6a]/30 p-2.5 rounded-xl text-xs text-white sm:col-span-2 focus:outline-none focus:border-[#9d1c6a]"
                    required
                  />
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="bg-[#150a18] border border-[#9d1c6a]/30 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="boxes">{t.boxes}</option>
                    <option value="louie-kapsicky">{t.louieKapsicky}</option>
                    <option value="louie-konzervy">{t.louieKonzervy}</option>
                    <option value="ontario">{t.ontario}</option>
                  </select>

                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                    className="bg-[#150a18] border border-[#9d1c6a]/30 p-2.5 rounded-xl text-xs text-white focus:outline-none"
                  >
                    <option value="pal">Palety (pal)</option>
                    <option value="krab">Krabice (krab)</option>
                    <option value="bal">Balíky (bal)</option>
                    <option value="ks">Kusy (ks)</option>
                  </select>

                  <button
                    type="submit"
                    className="bg-[#1b8a47] hover:bg-[#1bbd5c] text-white text-xs font-bold p-2.5 rounded-xl transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> {t.addItem}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ВКЛАДКА: ІСТОРІЯ */}
        {activeTab === 'history' && (
          <div className="bg-[#210f27] p-5 rounded-3xl border border-[#9d1c6a]/30 space-y-4">
            <h3 className="font-bold text-sm text-fuchsia-300 flex items-center gap-2">
              <History className="w-4 h-4" /> {t.historyTab}
            </h3>

            {history.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">{t.noHistory}</p>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {history.map(log => (
                  <div key={log.id} className="bg-[#150a18] p-3 rounded-2xl border border-[#9d1c6a]/20 flex justify-between items-start text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.action}</span>
                        <span className="text-[10px] text-fuchsia-300 bg-purple-950 px-2 py-0.5 rounded-md border border-fuchsia-900/50">
                          {log.userName} ({log.userRole})
                        </span>
                      </div>
                      {log.details && (
                        <p className="text-slate-400 text-[11px] font-mono">{log.details}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap ml-2">
                      {log.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ВКЛАДКА: КОРИСТУВАЧІ */}
        {activeTab === 'users' && currentUser.role === 'admin' && (
          <div className="bg-[#210f27] p-5 rounded-3xl border border-[#9d1c6a]/30 space-y-4">
            <h3 className="font-bold text-sm text-fuchsia-300 flex items-center gap-2">
              <Users className="w-4 h-4" /> {t.usersTab}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {users.map(u => (
                <div key={u.username} className="bg-[#150a18] p-4 rounded-2xl border border-[#9d1c6a]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{u.name}</span>
                      <span className="text-[11px] text-fuchsia-300/60 font-mono">(@{u.username})</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {t.userRole}: <span className="text-emerald-400 font-semibold">{u.role}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {['worker', 'manager', 'admin'].map(roleOption => (
                      <button
                        key={roleOption}
                        onClick={() => handleUserRoleChange(u.username, roleOption)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition uppercase ${
                          u.role === roleOption
                            ? 'bg-[#9d1c6a] text-white shadow-md'
                            : 'bg-[#210f27] text-slate-400 hover:text-white border border-[#9d1c6a]/30'
                        }`}
                      >
                        {roleOption}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
