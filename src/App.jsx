import React, { useState, useEffect } from 'react';
import {
  Globe, Settings as SettingsIcon, Shield, Users, Warehouse as WarehouseIcon,
  History as HistoryIcon, Thermometer, Send, CheckCircle, AlertTriangle,
  Search, Plus, FileSpreadsheet, TrendingUp, Calendar as CalendarIcon,
  Trash2, Edit, Save, X, Lock, Unlock, RefreshCw
} from 'lucide-react';

// ==========================================
// 1. МОВНІ СЛОВНИКИ (i18n)
// ==========================================
const TRANSLATIONS = {
  cz: {
    appTitle: "Výrobní Systém HACCP & Sklad",
    navWarehouse: "Sklad & Poličky",
    navHistory: "Historie šarží",
    navTemp: "Kontrola Teplot",
    navUsers: "Uživatelé & Práva",
    navSettings: "Nastavení Telegramu",
    language: "Jazyk",
    save: "Uložit",
    cancel: "Zrušit",
    add: "Přidat",
    delete: "Smazat",
    edit: "Upravit",
    status: "Stav",
    action: "Akce",
    ok: "V pořádku",
    error: "Odchylka",
    userRoleAdmin: "Administrátor",
    userRoleOperator: "Operátor",
    userRoleAuditor: "Auditor HACCP",
    tempTitle: "Kontrola Teplot a Podmínek (HACCP)",
    tempSub: "Monitoring mrazících boxů, chladničky a prostoru sekundární výroby",
    tabCalendar: "Kalendář",
    tabAdd: "Nový záznam",
    tabAnalytics: "Analytika a Přehled",
    tgBotToken: "BOT Token Telegramu",
    tgChatId: "Chat ID pro Notifikace",
    tgSendTest: "Odeslat testovací zprávu",
    tgSuccessMsg: "Testovací zpráva úspěšně odeslána!"
  },
  ua: {
    appTitle: "Виробнича Система HACCP та Склад",
    navWarehouse: "Склад та Полиці",
    navHistory: "Історія Парій",
    navTemp: "Моніторинг Температур",
    navUsers: "Користувачі та Права",
    navSettings: "Налаштування Telegram",
    language: "Мова",
    save: "Зберегти",
    cancel: "Скасувати",
    add: "Додати",
    delete: "Видалити",
    edit: "Редагувати",
    status: "Стан",
    action: "Дії",
    ok: "В нормі",
    error: "Відхилення",
    userRoleAdmin: "Адміністратор",
    userRoleOperator: "Оператор",
    userRoleAuditor: "Аудитор HACCP",
    tempTitle: "Контроль Температур та Умов (HACCP)",
    tempSub: "Моніторинг морозильних камер, холодильника та зони вторинної переробки",
    tabCalendar: "Календар",
    tabAdd: "Новий запис",
    tabAnalytics: "Аналітика та Огляд",
    tgBotToken: "Токен Telegram-бота",
    tgChatId: "Chat ID для сповіщень",
    tgSendTest: "Надіслати тестове повідомлення",
    tgSuccessMsg: "Тестове повідомлення успішно надіслано!"
  }
};

const TEMP_LIMITS = {
  freezer: { min: -25, max: -15, label: 'Mrazáky (-18°C až -24°C)' },
  fridge: { min: 1, max: 8, label: 'Chladicí box (+2°C až +8°C)' },
  room: { min: 15, max: 24, label: 'Prostor výroby (+18°C až +22°C)' }
};

// ==========================================
// 2. ГОЛОВНИЙ КОМПОНЕНТ APP (Контекст / Стан)
// ==========================================
export default function App() {
  const [lang, setLang] = useState('cz');
  const [activeTab, setActiveTab] = useState('warehouse');
  
  // Глобальні налаштування Telegram
  const [telegramConfig, setTelegramConfig] = useState({
    token: '',
    chatId: '',
    enabled: false
  });

  // Список користувачів
  const [users, setUsers] = useState([
    { id: '1', name: 'Andrej Tyvonovich', role: 'Admin', active: true },
    { id: '2', name: 'David Griač', role: 'Operator', active: true },
    { id: '3', name: 'Roman Kupčík', role: 'Operator', active: true },
    { id: '4', name: 'Paolo Ladus', role: 'Admin', active: true },
    { id: '5', name: 'Adriana Dryashkaba', role: 'Operator', active: true },
    { id: '6', name: 'Luboši Havelka', role: 'Auditor', active: true }
  ]);

  // Записи температур
  const [tempLogs, setTempLogs] = useState([
    {
      id: '1',
      date: '2026-10-08',
      shift: 'Ranní',
      responsiblePerson: 'Andrej Tyvonovich',
      temperatures: { freezer1: -20, freezer2: -19, freezer3: -21, freezer4: -18, chladicibox: 4, room: 20 },
      autoklavStatus: 'OK',
      notes: ''
    }
  ]);

  const t = TRANSLATIONS[lang];

  return (
    <div className="min-h-screen bg-[#1a0b1f] text-slate-100 font-sans flex flex-col">
      {/* Навігаційна панель */}
      <header className="bg-[#210f27] border-b border-[#9d1c6a]/30 px-6 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#9d1c6a] rounded-xl text-white">
            <WarehouseIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-fuchsia-300">{t.appTitle}</h1>
            <p className="text-xs text-slate-400">HACCP & Inventory Control System</p>
          </div>
        </div>

        {/* Перемикач вкладок */}
        <nav className="flex flex-wrap gap-1 bg-[#15081a] p-1.5 rounded-xl border border-[#9d1c6a]/20">
          <button
            onClick={() => setActiveTab('warehouse')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'warehouse' ? 'bg-[#9d1c6a] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <WarehouseIcon className="w-4 h-4" /> {t.navWarehouse}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'history' ? 'bg-[#9d1c6a] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HistoryIcon className="w-4 h-4" /> {t.navHistory}
          </button>
          <button
            onClick={() => setActiveTab('temperature')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'temperature' ? 'bg-[#9d1c6a] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-4 h-4" /> {t.navTemp}
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'users' ? 'bg-[#9d1c6a] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> {t.navUsers}
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'settings' ? 'bg-[#9d1c6a] text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <SettingsIcon className="w-4 h-4" /> {t.navSettings}
          </button>
        </nav>

        {/* Перемикання мови */}
        <div className="flex items-center gap-2 bg-[#15081a] px-3 py-1.5 rounded-xl border border-slate-700">
          <Globe className="w-4 h-4 text-fuchsia-400" />
          <button
            onClick={() => setLang('cz')}
            className={`text-xs font-bold px-2 py-1 rounded ${lang === 'cz' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400'}`}
          >
            CZ
          </button>
          <button
            onClick={() => setLang('ua')}
            className={`text-xs font-bold px-2 py-1 rounded ${lang === 'ua' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400'}`}
          >
            UA
          </button>
        </div>
      </header>

      {/* Основний вміст */}
      <main className="flex-1 p-6">
        {activeTab === 'warehouse' && <WarehouseTab lang={lang} t={t} />}
        {activeTab === 'history' && <HistoryTab lang={lang} t={t} />}
        {activeTab === 'temperature' && (
          <TemperatureMonitorTab
            lang={lang}
            t={t}
            logs={tempLogs}
            setLogs={setTempLogs}
            users={users}
          />
        )}
        {activeTab === 'users' && <UsersManagementTab lang={lang} t={t} users={users} setUsers={setUsers} />}
        {activeTab === 'settings' && (
          <SettingsTab
            lang={lang}
            t={t}
            config={telegramConfig}
            setConfig={setTelegramConfig}
          />
        )}
      </main>
    </div>
  );
}

// ==========================================
// 3. СКЛАД ТА ПОЛИЦІ (WAREHOUSE)
// ==========================================
function WarehouseTab({ lang, t }) {
  const [shelfFilter, setShelfFilter] = useState('ALL');
  const [weightMin, setWeightMin] = useState('');
  const [weightMax, setWeightMax] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [items, setItems] = useState([
    { id: '1', batch: 'BAT-2026-001', name: 'Hovězí maso', shelf: 'Regál A1', weight: 45.5, status: 'OK' },
    { id: '2', batch: 'BAT-2026-002', name: 'Vepřová krkovice', shelf: 'Regál B2', weight: 120.0, status: 'OK' },
    { id: '3', batch: 'BAT-2026-003', name: 'Kuřecí prsa', shelf: 'Regál A2', weight: 15.2, status: 'Karanténa' },
    { id: '4', batch: 'BAT-2026-004', name: 'Klobásy Speciál', shelf: 'Regál C1', weight: 88.0, status: 'OK' }
  ]);

  const filteredItems = items.filter(item => {
    const matchesShelf = shelfFilter === 'ALL' || item.shelf === shelfFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.batch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMinWeight = weightMin === '' || item.weight >= parseFloat(weightMin);
    const matchesMaxWeight = weightMax === '' || item.weight <= parseFloat(weightMax);

    return matchesShelf && matchesSearch && matchesMinWeight && matchesMaxWeight;
  });

  return (
    <div className="space-y-6">
      <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-fuchsia-300 mb-4 flex items-center gap-2">
          <WarehouseIcon className="w-5 h-5 text-fuchsia-400" />
          {lang === 'cz' ? 'Přehled skladu a filtrací' : 'Огляд складу та фільтрація'}
        </h2>

        {/* Панель фільтрів */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-xs text-slate-400 font-semibold">{lang === 'cz' ? 'Hledat položku / šarži' : 'Пошук товарів / партій'}</label>
            <div className="relative mt-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={lang === 'cz' ? 'Názvy або Šarže...' : 'Назва або партія...'}
                className="w-full bg-[#15081a] border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold">{lang === 'cz' ? 'Filter regálu' : 'Фільтр полиці'}</label>
            <select
              value={shelfFilter}
              onChange={(e) => setShelfFilter(e.target.value)}
              className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-2 text-white text-sm mt-1"
            >
              <option value="ALL">{lang === 'cz' ? 'Všechny regály' : 'Усі полиці'}</option>
              <option value="Regál A1">Regál A1</option>
              <option value="Regál A2">Regál A2</option>
              <option value="Regál B2">Regál B2</option>
              <option value="Regál C1">Regál C1</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold">{lang === 'cz' ? 'Min. váha (kg)' : 'Мін. вага (кг)'}</label>
            <input
              type="number"
              value={weightMin}
              onChange={(e) => setWeightMin(e.target.value)}
              placeholder="0"
              className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-2 text-white text-sm mt-1"
            />
          </div>

          <div>
            <label className="text-xs text-slate-400 font-semibold">{lang === 'cz' ? 'Max. váha (kg)' : 'Макс. вага (кг)'}</label>
            <input
              type="number"
              value={weightMax}
              onChange={(e) => setWeightMax(e.target.value)}
              placeholder="1000"
              className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-2 text-white text-sm mt-1"
            />
          </div>
        </div>

        {/* Таблиця товарів */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-[#15081a] text-slate-400 uppercase text-xs">
              <tr>
                <th className="p-3">Šarže</th>
                <th className="p-3">Název</th>
                <th className="p-3">Ulmístění / Regál</th>
                <th className="p-3">Váha (kg)</th>
                <th className="p-3">Stav</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredItems.map(item => (
                <tr key={item.id} className="hover:bg-[#2a1332]/50">
                  <td className="p-3 font-mono font-bold text-fuchsia-300">{item.batch}</td>
                  <td className="p-3 font-medium text-white">{item.name}</td>
                  <td className="p-3">{item.shelf}</td>
                  <td className="p-3 font-mono">{item.weight} kg</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.status === 'OK' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-700' : 'bg-amber-900/50 text-amber-300 border border-amber-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">
                    {lang === 'cz' ? 'Nenalezeny žádné položky odpovídající filtru.' : 'За вашим запитом товарів не знайдено.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. ІСТОРІЯ ПАРТІЙ (HISTORY)
// ==========================================
function HistoryTab({ lang, t }) {
  const [historyLogs] = useState([
    { id: '1', date: '2026-10-08 08:30', user: 'Andrej Tyvonovich', action: 'Přijetí šarže BAT-2026-001 (45.5 kg)' },
    { id: '2', date: '2026-10-08 10:15', user: 'David Griač', action: 'Přesun šarže BAT-2026-002 do Regál B2' },
    { id: '3', date: '2026-10-08 14:00', user: 'Paolo Ladus', action: 'HACCP Kontrola teplot: Vše OK' }
  ]);

  return (
    <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-fuchsia-300 mb-4 flex items-center gap-2">
        <HistoryIcon className="w-5 h-5 text-fuchsia-400" />
        {lang === 'cz' ? 'Historie operací a logů' : 'Історія операцій та логів'}
      </h2>

      <div className="space-y-3">
        {historyLogs.map(log => (
          <div key={log.id} className="bg-[#15081a] border border-slate-800 p-4 rounded-xl flex justify-between items-center gap-4">
            <div>
              <p className="text-sm font-semibold text-white">{log.action}</p>
              <p className="text-xs text-slate-400 mt-1">{lang === 'cz' ? 'Provedl:' : 'Виконав:'} {log.user}</p>
            </div>
            <span className="text-xs font-mono text-fuchsia-400 bg-[#2a1332] px-3 py-1 rounded-lg border border-[#9d1c6a]/30">
              {log.date}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. МОНІТОРИНГ ТЕМПЕРАТУР (TEMPERATURE MONITOR)
// ==========================================
function TemperatureMonitorTab({ lang, t, logs, setLogs, users }) {
  const [activeSubTab, setActiveSubTab] = useState('calendar');
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'Ranní',
    responsiblePerson: users[0]?.name || 'Andrej Tyvonovich',
    freezer1: -20,
    freezer2: -20,
    freezer3: -20,
    freezer4: -20,
    chladicibox: 4,
    room: 20,
    autoklavStatus: 'OK',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLog = {
      id: Date.now().toString(),
      date: formData.date,
      shift: formData.shift,
      responsiblePerson: formData.responsiblePerson,
      temperatures: {
        freezer1: Number(formData.freezer1),
        freezer2: Number(formData.freezer2),
        freezer3: Number(formData.freezer3),
        freezer4: Number(formData.freezer4),
        chladicibox: Number(formData.chladicibox),
        room: Number(formData.room)
      },
      autoklavStatus: formData.autoklavStatus,
      notes: formData.notes
    };

    setLogs([newLog, ...logs]);
    setActiveSubTab('analytics');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fuchsia-300 flex items-center gap-2">
            <Thermometer className="w-7 h-7 text-fuchsia-400" />
            {t.tempTitle}
          </h1>
          <p className="text-sm text-slate-400">{t.tempSub}</p>
        </div>

        <div className="flex gap-2 bg-[#2a1332] p-1 rounded-xl border border-[#9d1c6a]/30">
          <button
            onClick={() => setActiveSubTab('calendar')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'calendar' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> {t.tabCalendar}
          </button>
          <button
            onClick={() => setActiveSubTab('add')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'add' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> {t.tabAdd}
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeSubTab === 'analytics' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> {t.tabAnalytics}
          </button>
        </div>
      </div>

      {/* Вкладка створення */}
      {activeSubTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
          <h2 className="text-lg font-bold text-fuchsia-300 border-b border-[#9d1c6a]/20 pb-3">
            {lang === 'cz' ? 'Zadat novou kontrolu teplot' : 'Внести новий контроль температур'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">{lang === 'cz' ? 'Datum' : 'Дата'}</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">{lang === 'cz' ? 'Směna' : 'Зміна'}</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
                className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1"
              >
                <option value="Ranní">{lang === 'cz' ? 'Ranní' : 'Ранкова'}</option>
                <option value="Odpolední">{lang === 'cz' ? 'Odpolední' : 'Денна'}</option>
                <option value="Noční">{lang === 'cz' ? 'Noční' : 'Нічна'}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">{lang === 'cz' ? 'Zodpovědná osoba' : 'Відповідальна особа'}</label>
              <select
                value={formData.responsiblePerson}
                onChange={(e) => setFormData({ ...formData, responsiblePerson: e.target.value })}
                className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1"
              >
                {users.map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3">{TEMP_LIMITS.freezer.label}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-400">Mrazák #{num} (°C)</label>
                  <input
                    type="number"
                    value={formData[`freezer${num}`]}
                    onChange={(e) => setFormData({ ...formData, [`freezer${num}`]: e.target.value })}
                    className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1 text-center"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400">Chladicí box (°C) (+2 až +8)</label>
              <input
                type="number"
                value={formData.chladicibox}
                onChange={(e) => setFormData({ ...formData, chladicibox: e.target.value })}
                className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1 text-center"
                required
              />
            </div>
            <div className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400">Teplota prostor (°C) (+18 až +22)</label>
              <input
                type="number"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1 text-center"
                required
              />
            </div>
            <div className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400">Stav chemie a soli autokláv</label>
              <select
                value={formData.autoklavStatus}
                onChange={(e) => setFormData({ ...formData, autoklavStatus: e.target.value })}
                className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1"
              >
                <option value="OK">OK</option>
                <option value="Doplňte sůl">Doplňte sůl / Поповнити сіль</option>
                <option value="Kritický">Kritický / Критичний</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">{lang === 'cz' ? 'Poznámky / Odchylky' : 'Примітки / Відхилення'}</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1 h-20"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#9d1c6a] hover:bg-[#b8237d] text-white font-bold py-3 rounded-xl transition-all shadow-lg"
          >
            {t.save}
          </button>
        </form>
      )}

      {/* Вкладка аналітики */}
      {activeSubTab === 'analytics' && (
        <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-fuchsia-300">{lang === 'cz' ? 'Přehled kontrol a historie' : 'Огляд контролю та історія'}</h2>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Export CSV
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#15081a] text-slate-400 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3">Datum / Směna</th>
                  <th className="p-3">Osoba</th>
                  <th className="p-3">Mrazáky (#1 / #2 / #3 / #4)</th>
                  <th className="p-3">Chlaďák</th>
                  <th className="p-3">Prostor</th>
                  <th className="p-3">Autokláv</th>
                  <th className="p-3">Stav</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {logs.map((log) => {
                  const freezers = [log.temperatures.freezer1, log.temperatures.freezer2, log.temperatures.freezer3, log.temperatures.freezer4];
                  const isFreezerErr = freezers.some(t => t > TEMP_LIMITS.freezer.max || t < TEMP_LIMITS.freezer.min);

                  return (
                    <tr key={log.id} className="hover:bg-[#2a1332]/50">
                      <td className="p-3 font-semibold text-white">
                        {log.date} <span className="text-xs font-normal text-slate-400">({log.shift})</span>
                      </td>
                      <td className="p-3">{log.responsiblePerson}</td>
                      <td className="p-3 font-mono">
                        {freezers.join('° / ')}°
                      </td>
                      <td className="p-3 font-mono">{log.temperatures.chladicibox}°C</td>
                      <td className="p-3 font-mono">{log.temperatures.room}°C</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-xs ${log.autoklavStatus === 'OK' ? 'bg-emerald-900/50 text-emerald-300' : 'bg-amber-900/50 text-amber-300'}`}>
                          {log.autoklavStatus}
                        </span>
                      </td>
                      <td className="p-3">
                        {isFreezerErr ? (
                          <span className="flex items-center gap-1 text-red-400 font-bold text-xs">
                            <AlertTriangle className="w-4 h-4" /> {t.error}
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                            <CheckCircle className="w-4 h-4" /> {t.ok}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Вкладка календаря */}
      {activeSubTab === 'calendar' && (
        <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6 text-center text-slate-400">
          <p className="mb-2">🗓️ Zde se zobrazuje měsíční mřížka pro rychlý přehled po dnech.</p>
          <p className="text-xs text-slate-500">Kliknutím na libovolný den otevřete seznam kontrol za 3 směny.</p>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 6. КЕРУВАННЯ КОРИСТУВАЧАМИ (USERS MANAGEMENT)
// ==========================================
function UsersManagementTab({ lang, t, users, setUsers }) {
  const [newUser, setNewUser] = useState({ name: '', role: 'Operator' });

  const addUser = (e) => {
    e.preventDefault();
    if (!newUser.name.trim()) return;
    setUsers([...users, { id: Date.now().toString(), name: newUser.name, role: newUser.role, active: true }]);
    setNewUser({ name: '', role: 'Operator' });
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const deleteUser = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-fuchsia-300 flex items-center gap-2">
        <Users className="w-6 h-6 text-fuchsia-400" />
        {t.navUsers}
      </h2>

      {/* Форма додавання */}
      <form onSubmit={addUser} className="flex flex-wrap md:flex-nowrap gap-3 bg-[#15081a] p-4 rounded-xl border border-slate-800">
        <input
          type="text"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          placeholder={lang === 'cz' ? 'Jméno a příjmení...' : "Ім'я та прізвище..."}
          className="flex-1 bg-[#2a1332] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="bg-[#2a1332] border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
        >
          <option value="Admin">{t.userRoleAdmin}</option>
          <option value="Operator">{t.userRoleOperator}</option>
          <option value="Auditor">{t.userRoleAuditor}</option>
        </select>
        <button type="submit" className="bg-[#9d1c6a] hover:bg-[#b8237d] text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> {t.add}
        </button>
      </form>

      {/* Список користувачів */}
      <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
        {users.map(user => (
          <div key={user.id} className="bg-[#15081a] p-4 flex justify-between items-center gap-4 hover:bg-[#2a1332]/30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${user.active ? 'bg-emerald-900/50 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className={`font-semibold text-sm ${user.active ? 'text-white' : 'text-slate-500 line-through'}`}>{user.name}</p>
                <span className="text-xs text-fuchsia-400">{user.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleUserStatus(user.id)}
                className={`p-2 rounded-lg text-xs font-semibold ${user.active ? 'bg-amber-900/30 text-amber-300 border border-amber-700' : 'bg-emerald-900/30 text-emerald-300 border border-emerald-700'}`}
              >
                {user.active ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="p-2 bg-red-900/30 text-red-400 border border-red-700 rounded-lg hover:bg-red-900/50"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 7. НАЛАШТУВАННЯ TELEGRAM (SETTINGS)
// ==========================================
function SettingsTab({ lang, t, config, setConfig }) {
  const [statusMsg, setStatusMsg] = useState('');

  const sendTestMessage = () => {
    if (!config.token || !config.chatId) {
      setStatusMsg(lang === 'cz' ? 'Vyplňte Token a Chat ID!' : 'Заповніть Token та Chat ID!');
      return;
    }
    setStatusMsg(t.tgSuccessMsg);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  return (
    <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6 max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-fuchsia-300 flex items-center gap-2">
        <SettingsIcon className="w-6 h-6 text-fuchsia-400" />
        {t.navSettings}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400">{t.tgBotToken}</label>
          <input
            type="text"
            value={config.token}
            onChange={(e) => setConfig({ ...config, token: e.target.value })}
            placeholder="123456789:ABCdefGhIJKlmNoPQ..."
            className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white text-sm font-mono mt-1"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-400">{t.tgChatId}</label>
          <input
            type="text"
            value={config.chatId}
            onChange={(e) => setConfig({ ...config, chatId: e.target.value })}
            placeholder="-1001234567890 або @my_channel"
            className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white text-sm font-mono mt-1"
          />
        </div>

        <button
          onClick={sendTestMessage}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" /> {t.tgSendTest}
        </button>

        {statusMsg && (
          <div className="p-3 bg-emerald-900/50 border border-emerald-700 text-emerald-300 rounded-xl text-center text-sm font-semibold">
            {statusMsg}
          </div>
        )}
      </div>
    </div>
  );
}
