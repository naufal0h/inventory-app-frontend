import React from 'react';


const FileTabTable = ({ data, activeTab }) => {
  // Filter data berdasarkan tab yang dipilih
  const filteredData = activeTab === "SEMUA" 
    ? data 
    : data.filter(item => item.namaFile === activeTab);

  if (filteredData.length === 0) {
    return <div className="p-10 text-center text-gray-400">Tidak ada data untuk file ini.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-in fade-in duration-500">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead className="bg-slate-800 text-white">
            <tr>
              <th style={{ border: '1px solid #475569' }} className="p-3 text-xs uppercase tracking-wider">Kode</th>
              <th style={{ border: '1px solid #475569' }} className="p-3 text-xs uppercase tracking-wider">Nama Barang</th>
              <th style={{ border: '1px solid #475569' }} className="p-3 text-center text-xs uppercase tracking-wider">Stok Awal</th>
              <th style={{ border: '1px solid #475569' }} className="p-3 text-center text-xs uppercase tracking-wider text-green-400">Masuk</th>
              <th style={{ border: '1px solid #475569' }} className="p-3 text-center text-xs uppercase tracking-wider text-red-400">Keluar</th>
              <th style={{ border: '1px solid #475569' }} className="p-3 text-center text-xs uppercase tracking-wider bg-slate-700">Stok Akhir</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredData.map((item, idx) => (
              <tr key={idx} className="hover:bg-blue-50 transition-colors group">
                <td style={{ border: '1px solid #e2e8f0' }} className="p-3 font-mono text-sm">{item.kode}</td>
                <td style={{ border: '1px solid #e2e8f0' }} className="p-3 text-sm">{item.namaBarang}</td>
                <td style={{ border: '1px solid #e2e8f0' }} className="p-3 text-center text-gray-600">{item.stokAwal}</td>
                <td style={{ border: '1px solid #e2e8f0' }} className="p-3 text-center text-green-600 font-bold">+{item.masuk}</td>
                <td style={{ border: '1px solid #e2e8f0' }} className="p-3 text-center text-red-600 font-bold">-{item.keluar}</td>
                <td style={{ border: '1px solid #e2e8f0' }} className={`p-3 text-center font-black ${item.stokAkhir < 5 ? 'text-red-600 bg-red-50' : 'text-blue-700 bg-blue-50/30'}`}>
                  {item.stokAkhir}
                </td>
              </tr>
            ))}
          </tbody>
          {/* Ringkasan Footer per Tab */}
          <tfoot className="bg-gray-50 font-bold">
            <tr>
              <td colSpan="2" className="p-3 text-right text-xs">TOTAL PER TAB:</td>
              <td className="p-3 text-center">{filteredData.reduce((a, b) => a + b.stokAwal, 0)}</td>
              <td className="p-3 text-center text-green-600">+{filteredData.reduce((a, b) => a + b.masuk, 0)}</td>
              <td className="p-3 text-center text-red-600">-{filteredData.reduce((a, b) => a + b.keluar, 0)}</td>
              <td className="p-3 text-center bg-gray-200">{filteredData.reduce((a, b) => a + b.stokAkhir, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default FileTabTable;