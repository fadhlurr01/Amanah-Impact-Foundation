import React, { useState } from 'react';
import { MessageSquarePlus, Star, X, CheckCircle, Send, Sparkles } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang?: string;
}

export default function FeedbackModal({ isOpen, onClose, currentLang = 'id' }: FeedbackModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [category, setCategory] = useState<string>('Fitur Baru');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/feedbacks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, category, name, email, message })
      });

      if (res.ok) {
        setIsSuccess(true);
        window.dispatchEvent(new CustomEvent('amanah-toast', {
          detail: { message: 'Masukan dan aspirasi Anda berhasil terkirim ke tim Amanah Impact. Jazakallah khair!', type: 'success', title: 'Feedback Terkirim' }
        }));
        setTimeout(() => {
          setIsSuccess(false);
          setMessage('');
          setName('');
          setEmail('');
          onClose();
        }, 2000);
      } else {
        window.dispatchEvent(new CustomEvent('amanah-toast', {
          detail: { message: 'Gagal mengirim feedback. Silakan periksa koneksi server.', type: 'error', title: 'Gagal Mengirim' }
        }));
      }
    } catch (err) {
      window.dispatchEvent(new CustomEvent('amanah-toast', {
        detail: { message: 'Kendala jaringan saat mengirim feedback.', type: 'error', title: 'Jaringan Terputus' }
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center backdrop-blur-md">
              <MessageSquarePlus className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm tracking-tight">Kirim Masukan & Evaluasi Tools</h3>
              <p className="text-[11px] text-emerald-100">Bantu kami meningkatkan kualitas layanan AIF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-gray-900 dark:text-white">Terima Kasih Banyak!</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Masukan Anda sangat berharga bagi peningkatan platform Amanah Impact Foundation.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-4">
            {/* Rating Stars */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                Bagaimana pengalaman Anda menggunakan tools ini?
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 cursor-pointer transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-500 ml-2">
                  {rating === 5 ? '⭐⭐⭐⭐⭐ Luar Biasa' : `${rating} Bintang`}
                </span>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Kategori Masukan
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['Fitur Baru', 'UI/UX & Desain', 'Koreksi Data', 'Laporan Kendala'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`py-1.5 px-3 text-xs font-semibold rounded-xl border transition-all text-center cursor-pointer ${
                      category === cat
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-500 dark:text-emerald-300 font-bold'
                        : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-emerald-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1">
                Komentar / Saran Anda <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan pengalaman, masukan fitur, atau perbaikan..."
                className="w-full text-xs p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
              />
            </div>

            {/* Optional Contact info */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Nama (Opsional)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Anda"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 mb-1">
                  Email (Opsional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@anda.com"
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1.5 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !message}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer mt-2"
            >
              <Send className="w-3.5 h-3.5" />
              {isSubmitting ? 'Mengirimkan...' : 'Kirim Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
