import React, { useState } from 'react';
import { Calendar as CalendarIcon, ThermometerIcon, AlertTriangle, CheckCircle, Plus, FileSpreadsheet, TrendingUp } from 'lucide-react';

// Норми температур
const LIMITS = {
  freezer: { min: -25, max: -15, label: 'Mrazáky (-18°C až -24°C)' },
  fridge: { min: 1, max: 8, label: 'Chladicí box (+2°C až +8°C)' },
  room: { min: 15, max: 24, label: 'Prostor výroby (+18°C až +22°C)' }
};

export default function TemperatureMonitor() {
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar' | 'add' | 'analytics'
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Тестові дані
  const [logs, setLogs] = useState([
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

  // Стан для нової форми
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'Ranní',
    responsiblePerson: 'Andrej Tyvonovich',
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
        room: Number(formData.room),
      },
      autoklavStatus: formData.autoklavStatus,
      notes: formData.notes
    };

    setLogs([newLog, ...logs]);
    setActiveTab('analytics');
  };

  return (
    <div className="p-6 bg-[#1a0b1f] text-slate-100 min-h-screen">
      {/* Шапка та Перемикач вкладок */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-fuchsia-300 flex items-center gap-2">
            <Thermometer className="w-7 h-7 text-fuchsia-400" />
            Kontrola Teplot a Podmínek (HACCP)
          </h1>
          <p className="text-sm text-slate-400">Monitoring mrazících boxů, chladničky a prostoru sekundární výroby</p>
        </div>

        <div className="flex gap-2 bg-[#2a1332] p-1 rounded-xl border border-[#9d1c6a]/30">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'calendar' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-4 h-4" /> Kalendář
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'add' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plus className="w-4 h-4" /> Nový záznam
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
              activeTab === 'analytics' ? 'bg-[#9d1c6a] text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-4 h-4" /> Analytika a Přehled
          </button>
        </div>
      </div>

      {/* 1. ФОРМА ВНЕСЕННЯ ДАНИХ */}
      {activeTab === 'add' && (
        <form onSubmit={handleSubmit} className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6 max-w-4xl mx-auto space-y-6">
          <h2 className="text-lg font-bold text-fuchsia-300 border-b border-[#9d1c6a]/20 pb-3">Zadat novou kontrolu teplot</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400">Datum</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Směna</label>
              <select
                value={formData.shift}
                onChange={(e) => setFormData({...formData, shift: e.target.value})}
                className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1"
              >
                <option value="Ranní">Ranní</option>
                <option value="Odpolední">Odpolední</option>
                <option value="Noční">Noční</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400">Zodpovědná osoba</label>
              <select
                value={formData.responsiblePerson}
                onChange={(e) => setFormData({...formData, responsiblePerson: e.target.value})}
                className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1"
              >
                <option value="Andrej Tyvonovich">Andrej Tyvonovich</option>
                <option value="David Griač">David Griač</option>
                <option value="Roman Kupčík">Roman Kupčík</option>
                <option value="Ladus Paolo">Ladus Paolo</option>
                <option value="Adriana Dryashkaba">Adriana Dryashkaba</option>
                <option value="Luboši Havelka">Luboši Havelka</option>
              </select>
            </div>
          </div>

          {/* Морозильники */}
          <div>
            <h3 className="text-sm font-bold text-slate-300 mb-3">Mrazící boxy (Norma: -18°C až -24°C)</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
                  <label className="text-xs text-slate-400">Mrazák #{num} (°C)</label>
                  <input
                    type="number"
                    value={formData[`freezer${num}`]}
                    onChange={(e) => setFormData({...formData, [`freezer${num}`]: e.target.value})}
                    className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1 text-center"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Холодильник та приміщення */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400">Chladicí box (°C) (+2 až +8)</label>
              <input
                type="number"
                value={formData.chladicibox}
                onChange={(e) => setFormData({...formData, chladicibox: e.target.value})}
                className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1 text-center"
                required
              />
            </div>
            <div className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400">Teplota prostor (°C) (+18 až +22)</label>
              <input
                type="number"
                value={formData.room}
                onChange={(e) => setFormData({...formData, room: e.target.value})}
                className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1 text-center"
                required
              />
            </div>
            <div className="bg-[#15081a] p-3 rounded-xl border border-slate-800">
              <label className="text-xs text-slate-400">Stav chemie a soli autokláv</label>
              <select
                value={formData.autoklavStatus}
                onChange={(e) => setFormData({...formData, autoklavStatus: e.target.value})}
                className="w-full bg-[#2a1332] border border-slate-700 rounded-lg p-2 text-white font-bold mt-1"
              >
                <option value="OK">OK</option>
                <option value="Doplňte sůl">Doplňte sůl</option>
                <option value="Kritický">Kritický</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400">Poznámky / Odchylky</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              placeholder="Zadejte případné odchylky nebo opravná opatření..."
              className="w-full bg-[#15081a] border border-slate-700 rounded-xl p-3 text-white mt-1 h-20"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#9d1c6a] hover:bg-[#b8237d] text-white font-bold py-3 rounded-xl transition-all"
          >
            Uložit záznam
          </button>
        </form>
      )}

      {/* 2. ТАБЛИЦЯ АНАЛІТИКИ */}
      {activeTab === 'analytics' && (
        <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-fuchsia-300">Přehled kontrol a historie</h2>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4" /> Exportovat do CSV
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
                  const isFreezerErr = Object.values(log.temperatures).slice(0,4).some(t => t > LIMITS.freezer.max);
                  return (
                    <tr key={log.id} className="hover:bg-[#2a1332]/50">
                      <td className="p-3 font-semibold text-white">
                        {log.date} <span className="text-xs font-normal text-slate-400">({log.shift})</span>
                      </td>
                      <td className="p-3">{log.responsiblePerson}</td>
                      <td className="p-3 font-mono">
                        {log.temperatures.freezer1}° / {log.temperatures.freezer2}° / {log.temperatures.freezer3}° / {log.temperatures.freezer4}°
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
                            <AlertTriangle className="w-4 h-4" /> Odchylka
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold text-xs">
                            <CheckCircle className="w-4 h-4" /> V pořádku
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

      {/* 3. КАЛЕНДАРНИЙ СТАН */}
      {activeTab === 'calendar' && (
        <div className="bg-[#210f27] border border-[#9d1c6a]/30 rounded-2xl p-6 text-center text-slate-400">
         <p className="mb-2">🗓️ Zde se zobrazuje měsíční mřížka pro rychlý přehled po dnech.</p>
          <p className="text-xs text-slate-500">Kliknutím na libovolný den otevřete seznam kontrol za 3 směny.</p>
        </div>
      )}
    </div>
  );
}
