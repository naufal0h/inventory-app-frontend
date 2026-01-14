import React from 'react';
import { FileText, Database } from 'lucide-react';

const SummaryReport = ({ data }) => {
  // Logika mengelompokkan data berdasarkan nama file
  const rekapanPerFile = data.reduce((acc, curr) => {
    // 1. Mengambil nama file dari setiap baris data
    const fileName = curr.namaFile || "Tanpa Nama";
  
    // 2. Jika nama file ini belum ada di "keranjang" rekapan, buat baru
    if (!acc[fileName]) {
      acc[fileName] = { 
        nama: fileName, 
        totalItem: 0, 
        totalMasuk: 0, 
        totalKeluar: 0,
        stokAkhir: 0 
      };
    }
  
    // 3. Tambahkan angkanya ke kelompok file yang sesuai
    acc[fileName].totalItem += 1;
    acc[fileName].totalMasuk += (curr.masuk || 0);
    acc[fileName].totalKeluar += (curr.keluar || 0);
    acc[fileName].stokAkhir += (curr.stokAkhir || 0);
  
    return acc;
  }, {});

  const listRekapan = Object.values(rekapanPerFile);

  return (
    <div className="mt-12 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 p-4 border-b border-slate-200 flex items-center gap-2">
        <Database size={20} className="text-blue-600" />
        <h3 className="font-bold text-slate-800 uppercase text-sm tracking-widest">
          Rekapitulasi Per File Upload
        </h3>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead className="bg-slate-100/50 text-slate-500 text-[10px] font-black uppercase">
          <tr>
            <th className="p-4 border-r">Nama File Excel</th>
            <th className="p-4 border-r text-center">Jumlah SKU</th>
            <th className="p-4 border-r text-center text-emerald-600">Total Masuk</th>
            <th className="p-4 border-r text-center text-rose-600">Total Keluar</th>
            <th className="p-4 text-center bg-blue-50 text-blue-700">Akumulasi Stok</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 text-sm">
          {listRekapan.map((file, idx) => (
            <tr key={idx} className="hover:bg-slate-50 transition-colors">
              <td className="p-4 border-r flex items-center gap-2 font-medium">
                <FileText size={14} className="text-slate-400" />
                {file.nama}
              </td>
              <td className="p-4 border-r text-center">{file.totalItem}</td>
              <td className="p-4 border-r text-center font-bold text-emerald-600">+{file.totalMasuk}</td>
              <td className="p-4 border-r text-center font-bold text-rose-600">-{file.totalKeluar}</td>
              <td className="p-4 text-center font-black bg-blue-50/30 text-blue-900">{file.stokAkhir}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-900 text-white font-bold uppercase text-[10px]">
          <tr>
            <td className="p-4 text-right">TOTAL KESELURUHAN GUDANG:</td>
            <td className="p-4 text-center">{data.length}</td>
            <td className="p-4 text-center text-emerald-400">+{data.reduce((a, b) => a + (b.masuk || 0), 0)}</td>
            <td className="p-4 text-center text-rose-400">-{data.reduce((a, b) => a + (b.keluar || 0), 0)}</td>
            <td className="p-4 text-center bg-blue-600">{data.reduce((a, b) => a + (b.stokAkhir || 0), 0)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default SummaryReport;