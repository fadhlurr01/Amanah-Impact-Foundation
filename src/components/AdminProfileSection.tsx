import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Save, CheckCircle, AlertCircle, Image, LogOut } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminProfileSectionProps {
  currentAdmin: AdminUser;
  setCurrentAdmin: (user: AdminUser) => void;
  onLogout: () => void;
}

export default function AdminProfileSection({ currentAdmin, setCurrentAdmin, onLogout }: AdminProfileSectionProps) {
  // Profile inputs
  const [name, setName] = useState(currentAdmin.name);
  const [email, setEmail] = useState(currentAdmin.email);
  const [phone, setPhone] = useState(currentAdmin.phone);
  const [photoUrl, setPhotoUrl] = useState(currentAdmin.photoUrl);
  
  // Password inputs
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  // UI states
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const defaultAvatars = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150'
  ];

  // Sync state if currentAdmin changes from parent
  useEffect(() => {
    setName(currentAdmin.name);
    setEmail(currentAdmin.email);
    setPhone(currentAdmin.phone);
    setPhotoUrl(currentAdmin.photoUrl);
  }, [currentAdmin]);

  const handleShowAlert = (type: 'success' | 'error', text: string) => {
    setAlertMsg({ type, text });
    setTimeout(() => {
      setAlertMsg(null);
    }, 5000);
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !phone) {
      handleShowAlert('error', 'Nama, email, dan nomor HP wajib diisi.');
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        handleShowAlert('error', 'Sandi baru harus memiliki minimal 6 karakter.');
        return;
      }
      if (newPassword !== confirmNewPassword) {
        handleShowAlert('error', 'Konfirmasi sandi baru tidak cocok.');
        return;
      }
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentEmail: currentAdmin.email,
          name: name.trim(),
          email: email.toLowerCase().trim(),
          phone: phone.trim(),
          photoUrl: photoUrl.trim() || defaultAvatars[0],
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Gagal memperbarui profil.');
      }

      setCurrentAdmin({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        photoUrl: data.user.photoUrl
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');

      handleShowAlert('success', 'Profil Anda berhasil diperbarui di basis data MySQL!');
    } catch (err: any) {
      handleShowAlert('error', err.message || 'Gagal memperbarui profil.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-200">
      
      {/* Tab intro header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-4">
        <div>
          <h4 className="text-base font-extrabold text-gray-900 dark:text-white">
            Pengaturan Akun & Profil Amil
          </h4>
          <p className="text-xs text-gray-400 mt-1">
            Ganti nama, foto avatar, email korespondensi, dan sandi pengaman Anda.
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/20 dark:hover:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-red-200/55 cursor-pointer transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Sesi Admin
        </button>
      </div>

      {/* Profile Form card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/80 p-5 md:p-6 shadow-sm">
        
        {/* Alerts status */}
        {alertMsg && (
          <div
            className={`p-4 rounded-xl text-xs font-bold mb-5 flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150 ${
              alertMsg.type === 'success'
                ? 'bg-emerald-50 border border-emerald-150 text-emerald-800 dark:bg-emerald-950/30 dark:border-emerald-900/50 dark:text-emerald-300'
                : 'bg-red-50 border border-red-150 text-red-800 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-300'
            }`}
          >
            {alertMsg.type === 'success' ? (
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4.5 h-4.5 text-red-600 dark:text-red-400 shrink-0" />
            )}
            <span className="leading-relaxed">{alertMsg.text}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-5">
          
          {/* Avatar Settings Block */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200/55 dark:border-gray-800/80 flex flex-col sm:flex-row items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={photoUrl || defaultAvatars[0]}
                alt="Admin Avatar Preview"
                className="w-18 h-18 rounded-full border-2 border-emerald-500 object-cover shadow-md bg-white"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultAvatars[0];
                }}
              />
              <span className="absolute bottom-0 right-0 bg-emerald-600 text-white p-1 rounded-full border border-white">
                <Image className="w-3 h-3" />
              </span>
            </div>
            
            <div className="grow space-y-2 text-center sm:text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Pilih Foto Avatar Amil
              </span>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                {defaultAvatars.map((url, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setPhotoUrl(url)}
                    className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all hover:scale-105 cursor-pointer ${
                      photoUrl === url ? 'border-emerald-500 scale-105 shadow' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={url} alt={`Avatar option ${index}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
              <div>
                <input
                  type="text"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  className="w-full mt-1.5 p-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-[10px] text-gray-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  placeholder="Atau tempel URL gambar kustom di sini..."
                />
              </div>
            </div>
          </div>

          {/* Bio Data Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Nama Lengkap Amil
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Nomor WhatsApp (No. HP)
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:bg-white"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                Alamat Email Korespondensi
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* Change Password Block */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5 space-y-4">
            <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-450 uppercase tracking-wider">
              Ubah Sandi Keamanan (Opsional)
            </h5>
            <p className="text-[10px] text-gray-400 -mt-2 leading-relaxed">
              Kosongkan bidang sandi baru jika Anda tidak ingin mengubah sandi Anda saat ini.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Kata Sandi Baru
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:bg-white"
                    placeholder="Sandi baru minimal 6 karakter"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-650"
                  >
                    {showNewPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">
                  Konfirmasi Sandi Baru
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="block w-full pl-9 pr-10 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-slate-700 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none focus:bg-white"
                    placeholder="Ketik ulang sandi baru"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Verification section to authorize changes */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-5 bg-amber-50/20 dark:bg-amber-950/10 p-4 rounded-xl border border-amber-100/50 dark:border-amber-900/30">
            <label className="block text-[10px] font-black text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1.5">
              Sandi Saat Ini (Wajib Untuk Menyimpan Perubahan)
            </label>
            <div className="relative rounded-lg shadow-sm max-w-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-4 h-4 text-amber-600/70" />
              </div>
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full pl-9 pr-10 py-2 bg-white dark:bg-gray-900 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-gray-900 dark:text-white focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                placeholder="Masukkan sandi akun Anda sekarang"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-amber-600/70 hover:text-amber-700"
              >
                {showCurrentPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:active:bg-emerald-700 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-colors"
            >
              <Save className="w-4 h-4" />
              Simpan Profil Amil
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
