/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, ShieldCheck, MapPin, Share2, ClipboardCheck, ArrowRight, 
  HelpCircle, ChevronRight, MessageSquare, MessageSquarePlus, PhoneCall, CheckCircle, 
  Settings, User, Sparkles, RefreshCw, AlertCircle, ChevronDown, Globe, Sun, Moon,
  Menu, X, Lock, ArrowLeft, LogOut, Bell, CheckCheck, DollarSign, HeartHandshake, Briefcase, Database
} from 'lucide-react';
import { translations, getTranslation } from './translations';
import LanguageSelector from './components/LanguageSelector';
import ZakatCalculator from './components/ZakatCalculator';
import DonationModal from './components/DonationModal';
import FeedbackModal from './components/FeedbackModal';
import LegalModal from './components/LegalModal';
import AdminPanel from './components/AdminPanel';
import AdminAuth from './components/AdminAuth';
import PageViews from './components/PageViews';
import { 
  OrganizationInfo, Campaign, Donation, Donor, Volunteer, 
  CsrInquiry, Report, BlogPost, Testimonial, FAQ, AdminUser 
} from './types';

export default function App() {
  const [currentLang, setCurrentLang] = useState<string>('id');
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState<boolean>(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);
  const [isLegalOpen, setIsLegalOpen] = useState<boolean>(false);
  const [legalDefaultTab, setLegalDefaultTab] = useState<'disclaimer' | 'terms'>('disclaimer');
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [isAdminNotifOpen, setIsAdminNotifOpen] = useState<boolean>(false);
  const [adminUnreadCount, setAdminUnreadCount] = useState<number>(3);
  const [adminNotifFilter, setAdminNotifFilter] = useState<'all' | 'donations' | 'csr' | 'system'>('all');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const manualScrollUntilRef = useRef<number>(0);

  // Navigate to section with manual click lockout to prevent scrollspy fighting
  const scrollToSection = (sectionId: string, elementId: string) => {
    manualScrollUntilRef.current = Date.now() + 1000;
    setActiveSection(sectionId);
    setSelectedCampaignSlug('');
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 120);
    } else {
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // Track window scroll for navbar glassmorphism transition & scrollspy section tracking
  useEffect(() => {
    // Exactly matches page DOM order from top to bottom
    const trackedSections = [
      { id: 'home', elId: 'hero-section' },
      { id: 'masalah-solusi', elId: 'section-masalah' },
      { id: 'video-demo', elId: 'section-video-demo' },
      { id: 'campaigns', elId: 'section-campaigns' },
      { id: 'zakat', elId: 'section-zakat' },
      { id: 'transparency', elId: 'section-transparency' },
      { id: 'about', elId: 'section-about' },
      { id: 'csr', elId: 'section-csr' },
      { id: 'volunteer', elId: 'section-volunteer' },
      { id: 'blog', elId: 'section-blog' },
      { id: 'testimoni', elId: 'section-testimoni' },
      { id: 'faq', elId: 'section-faq' },
      { id: 'pricing', elId: 'section-pricing' }
    ];

    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // Ignore scrollspy if user recently clicked a nav button
      if (Date.now() < manualScrollUntilRef.current) {
        return;
      }

      // Very top of page
      if (scrollY < 180) {
        setActiveSection('home');
        return;
      }

      const viewportLine = 220; // Observation line below fixed navbar
      let matched = 'home';

      // 1. Check which section content spans across the observation line
      for (const item of trackedSections) {
        const el = document.getElementById(item.elId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= viewportLine && rect.bottom > viewportLine) {
            matched = item.id;
            break;
          }
        }
      }

      // 2. Fallback: closest section above observation line
      if (matched === 'home' && scrollY >= 180) {
        let minDiff = Infinity;
        for (const item of trackedSections) {
          const el = document.getElementById(item.elId);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= viewportLine) {
              const diff = viewportLine - rect.top;
              if (diff < minDiff) {
                minDiff = diff;
                matched = item.id;
              }
            }
          }
        }
      }

      setActiveSection(matched);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize and persist dark mode
  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };
  
  // Reactive tick to trigger re-renders when background translations complete
  const [translationTick, setTranslationTick] = useState<number>(0);
  useEffect(() => {
    const handleTranslationLoaded = () => {
      setTranslationTick(prev => prev + 1);
    };
    window.addEventListener('translation-loaded', handleTranslationLoaded);
    return () => {
      window.removeEventListener('translation-loaded', handleTranslationLoaded);
    };
  }, []);

  const t = (text: string) => getTranslation(text, currentLang);
  const [currentView, setCurrentView] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const saved = sessionStorage.getItem('amanah_current_view');
      if (path === '/admin' || hash === '#admin' || saved === 'admin') {
        return 'admin';
      }
    }
    return 'home';
  });
  const [selectedCampaignSlug, setSelectedCampaignSlug] = useState<string>('');

  // Synchronize currentView with window.location.pathname
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setCurrentView('admin');
      } else if (currentView === 'admin' && path !== '/admin') {
        setCurrentView('home');
      }
    };

    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  // Also sync view changes to the URL address bar and sessionStorage
  useEffect(() => {
    if (currentView === 'admin') {
      sessionStorage.setItem('amanah_current_view', 'admin');
      if (window.location.pathname !== '/admin') {
        window.history.pushState({}, '', '/admin');
      }
    } else {
      sessionStorage.setItem('amanah_current_view', currentView);
      if (window.location.pathname === '/admin') {
        window.history.pushState({}, '', '/');
      }
    }
  }, [currentView]);

  // Persistent Authenticated Admin State
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const stored = localStorage.getItem('amanah_current_admin');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const handleAdminLoginSuccess = (user: AdminUser) => {
    setCurrentAdmin(user);
    localStorage.setItem('amanah_current_admin', JSON.stringify(user));
  };

  const handleAdminLogout = () => {
    setCurrentAdmin(null);
    localStorage.removeItem('amanah_current_admin');
    setCurrentView('home');
    triggerToast('Anda berhasil keluar dari Portal Pengurus.');
  };

  const handleUpdateAdminProfile = (user: AdminUser) => {
    setCurrentAdmin(user);
    localStorage.setItem('amanah_current_admin', JSON.stringify(user));
    triggerToast('Profil Pengurus Berhasil Diperbarui!');
  };

  // Loaded database state datasets from full-stack API
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [donors, setDonors] = useState<Donor[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [csrInquiries, setCsrInquiries] = useState<CsrInquiry[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [orgInfo, setOrgInfo] = useState<OrganizationInfo | null>(null);

  // Interface state configurations
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string>('');
  
  // Donation dialog state
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [preSelectedSlug, setPreSelectedSlug] = useState<string>('');
  const [preSelectedAmt, setPreSelectedAmt] = useState<number>(0);
  const [toasts, setToasts] = useState<Array<{ id: string; title?: string; message: string; type?: 'success' | 'info' | 'warning' | 'error' }>>([]);

  const handleOpenLegalModal = (tab: 'disclaimer' | 'terms' = 'disclaimer') => {
    setLegalDefaultTab(tab);
    setIsLegalOpen(true);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Listen to custom amanah-toast events across the app
  useEffect(() => {
    const handleAmanahToast = (e: any) => {
      const detail = e.detail;
      if (!detail) return;
      const newToast = {
        id: String(Date.now()) + Math.random().toString(36).substring(2, 7),
        title: typeof detail === 'string' ? 'Pemberitahuan Amanah' : (detail.title || 'Pemberitahuan Amanah'),
        message: typeof detail === 'string' ? detail : (detail.message || ''),
        type: (typeof detail === 'string' ? 'info' : (detail.type || 'info')) as 'success' | 'info' | 'warning' | 'error'
      };
      setToasts(prev => [newToast, ...prev.slice(0, 2)]);
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== newToast.id));
      }, 5000);
    };

    window.addEventListener('amanah-toast', handleAmanahToast as EventListener);
    return () => {
      window.removeEventListener('amanah-toast', handleAmanahToast as EventListener);
    };
  }, []);

  // 1. Core Data fetching strictly from Database API (NO SILENT FALLBACK)
  const fetchAllData = async () => {
    setIsLoading(true);
    setErrorText('');
    try {
      const adminQuery = currentAdmin ? `?user_email=${encodeURIComponent(currentAdmin.email)}&is_admin=true` : '';

      const fetchApi = async (endpoint: string) => {
        const res = await fetch(endpoint);
        if (!res.ok) {
          const errData = await res.json().catch(() => null);
          const errorMsg = errData?.message || `Gagal mengambil data dari ${endpoint} (HTTP ${res.status})`;
          throw new Error(errorMsg);
        }
        return await res.json();
      };

      const [org, camp, don, dnr, vol, csr, rep, bgs, tst, fqs] = await Promise.all([
        fetchApi('/api/organization'),
        fetchApi(`/api/campaigns${adminQuery}`),
        fetchApi(`/api/donations${adminQuery}`),
        fetchApi(`/api/donors${adminQuery}`),
        fetchApi(`/api/volunteers${adminQuery}`),
        fetchApi(`/api/csr-inquiries${adminQuery}`),
        fetchApi(`/api/reports${adminQuery}`),
        fetchApi(`/api/blogs${adminQuery}`),
        fetchApi('/api/testimonials'),
        fetchApi('/api/faqs')
      ]);

      setOrgInfo(org);
      setCampaigns(camp);
      setDonations(don);
      setDonors(dnr);
      setVolunteers(vol);
      setCsrInquiries(csr);
      setReports(rep);
      setBlogs(bgs);
      setTestimonials(tst);
      setFaqs(fqs);

    } catch (err: any) {
      console.error('Koneksi Database Gagal:', err);
      const msg = err.message || 'Koneksi ke basis data terputus atau belum aktif.';
      setErrorText(msg);
      // Strictly NO fallback: clear datasets so the error is real and directly actionable
      setOrgInfo(null);
      setCampaigns([]);
      setDonations([]);
      setDonors([]);
      setVolunteers([]);
      setCsrInquiries([]);
      setReports([]);
      setBlogs([]);
      setTestimonials([]);
      setFaqs([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      localStorage.removeItem('amanah_donations');
      localStorage.removeItem('amanah_campaigns');
    } catch (e) {}
    fetchAllData();
  }, [currentAdmin, currentView]);

  const triggerToast = (msg: string, type: 'success' | 'info' | 'warning' | 'error' = 'success', title?: string) => {
    const newToast = {
      id: String(Date.now()) + Math.random().toString(36).substring(2, 7),
      title: title || (type === 'success' ? 'Berhasil' : type === 'error' ? 'Pemberitahuan Sistem' : 'Amanah Impact'),
      message: msg,
      type
    };
    setToasts(prev => [newToast, ...prev.slice(0, 2)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 5000);
  };

  // Helper trigger to open donate preselected
  const handleOpenDonate = (slug: string = '', amount: number = 0) => {
    setPreSelectedSlug(slug);
    setPreSelectedAmt(amount);
    setIsDonateOpen(true);
  };

  // Helper hook to pay Zakat from calculator
  const handlePayZakatTrigger = (amount: number, category: string) => {
    triggerToast(`${t('Zakat Terhitung Berhasil Dikonversi')}: ${amount}`);
    handleOpenDonate('umum', amount);
  };

  // Switch to specific selected campaign storytelling view
  const handleSelectCampaign = (slug: string) => {
    setSelectedCampaignSlug(slug);
    setCurrentView('campaign-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getTranslationPack = () => {
    return translations[currentLang] || translations['id'];
  };

  const langPack = getTranslationPack();

  // Find detailed selected campaign
  const activeCampaign = campaigns.find(c => c.slug === selectedCampaignSlug) || campaigns[0];

  // Dynamic navbar state: adapts cleanly to isDarkMode in both light mode and dark mode
  const isDarkNavbar = isDarkMode;
  const isHeroNavbar = isDarkMode;

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-gray-800 dark:text-gray-100 flex flex-col justify-between ${currentLang === 'ar' ? 'rtl' : 'ltr'}`} dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* 2. DYNAMIC REAL-TIME TOP-OF-SCREEN FLOATING NOTIFICATION POPUP */}
      {toasts.length > 0 && (
        <div 
          id="global-toast-container" 
          className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] flex flex-col gap-2.5 w-[92vw] max-w-md pointer-events-none"
        >
          {toasts.map(toast => (
            <div
              key={toast.id}
              className={`pointer-events-auto shadow-2xl rounded-2xl p-4 border backdrop-blur-xl flex items-start gap-3 transition-all duration-300 transform animate-in slide-in-from-top-4 fade-in ${
                toast.type === 'error'
                  ? 'bg-slate-900/95 border-rose-500/50 text-white shadow-rose-950/40'
                  : toast.type === 'warning'
                  ? 'bg-slate-900/95 border-amber-500/50 text-white shadow-amber-950/40'
                  : 'bg-slate-900/95 border-emerald-500/40 text-white shadow-emerald-950/50'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'error' ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : toast.type === 'warning' ? (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                )}
              </div>
              <div className="grow space-y-0.5">
                <h4 className="text-xs font-black tracking-wide leading-tight">
                  {toast.title}
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug">
                  {toast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-slate-400 hover:text-white p-0.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 3. FIXED NAVBAR MAIN HEADER WITH CRISP CONTRAST FOR LIGHT & DARK MODE */}
      <header
        id="sticky-header"
        className={`fixed top-0 left-0 right-0 z-50 w-full h-[60px] px-3 sm:px-6 flex items-center transition-all duration-300 ${
          isDarkMode
            ? isScrolled
              ? 'bg-[#0B132B]/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg'
              : 'bg-[#0B132B] border-b border-slate-800 text-white shadow-md'
            : isScrolled
              ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 text-slate-900 shadow-md'
              : 'bg-white border-b border-slate-200 text-slate-900 shadow-xs'
        }`}
      >
        <div id="nav-container" className="w-full flex items-center justify-between gap-2 md:gap-4">
          
          {/* 1. Website Profile & Brand (Pojok Kiri) */}
          <div className="flex items-center shrink-0">
            <button
              id="navbar-brand-profile"
              onClick={() => {
                setActiveSection('home');
                setSelectedCampaignSlug('');
                if (currentView !== 'home') {
                  setCurrentView('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className="flex items-center gap-2.5 sm:gap-3 text-left shrink-0 cursor-pointer group focus:outline-none"
              title="Amanah Impact Foundation - Beranda"
            >
              <div className="p-1 bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform">
                <img
                  src="/amanah_logo_1783746978284.jpg"
                  alt="Amanah Impact Foundation"
                  className="h-8 sm:h-9 md:h-10 w-auto object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm sm:text-base font-black tracking-tight leading-none transition-colors ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  Amanah Impact
                </span>
                <span className={`text-[10px] sm:text-[11px] font-bold leading-tight mt-0.5 tracking-wide transition-colors ${
                  isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  Foundation
                </span>
              </div>
            </button>

            {currentView === 'admin' && (
              <div className="flex items-center gap-1.5 ml-2.5 sm:ml-4">
                <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs ${
                  isDarkMode
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                }`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Admin Panel</span>
                  <span className="sm:hidden">Admin</span>
                </span>
              </div>
            )}
          </div>

          {/* 2. Menu Navigasi (Di Tengah: Responsif Scroll & Efek Neon Font) */}
          {currentView === 'admin' ? (
            <div className="flex-1" />
          ) : (
            <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1 mx-2 xl:mx-4">
              {[
                { id: 'home', key: 'navHome', label: 'Beranda', sectionId: 'hero-section' },
                { id: 'masalah-solusi', key: 'navProblemSolution', label: 'Tantangan & Solusi', sectionId: 'section-masalah' },
                { id: 'video-demo', key: 'navDemo', label: 'Demo Alat', sectionId: 'section-video-demo' },
                { id: 'campaigns', key: 'navCampaigns', label: 'Program Sosial', sectionId: 'section-campaigns' },
                { id: 'blog', key: 'navBlog', label: 'Edukasi & Berita', sectionId: 'section-blog' }
              ].map(item => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`navbar-item-${item.id}`}
                    onClick={() => scrollToSection(item.id, item.sectionId)}
                    className={`px-3 py-1.5 text-xs transition-all duration-200 cursor-pointer shrink-0 bg-transparent border-none ${
                      isActive
                        ? isDarkNavbar
                          ? 'font-black text-emerald-300 [text-shadow:0_0_8px_#34d399,0_0_18px_#10b981,0_0_28px_#059669]'
                          : 'font-black text-emerald-700 bg-emerald-500/15 rounded-xl px-3 py-1.5'
                        : isDarkNavbar
                        ? 'font-bold text-slate-300 hover:text-emerald-300 hover:[text-shadow:0_0_8px_rgba(52,211,153,0.6)]'
                        : 'font-bold text-slate-700 hover:text-emerald-600'
                    }`}
                  >
                    {langPack[item.key] || t(item.label)}
                  </button>
                );
              })}

              {/* Dropdown Lainnya */}
              {(() => {
                const isMoreActive = ['zakat', 'transparency', 'about', 'csr', 'volunteer', 'testimoni', 'faq', 'pricing'].includes(activeSection);
                return (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setIsMoreDropdownOpen(!isMoreDropdownOpen);
                        setIsLangDropdownOpen(false);
                      }}
                      className={`px-3 py-1.5 text-xs transition-all duration-200 cursor-pointer shrink-0 flex items-center gap-1.5 bg-transparent border-none ${
                        isMoreActive
                          ? isDarkNavbar
                            ? 'font-black text-emerald-300 [text-shadow:0_0_8px_#34d399,0_0_18px_#10b981,0_0_28px_#059669]'
                            : 'font-black text-emerald-700 bg-emerald-500/15 rounded-xl px-3 py-1.5'
                          : isDarkNavbar
                          ? isMoreDropdownOpen
                            ? 'text-emerald-300 [text-shadow:0_0_8px_rgba(52,211,153,0.6)] font-bold'
                            : 'text-slate-300 hover:text-emerald-300 hover:[text-shadow:0_0_8px_rgba(52,211,153,0.6)] font-bold'
                          : isMoreDropdownOpen
                            ? 'text-emerald-700 font-bold'
                            : 'text-slate-700 hover:text-emerald-600 font-bold'
                      }`}
                    >
                      <span>{langPack.navMore || 'Lainnya'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''} ${isMoreActive ? 'text-emerald-300 drop-shadow-[0_0_6px_#34d399]' : 'text-slate-400'}`} />
                    </button>
                    
                    {isMoreDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsMoreDropdownOpen(false)}></div>
                        <div className={`absolute left-1/2 -translate-x-1/2 mt-2 w-56 rounded-2xl shadow-2xl py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150 ${
                          isDarkNavbar
                            ? 'bg-slate-900/95 backdrop-blur-xl border border-slate-800 text-white shadow-2xl'
                            : 'bg-white dark:bg-slate-900 backdrop-blur-xl border border-gray-200 dark:border-slate-800 shadow-xl'
                        }`}>
                          {[
                            { id: 'zakat', key: 'navZakat', label: 'Zakat Digital', sectionId: 'section-zakat' },
                            { id: 'transparency', key: 'navTransparency', label: 'Transparansi', sectionId: 'section-transparency' },
                            { id: 'about', key: 'navAbout', label: 'Tentang Kami', sectionId: 'section-about' },
                            { id: 'csr', key: 'navCSR', label: 'CSR Solusi', sectionId: 'section-csr' },
                            { id: 'volunteer', key: 'navVolunteer', label: 'Relawan', sectionId: 'section-volunteer' },
                            { id: 'testimoni', key: 'navTestimoni', label: 'Testimoni', sectionId: 'section-testimoni' },
                            { id: 'faq', key: 'navFAQ', label: 'Pusat FAQ', sectionId: 'section-faq' },
                            { id: 'pricing', key: 'navPricing', label: 'Paket Kemitraan', sectionId: 'section-pricing' }
                          ].map(subItem => (
                            <button
                              key={subItem.id}
                              id={`navbar-item-${subItem.id}`}
                              onClick={() => {
                                setIsMoreDropdownOpen(false);
                                scrollToSection(subItem.id, subItem.sectionId);
                              }}
                              className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                                activeSection === subItem.id
                                  ? 'text-emerald-300 font-extrabold [text-shadow:0_0_8px_#34d399] bg-emerald-950/60'
                                  : isDarkNavbar
                                  ? 'text-slate-200 hover:bg-emerald-900/60 hover:text-emerald-300'
                                  : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 hover:text-emerald-700 dark:hover:text-emerald-400'
                              }`}
                            >
                              <span>{langPack[subItem.key] || t(subItem.label)}</span>
                            </button>
                          ))}

                          <div className={`border-t my-1.5 ${isDarkNavbar ? 'border-emerald-800/40' : 'border-gray-100 dark:border-slate-800'}`}></div>
                          <button
                            onClick={() => {
                              setIsMoreDropdownOpen(false);
                              setIsFeedbackOpen(true);
                            }}
                            className={`w-full text-left px-4 py-2 text-xs font-bold transition-colors cursor-pointer flex items-center gap-2 ${
                              isDarkNavbar
                                ? 'text-emerald-300 hover:bg-emerald-950/60'
                                : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
                            }`}
                          >
                            <MessageSquarePlus className="w-3.5 h-3.5" />
                            <span>{t('Beri Feedback Tools')}</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })()}
            </nav>
          )}

          {/* 3. Action Controls: Bahasa, Dark/Light, dan User */}
          <div className="flex items-center justify-end gap-1.5 sm:gap-2.5 shrink-0">
            {/* Language Selection Dropdown (Bahasa) */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangDropdownOpen(!isLangDropdownOpen);
                  setIsMoreDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-full transition-all shrink-0 cursor-pointer ${
                  isDarkMode
                    ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-xs'
                }`}
                title={t('Pilih Bahasa')}
              >
                <Globe className={`w-3.5 h-3.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`} />
                <span className="uppercase font-black">{currentLang}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isLangDropdownOpen ? 'rotate-180' : ''} ${isDarkMode ? 'text-emerald-400' : 'text-slate-600'}`} />
              </button>

              {isLangDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangDropdownOpen(false)}></div>
                  <div className={`absolute right-0 mt-2 w-40 rounded-2xl shadow-2xl py-1.5 z-20 animate-in fade-in slide-in-from-top-2 duration-150 ${
                    isDarkMode
                      ? 'bg-slate-900/95 backdrop-blur-xl border border-emerald-500/30 text-white shadow-emerald-950/40'
                      : 'bg-white dark:bg-slate-900 backdrop-blur-xl border border-gray-200 dark:border-slate-800 shadow-xl'
                  }`}>
                    {[
                      { code: 'id', label: 'Indonesian' },
                      { code: 'en', label: 'English' },
                      { code: 'ar', label: 'Arabic' },
                      { code: 'zh', label: 'Chinese' },
                      { code: 'ja', label: 'Japanese' }
                    ].map(lang => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setCurrentLang(lang.code);
                          setIsLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                          currentLang === lang.code
                            ? isDarkMode
                              ? 'bg-emerald-900/60 text-emerald-300 font-bold'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 font-bold'
                            : isDarkMode
                              ? 'text-slate-200 hover:bg-emerald-950/60 hover:text-emerald-300'
                              : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/20'
                        }`}
                      >
                        <span>{lang.label}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{lang.code}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle Button (Dark/Light) */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-full transition-all cursor-pointer shrink-0 ${
                isDarkMode
                  ? 'bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 shadow-xs'
              }`}
              title={t('Ubah Mode Layar (Gelap/Terang)')}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Jika di Admin: Tampilkan Notification Bell (Di Atas), Profile User & Logout */}
            {currentView === 'admin' ? (
              currentAdmin && (
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
                  {/* NOTIFICATION BELL WITH POPUP DROPDOWN (POSISI DI ATAS) */}
                  <div className="relative">
                    <button
                      id="navbar-notification-bell-btn"
                      type="button"
                      onClick={() => setIsAdminNotifOpen(!isAdminNotifOpen)}
                      className={`relative p-2 rounded-full transition-all cursor-pointer shadow-xs shrink-0 ${
                        isDarkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700'
                          : 'bg-slate-100 hover:bg-slate-200 text-emerald-700 border border-slate-300'
                      }`}
                      title="Pusat Notifikasi Operasional"
                    >
                      <Bell className={`w-4 h-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`} />
                      {adminUnreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-black text-white shadow-sm ring-2 ring-white dark:ring-slate-950">
                          {adminUnreadCount}
                        </span>
                      )}
                    </button>

                    {/* Tailored Notification Popup Modal/Dropdown */}
                    {isAdminNotifOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsAdminNotifOpen(false)} />
                        <div className="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-2xl bg-slate-900/95 backdrop-blur-2xl border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-200 text-left text-white">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                                <Bell className="w-4 h-4" />
                              </div>
                              <h4 className="text-xs font-black text-white">
                                Notifikasi Operasional
                              </h4>
                              {adminUnreadCount > 0 && (
                                <span className="text-[10px] font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                                  {adminUnreadCount} Baru
                                </span>
                              )}
                            </div>
                            {adminUnreadCount > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setAdminUnreadCount(0);
                                  triggerToast('Semua notifikasi telah ditandai sebagai dibaca.');
                                }}
                                className="text-[10px] font-bold text-emerald-400 hover:underline cursor-pointer flex items-center gap-1"
                              >
                                <CheckCheck className="w-3 h-3" /> Tandai Dibaca
                              </button>
                            )}
                          </div>

                          {/* Filter tabs */}
                          <div className="flex items-center gap-1 py-2.5 border-b border-slate-800 text-[10px] font-bold">
                            {(['all', 'donations', 'csr', 'system'] as const).map((f) => (
                              <button
                                key={f}
                                type="button"
                                onClick={() => setAdminNotifFilter(f)}
                                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer capitalize ${
                                  adminNotifFilter === f
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                              >
                                {f === 'all' ? 'Semua' : f === 'donations' ? 'Donasi' : f === 'csr' ? 'CSR' : 'Sistem'}
                              </button>
                            ))}
                          </div>

                          {/* List of dynamic operational events */}
                          <div className="py-2 space-y-1.5 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pr-1">
                            {(adminNotifFilter === 'all' || adminNotifFilter === 'donations') && (
                              <div 
                                onClick={() => {
                                  window.dispatchEvent(new CustomEvent('admin-switch-tab', { detail: { tab: 'donations' } }));
                                  setIsAdminNotifOpen(false);
                                }}
                                className="p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-emerald-500/30 group"
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 shrink-0 mt-0.5">
                                    <DollarSign className="w-4 h-4" />
                                  </div>
                                  <div className="grow">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[11px] font-black text-white group-hover:text-emerald-400 transition-colors">
                                        Donasi Terverifikasi Baru
                                      </h5>
                                      <span className="text-[9px] text-slate-400">Live DB</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                      Donasi masuk tercatat di basis data MySQL. Klik untuk audit ledger.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(adminNotifFilter === 'all' || adminNotifFilter === 'csr') && (
                              <div 
                                onClick={() => {
                                  window.dispatchEvent(new CustomEvent('admin-switch-tab', { detail: { tab: 'csr' } }));
                                  setIsAdminNotifOpen(false);
                                }}
                                className="p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-amber-500/30 group"
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className="p-2 rounded-xl bg-amber-950/80 text-amber-400 border border-amber-800/50 shrink-0 mt-0.5">
                                    <Briefcase className="w-4 h-4" />
                                  </div>
                                  <div className="grow">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[11px] font-black text-white group-hover:text-amber-400 transition-colors">
                                        Pipeline Kemitraan CSR & ESG
                                      </h5>
                                      <span className="text-[9px] text-slate-400">Proposal</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                      Inquiry kemitraan perusahaan BUMN & swasta tersimpan di database.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(adminNotifFilter === 'all' || adminNotifFilter === 'system') && (
                              <div 
                                onClick={() => {
                                  window.dispatchEvent(new CustomEvent('admin-switch-tab', { detail: { tab: 'settings' } }));
                                  setIsAdminNotifOpen(false);
                                }}
                                className="p-2.5 rounded-xl hover:bg-slate-800/80 transition-colors cursor-pointer border border-transparent hover:border-emerald-500/30 group"
                              >
                                <div className="flex items-start gap-2.5">
                                  <div className="p-2 rounded-xl bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 shrink-0 mt-0.5">
                                    <Database className="w-4 h-4" />
                                  </div>
                                  <div className="grow">
                                    <div className="flex items-center justify-between">
                                      <h5 className="text-[11px] font-black text-white group-hover:text-emerald-400 transition-colors">
                                        Database MySQL Aktif
                                      </h5>
                                      <span className="text-[9px] text-emerald-400 font-bold">Sinkron</span>
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                                      Semua data tersimpan permanen di database MySQL server.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="pt-2.5 mt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                            <button
                              type="button"
                              onClick={() => {
                                window.dispatchEvent(new CustomEvent('admin-switch-tab', { detail: { tab: 'reports' } }));
                                setIsAdminNotifOpen(false);
                              }}
                              className="font-bold text-emerald-400 hover:underline cursor-pointer"
                            >
                              Buka Laporan Akuntabilitas →
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAdminNotifOpen(false)}
                              className="font-bold text-slate-400 hover:text-white cursor-pointer"
                            >
                              Tutup
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Profile user info */}
                  <div className="flex items-center gap-2">
                    <img
                      src={currentAdmin.photoUrl}
                      alt={currentAdmin.name}
                      className="w-8 h-8 rounded-full border-2 border-emerald-500 object-cover shadow-xs"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
                      }}
                    />
                    <div className="hidden xl:block text-left">
                      <p className="text-xs font-black leading-tight text-slate-900 dark:text-white truncate max-w-[120px]">
                        {currentAdmin.name}
                      </p>
                      <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono font-bold leading-tight">
                        Super Admin
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleAdminLogout}
                    className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                    title="Keluar dari Admin Panel"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )
            ) : null}

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setIsMoreDropdownOpen(false);
                setIsLangDropdownOpen(false);
              }}
              className={`lg:hidden p-2 rounded-full transition-all cursor-pointer ${
                isHeroNavbar
                  ? 'bg-white/10 hover:bg-white/15 text-white border border-white/20'
                  : 'bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-4 h-4 text-red-500" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Dropdown Menu Panel (Detached from header flex row, positioned below top-bar) */}
        {isMobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 top-[60px] bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className={`lg:hidden absolute top-[60px] left-0 w-full z-50 max-h-[calc(100vh-60px)] overflow-y-auto shadow-2xl border-b transition-all duration-200 animate-in fade-in slide-in-from-top-2 p-4 sm:p-5 ${
              isDarkMode
                ? 'bg-[#0B132B]/98 text-white border-slate-800'
                : 'bg-white/98 text-slate-900 border-slate-200'
            }`}>
              {currentView === 'admin' ? (
                <div className="flex flex-col gap-3 py-1">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setSelectedCampaignSlug('');
                      setCurrentView('home');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-center py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs sm:text-sm font-black flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer active:scale-98"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Kembali ke Halaman Web Utama</span>
                  </button>
                  {currentAdmin && (
                    <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={currentAdmin.photoUrl}
                          alt=""
                          className="w-8 h-8 rounded-full border border-emerald-500 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150';
                          }}
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{currentAdmin.name}</p>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">{currentAdmin.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleAdminLogout();
                        }}
                        className="text-red-500 hover:text-red-600 text-xs font-bold px-2.5 py-1 bg-red-50 dark:bg-red-950/40 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <LogOut className="w-3 h-3" />
                        <span>Keluar</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {[
                    { id: 'home', key: 'navHome', label: 'Beranda', sectionId: 'hero-section' },
                    { id: 'masalah-solusi', key: 'navProblemSolution', label: 'Tantangan & Solusi', sectionId: 'section-masalah' },
                    { id: 'video-demo', key: 'navDemo', label: 'Demo Alat', sectionId: 'section-video-demo' },
                    { id: 'campaigns', key: 'navCampaigns', label: 'Program Sosial', sectionId: 'section-campaigns' },
                    { id: 'blog', key: 'navBlog', label: 'Edukasi & Berita', sectionId: 'section-blog' }
                  ].map(item => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          scrollToSection(item.id, item.sectionId);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs rounded-xl transition-all cursor-pointer ${
                          isActive
                            ? 'font-black text-emerald-400 bg-emerald-950/40 border border-emerald-500/30'
                            : 'font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        {langPack[item.key] || t(item.label)}
                      </button>
                    );
                  })}

                  {/* Collapsible/Grouped items of 'Lainnya' on mobile */}
                  <div className={`border-t my-1.5 pt-2 ${isHeroNavbar ? 'border-emerald-800/40' : 'border-gray-100 dark:border-gray-800'}`}>
                    <span className={`px-3 py-1 text-[10px] uppercase font-black tracking-wider block ${
                      isHeroNavbar ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {langPack.navMore || 'Lainnya'}
                    </span>
                    <div className="grid grid-cols-2 gap-1.5 mt-1">
                      {[
                        { id: 'zakat', key: 'navZakat', label: 'Zakat Digital', sectionId: 'section-zakat' },
                        { id: 'transparency', key: 'navTransparency', label: 'Transparansi', sectionId: 'section-transparency' },
                        { id: 'about', key: 'navAbout', label: 'Tentang Kami', sectionId: 'section-about' },
                        { id: 'csr', key: 'navCSR', label: 'CSR Solusi', sectionId: 'section-csr' },
                        { id: 'volunteer', key: 'navVolunteer', label: 'Relawan', sectionId: 'section-volunteer' },
                        { id: 'testimoni', key: 'navTestimoni', label: 'Testimoni', sectionId: 'section-testimoni' },
                        { id: 'faq', key: 'navFAQ', label: 'Pusat FAQ', sectionId: 'section-faq' },
                        { id: 'pricing', key: 'navPricing', label: 'Paket Kemitraan', sectionId: 'section-pricing' }
                      ].map(subItem => (
                        <button
                          key={subItem.id}
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            scrollToSection(subItem.id, subItem.sectionId);
                          }}
                          className={`text-left px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer ${
                            activeSection === subItem.id
                              ? 'text-emerald-400 font-extrabold bg-emerald-950/50 border border-emerald-500/25'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          {langPack[subItem.key] || t(subItem.label)}
                        </button>
                      ))}
                    </div>

                    <div className={`flex gap-2 pt-3 mt-2 border-t ${isHeroNavbar ? 'border-emerald-800/40' : 'border-gray-100 dark:border-gray-800'}`}>
                      <button
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          setIsFeedbackOpen(true);
                        }}
                        className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold ${
                          isHeroNavbar
                            ? 'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80'
                            : 'bg-slate-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {t('Beri Feedback')}
                      </button>
                      {currentAdmin && (
                        <button
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setCurrentView('admin');
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="flex-1 text-center py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                        >
                          <User className="w-3.5 h-3.5" />
                          <span>{currentAdmin.name || 'Dashboard'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </header>

      {/* Spacer to preserve document layout beneath the fixed 60px header */}
      <div className="h-[60px] w-full shrink-0 pointer-events-none" aria-hidden="true" />

      {/* 4. MAIN LOADING AND ERROR GRACEFUL PLACEMENTS */}
      <main className={`grow w-full ${
        currentView === 'admin'
          ? 'w-full p-0 max-w-none'
          : `w-full max-w-[1536px] mx-auto px-4 sm:px-6 md:px-8 ${currentView === 'home' ? 'pt-4 md:pt-6 pb-8' : 'py-8'}`
      }`}>
        {isLoading ? (
          <div id="loading-page-skeleton" className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
            <div>
              <h3 className="font-extrabold text-gray-900 dark:text-white">{t('Menghubungkan Digital Ledger Amanah...')}</h3>
              <p className="text-xs text-gray-400 mt-2">{t('Sedang sinkronisasi basis data, laporan dampak, & opini WTP real-time.')}</p>
            </div>
            
            {/* Skeletal placeholders cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl pt-8">
              {[1, 2, 3].map(skIdx => (
                <div key={skIdx} className="bg-white dark:bg-slate-800 border border-gray-200 p-6 rounded-2xl h-44 animate-pulse space-y-4">
                  <div className="w-11 h-11 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="w-1/2 h-2.5 bg-gray-100 dark:bg-slate-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        ) : errorText ? (
          <div id="error-alert-card" className="max-w-2xl mx-auto my-12 p-6 sm:p-8 bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-800/60 rounded-3xl text-center shadow-xl space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-9 h-9 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-black text-red-900 dark:text-red-200">
                Koneksi Basis Data Belum Terhubung
              </h3>
              <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-red-200 dark:border-red-900 text-left font-mono text-xs text-red-700 dark:text-red-300 break-words leading-relaxed">
                <span className="font-bold text-red-800 dark:text-red-200 block mb-1">Rincian Status Error:</span>
                {errorText}
              </div>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-xl text-left text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
              <strong className="block font-bold">Panduan Pemeriksaan:</strong>
              <ol className="list-decimal list-inside space-y-1 text-slate-700 dark:text-slate-300">
                <li>Pastikan konfigurasi kredensial MySQL di file <code className="font-bold text-emerald-600 dark:text-emerald-400">.env</code> backend sudah sesuai dengan database cPanel.</li>
                <li>Pastikan user MySQL telah memiliki izin hak akses penuh (ALL PRIVILEGES) ke database.</li>
                <li>Klik tombol <strong>"Hubungkan Ulang ke Database"</strong> di bawah untuk memuat ulang data.</li>
              </ol>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                id="btn-retry-db-connection"
                onClick={fetchAllData}
                className="w-full sm:w-auto px-6 py-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Hubungkan Ulang ke Database</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* VIEW MANAGER - ROUTING BRANCH ROUTER */}

            {/* Main Page and subpages rendering */}
            {['home', 'about', 'campaigns', 'transparency', 'csr', 'volunteer', 'blog'].includes(currentView) && (
              <PageViews
                currentView={currentView}
                campaigns={campaigns}
                donations={donations}
                donors={donors}
                blogs={blogs}
                testimonials={testimonials}
                faqs={faqs}
                reports={reports}
                currentLang={currentLang}
                langPack={langPack}
                onSelectCampaign={handleSelectCampaign}
                onOpenDonateModal={handleOpenDonate}
                onRefreshAll={fetchAllData}
                onNavigate={setCurrentView}
              />
            )}

            {/* Special standalone calculations page Zakat */}
            {currentView === 'zakat' && (
              <ZakatCalculator 
                onPayZakat={handlePayZakatTrigger} 
                langPack={langPack} 
                currentLang={currentLang}
              />
            )}

            {/* Special Standalone Backoffice and CRM Admin Panel with Authentication */}
            {currentView === 'admin' && (
              currentAdmin ? (
                <AdminPanel
                  currentAdmin={currentAdmin}
                  setCurrentAdmin={handleUpdateAdminProfile}
                  onLogout={handleAdminLogout}
                  campaigns={campaigns}
                  donations={donations}
                  donors={donors}
                  volunteers={volunteers}
                  csrInquiries={csrInquiries}
                  reports={reports}
                  blogs={blogs}
                  faqs={faqs}
                  testimonials={testimonials}
                  orgInfo={orgInfo}
                  onRefreshAll={fetchAllData}
                  langPack={langPack}
                  currentLang={currentLang}
                  onBackToWeb={() => {
                    setSelectedCampaignSlug('');
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              ) : (
                <AdminAuth
                  onLoginSuccess={handleAdminLoginSuccess}
                  langPack={langPack}
                  currentLang={currentLang}
                  onBackToWeb={() => {
                    setSelectedCampaignSlug('');
                    setCurrentView('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )
            )}

            {/* Special SToryteling detail page */}
            {currentView === 'campaign-detail' && activeCampaign && (
              <div id="campaign-detail-page" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                <div className="lg:col-span-8 space-y-6">
                  {/* Title and Hero banner of specific detail */}
                  <div className="space-y-3">
                    <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-black px-3 py-1 rounded uppercase tracking-wider inline-block">
                      {t(activeCampaign.category)}
                    </span>
                    <h2 className="text-xl md:text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-snug">
                      {t(activeCampaign.title)}
                    </h2>
                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {t('Kawasan')}: {t(activeCampaign.location)}
                    </p>
                  </div>

                  <div className="w-full h-80 rounded-3xl bg-slate-900 pointer-events-none select-none overflow-hidden relative border border-gray-200">
                    <img 
                      src={activeCampaign.thumbnailUrl || activeCampaign.imageUrl || 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1200'} 
                      alt={activeCampaign.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=1200';
                      }}
                      className="w-full h-full object-cover opacity-90"
                    />
                  </div>

                  {/* Story text */}
                  <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-slate-700 space-y-4 text-slate-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-serif">
                    <h4 className="font-sans font-bold text-gray-900 dark:text-white text-base">{t('Rincian Latar Belakang & Alokasi Penyaluran')}</h4>
                    {t(activeCampaign.story || activeCampaign.shortDescription)}
                  </div>

                  {/* Dynamic Milestone of aid update */}
                  <div id="campaign-milestone" className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-gray-900 rounded-2xl p-6 space-y-3">
                    <h4 className="font-extrabold text-gray-900 dark:text-white text-xs uppercase tracking-wider block">{t('Timeline Berita Acara & Update Lapangan')}</h4>
                    
                    <div className="relative border-l border-emerald-500 pl-4 ml-2.5 py-2.5">
                      <div className="relative">
                        <span className="absolute -left-[21px] top-0 bg-emerald-500 border border-emerald-100 rounded-full w-2.5 h-2.5"></span>
                        <div className="text-xs space-y-1">
                          <span className="font-extrabold text-emerald-800 dark:text-emerald-400 block font-mono">{t('20 Mei 2026 - Pengadaan Logistik Tahap 1')}</span>
                          <p className="text-gray-500 leading-normal">{t('Pembelian material sumur bor sedia tuntas dikerjakan oleh relawan kemitraan, siap disalurkan ke lokasi sasaran dhuafa murni.')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Side Action Box */}
                <div className="lg:col-span-4 bg-gradient-to-br from-white to-slate-50 dark:from-gray-800 dark:to-slate-900 border border-gray-200 dark:border-slate-700 rounded-3xl p-6 shadow-md hover:shadow-lg transition-shadow space-y-5">
                  <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest block">{t('Progress Terkumpul')}</span>
                    <strong className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight block mt-1">
                      {formatCurrency(activeCampaign.collectedAmount)}
                    </strong>
                    <span className="text-[11px] text-gray-400 block mt-1 leading-none">
                      {t('Dari Target')}: {formatCurrency(activeCampaign.targetAmount)}
                    </span>
                  </div>

                  {/* Meter bar */}
                  <div className="space-y-1">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (activeCampaign.collectedAmount / activeCampaign.targetAmount) * 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-[10px] text-gray-400 font-medium text-right">
                      {Math.min(100, Math.round((activeCampaign.collectedAmount / activeCampaign.targetAmount) * 100))}% {t('Tercapai')}
                    </div>
                  </div>

                  <div className="text-xs grid grid-cols-2 gap-3 pb-3 border-b border-gray-100 dark:border-gray-700 text-center font-medium">
                    <div className="bg-gray-100/50 dark:bg-gray-900 p-2.5 rounded-xl">
                      <span className="text-[10px] text-gray-400 block">{t('Penerima Manfaat')}</span>
                      <strong className="text-gray-800 dark:text-white mt-1 block">{activeCampaign.beneficiaryReached || 120} {t('Orang')}</strong>
                    </div>
                    <div className="bg-gray-100/50 dark:bg-gray-900 p-2.5 rounded-xl">
                      <span className="text-[10px] text-gray-400 block">{t('Hari Tersisa')}</span>
                      <strong className="text-gray-800 dark:text-white mt-1 block">45 {t('Hari lagi')}</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenDonate(activeCampaign.slug)}
                    id="btn-donate-detail-side"
                    className="w-full bg-emerald-650 hover:bg-emerald-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2 text-sm"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    {t('Bantu Program Ini Sekarang')}
                  </button>

                  <button
                    onClick={() => {
                      setCurrentView('campaigns');
                      setSelectedCampaignSlug('');
                    }}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-slate-700 dark:text-white font-extrabold py-3 px-4 rounded-xl text-xs transition-colors"
                  >
                    {t('Kembali ke Program Maslahat')}
                  </button>
                </div>

              </div>
            )}
          </>
        )}
      </main>

      {/* 5. FLOATING INTERACTIVE ACTION BUTTONS (Only on public views, hidden in Admin Panel) */}
      {currentView !== 'admin' && (
        <>
          {/* Floating Feedback Button (Bottom Left) */}
          <button
            type="button"
            onClick={() => setIsFeedbackOpen(true)}
            id="floating-feedback-btn"
            className="fixed bottom-4 sm:bottom-6 left-3 sm:left-6 z-40 bg-slate-900/90 hover:bg-slate-900 dark:bg-emerald-850 dark:hover:bg-emerald-750 border border-slate-700/80 p-2.5 sm:p-3.5 rounded-full text-white shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer group"
            title={t('Kirim Masukan & Evaluasi Tools')}
          >
            <MessageSquarePlus className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400 group-hover:rotate-12 transition-transform" />
            <span className="text-[11px] sm:text-xs font-black hidden md:inline-block pr-1">{t('Feedback')}</span>
          </button>

          {/* Floating WhatsApp Consultation Button (Bottom Right) */}
          <a
            href={`https://wa.me/${(orgInfo?.whatsapp || '628123456789').replace(/\D/g, '')}?text=${encodeURIComponent(t('Assalamualaikum Amanah Impact Foundation Amil, saya ingin berkonsultasi mengenai zakat/wakaf syariah...'))}`}
            target="_blank"
            rel="noopener noreferrer"
            id="floating-whatsapp-btn"
            className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 z-40 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 p-2.5 sm:p-3.5 rounded-full text-white shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-1.5 sm:gap-2"
            title={t('Konsultasi Syariah Amanah via WhatsApp')}
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
            <span className="text-[11px] sm:text-xs font-black hidden md:inline-block pr-1">{t('Tanya Syariah')}</span>
          </a>
        </>
      )}

      {/* 6. SYSTEM FOOTER (Only on public views, hidden in Admin Panel) */}
      {currentView !== 'admin' && (
        <footer id="system-footer" className="bg-slate-950 text-gray-400 text-xs py-12 px-4 md:px-8 mt-16 border-t border-slate-800 transition-colors">
          <div id="footer-container" className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* 1. Profil Yayasan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-500 rounded-lg text-white shadow-sm">
                  <Heart className="w-4 h-4 fill-white" />
                </div>
                <strong className="text-white font-serif tracking-tight text-base">
                  {orgInfo?.name || "Amanah Impact Foundation"}
                </strong>
              </div>
              <p className="leading-relaxed text-slate-300">
                {orgInfo?.tagline || t("Lembaga amil zakat, wakaf, dan kemanusiaan modern bersertifikasi resmi. Transparan berdampak, amanah menggerakkan kedaulatan umat.")}
              </p>
            </div>

            {/* 2. Informasi Kantor */}
            <div className="space-y-2">
              <strong className="text-white block uppercase tracking-wider text-[11px] font-bold">{t("Informasi Kantor")}</strong>
              <p className="text-slate-300 leading-relaxed">
                {orgInfo?.address || t("Gedung Menara Amanah Lantai 4, Jl. Kemakmuran No. 12 Jakarta Pusat, Indonesia")}
              </p>
              <p className="font-mono text-slate-300">
                <span>Email: </span>
                <a 
                  href={`mailto:${orgInfo?.email || 'info@amanahimpact.org'}`} 
                  className="text-emerald-400 hover:text-emerald-300 font-semibold hover:underline transition-colors"
                >
                  {orgInfo?.email || 'info@amanahimpact.org'}
                </a>
              </p>
              <p className="font-mono text-slate-300">
                <span>Telp: </span>
                <a 
                  href={`tel:${(orgInfo?.phone || '(021) 8888-1234').replace(/[^0-9+]/g, '')}`} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  {orgInfo?.phone || '(021) 8888-1234'}
                </a>
              </p>
            </div>

            {/* 3. Pilar Utama Program */}
            <div className="space-y-2 text-xs">
              <strong className="text-white block uppercase tracking-wider text-[11px] font-bold">{t("Pilar Utama Program")}</strong>
              <ul className="space-y-1.5 text-slate-300">
                <li><button onClick={() => { setCurrentView('zakat'); }} className="hover:text-emerald-400 transition-colors p-0 text-left cursor-pointer">{t("Zakat Maal & Profesi")}</button></li>
                <li><button onClick={() => { setCurrentView('campaigns'); }} className="hover:text-emerald-400 transition-colors p-0 text-left cursor-pointer">{t("Wakaf Produktif Abadi")}</button></li>
                <li><button onClick={() => { setCurrentView('campaigns'); }} className="hover:text-emerald-400 transition-colors p-0 text-left cursor-pointer">{t("Beasiswa Dhuafa & Yatim")}</button></li>
                <li><button onClick={() => { setCurrentView('campaigns'); }} className="hover:text-emerald-400 transition-colors p-0 text-left cursor-pointer">{t("Krisis Sanitasi Air Bersih")}</button></li>
              </ul>
            </div>

            {/* 4. Daftar Pemberitahuan */}
            <div className="space-y-3">
              <strong className="text-white block uppercase tracking-wider text-[11px] font-bold">{t("Daftar Pemberitahuan")}</strong>
              <p className="text-slate-300">{t("Dapatkan update mingguan berita acara berita lapangan terakreditasi.")}</p>
              <div className="flex gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                <input
                  type="email"
                  placeholder={t("Email Anda")}
                  className="bg-transparent text-[11px] p-1.5 outline-none grow text-white placeholder-slate-500"
                />
                <button
                  onClick={() => triggerToast(t('Terima kasih! Alamat email Anda telah terdaftar dalam newsletter Amanah.'), 'success', 'Berlangganan Newsletter')}
                  className="bg-emerald-600 hover:bg-emerald-500 font-extrabold text-[11px] px-4 py-1.5 text-white rounded-lg transition-colors cursor-pointer shadow-sm"
                >
                  {t("Ikut")}
                </button>
              </div>
            </div>

          </div>

          {/* Footer Bottom Bar */}
          <div className="max-w-7xl mx-auto border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between text-[11px] gap-4">
            <div className="text-slate-400 text-center md:text-left">
              &copy; {new Date().getFullYear()} {orgInfo?.name || "Yayasan Amanah Impact Foundation"}. Hak Cipta Dilindungi Undang-Undang. | Dibuat oleh{' '}
              <a
                href="https://contech.id"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline transition-colors inline-flex items-center gap-0.5"
              >
                Contech ID
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 font-medium">
              <button 
                onClick={() => handleOpenLegalModal('disclaimer')} 
                className="text-slate-400 hover:text-emerald-400 transition-colors p-0 cursor-pointer"
              >
                {t("Legalitas")}
              </button>
              <button 
                onClick={() => handleOpenLegalModal('disclaimer')} 
                className="text-slate-400 hover:text-emerald-400 transition-colors p-0 cursor-pointer"
              >
                {t("Keamanan")}
              </button>
              <button 
                onClick={() => handleOpenLegalModal('terms')} 
                className="text-slate-400 hover:text-emerald-400 transition-colors p-0 cursor-pointer"
              >
                {t("Ketentuan Layanan")}
              </button>
              
              {/* Tombol Admin Panel (Harus Login Super Admin) */}
              <button
                id="footer-btn-admin-panel"
                onClick={() => {
                  if (currentAdmin) {
                    setCurrentView('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else {
                    setIsAdminAuthModalOpen(true);
                  }
                }}
                className="flex items-center gap-1.5 font-bold bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-900 hover:from-emerald-900 hover:to-slate-800 text-emerald-400 hover:text-white px-3.5 py-1.5 rounded-xl border border-emerald-500/40 hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.25)] cursor-pointer transition-all active:scale-95 text-xs group"
                title="Admin Panel (Khusus Super Admin - Wajib Login)"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Admin Panel</span>
              </button>
            </div>
          </div>
        </footer>
      )}

      {/* 7. DIALOG PORTALS - DONATION MODAL ENGINE */}
      <DonationModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        campaigns={campaigns}
        preSelectedCampaignSlug={preSelectedSlug}
        preSelectedAmount={preSelectedAmt}
        preSelectedCategory=""
        onSuccess={(nat) => {
          triggerToast(`${t('Alhamdulillah! Donasi')} ${formatCurrency(nat.amount)} ${t('Diterima Kerja Semangat.')}`);
          fetchAllData(); // Live database refresh
        }}
        langPack={langPack}
        currentLang={currentLang}
      />

      {/* 8. FEEDBACK MODAL DIALOG */}
      <FeedbackModal
        isOpen={isFeedbackOpen}
        onClose={() => setIsFeedbackOpen(false)}
        currentLang={currentLang}
      />

      {/* 9. LEGAL DISCLAIMER & TERMS MODAL DIALOG */}
      <LegalModal
        isOpen={isLegalOpen}
        onClose={() => setIsLegalOpen(false)}
        defaultTab={legalDefaultTab}
        orgInfo={orgInfo}
      />

      {/* 10. ADMIN AUTH MODAL DIALOG (Terbuka saat tombol di bawah web diklik: login dulu agar tidak berpindah halaman secara mengejutkan) */}
      {isAdminAuthModalOpen && !currentAdmin && (
        <AdminAuth
          isModal={true}
          onClose={() => setIsAdminAuthModalOpen(false)}
          onLoginSuccess={(user) => {
            handleAdminLoginSuccess(user);
            setIsAdminAuthModalOpen(false);
            setCurrentView('admin');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          langPack={langPack}
          currentLang={currentLang}
        />
      )}

    </div>
  );
}
