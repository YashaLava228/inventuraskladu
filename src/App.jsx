import React, { useState, useEffect } from 'react';
import { 
  Globe, Settings as SettingsIcon, Shield, Users, Warehouse as WarehouseIcon, 
  History as HistoryIcon, Send, CheckCircle, AlertTriangle, 
  Search, Plus, FileSpreadsheet, TrendingUp, Calendar as CalendarIcon, 
  Trash2, Edit, Save, X, Lock, Unlock, RefreshCw 
} from 'lucide-react';

// Кастомна іконка термометра для уникнення проблем із залежностями
const ThermometerIcon = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
  </svg>
);

export const initialItems = [
  // --- KRABICE A OBALY (палети - pal) ---
  { id: 'BOX-01', name: 'Krabice LOUIE 150g', category: 'boxes', weight: '150g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-02', name: 'Krabice LOUIE 300g', category: 'boxes', weight: '300g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-03', name: 'Krabice Ontario / Wild Balance 200g', category: 'boxes', weight: '200g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-04', name: 'Krabice Wild Balance 400g', category: 'boxes', weight: '400g', unit: 'pal', quantity: 10, minLimit: 2 },
  { id: 'BOX-05', name: 'Krabice Wild Balance 85g', category: 'boxes', weight: '85g', unit: 'pal', quantity: 10, minLimit: 2 },

  // --- LOUIE KAPSIČKY (коробки - krab) ---
  { id: 'LOU 15001', name: 'LOU 15001 | LOUIE kapsička kuřecí s cuketou 150 g', category: 'louie-kapsicky', weight: '150g', unit: 'krab', quantity: 50, minLimit: 10 },
  { id: 'LOU 15002', name: 'LOU 15002 | LOUIE kapsička kuřecí s cuketou 300 g', category: 'louie-kapsicky', weight: '300g', unit: 'krab', quantity: 50, minLimit: 10 },
  { id: 'LOU 15101', name: 'LOU 15101 | LOUIE kapsička hovězí s mrkví 150 g', category: 'louie-kapsicky', weight: '150g', unit: 'krab', quantity: 50, minLimit: 10 },
  { id: 'LOU 15102', name: 'LOU 15102 | LOUIE kapsička hovězí s mrkví 300 g', category: 'louie-kapsicky', weight: '300g', unit: 'krab', quantity: 50, minLimit: 10 },

  // --- LOUIE KONZERVA ETIKETY (баліки - bal) ---
  { id: 'LOU 11009', name: 'LOU 11009 | LOUIE Kuřecí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11010', name: 'LOU 11010 | LOUIE Kuřecí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11011', name: 'LOU 11011 | LOUIE Kuřecí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  
  { id: 'LOU 11019', name: 'LOU 11019 | LOUIE Hovězí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11020', name: 'LOU 11020 | LOUIE Hovězí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11021', name: 'LOU 11021 | LOUIE Hovězí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 11029', name: 'LOU 11029 | LOUIE Kachní s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11030', name: 'LOU 11030 | LOUIE Kachní s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11031', name: 'LOU 11031 | LOUIE Kachní s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 11039', name: 'LOU 11039 | LOUIE Rybí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11040', name: 'LOU 11040 | LOUIE Rybí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11041', name: 'LOU 11041 | LOUIE Rybí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 11049', name: 'LOU 11049 | LOUIE Krůtí s rýží 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11050', name: 'LOU 11050 | LOUIE Krůtí s rýží 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 11051', name: 'LOU 11051 | LOUIE Krůtí s rýží 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 12020', name: 'LOU 12020 | LOUIE Telecí s šípkem a batáty 400 g', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 13050', name: 'LOU 13050 | LOUIE Krůtí s lososem a kopřivou 400 g', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 13051', name: 'LOU 13051 | LOUIE Krůtí s lososem a kopřivou 800 g', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14009', name: 'LOU 14009 | LOUIE Kuřecí s cuketou 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14010', name: 'LOU 14010 | LOUIE Kuřecí s cuketou 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14011', name: 'LOU 14011 | LOUIE Kuřecí s cuketou 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14019', name: 'LOU 14019 | LOUIE Hovězí s mrkví 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14020', name: 'LOU 14020 | LOUIE Hovězí s mrkví 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14021', name: 'LOU 14021 | LOUIE Hovězí s mrkví 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14029', name: 'LOU 14029 | LOUIE Kachní s brusinkami 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14030', name: 'LOU 14030 | LOUIE Kachní s brusinkami 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14031', name: 'LOU 14031 | LOUIE Kachní s brusinkami 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: 'LOU 14039', name: 'LOU 14039 | LOUIE Rybí s řasami 200 g (Etikety)', category: 'louie-konzervy', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14040', name: 'LOU 14040 | LOUIE Rybí s řasami 400 g (Etikety)', category: 'louie-konzervy', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: 'LOU 14041', name: 'LOU 14041 | LOUIE Rybí s řasami 800 g (Etikety)', category: 'louie-konzervy', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  // --- ONTARIO ETIKETY (баліки - bal) ---
  { id: '214-859785', name: '214-859785 | Ontario Puppy kuřecí spirulína 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859792', name: '214-859792 | Ontario Adult hovězí spirulína 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859808', name: '214-859808 | Ontario Adult kuřecí borůvky 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859815', name: '214-859815 | Ontario Adult jehněčí rakytník 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859822', name: '214-859822 | Ontario Adult kachní brusinky 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859839', name: '214-859839 | Ontario Adult telecí kurkuma 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  
  { id: '214-859846', name: '214-859846 | Ontario Puppy kuřecí spirulína 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859853', name: '214-859853 | Ontario Adult hovězí spirulína 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859860', name: '214-859860 | Ontario Adult kuřecí borůvky 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859877', name: '214-859877 | Ontario Adult jehněčí rakytník 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859884', name: '214-859884 | Ontario Adult kachní brusinky 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859891', name: '214-859891 | Ontario Adult telecí kurkuma 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: '214-859907', name: '214-859907 | Ontario Puppy kuřecí spirulína 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859914', name: '214-859914 | Ontario Adult hovězí spirulína 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859921', name: '214-859921 | Ontario Adult kuřecí borůvky 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859938', name: '214-859938 | Ontario Adult jehněčí rakytník 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859945', name: '214-859945 | Ontario Adult kachní brusinky 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859952', name: '214-859952 | Ontario Adult telecí kurkuma 800g (Etikety)', category: 'ontario', weight: '800g', unit: 'bal', quantity: 20, minLimit: 5 },

  { id: '214-859969', name: '214-859969 | Ontario Puppy monoprotein krůtí mrkev 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859976', name: '214-859976 | Ontario Adult monoprotein krůtí batáty 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859983', name: '214-859983 | Ontario Adult monoprotein jehněčí rýže 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-859990', name: '214-859990 | Ontario Adult monoprotein hovězí mrkev 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860002', name: '214-860002 | Ontario Adult monoprotein kachní dýně 200g (Etikety)', category: 'ontario', weight: '200g', unit: 'bal', quantity: 20, minLimit: 5 },
  
  { id: '214-860019', name: '214-860019 | Ontario Puppy monoprotein krůtí mrkev 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860026', name: '214-860026 | Ontario Adult monoprotein krůtí batáty 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860033', name: '214-860033 | Ontario Adult monoprotein jehněčí rýže 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860040', name: '214-860040 | Ontario Adult monoprotein hovězí mrkev 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },
  { id: '214-860057', name: '214-860057 | Ontario Adult monoprotein kachní dýně 400g (Etikety)', category: 'ontario', weight: '400g', unit: 'bal', quantity: 20, minLimit: 5 },

  // --- OSTATNÍ / TECHNICKÝ MATERIÁL (інше) ---
  { id: 'MAT-01', name: 'Lepidlo', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 10, minLimit: 2 },
  { id: 'MAT-02', name: 'Inkoust', category: 'ostatni', weight: 'N/A', unit: '%', quantity: 100, minLimit: 70 },
  { id: 'MAT-03', name: 'Plyn - Zásobník 1', category: 'ostatni', weight: 'N/A', unit: '%', quantity: 100, minLimit: 20 },
  { id: 'MAT-04', name: 'Plyn - Zásobník 2', category: 'ostatni', weight: 'N/A', unit: '%', quantity: 100, minLimit: 20 },
  { id: 'MAT-05', name: 'Europalety', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 50, minLimit: 10 },
  { id: 'MAT-06', name: 'Standardní palety', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 50, minLimit: 10 },
  { id: 'MAT-07', name: 'Fólie pro baličku', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 10, minLimit: 2 },
  { id: 'MAT-08', name: 'Ruční fólie', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 10, minLimit: 2 },
  { id: 'MAT-09', name: 'Sůl do autoklávu', category: 'ostatni', weight: 'N/A', unit: 'ks', quantity: 20, minLimit: 5 }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('warehouse');
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <WarehouseIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide">Виробнича Система HACCP та Склад</h1>
            <p className="text-xs text-slate-400">HACCP & Inventory Control System</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('warehouse')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'warehouse' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <WarehouseIcon className="w-4 h-4" />
            <span>Склад та Позиції</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('history')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <HistoryIcon className="w-4 h-4" />
            <span>Історія Партій</span>
          </button>

          <button 
            onClick={() => setActiveTab('temperature')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'temperature' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <ThermometerIcon className="w-4 h-4" />
            <span>Моніторинг Температур</span>
          </button>

          <button 
            onClick={() => setActiveTab('users')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <Users className="w-4 h-4" />
            <span>Користувачі та Права</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Налаштування Telegram</span>
          </button>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {activeTab === 'warehouse' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center space-x-4 w-full max-w-md">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Пошук товарів або партій..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
              <div className="text-sm text-slate-400">
                Всього позицій у базі: <span className="font-bold text-indigo-400">{items.length}</span>
              </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-xs text-slate-400 uppercase tracking-wider">
                    <th className="p-4">ID / ШАРЖЕ</th>
                    <th className="p-4">НАЗВА ТОВАРУ / МАТЕРІАЛУ</th>
                    <th className="p-4">КАТЕГОРІЯ</th>
                    <th className="p-4">КІЛЬКІСТЬ</th>
                    <th className="p-4">СТАТУС</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {items
                    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="p-4 font-mono font-medium text-indigo-400">{item.id}</td>
                        <td className="p-4 text-slate-200">{item.name}</td>
                        <td className="p-4 text-slate-400 uppercase text-xs">{item.category}</td>
                        <td className="p-4 font-semibold">{item.quantity} {item.unit}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.quantity <= item.minLimit ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                            {item.quantity <= item.minLimit ? 'Низький запас' : 'Норма'}
                          </span>
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-bold mb-4">Історія Партій та Операцій</h2>
            <p className="text-slate-400 text-sm">Тут відображатиметься лог рух товарів та партій по складу.</p>
          </div>
        )}

        {activeTab === 'temperature' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-bold mb-4">Моніторинг Температур</h2>
            <p className="text-slate-400 text-sm">Дані температурних датчиків автоклавів та складських приміщень.</p>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-bold mb-4">Керування Користувачами та Правами</h2>
            <p className="text-slate-400 text-sm">Налаштування ролей та доступу до системи.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
            <h2 className="text-lg font-bold mb-4">Налаштування Telegram Сповіщень</h2>
            <p className="text-slate-400 text-sm">Підключення чат-ботів та сповіщень про події на виробництві.</p>
          </div>
        )}
      </main>
    </div>
  );
}
