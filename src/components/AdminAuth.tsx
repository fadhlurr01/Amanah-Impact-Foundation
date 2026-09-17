import React, { useState } from 'react';
import { Shield, Mail, Lock, CheckCircle, AlertCircle, Eye, EyeOff, KeyRound, Sparkles, ArrowLeft, X, ShieldCheck } from 'lucide-react';

interface AdminUser {
  name: string;
  email: string;
  phone: string;
  photoUrl: string;
}

interface AdminAuthProps {
  onLoginSuccess: (user: AdminUser) => void;
  langPack: any;
  currentLang?: string;
  onBackToWeb?: () => void;
  isModal?: boolean;
  onClose?: () => void;
}

export default function AdminAuth({ onLoginSuccess, langPack, currentLang = 'id', onBackToWeb, isModal = false, onClose }: AdminAuthProps) {
  // Super Admin fields
  const [email, setEmail] = useState('admin@amanah.org');
  const [password, setPassword] = useState('admin123');
  
  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150'
  ];

  const handleShowAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 5000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      handleShowAlert('error', 'Silakan masukkan email dan kata sandi Super Admin.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ email: email.trim(), password })
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('Gagal memproses respons dari server autentikasi.');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Email atau kata sandi Super Admin tidak cocok.');
      }

      handleShowAlert('success', `Autentikasi berhasil! Selamat datang, ${data.user?.name || 'Admin'}. Mengalihkan ke Dashboard...`);
      setTimeout(() => {
        onLoginSuccess({
          name: data.user?.name || 'Ahmad Syarif',
          email: data.user?.email || 'admin@amanah.org',
          phone: data.user?.phone || '081234567890',
          photoUrl: data.user?.photoUrl || defaultAvatars[0]
        });
      }, 700);
    } catch (err: any) {
      handleShowAlert('error', err.message || 'Email atau kata sandi Super Admin tidak cocok.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('admin@amanah.org');
    setPassword('admin123');
    handleShowAlert('success', 'Kredensial Super Admin siap digunakan.');
  };

  const cardContent = (
    <div 
      onClick={(e) => e.stopPropagation()}
      className={`w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative ${
        isModal ? 'my-auto' : 'my-12'
      }`}
    >
      {/* Tombol Tutup Modal jika dalam mode Modal Dialog */}
      {isModal && onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-8 h-8 rounded-full bg-black/25 hover:bg-black/40 text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm"
          title="Tutup (Tetap di Web)"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Branding Header */}
      <div className="p-8 text-white relative text-center bg-gradient-to-br from-emerald-800 via-slate-900 to-emerald-950">
        {onBackToWeb && !isModal && (
          <button
            type="button"
            onClick={onBackToWeb}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 backdrop-blur-md text-[10px] font-black tracking-wide text-white px-3 py-1 rounded-full flex items-center gap-1.5 transition cursor-pointer"
            title="Kembali ke Halaman Web"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Ke Web</span>
          </button>
        )}
        
        <div className={`absolute top-4 ${isModal && onClose ? 'right-14' : 'right-4'} bg-emerald-500/20 border border-emerald-400/40 text-[9px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 text-emerald-300`}>
          <KeyRound className="w-3 h-3 text-emerald-300" /> Super Admin Access
        </div>

        <div className="w-14 h-14 bg-emerald-500/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 border border-emerald-500/30 shadow-inner text-emerald-400">
          <ShieldCheck className="w-7 h-7 text-emerald-400" />
        </div>

        <h3 className="text-xl font-extrabold tracking-tight">
          Portal Autentikasi Super Admin
        </h3>
        <p className="text-xs text-slate-300 mt-1">
          Amanah Impact Foundation — Akses Tunggal Kendali Sistem
        </p>
      </div>

      <div className="p-6 md:p-8 space-y-5">
        
        {/* Dynamic Alert Messages */}
        {alertMsg && (
          <div
            className={`p-3.5 rounded-xl text-xs font-semibold flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150 ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300'
                : 'bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{alertMsg.text}</span>
          </div>
        )}

        <div className="p-3 bg-emerald-50/70 dark:bg-slate-800/60 border border-emerald-200/50 dark:border-slate-700/60 rounded-2xl text-[11px] text-emerald-900 dark:text-emerald-200 leading-relaxed flex items-center justify-between gap-2">
          <span>Akses tunggal otoritas penuh Super Admin:</span>
          <button
            type="button"
            onClick={fillDefaultCredentials}
            className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer shrink-0 bg-white dark:bg-slate-900 px-2 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800"
          >
            Isi Cepat Default
          </button>
        </div>

        {/* SINGLE SUPER ADMIN LOGIN FORM */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Email Super Admin
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-4 w-4 text-emerald-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-9.5 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1.5 focus:ring-emerald-500 focus:outline-none font-semibold"
                placeholder="admin@amanah.org"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1.5">
              Kunci Akses Super Admin (Password)
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-4 w-4 text-emerald-500" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-9.5 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1.5 focus:ring-emerald-500 focus:outline-none font-semibold"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-emerald-600/20 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer mt-5"
          >
            <KeyRound className="w-4 h-4" />
            {isSubmitting ? 'Memverifikasi Akses...' : 'Masuk Cockpit Super Admin'}
          </button>
        </form>

      </div>
    </div>
  );

  if (isModal) {
    return (
      <div 
        id="admin-auth-modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
