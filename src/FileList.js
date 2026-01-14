import React from 'react';
import { FileSpreadsheet, Calendar, Archive, Trash2 } from 'lucide-react';

const FileList = ({ data, onDeleteFile }) => {
  // Mengambil daftar file unik beserta tanggal upload pertama kali ditemukan
  const uniqueFiles = data.reduce((acc, curr) => {
    // Jika namaFile kosong, beri nama default agar tetap muncul
    const name = curr.namaFile || "File Tanpa Nama/Data Lama";
    
    if (!acc.find(f => f.nama === name)) {
      acc.push({
        nama: name,
        tanggal: curr.tanggalUpload || new Date(),
        itemCount: data.filter(d => (d.namaFile || "File Tanpa Nama/Data Lama") === name).length
      });
    }
    return acc;
  }, []);

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
        <Archive size={20} /> Riwayat Upload File Excel
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {uniqueFiles.map((file, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                <FileSpreadsheet size={24} />
              </div>
              <button 
                onClick={() => onDeleteFile(file.nama)}
                className="text-slate-300 hover:text-rose-600 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
            
            <h4 className="font-bold text-slate-800 truncate mb-1" title={file.nama}>
              {file.nama}
            </h4>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
              <Calendar size={12} />
              {new Date(file.tanggal).toLocaleDateString('id-ID', { 
                day: 'numeric', month: 'long', year: 'numeric' 
              })}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kapasitas</span>
              <span className="text-sm font-black text-blue-600">{file.itemCount} Barang</span>
            </div>
          </div>
        ))}
        
        {uniqueFiles.length === 0 && (
          <div className="col-span-full p-10 border-2 border-dashed border-slate-200 rounded-2xl text-center text-slate-400">
            Belum ada file yang diunggah ke database.
          </div>
        )}
      </div>
    </div>
  );
};

export default FileList;