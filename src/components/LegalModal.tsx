import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, X, Check, Scale } from 'lucide-react';
import { OrganizationInfo } from '../types';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'disclaimer' | 'terms';
  orgInfo?: OrganizationInfo | null;
}

export default function LegalModal({ isOpen, onClose, defaultTab = 'disclaimer', orgInfo }: LegalModalProps) {
  const [activeTab, setActiveTab] = useState<'disclaimer' | 'terms'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Kepatuhan Hukum & Transparansi</h3>
              <p className="text-[11px] text-gray-400">
                {orgInfo?.name || 'Amanah Impact Foundation'} ({orgInfo?.operationalLicense ? `Izin Dinsos No. ${orgInfo.operationalLicense}` : 'SK Dinsos No. 421/DS/2022'})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 p-1.5 shrink-0">
          <button
            onClick={() => setActiveTab('disclaimer')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'disclaimer'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-200/50 dark:border-gray-700'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Disclaimer Legal
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex-1 py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'terms'
                ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-gray-200/50 dark:border-gray-700'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Syarat & Ketentuan (Terms)
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
          {activeTab === 'disclaimer' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-900 dark:text-amber-200">
                <span className="font-bold block text-xs mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" /> Penafian Legalitas dan Akuntabilitas
                </span>
                {orgInfo?.name || 'Amanah Impact Foundation'} ({orgInfo?.shortName || 'AIF'}) beroperasi sebagai badan hukum yayasan nirlaba yang sah berdasarkan Keputusan Kemenkumham RI No. {orgInfo?.legalNumber || 'AHU-0012345.AH.01.04.Tahun 2014'} dan Izin Pengumpulan Uang & Barang Dinas Sosial No. {orgInfo?.operationalLicense || '421/DS/2022'}.
              </div>

              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                1. Pengelolaan Dana Donasi, Zakat, dan Wakaf
              </h4>
              <p>
                Setiap rupiah donasi yang disalurkan melalui platform digital ini dikelola dengan mematuhi kaidah syariat (8 Asnaf Zakat sesuai MUI dan Fatwa BAZNAS) serta Undang-Undang Republik Indonesia No. 41 Tahun 2004 tentang Wakaf. 100% donasi neto dialokasikan langsung untuk penerima manfaat program terkait setelah dikurangi biaya amil operasional sesuai batas syariah (maksimal 12,5%).
              </p>

              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                2. Sifat Platform & Simulasi Digital
              </h4>
              <p>
                Platform ini menyediakan dashboard pemantauan live real-time (Digital Ledger). Informasi metrik, estimasi waktu penyelesaian program, dan foto perkembangan lapangan diperbarui secara berkala oleh tim relawan dan amil lapangan kami.
              </p>

              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                3. Perlindungan Privasi Donatur
              </h4>
              <p>
                Bagi donatur yang memilih opsi "Hamba Allah" (Anonim), nama Anda tidak akan pernah dipublikasikan di halaman publik manapun. Data kontak hanya digunakan untuk pengiriman kuitansi digital resmi (Digital Tax Receipt) dan laporan pertanggungjawaban.
              </p>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-900 dark:text-emerald-200">
                <span className="font-bold block text-xs mb-1 flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" /> Ketentuan Penggunaan Layanan Platform
                </span>
                Dengan mengakses dan bertransaksi di website Amanah Impact Foundation, Anda menyetujui seluruh syarat dan ketentuan yang tertulis di bawah ini.
              </div>

              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                1. Kewajiban Pengguna & Donatur
              </h4>
              <p>
                Donatur wajib memastikan bahwa sumber dana yang didonasikan berasal dari kegiatan yang halal dan sah menurut hukum Republik Indonesia, bukan hasil tindak pidana pencucian uang (Anti-Money Laundering Compliance).
              </p>

              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                2. Kebijakan Transaksi & Bukti Bayar
              </h4>
              <p>
                Setiap pembayaran yang berhasil terverifikasi otomatis akan menerbitkan Kuitansi Elektronik (Electronic Receipt) ber-QR Code dengan nomor referensi unik yang dapat diunduh kapan saja. Donasi yang telah diproses dan disalurkan tidak dapat dibatalkan (non-refundable).
              </p>

              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                3. Program Relawan & Kemitraan CSR
              </h4>
              <p>
                Relawan yang mendaftar bersedia mematuhi kode etik kemanusiaan, perlindungan anak, dan netralitas non-politik selama menjalankan aksi sosial di lapangan atas nama Amanah Impact Foundation.
              </p>

              <h4 className="font-bold text-gray-900 dark:text-white text-xs uppercase tracking-wider">
                4. Hak Kekayaan Intelektual & Copyright
              </h4>
              <p>
                Seluruh logo, merek dagang, desain sistem, dan aset digital platform dilindungi oleh hak cipta. Platform dirancang dan dikembangkan oleh <strong>Contech ID</strong> (contech.id) untuk mendukung digitalisasi filantropi sosial Indonesia.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800/40 border-t border-gray-100 dark:border-gray-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
          >
            Saya Memahami & Menyetujui
          </button>
        </div>
      </div>
    </div>
  );
}
