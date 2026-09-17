/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Heart, Shield, CheckCircle, Copy, Share2, ArrowRight, Download, Send, Coins } from 'lucide-react';
import { Campaign, Donation } from '../types';
import { getTranslation } from '../translations';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaigns: Campaign[];
  preSelectedCampaignSlug?: string;
  preSelectedAmount?: number;
  preSelectedCategory?: string;
  onSuccess: (donation: Donation) => void;
  langPack: any;
  currentLang: string;
}

export default function DonationModal({
  isOpen,
  onClose,
  campaigns,
  preSelectedCampaignSlug = '',
  preSelectedAmount = 0,
  preSelectedCategory = '',
  onSuccess,
  langPack,
  currentLang
}: DonationModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Input, 2: Payment, 3: Completed Receipt
  
  // States values
  const [campaignSlug, setCampaignSlug] = useState<string>(
    preSelectedCampaignSlug || (campaigns.length > 0 ? campaigns[0].slug : 'umum')
  );
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [amountInput, setAmountInput] = useState<string>(preSelectedAmount > 0 ? String(preSelectedAmount) : '100000');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [isRecurring, setIsRecurring] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('QRIS');
  const [successDonation, setSuccessDonation] = useState<Donation | null>(null);

  const t = (text: string) => getTranslation(text, currentLang);

  const notifyToast = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', title?: string) => {
    window.dispatchEvent(new CustomEvent('amanah-toast', {
      detail: { message: msg, type, title: title || (type === 'error' ? 'Kesalahan' : type === 'warning' ? 'Perhatian' : 'Amanah Impact') }
    }));
  };

  const handleCloseModal = () => {
    setStep(1);
    setSuccessDonation(null);
    setMessage('');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSuccessDonation(null);
      setMessage('');
      if (preSelectedCampaignSlug) {
        setCampaignSlug(preSelectedCampaignSlug);
      } else if (campaigns.length > 0) {
        setCampaignSlug(campaigns[0].slug);
      }
      if (preSelectedAmount > 0) {
        setAmountInput(String(preSelectedAmount));
      } else {
        setAmountInput('100000');
      }
    }
  }, [isOpen, preSelectedCampaignSlug, preSelectedAmount, campaigns]);

  if (!isOpen) return null;

  const quickAmounts = [25000, 50000, 100000, 250000, 500000, 1000000];

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || Number(amountInput) < 10000) {
      notifyToast(t('Minimal donasi adalah Rp 10.000'), 'warning', 'Nominal Donasi');
      return;
    }
    if (!donorName && !isAnonymous) {
      notifyToast(t('Silakan masukkan nama Anda atau pilih Donasi Anonim (Hamba Allah)'), 'warning', 'Nama Donatur');
      return;
    }
    if (!donorEmail) {
      notifyToast(t('Email wajib diisi untuk pengiriman kuitansi digital'), 'warning', 'Email Donatur');
      return;
    }
    if (!campaignSlug) {
      setCampaignSlug(campaigns[0]?.slug || 'umum');
    }
    setStep(2);
  };

  const handleProcessDonation = async () => {
    const effectiveSlug = campaignSlug || preSelectedCampaignSlug || (campaigns[0]?.slug || 'umum');
    const effectiveDonorName = isAnonymous 
      ? (t('Hamba Allah') || 'Hamba Allah') 
      : (donorName.trim() || t('Hamba Allah') || 'Hamba Allah');
    const effectiveDonorEmail = donorEmail.trim() || (isAnonymous ? 'hamba.allah@amanah.org' : 'donatur@amanah.org');
    const effectiveAmount = Math.max(Number(amountInput) || 10000, 10000);

    const payload = {
      donorName: effectiveDonorName,
      donorEmail: effectiveDonorEmail,
      donorPhone: donorPhone.trim(),
      campaignSlug: effectiveSlug,
      amount: effectiveAmount,
      isAnonymous,
      message: message.trim(),
      paymentMethod: paymentMethod || 'QRIS'
    };

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setSuccessDonation(data);
        onSuccess(data);
        setStep(3);
        notifyToast(
          `Donasi ${formatCurrency(data.amount)} berhasil diterima. Terima kasih atas kepedulian Anda!`,
          'success',
          'Alhamdulillah Donasi Berhasil'
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Gagal memproses donasi ke database.');
      }
    } catch (err: any) {
      console.error('Donation submission error:', err);
      notifyToast(
        err.message || t('Terjadi kesalahan saat memproses donasi. Silakan periksa koneksi server database.'),
        'error',
        'Kendala Transaksi'
      );
    }
  };

  const copyText = (txt: string) => {
    navigator.clipboard.writeText(txt);
    notifyToast(t('Berhasil disalin ke clipboard: ') + txt, 'success', 'Tersalin');
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  const downloadReceiptPdf = (d: Donation) => {
    const formattedAmount = formatCurrency(d.amount);
    const dateFormatted = new Date(d.createdDate).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const receiptHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Kuitansi-Resmi-${d.receiptNumber}</title>
  <style>
    @page { size: A4 portrait; margin: 1.5cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f8fafc; padding: 25px; color: #1e293b; }
    .receipt-card { max-width: 800px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; padding: 40px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #059669; padding-bottom: 20px; margin-bottom: 25px; }
    .logo-area h1 { font-size: 22px; color: #065f46; font-weight: 800; margin-bottom: 4px; }
    .logo-area p { font-size: 11px; color: #64748b; line-height: 1.4; }
    .receipt-title { text-align: right; }
    .receipt-title h2 { font-size: 18px; color: #0f172a; text-transform: uppercase; font-weight: 900; letter-spacing: 1px; }
    .receipt-no { font-size: 12px; font-family: monospace; color: #059669; font-weight: bold; margin-top: 4px; }
    .status-badge { display: inline-block; background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 800; margin-top: 6px; }
    .meta-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #f1f5f9; padding: 15px 20px; border-radius: 12px; margin-bottom: 25px; font-size: 12px; }
    .meta-item span { color: #64748b; display: block; font-size: 11px; margin-bottom: 2px; }
    .meta-item strong { color: #1e293b; font-size: 13px; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; font-size: 13px; }
    .details-table th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #cbd5e1; color: #475569; font-size: 11px; text-transform: uppercase; }
    .details-table td { padding: 14px 12px; border-bottom: 1px solid #e2e8f0; vertical-align: top; }
    .amount-highlight { font-size: 22px; color: #059669; font-weight: 900; }
    .notes-box { background: #fefce8; border-left: 4px solid #eab308; padding: 12px 16px; border-radius: 6px; margin-bottom: 30px; font-size: 12px; color: #854d0e; }
    .footer-signatures { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 30px; padding-top: 20px; border-top: 1px dashed #cbd5e1; }
    .qr-stamp { display: flex; align-items: center; gap: 15px; }
    .qr-box { width: 70px; height: 70px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #059669; text-align: center; }
    .signature-area { text-align: right; font-size: 11px; color: #475569; }
    .signature-name { font-weight: 800; color: #0f172a; text-decoration: underline; margin-top: 25px; }
    .legal-notice { font-size: 10px; color: #94a3b8; text-align: center; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 15px; }
    .actions { text-align: center; margin-bottom: 20px; }
    .btn { background: #059669; color: white; padding: 10px 24px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; font-size: 13px; margin: 0 5px; box-shadow: 0 2px 8px rgba(5,150,105,0.3); }
    .btn-close { background: #64748b; }
    @media print { .actions { display: none !important; } body { background: white; padding: 0; } .receipt-card { box-shadow: none; border: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn" onclick="window.print()">🖨️ Cetak / Simpan sebagai PDF</button>
    <button class="btn btn-close" onclick="window.close()">Tutup Jendela</button>
  </div>
  <div class="receipt-card">
    <div class="header">
      <div class="logo-area">
        <h1>AMANAH IMPACT FOUNDATION</h1>
        <p>Lembaga Filantropi & Kemanusiaan Berkelanjutan</p>
        <p>SK Kemenkumham: AHU-0019283.AH.01.04.2024 | Izin Dinsos: 460/1092/DINSOS/2024</p>
        <p>Menara Filantropi Amanah Lt. 12, TB Simatupang, Jakarta Selatan</p>
      </div>
      <div class="receipt-title">
        <h2>Kuitansi Resmi</h2>
        <div class="receipt-no">No: ${d.receiptNumber}</div>
        <div class="status-badge">✓ LUNAS & TERVERIFIKASI</div>
      </div>
    </div>
    <div class="meta-grid">
      <div class="meta-item"><span>Telah Diterima Dari:</span><strong>${d.donorName}</strong></div>
      <div class="meta-item"><span>Waktu Transaksi:</span><strong>${dateFormatted} WIB</strong></div>
      <div class="meta-item"><span>Kanal / Metode Bayar:</span><strong>${d.paymentMethod || 'QRIS Instant Syariah'}</strong></div>
      <div class="meta-item"><span>Status Audit Syariah:</span><strong>Wajar Tanpa Pengecualian (PSAK 109)</strong></div>
    </div>
    <table class="details-table">
      <thead>
        <tr><th>Program Alokasi Kebaikan</th><th>Kategori</th><th style="text-align:right">Total Donasi</th></tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>${d.campaignTitle}</strong><br><small style="color:#64748b">Akad: Donasi Amanah & Penyaluran Kemanusiaan Langsung</small></td>
          <td><span style="background:#e0e7ff;color:#3730a3;padding:3px 8px;border-radius:6px;font-size:11px;font-weight:bold">${d.category || 'Kemanusiaan'}</span></td>
          <td style="text-align:right"><span class="amount-highlight">${formattedAmount}</span></td>
        </tr>
      </tbody>
    </table>
    ${d.message ? `<div class="notes-box"><strong>Pesan / Doa Donatur:</strong><p style="margin-top:4px;font-style:italic">"${d.message}"</p></div>` : ''}
    <div class="footer-signatures">
      <div class="qr-stamp">
        <div class="qr-box">VERIFIED<br>OFFICIAL<br>AIF 2026</div>
        <div style="font-size:11px;color:#64748b">
          <strong style="color:#059669;display:block">VERIFIKASI DIGITAL SAH</strong>
          Terdaftar dalam Buku Besar Publik (Public Ledger)<br>ID Resi: ${d.receiptNumber}
        </div>
      </div>
      <div class="signature-area">
        <p>Jakarta, ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p style="margin-top:2px">Dewan Pengurus Amanah Impact Foundation</p>
        <div class="signature-name">Dr. H. Ahmad Syarif, M.E.</div>
        <p>Direktur Eksekutif Filantropi</p>
      </div>
    </div>
    <div class="legal-notice">
      Dokumen tanda terima donasi ini sah diterbitkan secara elektronik oleh sistem informasi Amanah Impact Foundation dan diakui sebagai bukti penyaluran yang sah menurut standar PSAK 109 tanpa memerlukan stempel basah manual.
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

    // Direct download as HTML file
    const blob = new Blob([receiptHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Kuitansi-AIF-${d.receiptNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open print preview window
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(receiptHtml);
      printWin.document.close();
    }
    notifyToast(`Kuitansi resmi ${d.receiptNumber} berhasil diunduh dan dialog cetak PDF telah dibuka.`, 'success', 'Kuitansi Berhasil Diunduh');
  };

  const downloadCertificatePdf = (d: Donation) => {
    const certNum = d.certificateNumber || `AIF-CERT-${d.id}`;
    const dateFormatted = new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const certHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Sertifikat-Kemaslahatan-${certNum}</title>
  <style>
    @page { size: A4 landscape; margin: 1cm; }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Georgia', serif; }
    body { background: #f8fafc; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
    .cert-container { width: 1050px; height: 740px; background: #ffffff; border: 12px double #065f46; border-radius: 20px; padding: 30px; position: relative; box-shadow: 0 8px 30px rgba(0,0,0,0.1); background-image: radial-gradient(#d1fae5 1px, transparent 1px); background-size: 24px 24px; }
    .inner-border { width: 100%; height: 100%; border: 2px solid #d97706; border-radius: 12px; padding: 40px 60px; text-align: center; display: flex; flex-direction: column; justify-content: space-between; background: rgba(255,255,255,0.95); position: relative; }
    .watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 160px; color: rgba(5,150,105,0.03); font-weight: 900; pointer-events: none; }
    .header-logo h2 { font-size: 16px; color: #059669; letter-spacing: 4px; text-transform: uppercase; font-family: 'Segoe UI', sans-serif; font-weight: 800; margin-bottom: 2px; }
    .header-logo h1 { font-size: 34px; color: #064e3b; letter-spacing: 2px; text-transform: uppercase; font-weight: 900; margin-bottom: 4px; }
    .cert-id { font-size: 12px; font-family: monospace; color: #d97706; font-weight: bold; letter-spacing: 1px; }
    .divider { width: 180px; height: 3px; background: linear-gradient(to right, transparent, #d97706, transparent); margin: 12px auto; }
    .cert-body p { font-size: 14px; color: #475569; font-style: italic; margin-bottom: 12px; }
    .recipient-name { font-size: 36px; color: #0f172a; font-weight: bold; text-decoration: underline; text-underline-offset: 8px; text-decoration-color: #059669; font-family: 'Segoe UI', sans-serif; margin: 15px 0; }
    .program-title { font-size: 18px; color: #065f46; font-weight: bold; margin: 10px 0; }
    .doa-text { font-size: 13px; color: #64748b; line-height: 1.6; max-width: 750px; margin: 0 auto; font-style: italic; }
    .footer-area { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; }
    .sign-col { width: 260px; text-align: center; }
    .sign-col p { font-size: 12px; color: #64748b; }
    .sign-name { font-size: 14px; font-weight: bold; color: #0f172a; border-top: 1px solid #94a3b8; padding-top: 4px; margin-top: 35px; }
    .seal-badge { width: 100px; height: 100px; border-radius: 50%; border: 3px dashed #d97706; background: #fffbeb; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #b45309; font-size: 10px; font-weight: 900; text-transform: uppercase; }
    .actions { margin-bottom: 20px; text-align: center; }
    .btn { background: #d97706; color: white; padding: 10px 24px; border-radius: 8px; border: none; font-weight: bold; cursor: pointer; font-size: 13px; margin: 0 5px; box-shadow: 0 2px 8px rgba(217,119,6,0.3); font-family: sans-serif; }
    .btn-close { background: #64748b; }
    @media print { .actions { display: none !important; } body { background: white; padding: 0; min-height: auto; } .cert-container { box-shadow: none; width: 100%; height: 100%; border-width: 8px; } }
  </style>
</head>
<body>
  <div class="actions">
    <button class="btn" onclick="window.print()">🖨️ Cetak / Simpan Sertifikat PDF</button>
    <button class="btn btn-close" onclick="window.close()">Tutup Jendela</button>
  </div>
  <div class="cert-container">
    <div class="inner-border">
      <div class="watermark">AMANAH</div>
      <div class="header-logo">
        <h2>Amanah Impact Foundation</h2>
        <h1>Sertifikat Kemaslahatan Filantropi</h1>
        <div class="divider"></div>
        <div class="cert-id">No. Registrasi Syariah: ${certNum}</div>
      </div>
      <div class="cert-body">
        <p>Dengan memohon ridho Allah Subhanahu Wa Ta'ala, sertifikat ini dianugerahkan dengan penuh takzim kepada:</p>
        <div class="recipient-name">${d.donorName}</div>
        <p>Atas ketulusan niat, partisipasi aktif, dan kebaikan jariyah yang disalurkan melalui program:</p>
        <div class="program-title">"${d.campaignTitle}"</div>
        <div class="doa-text">
          "Semoga Allah SWT melipatgandakan pahala atas harta yang diinfaqkan, membersihkan jiwa dan rezeki, serta menjadikannya sebagai timbangan amal jariyah yang pahalanya senantiasa mengalir abadi bagi kemaslahatan umat."
        </div>
      </div>
      <div class="footer-area">
        <div class="sign-col">
          <p>Ketua Dewan Pembina</p>
          <div class="sign-name">Ustadz Salman Farisi</div>
          <p style="font-size:10px">Dewan Syariah Yayasan</p>
        </div>
        <div class="seal-badge">
          <span style="font-size:18px">★</span>
          <span>SYARIAH</span>
          <span style="font-size:8px">PSAK 109</span>
          <span>SAH</span>
        </div>
        <div class="sign-col">
          <p>Jakarta, ${dateFormatted}</p>
          <p>Direktur Eksekutif</p>
          <div class="sign-name">Dr. H. Ahmad Syarif, M.E.</div>
          <p style="font-size:10px">Amanah Impact Foundation</p>
        </div>
      </div>
    </div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() { window.print(); }, 400);
    };
  </script>
</body>
</html>`;

    // Direct download as HTML file
    const blob = new Blob([certHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Sertifikat-Kemaslahatan-${certNum}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Open print preview window
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(certHtml);
      printWin.document.close();
    }
    notifyToast(`Sertifikat digital ${certNum} berhasil diunduh dan pratinjau cetak PDF telah dibuka.`, 'success', 'Sertifikat Berhasil Diunduh');
  };

  const shareToWhatsApp = (d: Donation) => {
    const text = `Alhamdulillah, saya baru saja menyalurkan donasi melalui *Amanah Impact Foundation* untuk program *"${d.campaignTitle}"* (No. Resi: ${d.receiptNumber}). Mari bersama tebarkan maslahat dan kepedulian melalui: ${window.location.origin}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    notifyToast('Membuka WhatsApp untuk membagikan bukti donasi...', 'success', 'WhatsApp');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleCloseModal();
        }
      }}
    >
      <div id="modal-container" className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between text-gray-900 dark:text-white shrink-0">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-600 dark:fill-none" />
            <span className="font-extrabold text-sm tracking-tight text-emerald-700 dark:text-emerald-400">
              {step === 1 ? t('Amanah Donasi Engine') : step === 2 ? t('Konfirmasi Pembayaran Amanah') : t('Donasi Berhasil! Alhamdulillah')}
            </span>
          </div>
          <button
            id="close-modal-btn"
            onClick={handleCloseModal}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400 dark:text-gray-300 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable interior */}
        <div className="p-6 overflow-y-auto grow">

          {/* S1: Input step */}
          {step === 1 && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              
              {/* Campaign Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                  {t('Tujuan Alokasi Kebaikan')}
                </label>
                <select
                  id="select-campaign-slug"
                  value={campaignSlug}
                  onChange={(e) => setCampaignSlug(e.target.value)}
                  className="w-full text-sm font-semibold border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl p-3 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="umum">{t('Donasi Umum Amanah Impact (Umum)')}</option>
                  {campaigns.map(c => (
                    <option key={c.slug} value={c.slug}>{t(c.title)}</option>
                  ))}
                </select>
              </div>

              {/* Amount section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                  {t('Pilih Nominal Dukungan')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map(val => (
                    <button
                      key={val}
                      type="button"
                      id={`quick-amt-${val}`}
                      onClick={() => setAmountInput(String(val))}
                      className={`text-xs font-bold py-2 px-1 rounded-xl border transition-all cursor-pointer ${
                        Number(amountInput) === val
                          ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 scale-[1.03] shadow-sm'
                          : 'border-gray-200 dark:border-gray-700 hover:border-emerald-200 hover:bg-emerald-50/20 dark:hover:border-emerald-800 dark:hover:bg-gray-800/40 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {formatCurrency(val)}
                    </button>
                  ))}
                </div>

                <div className="relative rounded-xl shadow-sm mt-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-400 text-xs font-bold">Rp</span>
                  </div>
                  <input
                    type="number"
                    id="input-custom-amount"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="block w-full pl-8 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl text-sm font-bold focus:ring-2 focus:ring-emerald-500"
                    placeholder={t('Masukkan jumlah donasi lain')}
                  />
                </div>
              </div>

              {/* Recurring setting */}
              <div className="bg-emerald-50/40 dark:bg-emerald-950/10 p-3 rounded-xl border border-emerald-100/30">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="w-4.5 h-4.5 accent-emerald-600 rounded"
                    id="chk-recurring"
                  />
                  <div>
                    <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 block p-0">{t('Komitmen Donasi Rutin Bulanan')}</span>
                    <span className="text-[10px] text-gray-500">{t('Auto-reminder via WhatsApp & Email setiap bulannya (Infaq Berkelanjutan).')}</span>
                  </div>
                </label>
              </div>

              {/* Donor particulars */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {t('Informasi Donatur')}
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="w-3.5 h-3.5 accent-emerald-600"
                      id="chk-anonymous"
                    />
                    <span className="text-xs text-gray-500 font-semibold">{t('Sembunyikan Nama (Anonim)')}</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      disabled={isAnonymous}
                      id="input-donor-name"
                      value={isAnonymous ? t('Hamba Allah') : donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      placeholder={t('Nama Lengkap')}
                      className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500 disabled:opacity-65"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="input-donor-email"
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      placeholder={t('Alamat Email Kuitansi')}
                      className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    id="input-donor-phone"
                    value={donorPhone}
                    onChange={(e) => setDonorPhone(e.target.value)}
                    placeholder={t('Nomor WhatsApp (untuk update kuitansi & program)')}
                    className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <textarea
                    id="input-donor-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('Tulis pesan semangat, doa, atau harapan Anda...')}
                    rows={2}
                    className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                id="btn-goto-payments"
                className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-emerald-600/10 transition-colors flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                {t('Pilih Metode Pembayaran')}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <Shield className="w-3.5 h-3.5 text-emerald-600" />
                {t('Sertifikasi Keamanan Pembayaran Berlapis SSL & Enkripsi Data')}
              </div>
            </form>
          )}

          {/* S2: Payment Options Selection and Confirmation */}
          {step === 2 && (
            <div className="space-y-5">
              
              <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/30 rounded-xl p-4">
                <span className="text-xs text-gray-500 dark:text-gray-400 block font-semibold mb-1">{t('Dukungan Donasi Anda:')}</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(Number(amountInput))}</span>
                <span className="text-xs text-emerald-700 dark:text-emerald-400 font-bold block mt-1">
                  {t('Untuk:')} {campaignSlug === 'umum' ? t('Donasi Umum Amanah Impact (Umum)') : t(campaigns.find(c => c.slug === campaignSlug)?.title || 'Donasi Umum Amanah')}
                </span>
                {isRecurring && <span className="inline-block bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 text-[9px] text-emerald-800 dark:text-emerald-300 rounded font-bold mt-2">{t('DULANG BULANAN RUTIN')}</span>}
              </div>

              {/* Group payment list */}
              <div className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {t('Metode Pembayaran Tersedia')}
                </label>

                {/* QRIS quick item */}
                <div className="grid grid-cols-1 gap-2.5">
                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'QRIS'
                      ? 'border-emerald-600 bg-emerald-50/30'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/15'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment_chan" 
                      value="QRIS" 
                      checked={paymentMethod === 'QRIS'} 
                      onChange={() => setPaymentMethod('QRIS')}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <div className="grow">
                      <span className="text-xs font-bold text-gray-800 dark:text-white block">{t('QRIS Mandiri Otoritas')}</span>
                      <span className="text-[10px] text-gray-400 block">{t('Dukung semua E-wallet (GoPay, OVO, DANA, BCA Mobile)')}</span>
                    </div>
                    <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0">{t('INSTAN')}</span>
                  </label>

                  {/* VAs */}
                  {['Virtual Account BCA', 'Virtual Account Mandiri', 'Virtual Account BNI'].map(vaItem => (
                    <label key={vaItem} className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === vaItem
                        ? 'border-emerald-600 bg-emerald-50/30'
                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/15'
                    }`}>
                      <input 
                        type="radio" 
                        name="payment_chan" 
                        value={vaItem} 
                        checked={paymentMethod === vaItem} 
                        onChange={() => setPaymentMethod(vaItem)}
                        className="w-4 h-4 accent-emerald-600"
                      />
                      <div className="grow">
                        <span className="text-xs font-bold text-gray-800 dark:text-white block">{vaItem}</span>
                        <span className="text-[10px] text-gray-400 block">{t('Simulasi Virtual Account transfer bank langsung')}</span>
                      </div>
                    </label>
                  ))}

                  {/* Manual Transfer */}
                  <label className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Transfer Bank Manual'
                      ? 'border-emerald-600 bg-emerald-50/30'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/15'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment_chan" 
                      value="Transfer Bank Manual" 
                      checked={paymentMethod === 'Transfer Bank Manual'} 
                      onChange={() => setPaymentMethod('Transfer Bank Manual')}
                      className="w-4 h-4 accent-emerald-600"
                    />
                    <div className="grow">
                      <span className="text-xs font-bold text-gray-800 dark:text-white block">{t('Transfer Rekening Yayasan Resmi (Verifikasi Manual)')}</span>
                      <span className="text-[10px] text-gray-400 block">{t('BRI Amanah Utama a.n. Amanah Impact Foundation')}</span>
                    </div>
                  </label>
                </div>
              </div>

              {paymentMethod === 'QRIS' && (
                <div id="qris-graphic-loader" className="border border-dashed border-emerald-300 dark:border-emerald-800 bg-gray-100/40 dark:bg-gray-900 rounded-xl p-5 text-center flex flex-col items-center justify-center space-y-2">
                  <span className="text-xs text-gray-600 dark:text-gray-300 font-bold block">{t('Silakan scan QRIS di atas melalui aplikasi bank atau e-wallet pilihan Anda untuk menyelesaikan pembayaran instan secara aman.')}</span>
                  
                  {/* Generated simulated center QR code */}
                  <div className="bg-white p-3 rounded-xl border border-gray-200">
                    <img 
                      src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AMANAH-IMPACT-NGO-DONATION-PRO-2026" 
                      alt="Simulated QRIS Code" 
                      className="w-32 h-32 select-none pointer-events-none"
                    />
                  </div>
                  
                  <span className="text-[10px] text-gray-400 font-medium block">
                    * QRIS dinamis berlisensi BI | Link referensi MD-AIF-7
                  </span>
                </div>
              )}

              {paymentMethod.startsWith('Virtual Account') && (
                <div id="va-loader" className="bg-slate-50 dark:bg-slate-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-semibold">{t('Nomor Virtual Account:')}</span>
                    <button 
                      type="button"
                      onClick={() => copyText('88081288881234')}
                      className="text-xs text-emerald-600 hover:text-emerald-700 font-bold flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> {t('Salin Kode VA')}
                    </button>
                  </div>
                  <div className="text-xl font-mono text-center font-bold tracking-widest text-slate-900 dark:text-white bg-white dark:bg-gray-800/80 p-2.5 rounded-lg border border-gray-100">
                    88081288881234
                  </div>
                  <p className="text-[10px] text-gray-400 text-center">
                    {t('Lakukan transfer sebesar nominal di atas ke nomor Virtual Account berikut sebelum batas waktu habis.')}
                  </p>
                </div>
              )}

              {paymentMethod === 'Transfer Bank Manual' && (
                <div id="manual-bank-loader" className="bg-slate-50 dark:bg-slate-950 border border-gray-300 dark:border-gray-700 rounded-xl p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold text-gray-800 dark:text-white">
                    <span>{t('Bank BRI Syariah')}</span>
                    <button 
                      type="button" 
                      onClick={() => copyText('0231-01-000456-56-1')} 
                      className="text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                    >
                      <Copy className="w-3.5 h-3.5" /> {t('Salin Kode VA')}
                    </button>
                  </div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">
                    {t('No. Rekening:')} <span className="font-mono text-gray-950 dark:text-white">0231-01-000456-56-1</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t('Atas Nama:')} <span className="font-bold">Yayasan Amanah Impact Foundation</span>
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center cursor-pointer"
                >
                  {t('Kembali')}
                </button>
                <button
                  type="button"
                  id="btn-confirm-payment-success"
                  onClick={handleProcessDonation}
                  className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer shadow-md"
                >
                  <CheckCircle className="w-4 h-4 fill-white" />
                  {t('Proses Donasi Sekarang')}
                </button>
              </div>

            </div>
          )}

          {/* S3: Complete / Receipt Display */}
          {step === 3 && successDonation && (
            <div id="receipt-success-display" className="space-y-6 text-center py-4">
              
              <div className="flex flex-col items-center justify-center">
                <div className="p-4 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full mb-3 shadow shadow-emerald-500/20">
                  <CheckCircle className="w-10 h-10 fill-emerald-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white">{t('Donasi Berhasil! Alhamdulillah')}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t('Terima kasih, kepedulian Anda langsung tercatat dan berdampak bagi kemakmuran penerima manfaat.')}
                </p>
              </div>

              {/* Digital E-Receipt layout (fintech style) */}
              <div className="bg-slate-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-4 text-left text-xs space-y-2.5 relative">
                
                {/* Decorative border cut in ledger */}
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-500"></div>

                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-2">
                  <span className="font-extrabold text-emerald-800 dark:text-emerald-400 block tracking-tight text-sm">
                    {t('Kuitansi Digital Resmi')}
                  </span>
                  <span className="font-mono text-gray-400 text-[10px]">
                    No: {successDonation.receiptNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t('Donatur')}</span>
                  <span className="font-bold text-gray-800 dark:text-white">
                    {successDonation.donorName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t('Tujuan Alokasi Kebaikan')}</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400 tracking-tight text-right shrink-0 max-w-[60%] truncate">
                    {t(successDonation.campaignTitle)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t('Nominal')}</span>
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                    {formatCurrency(successDonation.amount)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t('Status Pembayaran')}</span>
                  <span className="font-bold px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-900 flex items-center gap-1 shrink-0">
                    {successDonation.paymentMethod} • {t('TERBAYAR & TERSALURKAN BERKAH')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">{t('Waktu Transaksi')}</span>
                  <span className="font-mono text-gray-700 dark:text-gray-300">
                    {new Date(successDonation.createdDate).toLocaleString('id-ID')}
                  </span>
                </div>

                {successDonation.certificateNumber && (
                  <div className="border-t border-dashed border-gray-200 dark:border-gray-700 pt-2.5 mt-2 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-amber-800 dark:text-amber-400 font-bold flex items-center gap-1">
                        <Coins className="w-3 h-3 text-amber-500 fill-amber-500 shrink-0" />
                        Sertifikat Digital Siap:
                      </span>
                      <span className="font-mono text-[9px] font-bold text-amber-900 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded">
                        ID: {successDonation.certificateNumber}
                      </span>
                    </div>

                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-normal">
                      Sertifikat kemaslahatan Amal Jariah atau Zakat syariah Anda telah terbit resmi a.n <strong>{successDonation.donorName}</strong>.
                    </p>
                  </div>
                )}
              </div>

              {/* Action utilities */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 shrink-0">
                <button
                  type="button"
                  onClick={() => downloadReceiptPdf(successDonation)}
                  id="btn-download-pdf-rcpt"
                  className="flex-1 bg-white hover:bg-gray-100 text-gray-700 dark:bg-gray-800 dark:hover:bg-slate-700 dark:text-white border border-gray-300 dark:border-gray-700 font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  {t('Unduh Kuitansi PDF')}
                </button>

                {successDonation.certificateNumber && (
                  <button
                    type="button"
                    onClick={() => downloadCertificatePdf(successDonation)}
                    id="btn-download-cert"
                    className="flex-1 bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                  >
                    <Download className="w-4 h-4 fill-white" />
                    Unduh Sertifikat Digital
                  </button>
                )}
              </div>

              <div className="flex items-center justify-center gap-3 text-xs text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4">
                <span>{t('Bagikan Kebaikan')}:</span>
                <button 
                  type="button"
                  id="share-whatsapp"
                  onClick={() => shareToWhatsApp(successDonation)}
                  className="p-1.5 px-3 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer border border-emerald-500/20 shadow-xs"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Kirim via WhatsApp</span>
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 mt-2">
                <button
                  type="button"
                  id="btn-donate-again"
                  onClick={() => {
                    setStep(1);
                    setSuccessDonation(null);
                    setMessage('');
                    setAmountInput('100000');
                  }}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                  <span>{t('Donasi Lagi / Program Lain')}</span>
                </button>

                <button
                  type="button"
                  id="btn-finish-dialog"
                  onClick={handleCloseModal}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center cursor-pointer transition-colors"
                >
                  {t('Selesai & Tutup')}
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
