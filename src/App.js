import FileTabTable from './FileTabTable';
import SummaryReport from './SummaryReport';
import FileList from './FileList';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, 
  ResponsiveContainer, CartesianGrid, Cell 
} from 'recharts';
import { 
  LayoutDashboard, Package, Upload, 
  Search, AlertTriangle, CheckCircle, TrendingUp 
} from 'lucide-react';


function App() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  

  const fetchData = async () => {
    try {
      const res = await axios.get('https://inventory-app-backend-0yrb.onrender.com/api/barang');
      console.log("Data dari Server:", res.data); // CEK DI CONSOLE F12
      setData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchData(); }, []);
  const [activeFileTab, setActiveFileTab] = useState("SEMUA");

  // Filter Data Dinamis
  const filteredData = data.filter(item => 
    item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.kode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpload = async () => {
    if (!file) return alert("Pilih file!");
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      // PASTIKAN URL INI ADALAH URL BACKEND RENDER ANDA
      await axios.post('https://inventory-app-backend-0yrb.onrender.com/api/upload', formData); 
      fetchData();
      alert("Berhasil diunggah!");
    } catch (err) {
      console.error(err);
      alert("Gagal upload! Cek koneksi ke server.");
    }
  };

  const handleReset = async () => {
    if (window.confirm("Apakah Anda yakin ingin MENGHAPUS SEMUA DATA stok? Tindakan ini tidak bisa dibatalkan.")) {
      try {
        await axios.delete('https://inventory-app-backend-0yrb.onrender.com/api/reset');
        alert("Database telah dibersihkan.");
        fetchData(); // Refresh tampilan agar kosong
      } catch (err) {
        alert("Gagal mereset data.");
      }
    }
  };
  const deleteSpecificFile = async (namaFile) => {
    if (window.confirm(`Hapus seluruh data dari file ${namaFile}?`)) {
      try {
        await axios.delete(`https://inventory-app-backend-0yrb.onrender.com/api/barang/file/${encodeURIComponent(namaFile)}`);
        fetchData();
        alert("File berhasil dihapus dari sistem.");
      } catch (err) {
        alert("Gagal menghapus file.");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* SIDEBAR DINAMIS */}
      <div className="w-64 bg-slate-900 text-white p-6 sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-blue-500 p-2 rounded-xl rotate-3 shadow-lg shadow-blue-500/20">
            <Package size={24} />
          </div>
          <h1 className="text-xl font-black tracking-tighter">SMART-LOG</h1>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: <LayoutDashboard size={18}/>, label: 'Overview' },
            { id: 'inventory', icon: <Package size={18}/>, label: 'Stok Barang' }
          ].map((menu) => (
            <button
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                activeTab === menu.id ? 'bg-blue-600 shadow-lg shadow-blue-600/30 font-bold' : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {menu.icon} {menu.label}
            </button>
          ))}
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
              {activeTab === 'dashboard' ? 'Gudang Digital' : 'Daftar Inventaris'}
            </h2>
            <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Sistem Aktif & Terhubung Cloud
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Cari kode atau nama..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <label className="cursor-pointer bg-white border border-slate-200 px-4 py-2 rounded-xl hover:bg-slate-50 transition shadow-sm font-bold text-sm">
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
              {file ? file.name.substring(0, 10) + '...' : 'Pilih Excel'}
            </label>
            <button onClick={handleUpload} className="bg-slate-900 text-white p-2.5 rounded-xl hover:scale-105 active:scale-95 transition shadow-lg">
              <Upload size={20} />
            </button>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* STATS CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatCard label="Total SKU" val={data.length} color="blue" icon={<Package/>}/>
              <StatCard label="Barang Masuk" val={data.reduce((a,b)=>a+(b.masuk||0),0)} color="emerald" icon={<TrendingUp/>}/>
              <StatCard label="Barang Keluar" val={data.reduce((a,b)=>a+(b.keluar||0),0)} color="rose" icon={<TrendingUp className="rotate-180"/>}/>
              <StatCard label="Stok Kritis" val={data.filter(x => x.stokAkhir < 5).length} color="amber" icon={<AlertTriangle/>}/>
            </div>

            {/* CHART */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 mb-8">
               <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                 <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                 Top 10 Level Stok Terakhir
               </h3>
               <button 
            onClick={handleReset}
            className="bg-rose-100 text-rose-600 px-4 py-2 rounded-xl hover:bg-rose-600 hover:text-white transition-all font-bold text-sm flex items-center gap-2"
>
            <AlertTriangle size={16} /> Reset
            </button>              
               <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={filteredData.slice(0, 10)}>
                    <XAxis dataKey="kode" axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)'}} />
                    <Bar dataKey="stokAkhir" radius={[10, 10, 0, 0]}>
                      {filteredData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.stokAkhir < 5 ? '#f43f5e' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                {/* Ini adalah cara memanggilnya di dalam tampilan */}

               </div>
            </div>
            
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-300">
  <table style={{ borderCollapse: 'separate', borderSpacing: 0 }} className="w-full text-left border border-slate-300">
  <thead className="bg-slate-200">
    <tr>
      <th style={{ border: '1px solid #cbd5e1' }} className="p-4 text-slate-700 font-bold uppercase text-xs">Kode</th>
      <th style={{ border: '1px solid #cbd5e1' }} className="p-4 text-slate-700 font-bold uppercase text-xs">Nama Barang</th>
      <th style={{ border: '1px solid #cbd5e1' }} className="p-4 text-center font-bold text-xs">Stok Akhir</th>
    </tr>
  </thead>
  <tbody>
    {filteredData.map((item, idx) => (
      <tr key={idx} className="hover:bg-blue-50">
        <td style={{ border: '1px solid #e2e8f0' }} className="p-4 font-mono">{item.kode}</td>
        <td style={{ border: '1px solid #e2e8f0' }} className="p-4">{item.namaBarang}</td>
        <td style={{ border: '1px solid #e2e8f0' }} className={`p-4 text-center font-black ${item.stokAkhir < 5 ? 'text-red-600' : 'text-blue-700'}`}>
          {item.stokAkhir}
        </td>
      </tr>
    ))}
  </tbody>
</table>
</div>
        )}
      </div>
    </div>
  );
}

// Sub-komponen Card agar kode bersih
function StatCard({ label, val, color, icon }) {
  const colors = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
    amber: "bg-amber-50 text-amber-600"
  };
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition cursor-default">
      <div className={`w-10 h-10 ${colors[color]} rounded-xl flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black mt-1 tracking-tight">{val}</h3>
    </div>
  );
}

export default App;