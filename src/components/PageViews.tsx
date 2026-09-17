/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Heart, MapPin, Share2, ClipboardCheck, ArrowRight, ShieldCheck, 
  Search, Users, Calendar, Award, Building2, Smile, ArrowUpRight, CheckCircle,
  AlertCircle, Play, Smartphone, Monitor, Info, Sparkles, Star, Quote,
  ChevronLeft, ChevronRight, Check, HelpCircle, ChevronDown, Zap,
  X, BarChart3, Layers, FileText, CheckCircle2
} from 'lucide-react';
import { Campaign, Donation, Donor, Volunteer, CsrInquiry, BlogPost, FAQ, Testimonial, Report } from '../types';
import ZakatCalculator from './ZakatCalculator';
import InteractiveMap from './InteractiveMap';
import { getTranslation } from '../translations';

interface PageViewsProps {
  currentView: string;
  campaigns: Campaign[];
  donations: Donation[];
  donors: Donor[];
  blogs: BlogPost[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  reports?: Report[];
  currentLang: string;
  langPack: any;
  onSelectCampaign: (slug: string) => void;
  onOpenDonateModal: (campaignSlug?: string, amount?: number) => void;
  onRefreshAll: () => void;
  onNavigate?: (view: string) => void;
}

export default function PageViews({
  currentView,
  campaigns,
  donations,
  donors,
  blogs,
  testimonials,
  faqs,
  reports,
  currentLang,
  langPack,
  onSelectCampaign,
  onOpenDonateModal,
  onRefreshAll,
  onNavigate
}: PageViewsProps) {
  
  const t = (text: string) => getTranslation(text, currentLang);

  const notifyToast = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', title?: string) => {
    window.dispatchEvent(new CustomEvent('amanah-toast', {
      detail: { message: msg, type, title: title || (type === 'error' ? 'Kesalahan' : type === 'warning' ? 'Perhatian' : 'Amanah Impact') }
    }));
  };

  // States
  const [campSearch, setCampSearch] = useState('');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Semua');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  // CSR state form
  const [csrCompany, setCsrCompany] = useState('');
  const [csrPic, setCsrPic] = useState('');
  const [csrPhone, setCsrPhone] = useState('');
  const [csrEmail, setCsrEmail] = useState('');
  const [csrProgram, setCsrProgram] = useState('Pendidikan');
  const [csrBudget, setCsrBudget] = useState('Rp50juta - Rp100juta');
  const [csrInquirySuccess, setCsrInquirySuccess] = useState(false);

  // Volunteer state form
  const [volName, setVolName] = useState('');
  const [volEmail, setVolEmail] = useState('');
  const [volPhone, setVolPhone] = useState('');
  const [volExperience, setVolExperience] = useState('');
  const [volSkills, setVolSkills] = useState<string[]>([]);
  const [volInquirySuccess, setVolInquirySuccess] = useState(false);

  // Map interactive state
  const [hoveredRegion, setHoveredRegion] = useState<{ name: string; amount: string; desc: string } | null>(null);

  // Interactive Platform Exploration Modal State
  const [isExploreModalOpen, setIsExploreModalOpen] = useState<boolean>(false);
  const [exploreActiveTab, setExploreActiveTab] = useState<'ledger' | 'distribution' | 'compliance'>('ledger');

  // Active beneficiary testimonial index
  const [activeBeneficiaryIndex, setActiveBeneficiaryIndex] = useState(0);

  // Testimonial Carousel State & Data (Satu persatu dilihat & otomatis bergeser / swipe)
  const defaultTestimonials: Testimonial[] = [
    {
      id: 'T-01',
      name: 'H. Hendra Wijaya',
      role: 'Donatur Zakat Maal',
      location: 'Jakarta',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
      content: 'Sistem digital ledger real-time dari Amanah sangat luar biasa. Saya bisa langsung melihat dana zakat maal saya disalurkan ke program beasiswa dhuafa dalam hitungan jam. Transparansi seperti ini yang dicari umat.',
      rating: 5,
      type: 'donor' as const
    },
    {
      id: 'T-02',
      name: 'Ibu Ratna Kartika',
      role: 'Mitra CSR Korporasi',
      location: 'Bandung',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
      content: 'Kami bermitra dengan Amanah untuk program pengadaan sumur bor air bersih di daerah kekeringan. Laporan dampak kualitatif sangat komprehensif, dilengkapi data sains dan kuitansi transparan.',
      rating: 5,
      type: 'csr_partner' as const
    },
    {
      id: 'T-03',
      name: 'Zaki Al-Ghifari',
      role: 'Relawan Kemanusiaan',
      location: 'Surabaya',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
      content: 'Menjadi bagian dari tim relawan tanggap darurat Amanah membuka mata saya tentang pentingnya ketulusan. Semua penyaluran diatur dengan integritas tinggi dan langsung menyentuh penerima manfaat di lapangan.',
      rating: 5,
      type: 'volunteer' as const
    },
    {
      id: 'T-04',
      name: 'Siti Rahma',
      role: 'Penerima Manfaat Santri',
      location: 'Sukabumi',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150',
      content: 'Alhamdulillah, berkat beasiswa penuh dan asrama dari Amanah Impact Foundation, saya dapat melanjutkan sekolah ke jenjang menengah kejuruan. Terima kasih para donatur dan yayasan!',
      rating: 5,
      type: 'beneficiary' as const
    }
  ];

  const testimonialList = (testimonials && testimonials.length > 0) ? testimonials : defaultTestimonials;
  const [activeTestiIndex, setActiveTestiIndex] = useState(0);
  const [isTestiPaused, setIsTestiPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // Auto-shift timer (4.5 seconds)
  useEffect(() => {
    if (isTestiPaused || testimonialList.length <= 1) return;
    const timer = setInterval(() => {
      setActiveTestiIndex((prev) => (prev + 1) % testimonialList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isTestiPaused, testimonialList.length, activeTestiIndex]);

  const handleNextTesti = () => {
    setActiveTestiIndex((prev) => (prev + 1) % testimonialList.length);
  };

  const handlePrevTesti = () => {
    setActiveTestiIndex((prev) => (prev - 1 + testimonialList.length) % testimonialList.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsTestiPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsTestiPaused(false);
    if (touchStartX === null || touchEndX === null) return;
    const distance = touchStartX - touchEndX;
    if (distance > 40) {
      handleNextTesti();
    } else if (distance < -40) {
      handlePrevTesti();
    }
    setTouchStartX(null);
    setTouchEndX(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // SVG Map regions
  const indonesiaRegions = [
    { name: 'Sumatra', amount: 'Rp 1.450.000.000', desc: '46 Sekolah Tersertifikasi & Bantuan Tanggap Bencana Gempa', cx: '15%', cy: '40%' },
    { name: 'Jawa', amount: 'Rp 4.210.000.000', desc: '14 Pesantren Mandiri, 400 Santri Asrama & 2 Sumur Bor Utama Cilacap', cx: '35%', cy: '72%' },
    { name: 'Kalimantan', amount: 'Rp 890.000.000', desc: '3 Desa Sehat Sejahtera & Perlindungan Hutan Hijau Berkelanjutan', cx: '45%', cy: '45%' },
    { name: 'Sulawesi', amount: 'Rp 1.120.000.000', desc: 'Bantuan Pangan Nelayan Pesisir & Air Mengalir Donggala', cx: '65%', cy: '50%' },
    { name: 'Nusa Tenggara & Bali', amount: 'Rp 2.800.000.000', desc: 'Sumur Bor Produktif NTT, 2 Klinik Ibu & Anak Dhuafa', cx: '62%', cy: '80%' },
    { name: 'Maluku & Papua', amount: 'Rp 1.620.000.000', desc: 'Program Edukasi Terang Papua & Distribusi Beras Gizi Pelosok Asmat', cx: '88%', cy: '60%' }
  ];

  // Submission handles
  const handleCsrForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csrCompany || !csrPic || !csrPhone) {
      notifyToast('Tolong isi data Perusahaan dan kontak PIC lengkap.', 'warning', 'Form Kemitraan CSR');
      return;
    }
    try {
      const res = await fetch('/api/csr-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: csrCompany,
          picName: csrPic,
          whatsapp: csrPhone,
          email: csrEmail,
          interestedProgram: csrProgram,
          budgetRange: csrBudget
        })
      });
      if (res.ok) {
        setCsrInquirySuccess(true);
        setCsrCompany('');
        setCsrPic('');
        onRefreshAll();
        notifyToast('Proposal kemitraan CSR institusi Anda berhasil tercatat. Tim kemitraan akan segera menghubungi PIC.', 'success', 'Proposal CSR Terkirim');
      }
    } catch (e) {
      notifyToast('Kendala jaringan saat mengirim formulir CSR.', 'error', 'Kemitraan CSR');
    }
  };

  const handleVolunteerForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!volName || !volEmail || !volPhone) {
      notifyToast('Mohon isi nama lengkap dan nomor telepon / WhatsApp.', 'warning', 'Pendaftaran Relawan');
      return;
    }
    try {
      const res = await fetch('/api/volunteers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: volName,
          email: volEmail,
          whatsapp: volPhone,
          experience: volExperience,
          skills: volSkills.length > 0 ? volSkills : ['Logistik Terpadu']
        })
      });
      if (res.ok) {
        setVolInquirySuccess(true);
        setVolName('');
        setVolExperience('');
        onRefreshAll();
        notifyToast('Pendaftaran relawan berhasil tersimpan! Tim koordinasi relawan akan segera menghubungi Anda.', 'success', 'Relawan Terdaftar');
      }
    } catch (e) {
      notifyToast('Gagal memproses pendaftaran relawan ke database.', 'error', 'Pendaftaran Relawan');
    }
  };

  const handleSkillToggle = (s: string) => {
    if (volSkills.includes(s)) {
      setVolSkills(volSkills.filter(sk => sk !== s));
    } else {
      setVolSkills([...volSkills, s]);
    }
  };

  const calculateRemaining = (target: number, collected: number) => {
    return Math.max(0, target - collected);
  };

  return (
    <div id="page-views-wrapper" className="space-y-12">
      
      {/* 1. HOMEPAGE VIEW */}
      {currentView === 'home' && (
        <>
          {/* Main Hero block */}
          <section id="hero-section" className="relative py-20 px-6 rounded-3xl overflow-hidden bg-radial from-emerald-800 to-slate-900 text-white flex flex-col items-center text-center">
            
            {/* Background absolute decor */}
            <div className="absolute inset-0 opacity-15 bg-cover bg-center mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200')" }}></div>
            
            <div className="max-w-3xl relative z-10 space-y-6">
              <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500 font-extrabold px-3 py-1.5 rounded-full text-xs tracking-wider uppercase">
                {langPack.legalStatus || 'Yayasan Resmi Berizin Kemensos RI'}
              </span>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight md:leading-none text-slate-50">
                {langPack.heroHeadline}
              </h1>

              <p className="text-sm md:text-base text-gray-350 leading-relaxed max-w-2xl mx-auto font-medium">
                {langPack.heroSubheadline}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-3.5 pt-4 shrink-0">
                <button
                  id="hero-btn-donate"
                  onClick={() => onOpenDonateModal()}
                  className="bg-emerald-500 hover:bg-emerald-600 font-extrabold px-7 py-3.5 rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center gap-2 text-sm cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white" /> {langPack.btnDonateNow}
                </button>
                <button
                  id="hero-btn-transparency"
                  onClick={() => {
                    const section = document.getElementById('section-transparency');
                    if (section) {
                      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else if (onNavigate) {
                      onNavigate('home');
                      setTimeout(() => {
                        document.getElementById('section-transparency')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }, 150);
                    }
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-gray-700 font-bold px-6 py-3.5 rounded-xl transition-colors text-sm cursor-pointer shadow-md"
                >
                  {langPack.btnSeeImpact}
                </button>
              </div>
            </div>

            {/* Micro horizontal trust banner */}
            <div className="mt-16 w-full max-w-4xl border-t border-emerald-500/10 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-gray-300">
              <div className="flex items-center justify-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-left">{langPack.auditBadge || 'Opini Auditor WTP Resmi'}</span>
              </div>
              <div className="flex items-center justify-center gap-2.5 border-y sm:border-y-0 sm:border-x border-emerald-500/10 py-3 sm:py-0">
                <Award className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-left">{t('Sertifikasi BNSP & MUI Syariat')}</span>
              </div>
              <div className="flex items-center justify-center gap-2.5">
                <Smile className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="font-semibold text-left">{t('100% Amanah Tersalurkan Nyata')}</span>
              </div>
            </div>
          </section>

          {/* SECTION MASALAH & SOLUSI */}
          <section id="section-masalah" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 space-y-10 shadow-sm">
            {/* Header Utama Section */}
            <div className="text-center max-w-3xl mx-auto space-y-2.5">
              <span className="text-[10px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 uppercase">
                {t('TRANSFORMASI GERAKAN SOSIAL & FILANTROPI')}
              </span>
              <h2 className="text-xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white mt-1">
                {t('Mengurai Krisis Kepercayaan dengan Solusi Nyata')}
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                {t('Banyak niat baik terhambat karena kekhawatiran klasik dalam penyaluran dana publik. Kami hadir mengurai tantangan tersebut melalui pendekatan filantropi modern yang akuntabel, transparan, dan terukur.')}
              </p>
            </div>

            {/* Grid Perbandingan Dampak Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
              
              {/* KOLOM KIRI: MASALAH (Style Merah / Rose) */}
              <div className="bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100/60 dark:border-rose-900/20 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="border-b border-rose-100 dark:border-rose-900/40 pb-4">
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400">
                    <AlertCircle className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('TANTANGAN UTAMA')}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white mt-1">
                    {t('Krisis Kepercayaan Publik')}
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex gap-4 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-rose-100/30 dark:border-rose-900/20 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/55 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-mono text-xs font-black">
                      01
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-xs">
                        {t('Ketidakjelasan Laporan Keuangan')}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t('Donatur sering tidak mengetahui ke mana sisa dana disalurkan. Laporan keuangan tahunan yang lambat diunggah memicu keraguan publik atas akuntabilitas lembaga.')}
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-rose-100/30 dark:border-rose-900/20 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/55 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-mono text-xs font-black">
                      02
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-xs">
                        {t('Biaya Operasional Amil Tersembunyi')}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t('Potongan administrasi yang terlalu tinggi dan tidak transparan di awal seringkali memotong esensi nilai donasi yang diterima penerima manfaat murni di lapangan.')}
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-rose-100/30 dark:border-rose-900/20 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-rose-100 dark:bg-rose-950/55 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0 font-mono text-xs font-black">
                      03
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-xs">
                        {t('Dampak Penyaluran yang Sulit Diukur')}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t('Penyaluran dana sering kali bersifat konsumtif jangka pendek sekali habis, tanpa pengukuran dampak sosial yang jelas bagi masa depan penerima manfaat.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* KOLOM KANAN: SOLUSI (Style Hijau / Emerald) */}
              <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/60 dark:border-emerald-900/20 rounded-2xl p-6 md:p-8 space-y-6">
                <div className="border-b border-emerald-100 dark:border-emerald-900/40 pb-4">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-[11px] font-black uppercase tracking-widest">{t('SOLUSI AMANAH IMPACT')}</span>
                  </div>
                  <h3 className="text-base md:text-lg font-black text-gray-900 dark:text-white mt-1">
                    {t('Transparansi Digital & Dampak Nyata')}
                  </h3>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex gap-4 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-emerald-100/30 dark:border-emerald-900/20 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs font-black">
                      01
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-950 dark:text-white text-xs">
                        {t('Real-Time Public Ledger')}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t('Setiap sen donasi yang masuk atau keluar langsung tercatat dan dapat dipantau oleh siapa saja secara seketika melalui mutasi publik terbuka tanpa rekayasa.')}
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex gap-4 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-emerald-100/30 dark:border-emerald-900/20 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs font-black">
                      02
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-xs">
                        {t('100% Penyaluran Murni & CSR Ops')}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t('Dengan opsi biaya admin 0% untuk donatur, seluruh pembiayaan administrasi ditanggung oleh dana kontribusi dari kemitraan strategis korporasi (CSR) kami.')}
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex gap-4 items-start bg-white dark:bg-gray-900 p-4 rounded-xl border border-emerald-100/30 dark:border-emerald-900/20 shadow-sm">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0 font-mono text-xs font-black">
                      03
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-xs">
                        {t('Laporan Dampak & Monitoring Terukur')}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {t('Kami menggunakan metodologi kualifikasi sosial untuk melacak perbaikan ekonomi dan pendidikan penerima manfaat yang didokumentasikan berkala oleh tim relawan.')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* SECTION VIDEO DEMO & PLATFORM MOCKUPS */}
          <section id="section-video-demo" className="scroll-mt-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-10 text-white space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
              <div className="max-w-xl">
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                  {t('DEMO TOOLS & PLATFORM TRANSPARANSI')}
                </span>
                <h2 className="text-xl md:text-3xl font-black tracking-tight text-white mt-1">
                  {t('Eksplorasi Aplikasi & Dashboard Amil')}
                </h2>
                <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                  {t('Kami menyediakan perangkat pintar baik bagi para donatur untuk menghitung kontribusi mereka, maupun dashboard terintegrasi bagi publik dan amil untuk memantau aliran dana.')}
                </p>
              </div>

              {/* Demo Section Tab Switcher */}
              <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs shrink-0 font-bold">
                <button
                  onClick={() => notifyToast('Simulasi Sesi: Anda sedang melihat rancangan dashboard operasional terpadu.', 'info', 'Live Demo Portal')}
                  className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  Live Demo Mode Active
                </button>
              </div>
            </div>

            {/* Browser & Phone Showcase Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pt-4">
              
              {/* DESKTOP BROWSER CHROME MOCKUP */}
              <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <span className="bg-emerald-500/10 px-2 py-1 rounded">Desktop View</span>
                    <span>•</span>
                    <span className="text-gray-400 font-medium">{t('Dashboard Real-Time Pengawasan Publik')}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">{t('Sistem Transparansi Ledger Utama')}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t('Sistem berbasis awan (cloud) yang merangkum kurva pengumpulan dana, sebaran wilayah, penugasan amil di lapangan, serta audit ledger otomatis yang dapat diunduh publik dalam format standar WTP.')}
                  </p>
                </div>

                {/* Actual Dashboard Preview Frame Wrapper */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
                  
                  {/* Browser contents image viewport */}
                  <div className="relative group overflow-hidden bg-slate-900 aspect-video flex items-center justify-center">
                    <img 
                      src="/desktop_dashboard_screenshot_1783738865394.jpg" 
                      alt="Desktop Dashboard Screenshot"
                      className="w-full h-full object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-500 pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Play / Demo Interactive Overlay */}
                    <div 
                      onClick={() => setIsExploreModalOpen(true)}
                      className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center cursor-pointer"
                    >
                      <button
                        type="button"
                        id="btn-explore-platform-overlay"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsExploreModalOpen(true);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-black px-5 py-3 rounded-2xl text-xs flex items-center gap-2.5 shadow-2xl scale-95 group-hover:scale-100 transition-all duration-300 cursor-pointer border border-emerald-400/40"
                      >
                        <span className="flex h-2.5 w-2.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
                        </span>
                        <span>{t('Eksplorasi Platform')}</span>
                        <ArrowUpRight className="w-4 h-4 ml-0.5" />
                      </button>
                    </div>

                    {/* Interactive Hotspots over the screenshot */}
                    <div 
                      onClick={() => setIsExploreModalOpen(true)}
                      className="absolute top-[35%] left-[25%] group/hotspot cursor-pointer"
                    >
                      <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                      <span className="relative block w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      <div className="absolute left-6 top-0 hidden group-hover/hotspot:block bg-slate-950 border border-slate-800 text-[10px] p-2.5 rounded-xl w-48 shadow-xl text-left z-20 space-y-1">
                        <strong className="text-emerald-400 block font-bold">{t('Ledger Keuangan Digital')}</strong>
                        <p className="text-gray-400 leading-normal font-semibold">{t('Bagan garis tren mengorelasikan donasi masuk secara instan ke program sasaran tanpa penundaan amil.')}</p>
                        <span className="text-[9px] text-emerald-300 font-bold block pt-1">Klik untuk Buka Pratinjau →</span>
                      </div>
                    </div>

                    <div 
                      onClick={() => setIsExploreModalOpen(true)}
                      className="absolute top-[65%] left-[75%] group/hotspot cursor-pointer"
                    >
                      <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                      <span className="relative block w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      <div className="absolute right-6 top-0 hidden group-hover/hotspot:block bg-slate-950 border border-slate-800 text-[10px] p-2.5 rounded-xl w-48 shadow-xl text-left z-20 space-y-1">
                        <strong className="text-emerald-400 block font-bold">{t('Status Wajar Tanpa Pengecualian')}</strong>
                        <p className="text-gray-400 leading-normal font-semibold">{t('Setiap kuitansi lunas memiliki audit trail berkode unik terenkripsi demi menjamin transparansi tinggi.')}</p>
                        <span className="text-[9px] text-emerald-300 font-bold block pt-1">Klik untuk Buka Pratinjau →</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* MOBILE APP PHONE MOCKUP */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <span className="bg-emerald-500/10 px-2 py-1 rounded">Mobile App View</span>
                    <span>•</span>
                    <span className="text-gray-400 font-medium">{t('Kalkulator Zakat & Donasi Kilat')}</span>
                  </div>
                  <h3 className="text-base font-extrabold text-white">{t('Aplikasi Layanan Syariah Mandiri')}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {t('Kemudahan berdonasi, melacak rekam donasi pribadi, serta menghitung zakat maal, penghasilan, dan emas secara mandiri di mana pun Anda berada.')}
                  </p>
                </div>

                {/* Actual Phone Frame Mockup */}
                <div className="bg-slate-950 border-4 border-slate-800 rounded-[35px] overflow-hidden shadow-2xl relative max-w-[280px] mx-auto w-full aspect-[9/18.5]">
                  {/* Phone notch speaker top */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-slate-800 h-4.5 w-28 rounded-b-xl z-20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-950 block"></span>
                  </div>

                  {/* Phone screen image viewport */}
                  <div className="relative h-full bg-slate-900 overflow-hidden group">
                    <img 
                      src="/mobile_app_screenshot_1783738879626.jpg" 
                      alt="Mobile App Screenshot"
                      className="w-full h-full object-cover opacity-95 group-hover:scale-[1.03] transition-transform duration-500 pointer-events-none select-none"
                      referrerPolicy="no-referrer"
                    />

                    {/* Interactive Hotspot inside the Phone screen */}
                    <div 
                      onClick={() => {
                        onNavigate?.('zakat');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="absolute top-[40%] left-[50%] -translate-x-1/2 group/hotspot cursor-pointer"
                    >
                      <span className="absolute inline-flex h-4 w-4 rounded-full bg-emerald-400 animate-ping opacity-75"></span>
                      <span className="relative block w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      <div className="absolute left-1/2 -translate-x-1/2 top-6 bg-slate-950 border border-slate-800 text-[9px] p-2.5 rounded-xl w-44 shadow-xl text-center z-20 space-y-1">
                        <strong className="text-emerald-400 block font-bold">{t('Kalkulator Zakat Otomatis')}</strong>
                        <p className="text-gray-400 leading-normal font-semibold">{t('Fatwa Syariah MUI langsung tertanam di dalam hitungan cepat.')}</p>
                        <span className="text-[9px] text-emerald-300 font-bold block pt-1">Klik untuk Buka Kalkulator →</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onNavigate?.('zakat');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-emerald-600/90 hover:bg-emerald-500 active:scale-95 backdrop-blur-md text-[10px] text-white px-4 py-1.5 rounded-full font-bold shadow-lg opacity-90 group-hover:opacity-100 transition-all cursor-pointer border border-white/20 flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{t('Hitung Zakat Sekarang')}</span>
                    </button>
                  </div>

                  {/* Phone bottom bar line indicator */}
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 bg-slate-700 h-1 w-20 rounded-full z-20"></div>
                </div>
              </div>

            </div>
          </section>

          {/* Quick interactive search section */}
          <section id="section-campaigns" className="scroll-mt-24 space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-black block">
                  {langPack.secFeatured || 'Rekomendasi Program'}
                </span>
                <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-slate-50 tracking-tight mt-1.5 leading-none">
                  {t('Kampanye Darurat & Kemanusiaan')}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {t('Kontribusi Anda akan disalurkan hari ini dengan pelaporan berita acara audit real-time.')}
                </p>
              </div>
              <button
                id="btn-all-campaigns"
                onClick={() => {
                  const el = document.getElementById('navbar-item-campaigns');
                  if (el) el.click();
                }}
                className="text-emerald-600 hover:text-emerald-700 font-extrabold text-xs flex items-center gap-1 shrink-0"
              >
                {t('Lihat Semua Program')} ({campaigns.length})
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Campaign grid cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {campaigns.slice(0, 3).map(c => {
                const percent = Math.min(100, Math.round((c.collectedAmount / c.targetAmount) * 100));
                
                return (
                  <div key={c.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col justify-between hover:shadow-xl dark:shadow-none transition-shadow group">
                    <div className="relative h-44 bg-slate-900 overflow-hidden">
                      <img 
                        src={c.thumbnailUrl || c.imageUrl || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600'} 
                        alt={c.title} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600';
                        }}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-600 text-white font-black text-[9px] px-2.5 py-1 rounded uppercase tracking-wider">
                        {t(c.category)}
                      </span>
                      {c.urgency === 'high' && (
                        <span className="absolute top-3 right-3 bg-red-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase">
                          {langPack.urgencyUrgent || 'Urgen'}
                        </span>
                      )}
                    </div>

                    <div className="p-5 grow space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => onSelectCampaign(c.slug)}
                          className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug block hover:text-emerald-600 transition-colors text-left font-sans line-clamp-2"
                        >
                          {t(c.title)}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {t(c.shortDescription)}
                        </p>
                      </div>

                      {/* Financial progress metric */}
                      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400">
                          <span>{langPack.collected}: <strong>{formatCurrency(c.collectedAmount)}</strong></span>
                          <span className="font-bold text-gray-800 dark:text-white">{percent}%</span>
                        </div>

                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                          <span>{t('Sisa')}: {formatCurrency(calculateRemaining(c.targetAmount, c.collectedAmount))}</span>
                          <span>{t(c.location)}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2 shrink-0">
                        <button
                          onClick={() => onSelectCampaign(c.slug)}
                          className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold py-2 px-3 rounded-xl hover:bg-gray-200 text-xs transition-colors"
                        >
                          {t('Detail')}
                        </button>
                        <button
                          id={`btn-donate-quick-${c.slug}`}
                          onClick={() => onOpenDonateModal(c.slug)}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Heart className="w-3.5 h-3.5 fill-white" /> {t('Bantu Sekarang')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* INTERACTIVE GEOGRAPHY DISTRIBUTION MAP */}
          <section id="interactive-map" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white space-y-6 relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                {t('Live Distribution Ledger')}
              </span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight text-white mt-1">
                {langPack.petaDistribusi || 'Peta Distribusi Kemanusiaan Se-Indonesia'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {t('Klik penanda lokasi pada peta interaktif asli di bawah ini untuk melihat rincian penyaluran donasi dan program kemaslahatan terpercaya.')}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-radial from-slate-900 to-slate-950 p-4 rounded-2xl border border-slate-800">
              <div className="lg:col-span-8 w-full">
                <InteractiveMap currentLang={currentLang} t={t} onSelectRegion={setHoveredRegion} />
              </div>

              {/* Highlight Region Panel */}
              <div className="lg:col-span-4 bg-slate-950/50 border border-slate-800 rounded-xl p-5 min-h-[140px] flex flex-col justify-center space-y-2">
                {hoveredRegion ? (
                  <>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-black">
                      <MapPin className="w-4 h-4 text-emerald-400 fill-none" />
                      <span className="font-extrabold text-sm">{hoveredRegion.name}</span>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest block">{t('Total Penyaluran Sukses')}</span>
                      <strong className="text-xl font-mono text-emerald-400">{hoveredRegion.amount}</strong>
                      <p className="text-xs text-gray-400 leading-normal font-semibold">
                        {hoveredRegion.desc}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6 text-gray-500 text-xs">
                    <p>{t('Klik penanda lokasi')} <span className="inline-block w-2.5 h-2.5 bg-emerald-400 rounded-full"></span> {t('pada peta untuk melihat rincian program.')}</p>
                  </div>
                )}
              </div>

            </div>
          </section>



          {/* Testimonial & Donor Carousel */}
          <section id="testimonials-feed" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full min-h-[280px]">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black uppercase text-amber-600 dark:text-amber-400">{t('Kata Penerima Manfaat')}</span>
                  {testimonials.filter(tst => tst.type === 'beneficiary').length > 1 && (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setActiveBeneficiaryIndex(prev => (prev - 1 + testimonials.filter(tst => tst.type === 'beneficiary').length) % testimonials.filter(tst => tst.type === 'beneficiary').length)}
                        className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-950 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer border border-gray-150 dark:border-slate-800"
                        title={t('Sebelumnya')}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setActiveBeneficiaryIndex(prev => (prev + 1) % testimonials.filter(tst => tst.type === 'beneficiary').length)}
                        className="p-1 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/50 dark:hover:bg-gray-950 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer border border-gray-150 dark:border-slate-800"
                        title={t('Selanjutnya')}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {(() => {
                  const beneficiaries = testimonials.filter(tst => tst.type === 'beneficiary');
                  const listToUse = beneficiaries.length > 0 ? beneficiaries : testimonials;
                  if (listToUse.length === 0) {
                    return <span className="text-xs text-gray-400 italic">{t('Belum ada testimoni terdaftar')}</span>;
                  }
                  const index = activeBeneficiaryIndex % listToUse.length;
                  const item = listToUse[index];
                  return (
                    <div key={item.id} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                      <div className="relative">
                        <Quote className="absolute -top-1 -left-2 w-8 h-8 text-amber-100 dark:text-amber-900/20 opacity-40 shrink-0 pointer-events-none" />
                        <p className="font-serif italic text-gray-600 dark:text-gray-300 text-sm md:text-base leading-relaxed pl-6">
                          "{t(item.message || item.content)}"
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-3 pt-2">
                        {item.avatarUrl ? (
                          <img 
                            src={item.avatarUrl} 
                            alt={item.name} 
                            className="w-11 h-11 rounded-full object-cover shrink-0 select-none pointer-events-none border border-amber-100 dark:border-slate-700" 
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
                            {item.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-extrabold text-gray-900 dark:text-white text-xs block leading-tight">{item.name}</span>
                          <span className="text-[10px] text-gray-400 dark:text-gray-450 block font-medium mt-0.5">
                            {t(item.role)} {item.location ? `• ${t(item.location)}` : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
              
              {/* Dots indicators */}
              {testimonials.filter(tst => tst.type === 'beneficiary').length > 1 && (
                <div className="flex items-center gap-1.5 justify-center mt-4">
                  {testimonials.filter(tst => tst.type === 'beneficiary').map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveBeneficiaryIndex(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === (activeBeneficiaryIndex % testimonials.filter(tst => tst.type === 'beneficiary').length)
                          ? 'w-4 bg-amber-500'
                          : 'w-1.5 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* List last donations on feed */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 block">{langPack.donorWall || 'Daftar Kebaikan Donatur'}</span>
                <span className="text-[10px] text-gray-400 block mt-1">{t('Solidaritas nyata kontribusi lunas masyarakat.')}</span>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-slate-700 max-h-48 overflow-y-auto block pr-1.5 space-y-2 text-xs">
                {donations.filter(d => d.status === 'success').slice(0, 5).map(dnat => (
                  <div key={dnat.id} className="pt-2 flex justify-between items-center font-medium">
                    <div>
                      <span className="font-bold text-gray-800 dark:text-white block">
                        {dnat.isAnonymous ? t('Hamba Allah') : dnat.donorName}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate max-w-[170px]" title={dnat.campaignTitle}>{dnat.campaignTitle}</span>
                    </div>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400 shrink-0">
                      {formatCurrency(dnat.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION ZAKAT DIGITAL */}
          <section id="section-zakat" className="scroll-mt-24">
            <ZakatCalculator 
              onPayZakat={(amount, category) => onOpenDonateModal(undefined, amount)} 
              langPack={langPack} 
              currentLang={currentLang}
            />
          </section>

          {/* SECTION TRANSPARENCY & MUTASI LEDGER */}
          <section id="section-transparency" className="scroll-mt-24 space-y-8 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-slate-700">
            <div className="text-center max-w-xl mx-auto space-y-2.5">
              <span className="text-xs uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-wider block">{t('MUTASI KUNCI')}</span>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">{t('Pertanggungjawaban Finansial Publik')}</h2>
              <p className="text-xs text-gray-400 leading-normal">
                {t('Yayasan menyajikan ledger penerimaan dana masuk (ledger transaksi) lunas publik secara seketika gunanya menjamin transparansi tinggi 100% bebas dari rekayasa keuangan.')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl">
                <span className="text-xs text-slate-500 font-semibold block">{t('Total Akuntabilitas Ledger')}</span>
                <strong className="text-2xl font-mono text-emerald-700 dark:text-emerald-400 block mt-1">{t('100% TERBUKA')}</strong>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl">
                <span className="text-xs text-slate-500 font-semibold block">{t('Sertifikat Audit Keuangan')}</span>
                <strong className="text-2xl font-mono text-gray-900 dark:text-white block mt-1">{t('Rating WTP RI')}</strong>
              </div>
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-2xl">
                <span className="text-xs text-slate-500 font-semibold block">{t('Metrik Penyaluran Dampak')}</span>
                <strong className="text-2xl font-mono text-teal-600 dark:text-teal-400 block mt-1">{t('Sains & Terbimbing')}</strong>
              </div>
            </div>

            {/* Ledger mapping list */}
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-4 md:p-6 space-y-4">
              <div>
                <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-450 block">{t('Real-Time Ledger Transaksi Publik')}</span>
                <span className="text-[10px] text-gray-500 block">{t('Jurnal mutasi ini diperbarui secara instan begitu kontribusi Anda tuntas diterima oleh sistem perbankan.')}</span>
              </div>

              <div className="overflow-x-auto border border-gray-100 dark:border-gray-800 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/60 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 font-extrabold border-b border-gray-300 dark:border-slate-700">
                      <th className="p-3">{t('Waktu Masuk')}</th>
                      <th className="p-3">{t('Ref ID')}</th>
                      <th className="p-3">{t('Nama Donatur')}</th>
                      <th className="p-3">{t('Alokasi Penyaluran Program')}</th>
                      <th className="p-3">{t('Jumlah Dana')}</th>
                      <th className="p-3 text-right">{t('Verifikasi')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.filter(d => d.status === 'success').slice(0, 5).map(tx => (
                      <tr key={tx.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-emerald-50/5 text-xs text-gray-600 dark:text-gray-300">
                        <td className="p-3 font-mono text-[10px]">
                          {new Date(tx.createdDate).toLocaleString('id-ID')}
                        </td>
                        <td className="p-3 font-mono font-bold text-gray-500">{tx.id}</td>
                        <td className="p-3 font-bold">
                          {tx.isAnonymous ? t('Hamba Allah') : tx.donorName}
                        </td>
                        <td className="p-3 font-semibold truncate max-w-[150px]" title={tx.campaignTitle}>
                          {tx.campaignTitle}
                        </td>
                        <td className="p-3 font-extrabold text-gray-900 dark:text-white">
                          {formatCurrency(tx.amount)}
                        </td>
                        <td className="p-3 text-right">
                          <span className="bg-emerald-100 text-emerald-900 dark:bg-emerald-900 dark:text-emerald-200 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">
                            {t('APPROVED')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* SECTION ABOUT US */}
          <section id="section-about" className="scroll-mt-24 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-slate-700 space-y-10 text-gray-700 dark:text-gray-300">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-emerald-600 dark:text-emerald-400 text-xs uppercase font-extrabold tracking-widest block">{t('SIAPAKAH KAMI')}</span>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('Menjembatani Kepedulian, Merajut Kemandirian Berkelanjutan')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed leading-normal">
              <div className="space-y-3">
                <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{t('Visi Yayasan')}</h4>
                <p>
                  {t('Menjadi episentrum pemberdayaan masyarakat dhuafa dan tata kelola dana sosial Islam (Zakat, Infaq, Sedekah, Wakaf) terdepan di Indonesia yang berorientasi sains, akuntabilitas digital berlapis, dan berkelanjutan ekologis.')}
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{t('Definisi Naskah Legalitas')}</h4>
                <p className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl font-mono text-[10px] space-y-1 select-all border border-gray-100 dark:border-gray-800">
                  <span className="block"><strong>{t('SK Kemenkumham:')}</strong> AHU-00123.AH.01.04 TAHUN 2024</span>
                  <span className="block"><strong>{t('Reg Dinsos RI:')}</strong> 312/DINSOS-PP/2025</span>
                  <span className="block"><strong>{t('NPWP Lembaga:')}</strong> 45.123.456.7-012.000</span>
                  <span className="block"><strong>{t('Opini Keuangan:')}</strong> {t('WTP (Wajar Tanpa Pengecualian) audit independen')}</span>
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
              <div className="text-center md:text-left shrink-0">
                <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider block uppercase">{t('Dewan Direksi & Syariah')}</span>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{t('Struktur Kepemimpinan Amanah')}</h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
                {[
                  { name: 'Prof. Dr. KH. Ahmad Fauzi, M.A', role: 'Dewan Pengawas Syariah' },
                  { name: 'Ir. H. Budi Santoso, M.B.A', role: 'Direktur Eksekutif Yayasan' },
                  { name: 'Dr. Siti Aminah, S.E, M.Si', role: 'Kepala Bidang Akuntansi & Audit' },
                  { name: 'H. Muhammad Ridwan, Lc', role: 'Amil Zakat & Wakaf Syariah' }
                ].map(board => (
                  <div key={board.name} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-slate-800">
                    <span className="font-extrabold text-gray-900 dark:text-white block tracking-tight leading-snug">{t(board.name)}</span>
                    <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-1">{t(board.role)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* SECTION CSR SOLUTIONS */}
          <section id="section-csr" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-gray-700">
            <div className="md:col-span-7 space-y-6">
              <span className="text-emerald-600 dark:text-emerald-450 text-xs font-black uppercase block tracking-wider">{t('CSR & ESG SOLUTIONS PARTNERSHIP')}</span>
              <h2 className="text-xl md:text-3xl font-black text-gray-950 dark:text-white leading-snug tracking-tight">
                {t('Tingkatkan Dampak ESG Perusahaan Anda Bersama Kami')}
              </h2>
              <p className="leading-relaxed leading-normal font-medium text-gray-550 dark:text-gray-400">
                {t('Kami menyusun kemitraan program berkelanjutan siap saji didukung oleh infografis audit, dokumentasi foto, kuitansi digital, serta verifikasi laporan dampak yang patuh terhadap kualifikasi kriteria GRI (Global Reporting Initiative) & ESG.')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="font-extrabold text-gray-900 dark:text-white text-sm block mb-1">{t('Penyalur Terakreditasi B')}</span>
                  <p className="text-gray-500">{t('Seluruh berita acara diautentikasi resmi menteri sosial & amil.')}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                  <span className="font-extrabold text-gray-900 dark:text-white text-sm block mb-1">{t('Tailored ESG Dashboard')}</span>
                  <p className="text-gray-500">{t('Dashboard digital kustom korporasi guna paparan direksi RUPS.')}</p>
                </div>
              </div>
            </div>

            <div id="home-csr-form-panel" className="md:col-span-5 bg-gray-50/50 dark:bg-gray-900/60 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <h4 className="font-extrabold text-gray-950 dark:text-white">{t('Formulir Kolaborasi CSR')}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{t('Ajukan konsultasi program ESG korporat, tim kami akan menjadwalkan meeting dalam 1x24 jam.')}</p>
              </div>

              {csrInquirySuccess ? (
                <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-600 animate-bounce" />
                  <span className="font-bold block">{t('Terima Kasih, Mitra CSR!')}</span>
                  <p className="text-[11px]">{t('Prospektus kolaborasi dan proposal program kerja sedia terkirim ke email, tim amil segera menghubungi WhatsApp Anda.')}</p>
                  <button 
                    onClick={() => setCsrInquirySuccess(false)}
                    className="bg-white hover:bg-gray-100 text-emerald-800 font-extrabold px-3 py-1 rounded border text-[10px]"
                  >
                    {t('Ajukan Lagi')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCsrForm} className="space-y-3 font-xs">
                  <div>
                    <label className="block font-bold mb-1">{t('1. Nama Perusahaan / Korporasi')}</label>
                    <input
                      type="text"
                      required
                      value={csrCompany}
                      onChange={(e) => setCsrCompany(e.target.value)}
                      placeholder={t('Contoh: PT Angkasa Raya Tbk')}
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{t('2. Nama Lengkap PIC Perusahaan')}</label>
                    <input
                      type="text"
                      required
                      value={csrPic}
                      onChange={(e) => setCsrPic(e.target.value)}
                      placeholder={t('Contoh: Ibu Ranti Safitri')}
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">{t('Phone / WA PIC')}</label>
                      <input
                        type="text"
                        required
                        value={csrPhone}
                        onChange={(e) => setCsrPhone(e.target.value)}
                        placeholder="0812XXXXXXXX"
                        className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">{t('Alamat Email Kerja')}</label>
                      <input
                        type="email"
                        value={csrEmail}
                        onChange={(e) => setCsrEmail(e.target.value)}
                        placeholder="pic@corporate.com"
                        className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{t('Pilar Program yang Diminati')}</label>
                    <select
                      value={csrProgram}
                      onChange={(e) => setCsrProgram(e.target.value)}
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    >
                      <option value="Pendidikan Mandiri">{t('Beasiswa Santri & Asrama Yatim')}</option>
                      <option value="Air Bersih">{t('Sumur Bor Produktif Krisis Air')}</option>
                      <option value="Kesehatan Tangguh">{t('Klinik Kesehatan Keliling Dhuafa')}</option>
                      <option value="Reboisasi">{t('Mitigasi Emisi Karbon Green Reboisasi')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{t('Target Anggaran Kemitraan')}</label>
                    <select
                      value={csrBudget}
                      onChange={(e) => setCsrBudget(e.target.value)}
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    >
                      <option value="Rp50juta - Rp100juta">{t('Rp50 Juta - Rp100 Juta')}</option>
                      <option value="Rp100juta - Rp250juta">{t('Rp100 Juta - Rp250 Juta')}</option>
                      <option value="Rp250juta_plus">{t('Di atas Rp250 Juta')}</option>
                    </select>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                    >
                      {t('Ajukan Kemitraan ESG')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </section>

          {/* SECTION VOLUNTEER */}
          <section id="section-volunteer" className="scroll-mt-24 grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-slate-700">
            <div className="md:col-span-7 space-y-6">
              <span className="text-emerald-600 dark:text-emerald-450 text-xs font-black uppercase block tracking-wider">{t('JOIN AMANAH FORCE')}</span>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white leading-snug tracking-tight">
                {t('Ayo Ambil Peran dalam Barisan Penggerak Kebaikan')}
              </h2>
              <p className="leading-relaxed leading-normal font-medium text-gray-550 dark:text-gray-400">
                {t('Yayasan membuka seluas-luasnya peluang kontribusi kebahagiaan para pemuda Indonesia untuk terjun sebagai tim relawan lapangan penanggulangan kekeringan, edukasi mengajar mengaji pelosok, pendataan logistik bantuan bencana, murni tanpa pamrih demi kemanusiaan mulia.')}
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-950 dark:text-white text-sm">{t('Pelatihan Kesiapsiagaan Darurat')}</strong>
                    <p className="text-gray-500 mt-1">{t('Dapatkan pembekalan kompetensi SAR, mitigasi bencana psikososial anak dari para profesional.')}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-gray-900 dark:text-white text-sm">{t('Sertifikat Relawan Kemanusiaan Resmi')}</strong>
                    <p className="text-gray-500 mt-1">{t('Pengakuan legalitas berkontribusi sosial resmi yang diakui tingkat kementerian.')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div id="home-volunteer-form-panel" className="md:col-span-5 bg-gray-50/50 dark:bg-gray-900/60 border border-gray-200 dark:border-slate-700 p-6 rounded-2xl space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <h4 className="font-extrabold text-gray-900 dark:text-white">{t('Pendaftaran Relawan')}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{t('Gabung barisan motor penggerak hari ini juga.')}</p>
              </div>

              {volInquirySuccess ? (
                <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-center space-y-2">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-600 animate-bounce" />
                  <span className="font-bold block">{t('Selamat Bergabung!')}</span>
                  <p className="text-[11px]">{t('Lamaran Anda terdaftar. Tim koordinator relawan wilayah akan segera mengaktifkan status verifikasi Anda dan mengundang ke grup koordinasi penting.')}</p>
                  <button 
                    onClick={() => setVolInquirySuccess(false)}
                    className="bg-white hover:bg-gray-100 text-emerald-800 font-extrabold px-3 py-1 rounded border text-[10px]"
                  >
                    {t('Daftar baru')}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVolunteerForm} className="space-y-3 font-xs">
                  <div>
                    <label className="block font-bold mb-1">{t('1. Nama Lengkap Relawan')}</label>
                    <input
                      type="text"
                      required
                      value={volName}
                      onChange={(e) => setVolName(e.target.value)}
                      placeholder={t('Contoh: Aditya Nugroho')}
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-bold mb-1">{t('Email')}</label>
                      <input
                        type="email"
                        required
                        value={volEmail}
                        onChange={(e) => setVolEmail(e.target.value)}
                        placeholder="adit@relawan.net"
                        className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block font-bold mb-1">{t('No. WhatsApp')}</label>
                      <input
                        type="text"
                        required
                        value={volPhone}
                        onChange={(e) => setVolPhone(e.target.value)}
                        placeholder="0856XXXXXXXX"
                        className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{t('Spesialisasi Keahlian Relawan')}</label>
                    <div className="grid grid-cols-2 gap-2 font-medium mt-1">
                      {['Penyuluh Pendidikan', 'Penyalur Logistik Medis', 'Dokumentasi/Kamera', 'Supir Darurat SAR'].map(skill => (
                        <label key={skill} className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={volSkills.includes(skill)}
                            onChange={() => handleSkillToggle(skill)}
                            className="accent-emerald-600 rounded"
                          />
                          <span>{t(skill)}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-1">{t('Deskripsi Ringkas Pengalaman Sosial')}</label>
                    <textarea
                      rows={2}
                      value={volExperience}
                      onChange={(e) => setVolExperience(e.target.value)}
                      placeholder={t('Contoh: Pernah mengikuti satgas peduli Gempa Cianjur 2 minggu bagian logistik masakan dhuafa...')}
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {t('Kirim Lamaran Relawan')}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* SECTION BLOG NEWS */}
          <section id="section-blog" className="scroll-mt-24 space-y-8 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-slate-700">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-emerald-600 dark:text-emerald-455 text-xs font-black uppercase block tracking-wider">{t('KABAR EDUKASI MASLAHAT')}</span>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight font-sans">{t('Kanal Edukasi Kebaikan Yayasan')}</h2>
              <p className="text-xs text-gray-400">{t('Ikuti kupasan syariat zakat mal, transparansi filantropi, dan info update krisis air bersih.')}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-5 flex flex-col sm:flex-row gap-5 items-start hover:shadow-md transition-shadow">
                  <div className="w-full sm:w-36 h-36 rounded-2xl bg-gray-100 dark:bg-gray-800 select-none pointer-events-none overflow-hidden shrink-0">
                    <img 
                      src={post.thumbnailUrl || post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 text-xs flex flex-col justify-between h-full grow leading-relaxed">
                    <div className="space-y-1.5 font-medium">
                      <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                        {t(post.category)}
                      </span>
                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug tracking-tight font-sans">
                        {t(post.title)}
                      </h3>
                      <p className="text-gray-500 line-clamp-2">
                        {t(post.excerpt)}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-t-gray-100 dark:border-t-gray-800 flex items-center justify-between text-[10px] text-gray-400 mt-2">
                      <span>{t('Oleh')}: {post.author}</span>
                      <span>{new Date(post.createdDate || post.publishedDate).toLocaleDateString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SECTION TESTIMONI (SLIDER SATU PERSATU / AUTO-SWIPE) */}
          <section id="section-testimoni" className="scroll-mt-24 space-y-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-12 shadow-sm transition-colors">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-emerald-600 dark:text-emerald-450 text-xs font-black uppercase block tracking-wider">{t('TESTIMONI DONATUR & MITRA')}</span>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight font-sans">{t('Kata Mereka tentang Amanah')}</h2>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">{t('Bukti nyata transparansi digital, amanah, dan dampak sosial yang terukur secara nyata di lapangan.')}</p>
            </div>

            {/* SINGLE CARD CAROUSEL CONTAINER */}
            {(() => {
              const currentTesti = testimonialList[activeTestiIndex] || testimonialList[0];
              return (
                <div 
                  className="max-w-3xl mx-auto relative group px-2 md:px-0"
                  onMouseEnter={() => setIsTestiPaused(true)}
                  onMouseLeave={() => setIsTestiPaused(false)}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {/* Prev Button (Left) */}
                  <button
                    type="button"
                    onClick={handlePrevTesti}
                    aria-label="Testimoni Sebelumnya"
                    className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white border border-slate-700/80 flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
                  >
                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* Next Button (Right) */}
                  <button
                    type="button"
                    onClick={handleNextTesti}
                    aria-label="Testimoni Berikutnya"
                    className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/90 hover:bg-emerald-600 text-white border border-slate-700/80 flex items-center justify-center transition-all duration-200 shadow-xl hover:scale-110 active:scale-95 cursor-pointer backdrop-blur-md"
                  >
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </button>

                  {/* The Single Active Testimonial Card */}
                  <div 
                    key={activeTestiIndex}
                    className="relative bg-gradient-to-br from-[#0B132B] via-slate-900 to-[#0F172A] border border-slate-700/80 rounded-3xl p-6 sm:p-8 md:p-12 shadow-2xl overflow-hidden transition-all duration-300 animate-in fade-in zoom-in-95 select-none"
                  >
                    {/* Background Decorative Glow */}
                    <div className="absolute -top-16 -right-16 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
                    <Quote className="absolute top-6 right-6 md:top-8 md:right-8 w-16 h-16 md:w-24 md:h-24 text-emerald-400/10 pointer-events-none" />

                    <div className="relative z-10 space-y-6">
                      {/* Top Bar: 5 Stars Rating & Slide Counter */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                          ))}
                        </div>
                        <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-3 py-0.5 rounded-full tracking-wider shadow-xs">
                          {String(activeTestiIndex + 1).padStart(2, '0')} / {String(testimonialList.length).padStart(2, '0')}
                        </span>
                      </div>

                      {/* Testimonial Quote Text */}
                      <blockquote className="min-h-[90px] sm:min-h-[105px] flex items-center">
                        <p className="text-sm sm:text-base md:text-xl text-slate-100 italic leading-relaxed md:leading-relaxed font-medium">
                          "{t(currentTesti.content || (currentTesti as any).message || '')}"
                        </p>
                      </blockquote>

                      {/* Author Profile */}
                      <div className="flex items-center gap-3.5 sm:gap-4 pt-5 border-t border-slate-800/80">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full ring-2 ring-emerald-400/60 p-0.5 shrink-0 shadow-lg bg-slate-800 overflow-hidden">
                          <img 
                            src={currentTesti.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150'} 
                            alt={currentTesti.name} 
                            className="w-full h-full object-cover rounded-full pointer-events-none" 
                          />
                        </div>
                        <div className="min-w-0">
                          <strong className="text-sm sm:text-base font-black text-white block tracking-tight truncate">
                            {currentTesti.name}
                          </strong>
                          <span className="text-xs sm:text-sm text-emerald-400 font-bold block mt-0.5 truncate">
                            {t(currentTesti.role || '')}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                            {t(currentTesti.location || 'Indonesia')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Indicator Dots for pagination & direct jump */}
                  <div className="flex items-center justify-center gap-2 pt-6">
                    {testimonialList.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveTestiIndex(idx)}
                        aria-label={`Lihat testimoni ke-${idx + 1}`}
                        className={`transition-all duration-300 cursor-pointer ${
                          activeTestiIndex === idx
                            ? 'w-8 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]'
                            : 'w-2.5 h-2.5 bg-slate-600 hover:bg-slate-400 rounded-full'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Swipe hint */}
                  <p className="text-center text-[10px] text-gray-400 dark:text-slate-500 font-medium pt-2">
                    {t('Otomatis bergeser setiap beberapa detik • Geser atau klik panah untuk melihat testimoni lainnya')}
                  </p>
                </div>
              );
            })()}
          </section>

          {/* SECTION FAQ (FREQUENTLY ASKED QUESTIONS) */}
          <section id="section-faq" className="scroll-mt-24 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl p-6 md:p-10 space-y-8 shadow-sm transition-colors">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-emerald-600 dark:text-emerald-450 text-xs font-black uppercase block tracking-wider">
                {t('PUSAT INFORMASI & FAQ')}
              </span>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight font-sans">
                {t('Pertanyaan yang Sering Diajukan')}
              </h2>
              <p className="text-xs text-gray-400 leading-relaxed font-medium">
                {t('Pelajari mekanisme pengelolaan donasi, akuntabilitas audit, serta tata cara penyaluran zakat dan wakaf syariah di Amanah Impact Foundation.')}
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3.5">
              {(faqs.length > 0 ? faqs : [
                { id: 'F-01', question: 'Apakah donasi saya akan mendapatkan bukti pembayaran resmi?', answer: 'Ya, sistem kami secara otomatis memproses dan men-generate Receipt resmi atau Bukti Penerimaan Donasi Elektronik lengkap dengan tanda tangan digital dan nomor transaksi unik sesaat setelah donasi terverifikasi sukses.' },
                { id: 'F-02', question: 'Berapa standard nisab zakat profesi bulanan yang berlaku saat ini?', answer: 'Nisab zakat profesi bulanan merujuk pada ketetapan Baznas, yakni setara nilai harga 653 kg gabah kering atau setara 85 gram emas per tahun (sekitar Rp6.800.000 hingga Rp7.500.000 per bulan tergantung fluktuasi harga emas).' },
                { id: 'F-03', question: 'Apakah wakaf tunai mendapatkan sertifikat digital resmi?', answer: 'Ya, donatur yang menyalurkan wakaf uang di Amanah Impact Foundation berhak mengunduh Sertifikat Wakaf Digital (Digital Wakaf Pledge) berisi data nama pewakaf, ikrar wakaf, peruntukan aset, dan tanda tangan resmi nadzir.' },
                { id: 'F-04', question: 'Bagaimana cara mendaftar program relawan atau kemitraan CSR?', answer: 'Anda dapat langsung mengisi formulir pendaftaran relawan atau proposal CSR yang tersedia di website ini. Tim kami akan segera menindaklanjuti dan mengundang ke sesi koordinasi terpadu.' }
              ]).map((faqItem) => {
                const isOpen = openFaqId === faqItem.id;
                return (
                  <div
                    key={faqItem.id}
                    className="border border-gray-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all bg-gray-50/50 dark:bg-slate-950/40"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqId(isOpen ? null : faqItem.id)}
                      className="w-full text-left p-4 md:p-5 flex items-center justify-between gap-4 font-bold text-xs md:text-sm text-gray-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2.5">
                        <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                        {t(faqItem.question)}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-800/80 animate-in fade-in duration-200">
                        {t(faqItem.answer)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SECTION PRICING & MEMBERSHIP (FREE / PRO DENGAN OPSI BULANAN & TAHUNAN) */}
          <section id="section-pricing" className="scroll-mt-24 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                {t('PILIHAN KEMITRAAN & DUKUNGAN')}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
                {t('Paket Donatur & Kemitraan Filantropi')}
              </h2>
              <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                {t('Pilih skema keanggotaan dan kemitraan terbaik untuk melipatgandakan manfaat dakwah, zakat produktif, dan kepedulian sosial Anda secara berkelanjutan.')}
              </p>

              {/* Billing Cycle Toggle (Bulanan / Tahunan dengan Diskon 20%) */}
              <div className="pt-3 flex items-center justify-center">
                <div className="bg-gray-100 dark:bg-slate-800/90 p-1 rounded-2xl inline-flex items-center border border-gray-200 dark:border-slate-700/80 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-white dark:bg-slate-900 text-gray-900 dark:text-white shadow-xs'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {t('Bulanan')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle('annual')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-emerald-600 text-white shadow-xs shadow-emerald-600/30'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <span>{t('Tahunan')}</span>
                    <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      {t('Hemat 20%')}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Card 1: Free (Sahabat Donatur) */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:border-gray-300 dark:hover:border-slate-700 transition-all">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {t('Sahabat Donatur')}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t('Untuk individu & donatur umum')}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
                      Free
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">Rp 0</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/{t('selamanya')}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      {t('Akses penuh donasi & kalkulator zakat gratis')}
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300 pt-2">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Akses katalog program & donasi insidental')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Kalkulator Zakat Syariah (Mal, Profesi & Emas)')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('E-Kwitansi donasi instan ber-QR & audit publik')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Pantau jejak penyaluran dana secara berkala')}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => onOpenDonateModal()}
                    className="w-full py-3 px-4 rounded-xl border border-gray-300 dark:border-slate-700 font-bold text-xs text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer text-center"
                  >
                    {t('Mulai Berdonasi Bebas')}
                  </button>
                </div>
              </div>

              {/* Card 2: Pro Donatur (Rekomendasi / Populer) */}
              <div className="bg-gradient-to-b from-emerald-950/40 via-slate-900 to-slate-900 rounded-3xl border-2 border-emerald-500/80 p-6 md:p-8 flex flex-col justify-between shadow-xl shadow-emerald-950/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-bl-xl shadow-xs">
                  {t('REKOMENDASI')}
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-black">
                      <Zap className="w-3.5 h-3.5" />
                      <span>{t('DONATUR ISTIQOMAH')}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {t('Pro Donatur')}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {t('Dukungan rutin & pendampingan syariah penuh')}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/20">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {billingCycle === 'annual' ? 'Rp 39.000' : 'Rp 49.000'}
                      </span>
                      <span className="text-xs text-slate-300">/{t('bulan')}</span>
                    </div>
                    <p className="text-[11px] text-emerald-300 font-medium mt-1">
                      {billingCycle === 'annual'
                        ? t('Ditagih Rp 468.000 / tahun (Hemat Rp 120.000)')
                        : t('Dapat dibatalkan atau dialihkan sewaktu-waktu')}
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-200 pt-2">
                    <li className="flex items-start gap-2.5 font-semibold text-emerald-300">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t('Semua fasilitas Paket Sahabat')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t('Laporan Portofolio Kebaikan Bulanan (PDF/Email)')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t('Prioritas penyaluran alokasi program darurat')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t('Layanan Konsultasi Zakat & Waris bersama Asatidz')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{t('Rekap tahunan terverifikasi untuk pengurangan SPT')}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-emerald-500/20">
                  <button
                    type="button"
                    onClick={() => onOpenDonateModal('umum', billingCycle === 'annual' ? 468000 : 49000)}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-extrabold text-xs text-white shadow-lg shadow-emerald-500/30 transition-all cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{t('Pilih Pro Donatur')}</span>
                  </button>
                </div>
              </div>

              {/* Card 3: Enterprise CSR / Mitra Lembaga */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 p-6 md:p-8 flex flex-col justify-between shadow-xs hover:border-gray-300 dark:hover:border-slate-700 transition-all">
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        {t('Mitra CSR & Lembaga')}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {t('Perusahaan, yayasan & instansi')}
                      </p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      Enterprise
                    </span>
                  </div>

                  <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-gray-900 dark:text-white">
                        {billingCycle === 'annual' ? 'Rp 399.000' : 'Rp 499.000'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">/{t('bulan')}</span>
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      {billingCycle === 'annual'
                        ? t('Mulai Rp 4.788.000 / tahun (Program ESG Terintegrasi)')
                        : t('Mulai Rp 499.000 / bulan (Fleksibel & Terukur)')}
                    </p>
                  </div>

                  <ul className="space-y-3 text-xs text-gray-600 dark:text-gray-300 pt-2">
                    <li className="flex items-start gap-2.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Semua fasilitas Paket Pro Donatur')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Dedicated Relationship Officer & Program Planner')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Berita Acara Serah Terima (BAST) & Legalitas Pajak')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Ekspor Data Ledger Lengkap (Excel / CSV API)')}</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{t('Co-Branding program & publikasi media nasional')}</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('section-csr');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      } else {
                        onOpenDonateModal();
                      }
                    }}
                    className="w-full py-3 px-4 rounded-xl border border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 font-bold text-xs transition-colors cursor-pointer text-center"
                  >
                    {t('Ajukan Kerja Sama CSR')}
                  </button>
                </div>
              </div>
            </div>

            {/* Note & Guarantee */}
            <div className="bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-4 text-center">
              <p className="text-xs text-gray-600 dark:text-slate-300 font-medium">
                {t('Seluruh dana yang diamanahkan dikelola berdasarkan prinsip syariah 100% transparan, didukung audit keuangan akuntabel dan sistem tracking real-time.')}
              </p>
            </div>
          </section>

          {/* SECTION CTA (CALL TO ACTION) */}
          <section id="section-cta" className="scroll-mt-24 relative overflow-hidden rounded-3xl bg-radial from-emerald-800 to-slate-900 text-white p-8 md:p-12 text-center flex flex-col items-center">
            {/* Ambient background decoration */}
            <div className="absolute inset-0 opacity-10 bg-cover bg-center mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1200')" }}></div>
            
            <div className="max-w-2xl relative z-10 space-y-6">
              <span className="inline-block bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-extrabold px-3 py-1 rounded-full text-[10px] tracking-wider uppercase">
                {t('MARI BERGABUNG SEKARANG')}
              </span>
              <h2 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
                {t('Siap Menjadi Motor Penggerak Kedaulatan Umat?')}
              </h2>
              <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-medium max-w-lg mx-auto">
                {t('Setiap rupiah yang Anda zakatkan atau donasikan disalurkan murni 100% secara amanah dan tercatat secara transparan di public ledger. Gabung juga sebagai relawan kemanusiaan hari ini.')}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => onOpenDonateModal()}
                  className="bg-emerald-500 hover:bg-emerald-600 font-extrabold text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-white animate-pulse" /> {t('Donasi Sekarang')}
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('navbar-item-volunteer');
                    if (el) {
                      el.click();
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-gray-700 font-bold text-xs px-6 py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  {t('Gabung Relawan')}
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* 2. ABOUT US VIEW */}
      {currentView === 'about' && (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-slate-700 space-y-10 text-gray-700 dark:text-gray-300">
          
          {/* Mission statements */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-emerald-600 dark:text-emerald-400 text-xs uppercase font-extrabold tracking-widest block">{t('SIAPAKAH KAMI')}</span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              {t('Menjembatani Kepedulian, Merajut Kemandirian Berkelanjutan')}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed leading-normal">
            <div className="space-y-3">
              <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{t('Visi Yayasan')}</h4>
              <p>
                {t('Menjadi episentrum pemberdayaan masyarakat dhuafa dan tata kelola dana sosial Islam (Zakat, Infaq, Sedekah, Wakaf) terdepan di Indonesia yang berorientasi sains, akuntabilitas digital berlapis, dan berkelanjutan ekologis.')}
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{t('Definisi Naskah Legalitas')}</h4>
              <p className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl font-mono text-[10px] space-y-1 select-all border border-gray-100 dark:border-gray-800">
                <span className="block"><strong>{t('SK Kemenkumham:')}</strong> AHU-00123.AH.01.04 TAHUN 2024</span>
                <span className="block"><strong>{t('Reg Dinsos RI:')}</strong> 312/DINSOS-PP/2025</span>
                <span className="block"><strong>{t('NPWP Lembaga:')}</strong> 45.123.456.7-012.000</span>
                <span className="block"><strong>{t('Opini Keuangan:')}</strong> {t('WTP (Wajar Tanpa Pengecualian) audit independen')}</span>
              </p>
            </div>
          </div>

          {/* Dewan Pembina list */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-700 space-y-4">
            <div className="text-center md:text-left shrink-0">
              <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 tracking-wider block uppercase">{t('Dewan Direksi & Syariah')}</span>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mt-1">{t('Struktur Kepemimpinan Amanah')}</h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
              {[
                { name: 'Prof. Dr. KH. Ahmad Fauzi, M.A', role: 'Dewan Pengawas Syariah' },
                { name: 'Ir. H. Budi Santoso, M.B.A', role: 'Direktur Eksekutif Yayasan' },
                { name: 'Dr. Siti Aminah, S.E, M.Si', role: 'Kepala Bidang Akuntansi & Audit' },
                { name: 'H. Muhammad Ridwan, Lc', role: 'Amil Zakat & Wakaf Syariah' }
              ].map(board => (
                <div key={board.name} className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-100 dark:border-slate-800">
                  <span className="font-extrabold text-gray-900 dark:text-white block tracking-tight leading-snug">{t(board.name)}</span>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block mt-1">{t(board.role)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 3. CAMPAIGNS LIST VIEW */}
      {currentView === 'campaigns' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('Katalog Program Amanah')}</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('Eksplorasi target sedia, zakat, reboisasi ataupun bantuan kemanusiaan.')}</p>
            </div>

            {/* Search inputs */}
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={campSearch}
                onChange={(e) => setCampSearch(e.target.value)}
                placeholder={t('Cari program kemanusiaan...')}
                className="bg-transparent text-xs outline-none focus:ring-0 text-slate-800 dark:text-white placeholder-gray-400 font-medium"
              />
            </div>
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap gap-1.5 pb-2 shrink-0 overflow-x-auto">
            {['Semua', 'Pendidikan', 'Wakaf', 'Pangan', 'Air Bersih', 'Kesehatan', 'Bencana'].map(catFilter => (
              <button
                key={catFilter}
                id={`camp-filter-btn-${catFilter}`}
                onClick={() => setActiveCategoryFilter(catFilter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
                  activeCategoryFilter === catFilter
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white hover:bg-emerald-50 dark:bg-slate-800 text-gray-600 dark:text-gray-350 border border-gray-200 dark:border-slate-700'
                }`}
              >
                {t(catFilter)}
              </button>
            ))}
          </div>

          {/* Catalog display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {campaigns
              .filter(c => activeCategoryFilter === 'Semua' || c.category === activeCategoryFilter)
              .filter(c => c.title.toLowerCase().includes(campSearch.toLowerCase()) || c.shortDescription.toLowerCase().includes(campSearch.toLowerCase()))
              .map(c => {
                const percent = Math.min(100, Math.round((c.collectedAmount / c.targetAmount) * 100));

                return (
                  <div key={c.id} className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-slate-700 overflow-hidden flex flex-col justify-between hover:shadow-lg dark:shadow-none transition-shadow group">
                    <div className="relative h-44 bg-slate-900 overflow-hidden select-none">
                      <img 
                        src={c.thumbnailUrl || c.imageUrl || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600'} 
                        alt={c.title} 
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=600';
                        }}
                        className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute top-3 left-3 bg-emerald-650 text-white font-extrabold text-[9px] px-2.5 py-1 rounded uppercase tracking-wider">
                        {t(c.category)}
                      </span>
                    </div>

                    <div className="p-5 grow space-y-4 flex flex-col justify-between">
                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => onSelectCampaign(c.slug)}
                          className="font-extrabold text-sm text-gray-950 dark:text-white leading-snug block hover:text-emerald-600 transition-colors text-left line-clamp-2"
                        >
                          {t(c.title)}
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {t(c.shortDescription)}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-center text-[10px] text-gray-500 dark:text-gray-400">
                          <span>{langPack.collected}: <strong>{formatCurrency(c.collectedAmount)}</strong></span>
                          <span className="font-bold text-gray-800 dark:text-white">{percent}%</span>
                        </div>

                        <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all"
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                          <span>Target: {formatCurrency(c.targetAmount)}</span>
                          <span>{t(c.location)}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-2 shrink-0">
                        <button
                          onClick={() => onSelectCampaign(c.slug)}
                          className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-white font-bold py-2 px-3 rounded-xl hover:bg-gray-200 text-xs transition-colors"
                        >
                          {t('Detail')}
                        </button>
                        <button
                          onClick={() => onOpenDonateModal(c.slug)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2 px-3 rounded-xl text-xs transition-colors"
                        >
                          {t('Bantu Sekarang')}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 4. TRANSPARENCY & REPORTS VIEW */}
      {currentView === 'transparency' && (
        <div id="transparency-board" className="space-y-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2.5">
            <span className="text-xs uppercase font-black text-emerald-600 dark:text-emerald-400 tracking-wider block">{t('MUTASI KUNCI')}</span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white">{t('Pertanggungjawaban Finansial Publik')}</h2>
            <p className="text-xs text-gray-400 leading-normal">
              {t('Yayasan menyajikan ledger penerimaan dana masuk (ledger transaksi) lunas publik secara seketika gunanya menjamin transparansi tinggi 100% bebas dari rekayasa keuangan.')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white dark:bg-gray-800 border border-gray-200 p-5 rounded-2xl">
              <span className="text-xs text-slate-500 font-semibold block">{t('Total Akuntabilitas Ledger')}</span>
              <strong className="text-2xl font-mono text-emerald-700 dark:text-emerald-400 block mt-1">{t('100% TERBUKA')}</strong>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 p-5 rounded-2xl">
              <span className="text-xs text-slate-500 font-semibold block">{t('Sertifikat Audit Keuangan')}</span>
              <strong className="text-2xl font-mono text-gray-900 dark:text-white block mt-1">{t('Rating WTP RI')}</strong>
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-200 p-5 rounded-2xl">
              <span className="text-xs text-slate-500 font-semibold block">{t('Metrik Penyaluran Dampak')}</span>
              <strong className="text-2xl font-mono text-teal-600 block mt-1">{t('Sains & Terbimbing')}</strong>
            </div>
          </div>

          {/* Ledger mapping list */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-4">
            <div>
              <span className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-455 block">{t('Real-Time Ledger Transaksi Publik')}</span>
              <span className="text-[10px] text-gray-500 block">{t('Jurnal mutasi ini diperbarui secara instan begitu kontribusi Anda tuntas diterima oleh sistem perbankan.')}</span>
            </div>

            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/60 text-slate-600 font-extrabold border-b border-gray-300">
                    <th className="p-3">{t('Waktu Masuk')}</th>
                    <th className="p-3">{t('Ref ID')}</th>
                    <th className="p-3">{t('Nama Donatur')}</th>
                    <th className="p-3">{t('Alokasi Penyaluran Program')}</th>
                    <th className="p-3">{t('Jumlah Dana')}</th>
                    <th className="p-3 text-right">{t('Verifikasi')}</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.filter(d => d.status === 'success').map(tx => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-emerald-50/5 text-xs text-gray-600 dark:text-gray-300">
                      <td className="p-3 font-mono text-[10px]">
                        {new Date(tx.createdDate).toLocaleString('id-ID')}
                      </td>
                      <td className="p-3 font-mono font-bold text-gray-500">{tx.id}</td>
                      <td className="p-3 font-bold">
                        {tx.isAnonymous ? t('Hamba Allah') : tx.donorName}
                      </td>
                      <td className="p-3 font-semibold truncate max-w-[150px]" title={tx.campaignTitle}>
                        {t(tx.campaignTitle)}
                      </td>
                      <td className="p-3 font-extrabold text-gray-900 dark:text-white">
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="p-3 text-right">
                        <span className="bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">
                          {t('APPROVED')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 5. CSR PARTNERS VIEW */}
      {currentView === 'csr' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-gray-700">
          
          <div className="md:col-span-7 space-y-6">
            <span className="text-emerald-600 dark:text-emerald-450 text-xs font-black uppercase block tracking-wider">{t('CSR & ESG SOLUTIONS PARTNERSHIP')}</span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white leading-snug tracking-tight">
              {t('Tingkatkan Dampak ESG Perusahaan Anda Bersama Kami')}
            </h2>
            <p className="leading-relaxed leading-normal">
              {t('Kami menyusun kemitraan program berkelanjutan siap saji didukung oleh infografis audit, dokumentasi foto, kuitansi digital, serta verifikasi laporan dampak yang patuh terhadap kualifikasi kriteria GRI (Global Reporting Initiative) & ESG.')}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100.5">
                <span className="font-extrabold text-gray-900 dark:text-white text-xs block mb-1">{t('Penyalur Terakreditasi B')}</span>
                <p className="text-gray-500">{t('Seluruh berita acara diautentikasi resmi menteri sosial & amil.')}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100.5">
                <span className="font-extrabold text-gray-900 dark:text-white text-xs block mb-1">{t('Tailored ESG Dashboard')}</span>
                <p className="text-gray-500">{t('Dashboard digital kustom korporasi guna paparan direksi RUPS.')}</p>
              </div>
            </div>
          </div>

          <div id="csr-form-panel" className="md:col-span-5 bg-gray-50/50 dark:bg-gray-900/60 border border-gray-200 p-6 rounded-2xl space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <h4 className="font-extrabold text-gray-900 dark:text-white">{t('Formulir Kolaborasi CSR')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{t('Ajukan konsultasi program ESG korporat, tim kami akan menjadwalkan meeting dalam 1x24 jam.')}</p>
            </div>

            {csrInquirySuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-600 animate-bounce" />
                <span className="font-bold block">{t('Terima Kasih, Mitra CSR!')}</span>
                <p className="text-[11px]">{t('Prospektus kolaborasi dan proposal program kerja sedia terkirim ke email, tim amil segera menghubungi WhatsApp Anda.')}</p>
                <button 
                  onClick={() => setCsrInquirySuccess(false)}
                  className="bg-white hover:bg-gray-100 text-emerald-800 font-extrabold px-3 py-1 rounded border text-[10px]"
                >
                  {t('Ajukan Lagi')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleCsrForm} className="space-y-3 font-xs">
                <div>
                  <label className="block font-bold mb-1">{t('1. Nama Perusahaan / Korporasi')}</label>
                  <input
                    type="text"
                    required
                    value={csrCompany}
                    onChange={(e) => setCsrCompany(e.target.value)}
                    placeholder={t('Contoh: PT Angkasa Raya Tbk')}
                    className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">{t('2. Nama Lengkap PIC Perusahaan')}</label>
                  <input
                    type="text"
                    required
                    value={csrPic}
                    onChange={(e) => setCsrPic(e.target.value)}
                    placeholder={t('Contoh: Ibu Ranti Safitri')}
                    className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">{t('Phone / WA PIC')}</label>
                    <input
                      type="text"
                      required
                      value={csrPhone}
                      onChange={(e) => setCsrPhone(e.target.value)}
                      placeholder="0812XXXXXXXX"
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">{t('Alamat Email Kerja')}</label>
                    <input
                      type="email"
                      value={csrEmail}
                      onChange={(e) => setCsrEmail(e.target.value)}
                      placeholder="pic@corporate.com"
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">{t('Pilar Program yang Diminati')}</label>
                  <select
                    value={csrProgram}
                    onChange={(e) => setCsrProgram(e.target.value)}
                    className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                  >
                    <option value="Pendidikan Mandiri">{t('Beasiswa Santri & Asrama Yatim')}</option>
                    <option value="Air Bersih">{t('Sumur Bor Produktif Krisis Air')}</option>
                    <option value="Kesehatan Tangguh">{t('Klinik Kesehatan Keliling Dhuafa')}</option>
                    <option value="Reboisasi">{t('Mitigasi Emisi Karbon Green Reboisasi')}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">{t('Target Anggaran Kemitraan')}</label>
                  <select
                    value={csrBudget}
                    onChange={(e) => setCsrBudget(e.target.value)}
                    className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                  >
                    <option value="Rp50juta - Rp100juta">{t('Rp50 Juta - Rp100 Juta')}</option>
                    <option value="Rp100juta - Rp250juta">{t('Rp100 Juta - Rp250 Juta')}</option>
                    <option value="Rp250juta_plus">{t('Di atas Rp250 Juta')}</option>
                  </select>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    id="btn-submit-csr-inquiry"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    {t('Ajukan Kemitraan ESG')}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      )}

      {/* 6. VOLUNTEER REGISTER VIEW */}
      {currentView === 'volunteer' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 border border-gray-200 dark:border-slate-700">
          
          <div className="md:col-span-7 space-y-6">
            <span className="text-emerald-600 dark:text-emerald-455 text-xs font-black uppercase block tracking-wider">{t('JOIN AMANAH FORCE')}</span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white leading-snug tracking-tight">
              {t('Ayo Ambil Peran dalam Barisan Penggerak Kebaikan')}
            </h2>
            <p className="leading-relaxed leading-normal">
              {t('Yayasan membuka seluas-luasnya peluang kontribusi kebahagiaan para pemuda Indonesia untuk terjun sebagai tim relawan lapangan penanggulangan kekeringan, edukasi mengajar mengaji pelosok, pendataan logistik bantuan bencana, murni tanpa pamrih demi kemanusiaan mulia.')}
            </p>

            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white">{t('Pelatihan Kesiapsiagaan Darurat')}</strong>
                  <p className="text-gray-500 mt-1">{t('Dapatkan pembekalan kompetensi SAR, mitigasi bencana psikososial anak dari para profesional.')}</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 dark:text-white">{t('Sertifikat Relawan Kemanusiaan Resmi')}</strong>
                  <p className="text-gray-500 mt-1">{t('Pengakuan legalitas berkontribusi sosial resmi yang diakui tingkat kementerian.')}</p>
                </div>
              </div>
            </div>
          </div>

          <div id="volunteer-form-panel" className="md:col-span-5 bg-gray-50/50 dark:bg-gray-900/60 border border-gray-200 p-6 rounded-2xl space-y-4">
            <div className="border-b border-gray-200 dark:border-gray-700 pb-2">
              <h4 className="font-extrabold text-gray-900 dark:text-white">{t('Pendaftaran Relawan')}</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{t('Gabung barisan motor penggerak hari ini juga.')}</p>
            </div>

            {volInquirySuccess ? (
              <div className="bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 text-emerald-800 dark:text-emerald-300 p-4 rounded-xl text-center space-y-2">
                <CheckCircle className="w-8 h-8 mx-auto text-emerald-600 animate-bounce" />
                <span className="font-bold block">{t('Selamat Bergabung!')}</span>
                <p className="text-[11px]">{t('Lamaran Anda terdaftar. Tim koordinator relawan wilayah akan segera mengaktifkan status verifikasi Anda dan mengundang ke grup koordinasi penting.')}</p>
                <button 
                  onClick={() => setVolInquirySuccess(false)}
                  className="bg-white hover:bg-gray-100 text-emerald-800 font-extrabold px-3 py-1 rounded border text-[10px]"
                >
                  {t('Daftar baru')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleVolunteerForm} className="space-y-3 font-xs">
                <div>
                  <label className="block font-bold mb-1">{t('1. Nama Lengkap Lambang Relawan')}</label>
                  <input
                    type="text"
                    required
                    value={volName}
                    onChange={(e) => setVolName(e.target.value)}
                    placeholder={t('Contoh: Aditya Nugroho')}
                    className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold mb-1">{t('Email')}</label>
                    <input
                      type="email"
                      required
                      value={volEmail}
                      onChange={(e) => setVolEmail(e.target.value)}
                      placeholder="adit@relawan.net"
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">{t('No. WhatsApp')}</label>
                    <input
                      type="text"
                      required
                      value={volPhone}
                      onChange={(e) => setVolPhone(e.target.value)}
                      placeholder="0856XXXXXXXX"
                      className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">{t('Spesialisasi Keahlian Relawan')}</label>
                  <div className="grid grid-cols-2 gap-2 font-medium mt-1">
                    {['Penyuluh Pendidikan', 'Penyalur Logistik Medis', 'Dokumentasi/Kamera', 'Supir Darurat SAR'].map(skill => (
                      <label key={skill} className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={volSkills.includes(skill)}
                          onChange={() => handleSkillToggle(skill)}
                          className="accent-emerald-600 rounded"
                        />
                        <span>{t(skill)}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold mb-1">{t('Deskripsi Ringkas Pengalaman Sosial')}</label>
                  <textarea
                    rows={2}
                    value={volExperience}
                    onChange={(e) => setVolExperience(e.target.value)}
                    placeholder={t('Contoh: Pernah mengikuti satgas peduli Gempa Cianjur 2 minggu bagian logistik masakan dhuafa...')}
                    className="w-full text-xs p-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 dark:text-white rounded-lg"
                  />
                </div>

                <button
                  type="submit"
                  id="btn-submit-volunteer"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-2.5 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  {t('Kirim Lamaran Relawan')}
                </button>
              </form>
            )}
          </div>

        </div>
      )}

      {/* 7. EDUCATIONAL BLOGS VIEW */}
      {currentView === 'blog' && (
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-emerald-600 dark:text-emerald-455 text-xs font-black uppercase block tracking-wider">{t('KABAR EDUKASI MASLAHAT')}</span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight">{t('Kanal Edukasi Kebaikan Yayasan')}</h2>
            <p className="text-xs text-gray-400">{t('Ikuti kupasan syariat zakat mal, transparansi filantropi, dan info update krisis air bersih.')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogs.map(post => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-5 flex flex-col sm:flex-row gap-5 items-start hover:shadow-md transition-shadow">
                <div className="w-full sm:w-36 h-36 rounded-2xl bg-gray-100 select-none pointer-events-none overflow-hidden shrink-0">
                  <img 
                    src={post.thumbnailUrl || post.imageUrl} 
                    alt={post.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-2 text-xs flex flex-col justify-between h-full grow leading-relaxed">
                  <div className="space-y-1.5">
                    <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-black px-2 py-0.5 rounded tracking-wide uppercase">
                      {t(post.category)}
                    </span>
                    <h3 className="font-extrabold text-sm text-gray-900 dark:text-white leading-snug tracking-tight">
                      {t(post.title)}
                    </h3>
                    <p className="text-gray-500 line-clamp-2">
                      {t(post.excerpt)}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-t-gray-100 dark:border-t-slate-700 flex items-center justify-between text-[10px] text-gray-400 mt-2">
                    <span>{t('Oleh')}: {post.author}</span>
                    <span>{new Date(post.createdDate || post.publishedDate).toLocaleDateString('id-ID')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. INTERACTIVE PLATFORM EXPLORATION MODAL */}
      {isExploreModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsExploreModalOpen(false)} 
          />
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-gradient-to-r from-slate-50 to-emerald-50/40 dark:from-slate-900 dark:to-emerald-950/30">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-extrabold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Sistem Real-Time Ledger & Audit Publik
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                  Eksplorasi Platform Transparansi Filantropi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pratinjau langsung arsitektur digital pelaporan donasi, penyaluran amanah, dan pembukuan syariah PSAK 109.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsExploreModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Stat Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/40">
              <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Total Donasi Terhimpun</span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block mt-0.5">
                  Rp {donations.reduce((acc, d) => acc + (d.amount || 0), 0).toLocaleString('id-ID')}
                </span>
                <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5 block">Live Terverifikasi</span>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Program Terverifikasi</span>
                <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 block mt-0.5">
                  {campaigns.length} Program
                </span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 block">100% Akad Amanah</span>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Donatur Terdaftar</span>
                <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white block mt-0.5">
                  {donors.length} Donatur
                </span>
                <span className="text-[9px] text-teal-600 dark:text-teal-400 font-bold mt-0.5 block">CRM Terenkripsi</span>
              </div>
              <div className="bg-white dark:bg-slate-800/80 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 block">Status Audit Keuangan</span>
                <span className="text-sm sm:text-base font-black text-indigo-600 dark:text-indigo-400 block mt-0.5 truncate" title="Wajar Tanpa Pengecualian">
                  Opini WTP
                </span>
                <span className="text-[9px] text-indigo-600 dark:text-indigo-400 font-bold mt-0.5 block">Standar PSAK 109</span>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="px-5 sm:px-6 pt-3 flex gap-2 border-b border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setExploreActiveTab('ledger')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  exploreActiveTab === 'ledger'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Ledger Keuangan Live</span>
              </button>
              <button
                type="button"
                onClick={() => setExploreActiveTab('distribution')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  exploreActiveTab === 'distribution'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Penyaluran Program</span>
              </button>
              <button
                type="button"
                onClick={() => setExploreActiveTab('compliance')}
                className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  exploreActiveTab === 'compliance'
                    ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Legalitas & Audit Syariah</span>
              </button>
            </div>

            {/* Modal Body / Tab Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 max-h-[42vh]">
              {exploreActiveTab === 'ledger' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      Entri Mutasi Donasi Masuk Real-Time
                    </span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                      Sinkron Otomatis
                    </span>
                  </div>
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 font-bold">
                          <tr>
                            <th className="p-2.5">No. Resi</th>
                            <th className="p-2.5">Donatur</th>
                            <th className="p-2.5">Program Tujuan</th>
                            <th className="p-2.5">Metode</th>
                            <th className="p-2.5 text-right">Nominal</th>
                            <th className="p-2.5 text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                          {donations.slice(0, 5).map((d, idx) => (
                            <tr key={d.id || idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                              <td className="p-2.5 font-mono text-slate-500 dark:text-slate-400 text-[11px]">{d.receiptNumber || `AMN-${d.id}`}</td>
                              <td className="p-2.5 font-bold text-slate-800 dark:text-slate-100">{d.isAnonymous ? 'Hamba Allah' : d.donorName}</td>
                              <td className="p-2.5 text-slate-600 dark:text-slate-300 truncate max-w-[180px]">{d.campaignTitle}</td>
                              <td className="p-2.5">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                  {d.paymentMethod || 'QRIS'}
                                </span>
                              </td>
                              <td className="p-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                Rp {(d.amount || 0).toLocaleString('id-ID')}
                              </td>
                              <td className="p-2.5 text-center">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Lunas
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {exploreActiveTab === 'distribution' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {campaigns.slice(0, 4).map(c => (
                    <div key={c.id} className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {c.category}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {Math.min(100, Math.round((c.collectedAmount / (c.targetAmount || 1)) * 100))}%
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{c.title}</h4>
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(100, Math.round((c.collectedAmount / (c.targetAmount || 1)) * 100))}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1">
                        <span className="text-slate-500 dark:text-slate-400">Terkumpul: <b className="text-slate-800 dark:text-slate-100">Rp {c.collectedAmount.toLocaleString('id-ID')}</b></span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsExploreModalOpen(false);
                            onOpenDonateModal(c.slug);
                          }}
                          className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline cursor-pointer"
                        >
                          Salurkan Donasi →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {exploreActiveTab === 'compliance' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <h5 className="font-bold text-slate-900 dark:text-white">Audit Trail Otomatis</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Setiap mutasi donasi dienkripsi dengan nomor referensi unik dan dapat diverifikasi langsung oleh donatur.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <FileText className="w-5 h-5 text-teal-500" />
                    <h5 className="font-bold text-slate-900 dark:text-white">Standar PSAK 109</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Pencatatan akuntansi zakat, infak, dan sedekah dipisahkan secara ketat sesuai syariah dan PSAK 109.
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1.5">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <h5 className="font-bold text-slate-900 dark:text-white">Nisab Syariah Terpadu</h5>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                      Kalkulator zakat terintegrasi dengan patokan harga emas acuan dan fatwa Dewan Syariah Nasional MUI.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer / Navigation Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExploreModalOpen(false);
                    onNavigate?.('transparency');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold rounded-xl transition cursor-pointer shadow-sm flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Buka Transparansi Penuh</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsExploreModalOpen(false);
                    onNavigate?.('zakat');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Hitung Zakat Mandiri</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsExploreModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white font-semibold cursor-pointer"
              >
                Tutup Pratinjau
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
