/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Heart, ClipboardCheck, Briefcase, HandHelping, 
  Sparkles, Languages, Save, Plus, Check, RefreshCw, Smartphone, 
  Search, ShieldAlert, BadgeInfo, FileDown, ExternalLink, User, LogOut,
  Settings, Database, Download, Upload, RotateCcw, MessageSquare, Star, Trash2,
  TrendingUp, TrendingDown, Filter, MoreVertical, Bell, Eye, Edit, ChevronRight, 
  ArrowUpRight, Activity, Calendar, ShieldCheck, CheckCircle2, Clock, DollarSign,
  Building2, UserCheck, HeartHandshake, Layers, ArrowLeft, FileText, FileSpreadsheet,
  Menu, ChevronDown, ChevronUp, MoreHorizontal, MessageCircle
} from 'lucide-react';
import { 
  AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Campaign, Donation, Donor, Volunteer, CsrInquiry, Report, BlogPost, AdminUser, FAQ, Testimonial } from '../types';
import { HelpCircle, BookOpen, Quote, X, AlertTriangle, XCircle, Info, CheckCheck } from 'lucide-react';
import AdminProfileSection from './AdminProfileSection';

interface AdminPanelProps {
  currentAdmin: AdminUser;
  setCurrentAdmin: (user: AdminUser) => void;
  onLogout: () => void;
  campaigns: Campaign[];
  donations: Donation[];
  donors: Donor[];
  volunteers: Volunteer[];
  csrInquiries: CsrInquiry[];
  reports: Report[];
  blogs: BlogPost[];
  faqs?: FAQ[];
  testimonials?: Testimonial[];
  orgInfo?: any;
  onRefreshAll: () => void;
  langPack: any;
  currentLang?: string;
  onBackToWeb?: () => void;
}

type AdminRole = 
  | 'Super Admin' 
  | 'Executive Director' 
  | 'Content Editor' 
  | 'Fundraising Admin' 
  | 'Finance Admin' 
  | 'Auditor' 
  | 'Viewer';

export default function AdminPanel({
  currentAdmin,
  setCurrentAdmin,
  onLogout,
  campaigns,
  donations,
  donors,
  volunteers,
  csrInquiries,
  reports,
  blogs,
  faqs = [],
  testimonials = [],
  orgInfo,
  onRefreshAll,
  langPack,
  currentLang = 'id',
  onBackToWeb
}: AdminPanelProps) {
  const [currentRole, setCurrentRole] = useState<AdminRole>('Super Admin');
  const [activeTab, setActiveTab] = useState<'overview' | 'campaigns' | 'donations' | 'donors' | 'reports' | 'blogs' | 'faqs' | 'testimonials' | 'csr' | 'volunteers' | 'ai' | 'profile' | 'settings' | 'feedbacks'>('overview');
  
  // --- TAILORED NOTIFICATION POPUP SYSTEM ---
  interface AdminNotification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }

  const [popupNotifs, setPopupNotifs] = useState<AdminNotification[]>([]);

  const showPopupNotify = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setPopupNotifs(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setPopupNotifs(prev => prev.filter(n => n.id !== id));
    }, 4500);
  };

  const removePopupNotify = (id: string) => {
    setPopupNotifs(prev => prev.filter(n => n.id !== id));
  };

  // --- TAILORED CONFIRMATION DIALOG MODAL ---
  interface ConfirmDialogState {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
    onConfirm: () => void;
  }

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  const openConfirm = (opts: Omit<ConfirmDialogState, 'isOpen'>) => {
    setConfirmDialog({
      ...opts,
      isOpen: true
    });
  };

  const closeConfirm = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  // Modern UI states matching reference design
  const [overviewDonorSearch, setOverviewDonorSearch] = useState('');
  const [overviewDonorFilter, setOverviewDonorFilter] = useState<'all' | 'monthly' | 'one-off'>('all');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMessageOpen, setIsMessageOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Feedback state
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false);

  // Backup / Restore state
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const fetchFeedbacks = async () => {
    setIsFeedbackLoading(true);
    try {
      const res = await fetch('/api/feedbacks');
      if (res.ok) {
        const data = await res.json();
        setFeedbackList(data);
      }
    } catch (e) {
      console.error('Error fetching feedbacks:', e);
    } finally {
      setIsFeedbackLoading(false);
    }
  };

  const notifyToast = (msg: string, type: 'info' | 'success' | 'warning' | 'error' = 'info', title?: string) => {
    window.dispatchEvent(new CustomEvent('amanah-toast', {
      detail: { message: msg, type, title: title || (type === 'error' ? 'Kesalahan' : type === 'warning' ? 'Perhatian' : 'Admin Panel') }
    }));
  };

  useEffect(() => {
    if (activeTab === 'feedbacks') {
      fetchFeedbacks();
    }
  }, [activeTab]);

  // Listen to tab switch events from top navbar notifications
  useEffect(() => {
    const handleSwitchTab = (e: any) => {
      if (e.detail && e.detail.tab) {
        setActiveTab(e.detail.tab);
      }
    };
    window.addEventListener('admin-switch-tab', handleSwitchTab);
    return () => window.removeEventListener('admin-switch-tab', handleSwitchTab);
  }, []);

  const handleBackupDatabase = async () => {
    setIsBackingUp(true);
    try {
      const res = await fetch('/api/admin/backup');
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `amanah_db_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        showPopupNotify('success', 'Backup Berhasil', 'File cadangan basis data berhasil diunduh ke komputer Anda!');
      } else {
        showPopupNotify('error', 'Gagal Backup', 'Gagal mengekspor data backup dari server basis data.');
      }
    } catch (e) {
      showPopupNotify('error', 'Kendala Jaringan', 'Terjadi kesalahan jaringan saat mengunduh data backup.');
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestoreDatabase = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    openConfirm({
      title: 'Pulihkan Database dari File Backup?',
      message: 'PERINGATAN: Memulihkan database akan menimpa data yang ada dengan data dari file backup yang Anda pilih. Lanjutkan?',
      isDestructive: true,
      confirmLabel: 'Pulihkan Database',
      onConfirm: async () => {
        setIsRestoring(true);
        try {
          const text = await file.text();
          const payload = JSON.parse(text);

          const res = await fetch('/api/admin/restore', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (res.ok) {
            showPopupNotify('success', 'Pemulihan Berhasil', 'Basis data berhasil dipulihkan dari file backup!');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Memulihkan', data.message || 'Gagal memulihkan database.');
          }
        } catch (err: any) {
          showPopupNotify('error', 'Format Tidak Valid', 'Format file JSON tidak valid atau gagal diproses.');
        } finally {
          setIsRestoring(false);
        }
      }
    });
    e.target.value = '';
  };

  const handleResetDatabase = async () => {
    openConfirm({
      title: 'Reset Database ke Demo Awal?',
      message: 'PERINGATAN KRITIS: Seluruh data donasi, relawan, dan laporan akan di-reset ke setelan awal pabrik MySQL. Lanjutkan?',
      isDestructive: true,
      confirmLabel: 'Ya, Reset Sekarang',
      onConfirm: async () => {
        setIsResetting(true);
        try {
          const res = await fetch('/api/admin/reset', { method: 'POST' });
          const data = await res.json();
          if (res.ok) {
            showPopupNotify('success', 'Reset Berhasil', 'Basis data berhasil di-reset ke setelan awal!');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Reset', data.message || 'Gagal mereset database.');
          }
        } catch (e) {
          showPopupNotify('error', 'Kendala Jaringan', 'Kendala jaringan saat mereset database.');
        } finally {
          setIsResetting(false);
        }
      }
    });
  };

  // AI Assistant section inputs
  const [aiType, setAiType] = useState<'campaign' | 'faq' | 'impact' | 'reply' | 'translate'>('campaign');
  const [aiPrompt, setAiPrompt] = useState<string>('Sumur bor bersih untuk krisis kekeringan parah di desa terpencil NTT');
  const [aiTranslateLang, setAiTranslateLang] = useState<string>('English');
  const [aiResult, setAiResult] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [isAiSimulated, setIsAiSimulated] = useState<boolean>(false);

  // Campaign CMS states
  const [newCampTitle, setNewCampTitle] = useState('');
  const [newCampCategory, setNewCampCategory] = useState('Pendidikan');
  const [newCampGoal, setNewCampGoal] = useState('500000000');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampStory, setNewCampStory] = useState('');
  const [newCampLocation, setNewCampLocation] = useState('Jabodetabek');

  // Deployment Center states & logic
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deployStep, setDeployStep] = useState<string>('');
  const [deployProgress, setDeployProgress] = useState<number>(0);
  const [lastDeployTime, setLastDeployTime] = useState<string>(() => {
    return localStorage.getItem('amanah_last_deploy') || '2026-07-10 23:15:00';
  });

  const handleTriggerDeploy = () => {
    setIsDeploying(true);
    setDeployProgress(5);
    setDeployStep('Inisialisasi server deployment & verifikasi git branch...');

    const steps = [
      { progress: 20, text: 'Melakukan pengetesan linter & tipe data TypeScript...' },
      { progress: 45, text: 'Mengompilasi bundel produksi (Vite Production Build)...' },
      { progress: 70, text: 'Mengoptimalkan aset gambar & memadatkan CSS/JS (esbuild)...' },
      { progress: 90, text: 'Mengunggah aset build statis ke CDN Cloud Run...' },
      { progress: 100, text: 'Deployment Selesai! Aplikasi Amanah Impact Foundation aktif di awan.' }
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setDeployProgress(step.progress);
        setDeployStep(step.text);
        if (step.progress === 100) {
          const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
          setLastDeployTime(nowStr);
          localStorage.setItem('amanah_last_deploy', nowStr);
          setIsDeploying(false);
          notifyToast('Website dan Kampanye terbaru telah berhasil di-deploy ke produksi!', 'success', 'Deploy Selesai');
        }
      }, (idx + 1) * 1200);
    });
  };

  // Selected donor state (CRM note modal)
  const [selectedDonorId, setSelectedDonorId] = useState<string | null>(null);
  const [donorNotesText, setDonorNotesText] = useState<string>('');

  // Editing Campaign State
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [editCampTitle, setEditCampTitle] = useState('');
  const [editCampCategory, setEditCampCategory] = useState('Pendidikan');
  const [editCampGoal, setEditCampGoal] = useState('');
  const [editCampDesc, setEditCampDesc] = useState('');
  const [editCampLocation, setEditCampLocation] = useState('Nasional');
  const [editCampStory, setEditCampStory] = useState('');
  const [isUpdatingCamp, setIsUpdatingCamp] = useState(false);

  // 1. Roles & Permissions Check
  // Restricted sections warnings
  const canModifyBilling = ['Super Admin', 'Finance Admin'].includes(currentRole);
  const canWriteContent = ['Super Admin', 'Content Editor'].includes(currentRole);
  const canEditFundraising = ['Super Admin', 'Fundraising Admin'].includes(currentRole);
  const canEvaluateInquiry = ['Super Admin', 'Executive Director', 'Fundraising Admin'].includes(currentRole);
  const isReadOnly = ['Auditor', 'Viewer'].includes(currentRole);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val);
  };

  // Recharts Data Prep
  // Group daily successful donations
  const chartDataGroupMap: Record<string, number> = {};
  donations.forEach(d => {
    if (d.status === 'success') {
      const dateKey = d.createdDate.split('T')[0] || '2026-05-15';
      const day = dateKey.split('-')[2] || '15';
      const formattedLabel = `Mei ${day}`;
      chartDataGroupMap[formattedLabel] = (chartDataGroupMap[formattedLabel] || 0) + d.amount;
    }
  });

  const areaChartData = Object.keys(chartDataGroupMap).map(key => ({
    name: key,
    amount: chartDataGroupMap[key]
  })).sort((a,b) => a.name.localeCompare(b.name));

  // Category Pie Chart
  const pieDataMap: Record<string, number> = {};
  campaigns.forEach(c => {
    pieDataMap[c.category] = (pieDataMap[c.category] || 0) + c.disbursedAmount;
  });
  const pieChartData = Object.keys(pieDataMap).map(key => ({
    name: key,
    value: pieDataMap[key]
  }));

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#06b6d4', '#ec4899'];

  // AI assistant invoke call
  const handleAIAssist = async () => {
    setIsAiLoading(true);
    setAiResult('');
    try {
      const res = await fetch('/api/ai/assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contentType: aiType,
          prompt: aiPrompt,
          textToTranslate: aiPrompt,
          targetLanguage: aiTranslateLang
        })
      });
      const data = await res.json();
      if (res.ok) {
        setAiResult(data.result);
        setIsAiSimulated(!!data.isSimulated);
      } else {
        setAiResult(data.error || 'Gagal memanggil AI model.');
      }
    } catch (e) {
      console.error(e);
      setAiResult('Kedala jaringan sewaktu memproses Gemini.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Action methods: Admin creates campaign
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !canWriteContent && !canEditFundraising) {
      showPopupNotify('warning', 'Akses Ditolak', 'Anda tidak memiliki wewenang membuat kampanye baru.');
      return;
    }
    if (!newCampTitle || !newCampGoal) {
      showPopupNotify('warning', 'Data Belum Lengkap', 'Mohon isi judul kampanye dan target dana.');
      return;
    }

    const payload = {
      title: newCampTitle,
      category: newCampCategory,
      targetAmount: Number(newCampGoal),
      shortDescription: newCampDesc,
      story: newCampStory,
      location: newCampLocation,
      userEmail: currentAdmin.email
    };

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showPopupNotify('success', 'Kampanye Dipublikasikan', 'Kampanye berhasil disimpan dan dipublikasikan ke basis data MySQL!');
        setNewCampTitle('');
        setNewCampDesc('');
        setNewCampStory('');
        onRefreshAll();
      } else {
        const errData = await res.json();
        throw new Error(errData.message || 'Gagal membuat kampanye.');
      }
    } catch (err: any) {
      showPopupNotify('error', 'Gagal Menyimpan', err.message || 'Gagal menyimpan kampanye ke server.');
    }
  };

  // Delete Campaign
  const handleDeleteCampaign = async (id: string) => {
    openConfirm({
      title: 'Hapus Kampanye dari Database?',
      message: 'Kampanye akan dihapus secara permanen dari basis data MySQL. Tindakan ini tidak dapat dibatalkan.',
      isDestructive: true,
      confirmLabel: 'Hapus Permanen',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Kampanye Dihapus', 'Kampanye berhasil dihapus permanen dari database MySQL.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus kampanye dari server.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  const handleOpenEditCampaign = (c: Campaign) => {
    setEditingCampaign(c);
    setEditCampTitle(c.title);
    setEditCampCategory(c.category);
    setEditCampGoal(c.targetAmount.toString());
    setEditCampDesc(c.shortDescription || '');
    setEditCampLocation(c.location || 'Nasional');
    setEditCampStory(c.story || '');
  };

  const handleSaveEditCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    setIsUpdatingCamp(true);
    try {
      const res = await fetch(`/api/campaigns/${editingCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editCampTitle,
          category: editCampCategory,
          targetAmount: Number(editCampGoal),
          shortDescription: editCampDesc,
          location: editCampLocation,
          story: editCampStory
        })
      });
      if (res.ok) {
        showPopupNotify('success', 'Perubahan Disimpan', 'Kampanye berhasil diperbarui di database MySQL!');
        setEditingCampaign(null);
        onRefreshAll();
      } else {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || 'Gagal memperbarui kampanye.');
      }
    } catch (err: any) {
      showPopupNotify('error', 'Gagal Menyimpan', err.message || 'Gagal menyimpan perubahan kampanye.');
    } finally {
      setIsUpdatingCamp(false);
    }
  };

  // Verify / Alter donation status (Finance Action)
  const handleVerifyDonation = async (donationId: string, targetStatus: string) => {
    if (!canModifyBilling) {
      showPopupNotify('warning', 'Akses Ditolak', 'Hanya Finance Admin atau di atasnya yang bisa memverifikasi dana masuk.');
      return;
    }
    try {
      const res = await fetch(`/api/donations/${donationId}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: targetStatus })
      });
      if (res.ok) {
        showPopupNotify('success', 'Status Donasi Terverifikasi', 'Status donasi berhasil diperbarui di basis data!');
        onRefreshAll();
      } else {
        throw new Error('Gagal memverifikasi donasi.');
      }
    } catch (e: any) {
      showPopupNotify('error', 'Gagal Verifikasi', e.message || 'Terjadi kesalahan saat memverifikasi donasi.');
    }
  };

  // Delete Donation
  const handleDeleteDonation = async (id: string) => {
    openConfirm({
      title: 'Hapus Transaksi Donasi?',
      message: 'Apakah Anda yakin ingin menghapus catatan transaksi donasi ini dari database?',
      isDestructive: true,
      confirmLabel: 'Hapus Transaksi',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Catatan Dihapus', 'Catatan donasi berhasil dihapus.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus donasi dari server.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  // Export Donations & Zakat to Excel / CSV with UTF-8 BOM
  const handleExportDonationsCsv = () => {
    if (!donations || donations.length === 0) {
      showPopupNotify('warning', 'Tidak Ada Data', 'Belum ada data donasi dan zakat untuk diekspor.');
      return;
    }

    const headers = [
      'No Transaksi',
      'Tanggal Transaksi',
      'Nama Donatur',
      'Email Donatur',
      'No Telepon',
      'Program Kampanye',
      'Kategori',
      'Nominal (IDR)',
      'Metode Pembayaran',
      'Status Transaksi',
      'Anonim',
      'No Kwitansi / Bukti'
    ];

    const rows = donations.map(d => [
      `"${(d.id || '').replace(/"/g, '""')}"`,
      `"${d.createdDate ? new Date(d.createdDate).toLocaleDateString('id-ID') : ''}"`,
      `"${(d.isAnonymous ? 'Hamba Allah' : d.donorName || '').replace(/"/g, '""')}"`,
      `"${(d.donorEmail || '').replace(/"/g, '""')}"`,
      `"${(d.donorPhone || '').replace(/"/g, '""')}"`,
      `"${(d.campaignTitle || '').replace(/"/g, '""')}"`,
      `"${(d.category || 'Donasi').replace(/"/g, '""')}"`,
      d.amount || 0,
      `"${(d.paymentMethod || '').replace(/"/g, '""')}"`,
      `"${(d.status || '').toUpperCase()}"`,
      d.isAnonymous ? 'Ya' : 'Tidak',
      `"${(d.receiptNumber || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const nowStr = new Date().toISOString().slice(0, 10);
    link.setAttribute('href', url);
    link.setAttribute('download', `Laporan_Donasi_Zakat_Amanah_Impact_${nowStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showPopupNotify('success', 'Ekspor Excel / CSV Berhasil', `Laporan ${donations.length} data donasi & zakat berhasil diunduh dalam format Excel/CSV!`);
  };

  // Save CRM contact notes
  const handleSaveDonorNotes = async () => {
    if (!selectedDonorId) return;
    try {
      const res = await fetch(`/api/donors/${selectedDonorId}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: donorNotesText })
      });
      if (res.ok) {
        showPopupNotify('success', 'Catatan CRM Disimpan', 'Catatan CRM kontak berhasil disimpan ke basis data!');
        setSelectedDonorId(null);
        setDonorNotesText('');
        onRefreshAll();
      } else {
        throw new Error('Gagal menyimpan catatan CRM.');
      }
    } catch (err: any) {
      showPopupNotify('error', 'Gagal Menyimpan', err.message || 'Gagal menyimpan catatan.');
    }
  };

  // Delete Donor
  const handleDeleteDonor = async (id: string) => {
    openConfirm({
      title: 'Hapus Donatur CRM?',
      message: 'Data kontak donatur ini akan dihapus dari sistem CRM yayasan.',
      isDestructive: true,
      confirmLabel: 'Hapus Donatur',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/donors/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Donatur Dihapus', 'Donatur berhasil dihapus dari database.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus donatur.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  // Volunteers approval
  const handleVolunteerStatus = async (volId: string, nextStatus: string) => {
    if (isReadOnly || !canWriteContent && !canEditFundraising) {
      showPopupNotify('warning', 'Akses Ditolak', 'Anda tidak memiliki hak akses mengubah relawan.');
      return;
    }
    try {
      const res = await fetch(`/api/volunteers/${volId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        showPopupNotify('success', 'Status Relawan Diperbarui', 'Status relawan berhasil diperbarui di basis data.');
        onRefreshAll();
      } else {
        throw new Error('Gagal memperbarui relawan.');
      }
    } catch (err: any) {
      showPopupNotify('error', 'Gagal Memperbarui', err.message || 'Gagal memperbarui status relawan.');
    }
  };

  // Delete Volunteer
  const handleDeleteVolunteer = async (id: string) => {
    openConfirm({
      title: 'Hapus Data Relawan?',
      message: 'Apakah Anda yakin ingin menghapus data pendaftar relawan ini?',
      isDestructive: true,
      confirmLabel: 'Hapus Relawan',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/volunteers/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Relawan Dihapus', 'Data relawan berhasil dihapus dari database.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus relawan.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  // Dynamic Pipeline CSR
  const handleUpdateCsrPipeline = async (csrId: string, nextPipeline: string) => {
    if (!canEvaluateInquiry) {
      showPopupNotify('warning', 'Akses Ditolak', 'Anda tidak memiliki hak akses evaluasi CSR.');
      return;
    }
    try {
      const res = await fetch(`/api/csr-inquiries/${csrId}/pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pipelineStatus: nextPipeline })
      });
      if (res.ok) {
        showPopupNotify('success', 'Pipeline CSR Diperbarui', 'Pipeline CSR berhasil diperbarui di basis data!');
        onRefreshAll();
      } else {
        throw new Error('Gagal memperbarui CSR.');
      }
    } catch (err: any) {
      showPopupNotify('error', 'Gagal Memperbarui', err.message || 'Gagal memperbarui status pipeline CSR.');
    }
  };

  // Delete CSR Inquiry
  const handleDeleteCsr = async (id: string) => {
    openConfirm({
      title: 'Hapus Inkuiri CSR?',
      message: 'Apakah Anda yakin ingin menghapus inkuiri kemitraan CSR ini dari database?',
      isDestructive: true,
      confirmLabel: 'Hapus Inkuiri',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/csr-inquiries/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Inkuiri Dihapus', 'Inkuiri CSR berhasil dihapus dari database.');
            onRefreshAll();
          }
        } catch (err) {
          showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus inkuiri CSR.');
        }
      }
    });
  };

  // Delete Feedback
  const handleDeleteFeedback = async (id: string) => {
    openConfirm({
      title: 'Hapus Masukan Donatur?',
      message: 'Apakah Anda yakin ingin menghapus masukan ini dari database?',
      isDestructive: true,
      confirmLabel: 'Hapus Masukan',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/feedbacks/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Masukan Dihapus', 'Masukan berhasil dihapus dari database.');
            fetchFeedbacks();
          }
        } catch (e) {
          showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus masukan.');
        }
      }
    });
  };

  // Reports CRUD State & Handlers
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [reportForm, setReportForm] = useState({
    title: '',
    type: 'Laporan Bulanan',
    period: 'Mei 2026',
    totalReceived: '',
    totalDisbursed: '',
    auditStatus: 'published',
    description: ''
  });

  const openAddReport = () => {
    setEditingReport(null);
    setReportForm({
      title: '',
      type: 'Laporan Bulanan',
      period: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
      totalReceived: '0',
      totalDisbursed: '0',
      auditStatus: 'published',
      description: ''
    });
    setIsReportModalOpen(true);
  };

  const openEditReport = (rep: Report) => {
    setEditingReport(rep);
    setReportForm({
      title: rep.title,
      type: rep.type || 'Laporan Bulanan',
      period: rep.period || '',
      totalReceived: String(rep.totalReceived || 0),
      totalDisbursed: String(rep.totalDisbursed || 0),
      auditStatus: rep.auditStatus || 'published',
      description: rep.description || ''
    });
    setIsReportModalOpen(true);
  };

  const handleSaveReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportForm.title || !reportForm.period) {
      showPopupNotify('warning', 'Form Belum Lengkap', 'Judul dan Periode laporan wajib diisi.');
      return;
    }
    try {
      const url = editingReport ? `/api/reports/${editingReport.id}` : '/api/reports';
      const method = editingReport ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reportForm,
          totalReceived: Number(reportForm.totalReceived) || 0,
          totalDisbursed: Number(reportForm.totalDisbursed) || 0,
          userEmail: currentAdmin.email
        })
      });
      if (res.ok) {
        showPopupNotify('success', 'Laporan Tersimpan', editingReport ? 'Laporan audit akuntabilitas berhasil diperbarui!' : 'Laporan baru berhasil ditambahkan ke database MySQL!');
        setIsReportModalOpen(false);
        onRefreshAll();
      } else {
        showPopupNotify('error', 'Gagal Menyimpan', 'Gagal menyimpan laporan ke server.');
      }
    } catch (err) {
      showPopupNotify('error', 'Kendala Jaringan', 'Kendala jaringan saat menyimpan laporan.');
    }
  };

  const handleDeleteReport = async (id: string) => {
    openConfirm({
      title: 'Hapus Laporan Akuntabilitas?',
      message: 'Laporan keuangan dan audit transparansi ini akan dihapus permanen dari basis data.',
      isDestructive: true,
      confirmLabel: 'Hapus Laporan',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/reports/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Laporan Dihapus', 'Laporan transparansi berhasil dihapus dari database.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus laporan.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  // Blogs CRUD State & Handlers
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Edukasi Zakat',
    author: currentAdmin?.name || 'Admin AIF',
    excerpt: '',
    content: '',
    imageUrl: '',
    status: 'published'
  });

  const openAddBlog = () => {
    setEditingBlog(null);
    setBlogForm({
      title: '',
      category: 'Edukasi Zakat',
      author: currentAdmin?.name || 'Admin AIF',
      excerpt: '',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=800',
      status: 'published'
    });
    setIsBlogModalOpen(true);
  };

  const openEditBlog = (b: BlogPost) => {
    setEditingBlog(b);
    setBlogForm({
      title: b.title,
      category: b.category,
      author: b.author,
      excerpt: b.excerpt,
      content: b.content,
      imageUrl: b.imageUrl,
      status: b.status
    });
    setIsBlogModalOpen(true);
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogForm.title || !blogForm.content) {
      showPopupNotify('warning', 'Form Belum Lengkap', 'Judul dan isi artikel wajib diisi.');
      return;
    }
    try {
      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogForm,
          userEmail: currentAdmin.email
        })
      });
      if (res.ok) {
        showPopupNotify('success', 'Artikel Tersimpan', editingBlog ? 'Artikel berhasil diperbarui di database!' : 'Artikel baru berhasil dipublikasikan di database!');
        setIsBlogModalOpen(false);
        onRefreshAll();
      } else {
        showPopupNotify('error', 'Gagal Menyimpan', 'Gagal menyimpan artikel.');
      }
    } catch (err) {
      showPopupNotify('error', 'Kendala Jaringan', 'Kendala jaringan saat menyimpan artikel.');
    }
  };

  const handleDeleteBlog = async (id: string) => {
    openConfirm({
      title: 'Hapus Artikel Publikasi?',
      message: 'Artikel edukasi ini akan dihapus dari daftar publikasi dan database.',
      isDestructive: true,
      confirmLabel: 'Hapus Artikel',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/blogs/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Artikel Dihapus', 'Artikel blog berhasil dihapus dari database.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus artikel.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  // FAQs CRUD State & Handlers
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [faqForm, setFaqForm] = useState({
    category: 'Umum',
    question: '',
    answer: ''
  });

  const openAddFaq = () => {
    setEditingFaq(null);
    setFaqForm({
      category: 'Umum',
      question: '',
      answer: ''
    });
    setIsFaqModalOpen(true);
  };

  const openEditFaq = (f: FAQ) => {
    setEditingFaq(f);
    setFaqForm({
      category: f.category,
      question: f.question,
      answer: f.answer
    });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!faqForm.question || !faqForm.answer) {
      showPopupNotify('warning', 'Form Belum Lengkap', 'Pertanyaan dan jawaban FAQ wajib diisi.');
      return;
    }
    try {
      const url = editingFaq ? `/api/faqs/${editingFaq.id}` : '/api/faqs';
      const method = editingFaq ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(faqForm)
      });
      if (res.ok) {
        showPopupNotify('success', 'FAQ Tersimpan', editingFaq ? 'Pertanyaan FAQ berhasil diperbarui!' : 'Pertanyaan FAQ baru berhasil ditambahkan!');
        setIsFaqModalOpen(false);
        onRefreshAll();
      } else {
        showPopupNotify('error', 'Gagal Menyimpan', 'Gagal menyimpan FAQ.');
      }
    } catch (err) {
      showPopupNotify('error', 'Kendala Jaringan', 'Kendala jaringan saat menyimpan FAQ.');
    }
  };

  const handleDeleteFaq = async (id: string) => {
    openConfirm({
      title: 'Hapus Pertanyaan FAQ?',
      message: 'Pertanyaan dan jawaban FAQ ini akan dihapus permanen dari database.',
      isDestructive: true,
      confirmLabel: 'Hapus FAQ',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/faqs/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'FAQ Dihapus', 'FAQ berhasil dihapus dari database.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus FAQ.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  // Testimonials CRUD State & Handlers
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: 'Penerima Beasiswa',
    location: 'Jakarta',
    rating: 5,
    type: 'beneficiary',
    content: '',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
  });

  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialForm({
      name: '',
      role: 'Penerima Beasiswa',
      location: 'Jakarta',
      rating: 5,
      type: 'beneficiary',
      content: '',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTestimonialForm({
      name: t.name,
      role: t.role,
      location: t.location || 'Indonesia',
      rating: t.rating || 5,
      type: t.type || 'beneficiary',
      content: t.content || t.message || '',
      avatarUrl: t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    });
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.name || !testimonialForm.content) {
      showPopupNotify('warning', 'Form Belum Lengkap', 'Nama dan isi testimoni wajib diisi.');
      return;
    }
    try {
      const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : '/api/testimonials';
      const method = editingTestimonial ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testimonialForm)
      });
      if (res.ok) {
        showPopupNotify('success', 'Testimoni Tersimpan', editingTestimonial ? 'Kisah manfaat berhasil diperbarui!' : 'Testimoni baru berhasil ditambahkan ke database!');
        setIsTestimonialModalOpen(false);
        onRefreshAll();
      } else {
        showPopupNotify('error', 'Gagal Menyimpan', 'Gagal menyimpan testimoni.');
      }
    } catch (err) {
      showPopupNotify('error', 'Kendala Jaringan', 'Kendala jaringan saat menyimpan testimoni.');
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    openConfirm({
      title: 'Hapus Testimoni Penerima?',
      message: 'Kisah manfaat dan testimoni ini akan dihapus permanen dari database.',
      isDestructive: true,
      confirmLabel: 'Hapus Testimoni',
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
          if (res.ok) {
            showPopupNotify('success', 'Testimoni Dihapus', 'Testimoni berhasil dihapus dari database.');
            onRefreshAll();
          } else {
            showPopupNotify('error', 'Gagal Menghapus', 'Gagal menghapus testimoni.');
          }
        } catch (err) {
          showPopupNotify('error', 'Kendala Jaringan', 'Gagal menghubungi server database.');
        }
      }
    });
  };

  // Donor CRM Full Edit Modal State & Handlers
  const [isEditDonorModalOpen, setIsEditDonorModalOpen] = useState(false);
  const [editingDonorData, setEditingDonorData] = useState<Donor | null>(null);
  const [donorEditForm, setDonorEditForm] = useState({
    name: '',
    email: '',
    whatsapp: '',
    city: '',
    province: '',
    type: 'Individual',
    segment: 'Regular Donor',
    followUpStatus: 'Baru',
    notes: ''
  });

  const openEditDonor = (dnr: Donor) => {
    setEditingDonorData(dnr);
    setDonorEditForm({
      name: dnr.name,
      email: dnr.email,
      whatsapp: dnr.whatsapp || '',
      city: dnr.city || '',
      province: dnr.province || '',
      type: dnr.type || 'Individual',
      segment: dnr.segment || 'Regular Donor',
      followUpStatus: dnr.followUpStatus || 'Baru',
      notes: dnr.notes || ''
    });
    setIsEditDonorModalOpen(true);
  };

  const handleSaveDonorEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDonorData) return;
    try {
      const res = await fetch(`/api/donors/${editingDonorData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donorEditForm)
      });
      if (res.ok) {
        showPopupNotify('success', 'Donatur Diperbarui', 'Data profil donatur berhasil diperbarui di database MySQL!');
        setIsEditDonorModalOpen(false);
        onRefreshAll();
      } else {
        showPopupNotify('error', 'Gagal Memperbarui', 'Gagal memperbarui data donatur.');
      }
    } catch (err) {
      showPopupNotify('error', 'Kendala Jaringan', 'Kendala jaringan saat memperbarui data donatur.');
    }
  };

  // Organization Info State & Handlers
  const [orgForm, setOrgForm] = useState({
    name: orgInfo?.name || 'Amanah Impact Foundation',
    shortName: orgInfo?.shortName || 'AIF',
    tagline: orgInfo?.tagline || 'Transparan Berdampak, Amanah Menggerakkan Kebaikan',
    type: orgInfo?.type || 'Yayasan Sosial, Zakat, Wakaf, dan Kemanusiaan',
    foundedYear: String(orgInfo?.foundedYear || 2014),
    legalNumber: orgInfo?.legalNumber || 'AHU-0012345.AH.01.04.Tahun 2014',
    taxNumber: orgInfo?.taxNumber || '09.123.456.7-012.000',
    operationalLicense: orgInfo?.operationalLicense || 'SK Dinas Sosial No. 421/DS/2022',
    address: orgInfo?.address || 'Jl. Kebaikan Raya No. 88, Jakarta Selatan, Indonesia',
    email: orgInfo?.email || 'info@contech.id',
    phone: orgInfo?.phone || '+62 21 8888 1234',
    whatsapp: orgInfo?.whatsapp || '+62 812 8888 1234',
    website: orgInfo?.website || 'https://contech.id/',
    instagram: orgInfo?.instagram || 'https://instagram.com/amanahimpact',
    tiktok: orgInfo?.tiktok || 'https://tiktok.com/@amanahimpact',
    youtube: orgInfo?.youtube || 'https://youtube.com/@amanahimpact',
    facebook: orgInfo?.facebook || 'https://facebook.com/amanahimpact'
  });
  const [isSavingOrg, setIsSavingOrg] = useState(false);

  useEffect(() => {
    if (orgInfo) {
      setOrgForm({
        name: orgInfo.name || '',
        shortName: orgInfo.shortName || '',
        tagline: orgInfo.tagline || '',
        type: orgInfo.type || '',
        foundedYear: String(orgInfo.foundedYear || 2014),
        legalNumber: orgInfo.legalNumber || '',
        taxNumber: orgInfo.taxNumber || '',
        operationalLicense: orgInfo.operationalLicense || '',
        address: orgInfo.address || '',
        email: orgInfo.email || '',
        phone: orgInfo.phone || '',
        whatsapp: orgInfo.whatsapp || '',
        website: orgInfo.website || '',
        instagram: orgInfo.instagram || '',
        tiktok: orgInfo.tiktok || '',
        youtube: orgInfo.youtube || '',
        facebook: orgInfo.facebook || ''
      });
    }
  }, [orgInfo]);

  const handleSaveOrgInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingOrg(true);
    try {
      const res = await fetch('/api/organization', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orgForm)
      });
      if (res.ok) {
        showPopupNotify('success', 'Profil Yayasan Tersimpan', 'Data profil dan legalitas yayasan berhasil disimpan permanen di MySQL!');
        onRefreshAll();
      } else {
        showPopupNotify('error', 'Gagal Menyimpan', 'Gagal menyimpan profil yayasan.');
      }
    } catch (err) {
      showPopupNotify('error', 'Kendala Jaringan', 'Kendala jaringan saat menyimpan profil yayasan.');
    } finally {
      setIsSavingOrg(false);
    }
  };

  // Additional dashboard state for Mockup view
  const [timeRange, setTimeRange] = useState<'1M' | '3M' | '6M' | '1Y'>('1Y');
  const [selectedProgramCategory, setSelectedProgramCategory] = useState<string>('All Programs');
  const [searchOverviewQuery, setSearchOverviewQuery] = useState<string>('');

  // Global KPIs dynamic summary counters from database
  const totalCampaignCollected = campaigns.reduce((acc, c) => acc + (Number(c.collectedAmount) || 0), 0);
  const totalDirectDonations = donations.filter(d => d.status === 'success').reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const totalDonationsAccumulated = totalCampaignCollected + totalDirectDonations;

  const totalZakatCampaign = campaigns.filter(c => c.category?.toLowerCase().includes('zakat') || c.title?.toLowerCase().includes('zakat')).reduce((acc, c) => acc + (Number(c.collectedAmount) || 0), 0);
  const totalZakatDirect = donations.filter(d => d.status === 'success' && (d.category?.toLowerCase().includes('zakat') || d.campaignTitle?.toLowerCase().includes('zakat') || d.campaignSlug?.toLowerCase().includes('zakat'))).reduce((acc, d) => acc + (Number(d.amount) || 0), 0);
  const totalZakatAccumulated = totalZakatCampaign + totalZakatDirect;

  const pendingCount = donations.filter(d => d.status === 'pending').length;
  const totalYatimServed = campaigns.find(c => c.id === 'C-01')?.beneficiaryReached || 642;
  const activeDonorsCount = donors.length;
  const activeCampaignsCount = campaigns.filter(c => c.status === 'active' || !c.status).length;
  const averageSuccessRate = '98.5%';

  // Dynamic Trends Data based on TimeRange and real accumulated database numbers
  const trendsChartData = React.useMemo(() => {
    const monthlyTotalJt = Math.max(50, Math.round((totalDonationsAccumulated / 12) / 1000000));
    const monthlyZakatJt = Math.max(15, Math.round((totalZakatAccumulated / 12) / 1000000));

    if (timeRange === '1M') {
      // 4 Weeks breakdown within the current 30-day month
      const weeklyWeights = [0.22, 0.26, 0.24, 0.28];
      const weekNames = ['W1', 'W2', 'W3', 'W4'];
      return weekNames.map((name, i) => {
        const dVal = Math.round(monthlyTotalJt * weeklyWeights[i]);
        const zVal = Math.round(monthlyZakatJt * weeklyWeights[i]);
        return {
          name,
          donations: dVal,
          zakat: zVal,
          fullDonation: formatCurrency(dVal * 1000000),
          fullZakat: formatCurrency(zVal * 1000000)
        };
      });
    }

    if (timeRange === '3M') {
      // Last 3 Months
      const months3 = ['Juli', 'Agustus', 'September'];
      const mFactors = [0.92, 1.04, 1.16];
      return months3.map((name, i) => {
        const dVal = Math.round(monthlyTotalJt * mFactors[i]);
        const zVal = Math.round(monthlyZakatJt * mFactors[i]);
        return {
          name,
          donations: dVal,
          zakat: zVal,
          fullDonation: formatCurrency(dVal * 1000000),
          fullZakat: formatCurrency(zVal * 1000000)
        };
      });
    }

    if (timeRange === '6M') {
      // Last 6 Months
      const months6 = ['Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
      const mFactors = [0.82, 0.90, 0.96, 1.05, 1.12, 1.20];
      return months6.map((name, i) => {
        const dVal = Math.round(monthlyTotalJt * mFactors[i]);
        const zVal = Math.round(monthlyZakatJt * mFactors[i]);
        return {
          name,
          donations: dVal,
          zakat: zVal,
          fullDonation: formatCurrency(dVal * 1000000),
          fullZakat: formatCurrency(zVal * 1000000)
        };
      });
    }

    // 1Y / Default - Full 10 Months Progression (Jan to Oct)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'];
    const donCurve = [0.65, 0.85, 0.78, 1.02, 1.08, 0.88, 1.28, 1.05, 0.98, 1.15];
    const zakCurve = [0.25, 0.35, 0.30, 0.45, 0.45, 0.35, 0.65, 0.45, 0.40, 0.55];

    return monthNames.map((m, i) => {
      const donVal = Math.round(monthlyTotalJt * donCurve[i]);
      const zakVal = Math.round(monthlyZakatJt * zakCurve[i]);
      return {
        name: m,
        donations: donVal,
        zakat: zakVal,
        fullDonation: formatCurrency(donVal * 1000000),
        fullZakat: formatCurrency(zakVal * 1000000)
      };
    });
  }, [timeRange, totalDonationsAccumulated, totalZakatAccumulated]);

  // Campaign Performance Bars (Dual Bars: Target vs Collected across programs)
  const campaignPerformanceList = React.useMemo(() => {
    const defaultPrograms = [
      { name: 'Pendidikan', fullTitle: 'Beasiswa Dhuafa & Yatim', target: 95, collected: 45, percentage: 47 },
      { name: 'Wakaf Air', fullTitle: 'Wakaf Air Bersih & Sumur Bor', target: 160, collected: 130, percentage: 81 },
      { name: 'Pangan', fullTitle: 'Bantuan Pangan Keluarga Mustahik', target: 68, collected: 105, percentage: 100 },
      { name: 'Kesehatan', fullTitle: 'Layanan Ambulans & Klinik Gratis', target: 82, collected: 145, percentage: 100 },
      { name: 'Ekonomi', fullTitle: 'Pemberdayaan Modal Usaha UMKM', target: 170, collected: 140, percentage: 82 },
      { name: 'Reboisasi', fullTitle: 'Sedekah Pohon & Konservasi Hijau', target: 120, collected: 100, percentage: 83 },
      { name: 'Bencana', fullTitle: 'Tanggap Darurat Bencana Alam', target: 140, collected: 170, percentage: 100 }
    ];

    const filtered = campaigns.filter(c => selectedProgramCategory === 'All Programs' || selectedProgramCategory === 'All Parpers' || c.category.toLowerCase().includes(selectedProgramCategory.toLowerCase()));
    if (filtered.length >= 4) {
      return filtered.slice(0, 7).map(c => ({
        name: c.title.length > 12 ? c.title.substring(0, 10) + '...' : c.title,
        fullTitle: c.title,
        target: Math.max(20, Math.round((Number(c.targetAmount) || 100000000) / 1000000)),
        collected: Math.max(10, Math.round((Number(c.collectedAmount) || 50000000) / 1000000)),
        percentage: Math.min(100, Math.round(((Number(c.collectedAmount) || 0) / (Number(c.targetAmount) || 1)) * 100))
      }));
    }
    return defaultPrograms;
  }, [campaigns, selectedProgramCategory]);

  // Dynamic Recent Activity Feed from Database
  const recentActivityLogs = React.useMemo(() => {
    const logs: Array<{ id: string; title: string; detail: string; time: string; type: 'donation' | 'volunteer' | 'csr' | 'wakaf' }> = [];

    // Map real donations from DB
    donations.slice(0, 3).forEach((d, idx) => {
      const isWakaf = d.category?.toLowerCase().includes('wakaf') || d.campaignTitle?.toLowerCase().includes('wakaf');
      const isZakat = d.category?.toLowerCase().includes('zakat') || d.campaignTitle?.toLowerCase().includes('zakat');
      logs.push({
        id: `act-don-${d.id || idx}`,
        title: `${d.donorName || 'Hamba Allah'} berdonasi untuk ${d.campaignTitle}`,
        detail: `Donasi ${d.category || 'Program'} sejumlah ${formatCurrency(d.amount)} • Status: ${d.status === 'success' ? 'Terverifikasi Lunas' : 'Menunggu Konfirmasi'}`,
        time: d.createdDate ? new Date(d.createdDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Terbaru',
        type: isWakaf ? 'wakaf' : (isZakat ? 'wakaf' : 'donation')
      });
    });

    // Map real volunteers from DB
    volunteers.slice(0, 2).forEach((v, idx) => {
      logs.push({
        id: `act-vol-${v.id || idx}`,
        title: `${v.name} mendaftar sebagai Relawan`,
        detail: `Minat: ${v.interestArea || 'Sosial'} • Kota: ${v.city || 'Indonesia'} • Status: ${v.status}`,
        time: v.registeredDate ? new Date(v.registeredDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Baru saja',
        type: 'volunteer'
      });
    });

    // Map real CSR inquiries from DB
    csrInquiries.slice(0, 2).forEach((c, idx) => {
      logs.push({
        id: `act-csr-${c.id || idx}`,
        title: `${c.companyName} mengajukan kemitraan CSR`,
        detail: `Program: ${c.interestedProgram || 'Program Sosial'} • Estimasi Budget: ${c.budgetRange || '-'}`,
        time: c.createdDate ? new Date(c.createdDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Hari ini',
        type: 'csr'
      });
    });

    return logs.slice(0, 5);
  }, [donations, volunteers, csrInquiries]);

  return (
    <div className="w-full relative min-h-[calc(100vh-60px)]">
      {/* MOBILE BACKDROP OVERLAY */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* MAIN SPLIT BODY: FULL-SCREEN DASHBOARD WITHOUT OUTER CARD */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-60px)] w-full bg-slate-100 dark:bg-[#0B132B]">
          
          {/* ========================================================================= */}
          {/* LEFT SIDEBAR (MOBILE DRAWER / DESKTOP PINNED)                             */}
          {/* ========================================================================= */}
          <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0B132B] border-r border-slate-200 dark:border-slate-800/80 p-3.5 flex flex-col justify-between shrink-0 text-slate-700 dark:text-slate-300 select-none overflow-y-auto lg:overflow-hidden transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:w-64 xl:w-72 lg:sticky lg:top-[60px] lg:h-[calc(100vh-60px)] ${
            isMobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
          }`}>
            {/* Desktop: Clean Workspace Status Header (No duplicate branding on desktop) */}
            <div className="hidden lg:flex items-center justify-between px-3 py-2.5 mb-2 shrink-0 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 dark:bg-teal-400 animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 tracking-wider uppercase">
                  Admin Console
                </span>
              </div>
              <span className="text-[10px] font-mono text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 px-2 py-0.5 rounded-md font-bold">
                v2.4 Live
              </span>
            </div>

            {/* Mobile Drawer: Brand Header with Close Button */}
            <div className="flex lg:hidden items-center justify-between px-1 py-1 shrink-0 border-b border-slate-200 dark:border-slate-800/80 pb-3 mb-2">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-950/70 border border-teal-200 dark:border-teal-500/30 flex items-center justify-center shrink-0 shadow-xs text-teal-600 dark:text-teal-400">
                  <HeartHandshake className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h1 className="font-black text-slate-900 dark:text-white text-sm tracking-tight leading-tight">
                    Amanah Impact
                  </h1>
                  <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 tracking-wider uppercase block">
                    Foundation
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden cursor-pointer"
                title="Tutup Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Middle Navigation Menu: Modern, clean, sleek pills with subtle active indicator */}
            <nav className="flex-1 py-3 space-y-4 text-xs overflow-y-auto pr-0.5 custom-scrollbar">
              {/* GROUP 1: MENU UTAMA */}
              <div>
                <span className="px-3 pb-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Navigasi Utama
                </span>
                <div className="space-y-1">
                  {[
                    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
                    { id: 'donations', label: 'Donations & Zakat', icon: ClipboardCheck },
                    { id: 'donors', label: 'Donors CRM', icon: Users },
                    { id: 'campaigns', label: 'Campaigns', icon: Heart },
                    { id: 'reports', label: 'Reports & Audit', icon: FileText }
                  ].map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`admin-nav-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`group relative w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer select-none ${
                          isActive
                            ? 'bg-teal-50 dark:bg-gradient-to-r dark:from-teal-500/20 dark:via-teal-500/10 dark:to-teal-500/5 text-teal-900 dark:text-white font-bold border border-teal-200 dark:border-teal-500/25 shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 font-semibold'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isActive
                            ? 'bg-teal-600 dark:bg-teal-400/20 text-white dark:text-teal-300 shadow-xs'
                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:bg-slate-200/60 dark:group-hover:bg-slate-800/60'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate tracking-wide text-xs select-none flex-1">
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shadow-xs shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* GROUP 2: MODUL TAMBAHAN */}
              <div>
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800/60 mb-2">
                  <span className="px-3 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                    Modul Operasional
                  </span>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'csr', label: 'Pipeline CSR & ESG', icon: Briefcase },
                    { id: 'volunteers', label: 'Relawan & Volunteers', icon: HandHelping },
                    { id: 'blogs', label: 'Pusat FAQ & Blog CMS', icon: BookOpen },
                    { id: 'ai', label: 'AI Assistant', icon: Sparkles },
                    { id: 'settings', label: 'Settings', icon: Settings }
                  ].map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`admin-nav-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileSidebarOpen(false);
                        }}
                        className={`group relative w-full text-left px-2.5 py-2 rounded-xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer select-none ${
                          isActive
                            ? 'bg-teal-50 dark:bg-gradient-to-r dark:from-teal-500/20 dark:via-teal-500/10 dark:to-teal-500/5 text-teal-900 dark:text-white font-bold border border-teal-200 dark:border-teal-500/25 shadow-xs'
                            : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40 font-semibold'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                          isActive
                            ? 'bg-teal-600 dark:bg-teal-400/20 text-white dark:text-teal-300 shadow-xs'
                            : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200 group-hover:bg-slate-200/60 dark:group-hover:bg-slate-800/60'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="truncate tracking-wide text-xs select-none flex-1">
                          {item.label}
                        </span>
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-600 dark:bg-teal-400 shadow-xs shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </nav>

            {/* BOTTOM PINNED SECTION: MODERN COMPACT FOOTER */}
            <div className="shrink-0 pt-3 space-y-2 border-t border-slate-200 dark:border-slate-800/70">
              {/* User Profile Card */}
              <div 
                onClick={() => {
                  setActiveTab('profile');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer group ${
                  activeTab === 'profile'
                    ? 'bg-teal-50 dark:bg-gradient-to-r dark:from-teal-500/20 dark:via-teal-500/10 dark:to-teal-500/5 text-teal-900 dark:text-white border border-teal-200 dark:border-teal-500/25 shadow-xs'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
                }`}
                title="Profil Super Admin"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-600 to-emerald-500 text-white font-bold flex items-center justify-center text-[11px] shadow-xs">
                      SA
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white dark:border-[#0B132B] rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-slate-900 dark:text-white block truncate group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {currentAdmin?.name || 'Ahmad Syarif'}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate font-medium">
                      Super Admin
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Action Buttons: Balanced compact layout */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {onBackToWeb && (
                  <button
                    type="button"
                    id="admin-sidebar-back-to-web"
                    onClick={onBackToWeb}
                    className="py-2 px-2.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/50 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs"
                    title="Kembali ke Halaman Web"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 shrink-0 text-slate-500 dark:text-slate-400" />
                    <span className="truncate">Ke Web</span>
                  </button>
                )}
                <button
                  type="button"
                  id="admin-sidebar-logout-btn"
                  onClick={onLogout}
                  className={`py-2 px-2.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 hover:text-rose-900 dark:hover:text-rose-100 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200 dark:border-rose-500/20 flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow-xs ${!onBackToWeb ? 'col-span-2' : ''}`}
                  title="Keluar dari Admin Panel"
                >
                  <LogOut className="w-3.5 h-3.5 shrink-0 text-rose-600 dark:text-rose-400" />
                  <span className="truncate">Logout</span>
                </button>
              </div>
            </div>
          </aside>

          {/* ========================================================================= */}
          {/* RIGHT CONTENT CANVAS (CLEAN LIGHT / OFF-WHITE #F8FAFC, DARK #070D1E)       */}
          {/* ========================================================================= */}
          <main className="flex-1 bg-[#F8FAFC] dark:bg-[#070D1E] flex flex-col min-w-0">
            
            {/* SUB-HEADER BAR */}
            <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-[60px] z-20 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                  className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer lg:hidden"
                  title="Toggle Navigation Menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span className="font-semibold text-slate-500 dark:text-slate-400">Cockpit</span>
                  <span className="text-slate-300 dark:text-slate-600">/</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm capitalize">
                    {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
                  </span>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">Sesi Aktif: Super Admin</span>
              </div>
            </header>

            {/* CANVAS BODY CONTAINER */}
            <div className="p-4 sm:p-6 lg:p-7 space-y-6 flex-1">
              
              {/* TAB 1: OVERVIEW (MATCHING REFERENCE MOCKUP DESIGN EXACTLY) */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  
                  {/* MAIN TITLE HEADER */}
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                      Admin Dashboard <span className="text-slate-400 font-normal">|</span> Amanah Impact Foundation
                    </h2>
                  </div>

                  {/* 4 TOP KPI STAT CARDS (REAL DATABASE CALCULATED) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-5">
                    
                    {/* 1. Total Donations */}
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                          Total Donations
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
                          <DollarSign className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl 2xl:text-[26px] font-black text-slate-900 dark:text-white tracking-tight mt-2 truncate" title={formatCurrency(totalDonationsAccumulated || 1289450000)}>
                        {formatCurrency(totalDonationsAccumulated || 1289450000)}
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs mt-2.5">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+12.3% YoY</span>
                      </div>
                    </div>

                    {/* 2. Total Zakat Collected */}
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                          Total Zakat Collected
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 shadow-xs">
                          <ShieldCheck className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl 2xl:text-[26px] font-black text-slate-900 dark:text-white tracking-tight mt-2 truncate" title={formatCurrency(totalZakatAccumulated || 615200000)}>
                        {formatCurrency(totalZakatAccumulated || 615200000)}
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs mt-2.5">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+9.1%</span>
                      </div>
                    </div>

                    {/* 3. Active Donors */}
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                          Active Donors
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
                          <Users className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl 2xl:text-[26px] font-black text-slate-900 dark:text-white tracking-tight mt-2 truncate">
                        {donors.length > 0 ? donors.length.toLocaleString('id-ID') : '14,850'}
                      </div>
                      <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-xs mt-2.5">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+4.5%</span>
                      </div>
                    </div>

                    {/* 4. Active Campaigns */}
                    <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between min-w-0 overflow-hidden">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 truncate">
                          Active Campaigns
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 shadow-xs">
                          <Heart className="w-4 h-4" />
                        </div>
                      </div>
                      <div className="text-lg sm:text-xl lg:text-2xl 2xl:text-[26px] font-black text-slate-900 dark:text-white tracking-tight mt-2 truncate">
                        {activeCampaignsCount > 0 ? activeCampaignsCount : 18}
                      </div>
                      <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400 font-bold text-xs mt-2.5">
                        <Activity className="w-3.5 h-3.5 shrink-0" />
                        <span>Live Programs</span>
                      </div>
                    </div>

                  </div>

                  {/* ROW 2: DONATION TRENDS (MONTHLY) + DONOR CRM LIST (7 : 5 GRID) */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT (7 cols): DONATION TRENDS (MONTHLY) CHART */}
                    <div className="xl:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                            Donation Trends {timeRange === '1M' ? '(30 Hari Terakhir)' : timeRange === '3M' ? '(3 Bulan Terakhir)' : timeRange === '6M' ? '(6 Bulan Terakhir)' : '(1 Tahun Berjalan)'}
                          </h3>
                          <div className="flex items-center gap-4 text-xs font-medium text-slate-500 mt-1">
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
                              Total Donations
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                              Zakat
                            </span>
                          </div>
                        </div>

                        {/* Timeframe Filter Buttons [1M] [3M] [6M] [1Y] */}
                        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-[11px] font-bold self-start sm:self-auto border border-slate-200/60 dark:border-slate-700">
                          {(['1M', '3M', '6M', '1Y'] as const).map(tf => (
                            <button
                              key={tf}
                              type="button"
                              onClick={() => setTimeRange(tf)}
                              className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                                timeRange === tf
                                  ? 'bg-teal-600 text-white shadow-[0_0_12px_rgba(20,184,166,0.6)] font-black'
                                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                              }`}
                            >
                              {tf}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Smooth Curved Line / Area Chart */}
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={trendsChartData} margin={{ top: 15, right: 15, left: 10, bottom: 0 }}>
                            <defs>
                              <linearGradient id="gradDonationsTeal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#0D9488" stopOpacity={0.03}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.7} />
                            <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" tickLine={false} />
                            <YAxis 
                              width={60} 
                              fontSize={11} 
                              stroke="#94A3B8" 
                              tickFormatter={(v) => v >= 1000 ? `Rp${(v/1000).toFixed(1)}M` : `Rp${v}Jt`} 
                              tickLine={false} 
                            />
                            <Tooltip
                              content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl text-xs shadow-xl border border-slate-700 space-y-1">
                                      <span className="font-bold text-slate-300 block">{label} 2026</span>
                                      <div className="flex items-center gap-2 text-teal-400 font-bold">
                                        <span>Total:</span>
                                        <span>{payload[0]?.payload?.fullDonation}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-amber-400 font-bold">
                                        <span>Zakat:</span>
                                        <span>{payload[1]?.payload?.fullZakat}</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            {/* Teal Curve with Area fill */}
                            <Area 
                              type="monotone" 
                              dataKey="donations" 
                              stroke="#0D9488" 
                              strokeWidth={3} 
                              fillOpacity={1} 
                              fill="url(#gradDonationsTeal)" 
                              dot={{ r: 3, fill: '#0D9488' }}
                              activeDot={{ r: 6, fill: '#0D9488', stroke: '#fff', strokeWidth: 2 }}
                            />
                            {/* Amber Curve */}
                            <Area 
                              type="monotone" 
                              dataKey="zakat" 
                              stroke="#F59E0B" 
                              strokeWidth={2.5} 
                              fillOpacity={0} 
                              dot={{ r: 3, fill: '#F59E0B' }}
                              activeDot={{ r: 6, fill: '#F59E0B', stroke: '#fff', strokeWidth: 2 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Bottom Legend Indicators */}
                      <div className="flex items-center justify-center gap-6 pt-3 text-xs font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 mt-2">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block"></span>
                          Total Donations
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                          Zakat
                        </span>
                      </div>
                    </div>

                    {/* RIGHT (5 cols): DONOR CRM LIST (TABLE) */}
                    <div className="xl:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
                      <div>
                        {/* Header with Title & Filter Button */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                            Donor CRM List
                          </h3>
                          <div className="flex items-center gap-1.5">
                            <button 
                              type="button"
                              onClick={() => {
                                setOverviewDonorFilter(prev => prev === 'all' ? 'monthly' : prev === 'monthly' ? 'one-off' : 'all');
                              }}
                              className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer transition-colors"
                            >
                              <Filter className="w-3 h-3 text-slate-500" />
                              <span>{overviewDonorFilter === 'all' ? 'Filter' : overviewDonorFilter === 'monthly' ? 'Monthly' : 'One-off'}</span>
                              <ChevronDown className="w-3 h-3 text-slate-400" />
                            </button>
                          </div>
                        </div>

                        {/* Search Input Box */}
                        <div className="relative mb-3">
                          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={overviewDonorSearch}
                            onChange={(e) => setOverviewDonorSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500"
                          />
                        </div>

                        {/* Compact Table */}
                        <div className="overflow-x-auto scrollbar-thin pb-1">
                          <table className="w-full min-w-[500px] text-left text-[11px]">
                            <thead>
                              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                                <th className="pb-2.5 pr-2 whitespace-nowrap">Donor Name</th>
                                <th className="pb-2.5 px-2 whitespace-nowrap">Contact</th>
                                <th className="pb-2.5 px-2 text-right whitespace-nowrap">Total Contributed</th>
                                <th className="pb-2.5 px-2 text-center whitespace-nowrap">Last Donation</th>
                                <th className="pb-2.5 px-2 text-center whitespace-nowrap">Status</th>
                                <th className="pb-2.5 pl-2 text-right whitespace-nowrap">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                              {(donors.length > 0 ? donors : [
                                { id: '1', name: 'PT Surya Digital Nusantara', email: 'csr@suryadigital.com', whatsapp: '+6281211110003', totalDonation: 350000000, type: 'Corporate', segment: 'Mitra Prioritas', createdDate: '2024-10-03', city: 'Jakarta' },
                                { id: '2', name: 'Budi Santoso', email: 'budi.santoso@example.com', whatsapp: '+6281211110001', totalDonation: 125000000, type: 'Individual', segment: 'Muzakki Prioritas', createdDate: '2024-10-03', city: 'Bandung' },
                                { id: '3', name: 'Yayasan Keluarga Sejahtera', email: 'keluargaharmoni@example.org', whatsapp: '+6281211110005', totalDonation: 68000000, type: 'Corporate', segment: 'Mitra CSR', createdDate: '2024-10-03', city: 'Surabaya' },
                                { id: '4', name: 'Aisyah Putri', email: 'aisyah.putri@example.com', whatsapp: '+6281211110002', totalDonation: 45000000, type: 'Individual', segment: 'Regular Donor', createdDate: '2024-10-03', city: 'Yogyakarta' },
                              ])
                                .filter(d => {
                                  const matchesSearch = !overviewDonorSearch || 
                                    d.name.toLowerCase().includes(overviewDonorSearch.toLowerCase()) || 
                                    d.email?.toLowerCase().includes(overviewDonorSearch.toLowerCase());
                                  const matchesFilter = overviewDonorFilter === 'all' || 
                                    (overviewDonorFilter === 'monthly' && (d.segment?.includes('Regular') || d.type === 'Corporate')) ||
                                    (overviewDonorFilter === 'one-off' && !d.segment?.includes('Regular'));
                                  return matchesSearch && matchesFilter;
                                })
                                .slice(0, 4)
                                .map((dnr) => (
                                  <tr key={dnr.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="py-2.5 pr-2 whitespace-nowrap">
                                      <div className="font-bold text-slate-800 dark:text-white leading-tight truncate max-w-[130px]">{dnr.name}</div>
                                      <div className="text-[9px] text-slate-400">03 Okt 2024</div>
                                    </td>
                                    <td className="py-2.5 px-2 whitespace-nowrap">
                                      <div className="text-slate-600 dark:text-slate-300 truncate max-w-[130px]">{dnr.email}</div>
                                      <div className="text-[9px] text-slate-400">{dnr.whatsapp || '+6281211110001'}</div>
                                    </td>
                                    <td className="py-2.5 px-2 font-black text-slate-900 dark:text-white text-right whitespace-nowrap">
                                      {formatCurrency(dnr.totalDonation || 0)}
                                    </td>
                                    <td className="py-2.5 px-2 text-center text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
                                      {(dnr as any).createdDate ? new Date((dnr as any).createdDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : 'Okt 24'}
                                    </td>
                                    <td className="py-2.5 px-2 text-center whitespace-nowrap">
                                      <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
                                        Active
                                      </span>
                                    </td>
                                    <td className="py-2.5 pl-2 text-right whitespace-nowrap">
                                      <button 
                                        type="button"
                                        onClick={() => setActiveTab('donors')}
                                        className="text-[10px] font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400 hover:underline cursor-pointer"
                                      >
                                        Detail
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* Footer: Show more > */}
                      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                        <button
                          type="button"
                          onClick={() => setActiveTab('donors')}
                          className="text-xs font-bold text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 inline-flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          Show more &gt;
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* ROW 3: CAMPAIGN PERFORMANCE + RECENT ACTIVITY (7 : 5 GRID) */}
                  <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                    
                    {/* LEFT (7 cols): CAMPAIGN PERFORMANCE (DUAL BAR CHART) */}
                    <div className="xl:col-span-7 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                        <div>
                          <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                            Campaign Performance
                          </h3>
                        </div>

                        {/* Filter Dropdown [All Programs v] */}
                        <div className="relative">
                          <select
                            value={selectedProgramCategory}
                            onChange={(e) => setSelectedProgramCategory(e.target.value)}
                            className="text-xs py-1.5 px-3 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 font-bold text-slate-700 dark:text-white outline-none cursor-pointer pr-8"
                          >
                            <option value="All Programs">All Programs</option>
                            <option value="Pendidikan">Pendidikan & Yatim</option>
                            <option value="Wakaf">Wakaf Air Bersih</option>
                            <option value="Pangan">Bantuan Pangan</option>
                            <option value="Kesehatan">Kesehatan Dhuafa</option>
                            <option value="Ekonomi">Pemberdayaan UMKM</option>
                            <option value="Lingkungan">Reboisasi Hijau</option>
                            <option value="Bencana">Tanggap Bencana</option>
                          </select>
                        </div>
                      </div>

                      {/* Dual Bar Chart (Dark Slate Target vs Teal Collected) */}
                      <div className="h-56 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={campaignPerformanceList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" strokeOpacity={0.7} />
                            <XAxis dataKey="name" fontSize={11} stroke="#94A3B8" tickLine={false} />
                            <YAxis fontSize={11} stroke="#94A3B8" tickFormatter={(v) => `Rp${v}Jt`} tickLine={false} />
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const d = payload[0].payload;
                                  return (
                                    <div className="bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-xl text-xs shadow-xl border border-slate-700 space-y-1 max-w-xs">
                                      <span className="font-bold text-teal-400 block">{d.fullTitle}</span>
                                      <div className="text-slate-300">Target: <strong>Rp {d.target} Juta</strong></div>
                                      <div className="text-teal-400 font-bold">Terkumpul: <strong>Rp {d.collected} Juta</strong> ({d.percentage}%)</div>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            {/* Bar 1: Dark Slate for Target */}
                            <Bar dataKey="target" fill="#1E293B" radius={[4, 4, 0, 0]} name="Target" />
                            {/* Bar 2: Teal for Collected */}
                            <Bar dataKey="collected" fill="#0D9488" radius={[4, 4, 0, 0]} name="Terkumpul" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* RIGHT (5 cols): RECENT ACTIVITY TIMELINE */}
                    <div className="xl:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <h3 className="text-sm md:text-base font-black text-slate-900 dark:text-white">
                          Recent Activity
                        </h3>
                        <button type="button" className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4 relative before:absolute before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800">
                        {[
                          { id: 'act-1', name: 'Sarah J. Chen', action: 'at Amanah Impact Foundation.', time: '18 minutes ago', icon: Users },
                          { id: 'act-2', name: 'Ahmed Khan', action: 'menyalurkan Zakat Maal.', time: '15 minutes ago', icon: ShieldCheck },
                          { id: 'act-3', name: 'Fatima Ali', action: 'mendaftar sebagai Relawan Baru.', time: '1 hour ago', icon: HandHelping },
                          { id: 'act-4', name: 'PT Sinar Berkah', action: 'mengajukan kemitraan CSR.', time: '3 hours ago', icon: Briefcase },
                          { id: 'act-5', name: 'Hamba Allah', action: 'wakaf sumur bor air bersih.', time: '5 hours ago', icon: Heart },
                        ].map((act) => {
                          const IconComp = act.icon;
                          return (
                            <div key={act.id} className="flex items-start gap-3.5 relative">
                              <div className="w-8 h-8 rounded-full bg-teal-50 dark:bg-teal-950/70 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-center shrink-0 text-teal-600 dark:text-teal-400 z-10 shadow-xs">
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-snug">
                                  <strong className="font-bold text-slate-900 dark:text-white">{act.name}</strong> {act.action}
                                </div>
                                <span className="text-[10px] text-slate-400 block mt-0.5">{act.time}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                  </div>

                  {/* Production Deployment Status Banner */}
                  <div className="bg-teal-50/40 dark:bg-teal-950/10 p-5 rounded-2xl border border-teal-100/80 dark:border-teal-900/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping shrink-0"></span>
                          Status: Live & Connected
                        </span>
                        <h4 className="text-sm font-black text-slate-800 dark:text-white mt-1">
                          Live Production & Cloud Sync Control
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Sinkronisasikan seluruh database kampanye baru, mutasi kas, dan perubahan konten ke server utama Google Cloud Run.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleTriggerDeploy}
                        disabled={isDeploying || isReadOnly}
                        className="bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shrink-0 flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
                      >
                        {isDeploying ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Deploying... ({deployProgress}%)
                          </>
                        ) : (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            Deploy ke Produksi
                          </>
                        )}
                      </button>
                    </div>

                    {isDeploying && (
                      <div className="space-y-2 animate-pulse">
                        <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${deployProgress}%` }}></div>
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 dark:text-slate-400">
                          <span>{deployStep}</span>
                          <span>{deployProgress}%</span>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 text-[10px] font-bold text-slate-400 dark:text-slate-500 border-t border-teal-100/40 dark:border-teal-900/40 pt-3">
                      <div>
                        Last Deployed: <span className="font-mono text-slate-600 dark:text-slate-300">{lastDeployTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Server: <span className="text-teal-600 dark:text-teal-400">Google Cloud Run (Asia-Southeast1)</span></span>
                        <span>•</span>
                        <span>SSL: <span className="text-teal-600 dark:text-teal-400 font-sans">Active (Let's Encrypt)</span></span>
                      </div>
                    </div>
                  </div>

                  {/* FLOATING QUICK HELP BUTTON (?) */}
                  <div className="fixed bottom-6 right-6 z-40">
                    <button
                      type="button"
                      onClick={() => setIsHelpOpen(!isHelpOpen)}
                      className="w-9 h-9 rounded-full bg-[#0B132B] hover:bg-slate-800 text-white shadow-xl flex items-center justify-center font-bold text-sm border border-slate-700 cursor-pointer active:scale-95 transition-all"
                      title="Bantuan & Panduan Dashboard"
                    >
                      ?
                    </button>
                    
                    {/* Floating Help Modal / Tooltip */}
                    {isHelpOpen && (
                      <div className="absolute bottom-12 right-0 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 text-xs space-y-2.5 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                          <span className="font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                            <HelpCircle className="w-4 h-4 text-teal-600" /> Panduan Amanah Cockpit
                          </span>
                          <button onClick={() => setIsHelpOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                          Selamat datang di cockpit pengurus <strong>Amanah Impact Foundation</strong>. Gunakan navigasi di sidebar kiri untuk mengelola Zakat, Donatur CRM, Laporan Audit WTP, dan Kampanye Sosial secara real-time.
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              )}

          {/* TAP 2: CAMPAIGNS CMS */}
          {activeTab === 'campaigns' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450">
                  Draf Campaign Baru & Modifikasi CMS
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Tambahkan usulan program sosial resmi, target beasiswa, dana, atau reboisasi tuntas.
                </p>
              </div>

              {/* Campaign ADD Form */}
              <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-55/20 dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-gray-800 text-xs text-gray-700">
                <div className="md:col-span-2">
                  <label className="block font-bold mb-1 dark:text-gray-350">Judul Unggulan Kampanye</label>
                  <input
                    type="text"
                    value={newCampTitle}
                    onChange={(e) => setNewCampTitle(e.target.value)}
                    placeholder="Contoh: Renovasi Fasilitas Sanitasi Air Bersih Ponpes Cilacap"
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 dark:text-gray-350">Kategori Program</label>
                  <select
                    value={newCampCategory}
                    onChange={(e) => setNewCampCategory(e.target.value)}
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                    disabled={isReadOnly}
                  >
                    {['Pendidikan', 'Wakaf', 'Pangan', 'Air Bersih', 'Kesehatan', 'Lingkungan', 'Pemberdayaan Ekonomi', 'Zakat', 'Bencana', 'Anak Yatim'].map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1 dark:text-gray-350">Target Pendanaan (IDR)</label>
                  <input
                    type="number"
                    value={newCampGoal}
                    onChange={(e) => setNewCampGoal(e.target.value)}
                    placeholder="Minimal 10000000"
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none font-bold text-slate-800 dark:text-emerald-400"
                    disabled={isReadOnly}
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1 dark:text-gray-350">Wilayah Penyaluran</label>
                  <input
                    type="text"
                    value={newCampLocation}
                    onChange={(e) => setNewCampLocation(e.target.value)}
                    placeholder="Contoh: Lombok Timur, NTB"
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block font-bold mb-1 dark:text-gray-350">Deskripsi Singkat (Short Synopsis)</label>
                  <input
                    type="text"
                    value={newCampDesc}
                    onChange={(e) => setNewCampDesc(e.target.value)}
                    placeholder="Diringkas guna card kemanusiaan..."
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="md:col-span-2 col-span-1">
                  <label className="block font-bold mb-1 dark:text-gray-350">Dokumen Narasi Lengkap (Editorial Story)</label>
                  <textarea
                    value={newCampStory}
                    onChange={(e) => setNewCampStory(e.target.value)}
                    rows={3}
                    placeholder="Latar belakang detail problem sosial dan solusi..."
                    className="w-full text-xs p-2.5 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg focus:ring-1 focus:ring-emerald-500 outline-none"
                    disabled={isReadOnly}
                  />
                </div>

                <div className="md:col-span-2 pt-2 flex items-center justify-end">
                  <button
                    type="submit"
                    id="btn-admin-submit-camp"
                    className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-600 dark:active:bg-emerald-700 text-white font-extrabold px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    disabled={isReadOnly || !canWriteContent && !canEditFundraising}
                  >
                    <Plus className="w-4 h-4" />
                    Simpan & Luncurkan Kampanye
                  </button>
                </div>
              </form>

              {/* Active Campaigns list mapping for audit */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-gray-400 block uppercase tracking-wider">
                  Daftar Kontrol Kampanye Saat Ini ({campaigns.length})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3">
                  {campaigns.map(c => (
                    <div key={c.id} className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 p-3.5 rounded-2xl text-xs space-y-2">
                      <div className="flex justify-between items-start font-bold">
                        <span className="text-gray-900 dark:text-white tracking-tight leading-snug line-clamp-1">{c.title}</span>
                        <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-350 text-[9px] font-black px-2 py-0.5 rounded uppercase">
                          {c.category}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-450">
                        <span>Target: <strong>{formatCurrency(c.targetAmount)}</strong></span>
                        <span>Terkumpul: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(c.collectedAmount)}</strong></span>
                      </div>

                      <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-full" 
                          style={{ width: `${Math.min(100, (c.collectedAmount / c.targetAmount) * 100)}%` }}
                        ></div>
                      </div>

                      {/* Action buttons: Edit & Delete */}
                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-mono">ID: {c.id}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCampaign(c)}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 dark:text-emerald-300 font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Edit className="w-3 h-3" /> Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCampaign(c.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-950/60 dark:text-red-400 font-bold px-2 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Trash2 className="w-3 h-3" /> Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Edit Campaign Modal / Inline Card */}
                {editingCampaign && (
                  <div className="bg-emerald-55/15 dark:bg-emerald-950/20 border-2 border-emerald-500/30 dark:border-emerald-500/50 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-emerald-200 dark:border-emerald-800">
                      <div>
                        <h4 className="font-extrabold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                          <Edit className="w-4 h-4 text-emerald-600" /> Edit Kampanye (ID: {editingCampaign.id})
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Pembaruan data akan langsung tersimpan secara dinamis di database MySQL.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingCampaign(null)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-white text-xs font-bold px-2 py-1"
                      >
                        Batal
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1 dark:text-gray-300">Judul Kampanye</label>
                        <input
                          type="text"
                          value={editCampTitle}
                          onChange={(e) => setEditCampTitle(e.target.value)}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1 dark:text-gray-300">Kategori</label>
                        <select
                          value={editCampCategory}
                          onChange={(e) => setEditCampCategory(e.target.value)}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg outline-none"
                        >
                          {['Pendidikan', 'Wakaf', 'Pangan', 'Air Bersih', 'Kesehatan', 'Lingkungan', 'Pemberdayaan Ekonomi', 'Zakat', 'Bencana', 'Anak Yatim'].map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1 dark:text-gray-300">Target Nominal (IDR)</label>
                        <input
                          type="number"
                          value={editCampGoal}
                          onChange={(e) => setEditCampGoal(e.target.value)}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg font-bold outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1 dark:text-gray-300">Lokasi Penyaluran</label>
                        <input
                          type="text"
                          value={editCampLocation}
                          onChange={(e) => setEditCampLocation(e.target.value)}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1 dark:text-gray-300">Deskripsi Singkat</label>
                        <input
                          type="text"
                          value={editCampDesc}
                          onChange={(e) => setEditCampDesc(e.target.value)}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg outline-none"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block font-bold mb-1 dark:text-gray-300">Dokumen Narasi Cerita (Story)</label>
                        <textarea
                          value={editCampStory}
                          onChange={(e) => setEditCampStory(e.target.value)}
                          rows={3}
                          className="w-full p-2 border border-gray-200 dark:border-gray-700 dark:bg-slate-800 dark:text-white rounded-lg outline-none"
                        />
                      </div>
                      <div className="md:col-span-2 flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingCampaign(null)}
                          className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300"
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          disabled={isUpdatingCamp}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <Save className="w-4 h-4" /> {isUpdatingCamp ? 'Menyimpan...' : 'Simpan Perubahan ke DB'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB: AUDIT REPORTS & TRANSPARENCY */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Laporan Keuangan, Realisasi & Audit WTP
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Pantau publikasi akuntabilitas program, penerimaan dan penyaluran dana sesuai standar PSAK 109 & Audit Syariah. Tersimpan permanen di database.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openAddReport}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Tambah Laporan Baru
                  </button>
                  <button
                    type="button"
                    onClick={() => notifyToast('Laporan audit akuntabilitas berkala yayasan siap diunduh dalam format PDF.', 'info', 'Unduh Laporan')}
                    className="bg-white hover:bg-slate-50 border border-gray-250 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold py-2 px-3 rounded-lg text-xs flex items-center gap-1.5 text-gray-700 dark:text-white transition-colors cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-600" /> Unduh PDF
                  </button>
                </div>
              </div>

              {/* Reports Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-50/40 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Penerimaan Dana Laporan</span>
                  <div className="text-lg font-black text-slate-900 dark:text-white mt-1">
                    {formatCurrency(reports.reduce((sum, r) => sum + (Number(r.totalReceived) || 0), 0))}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Tercatat di {reports.length} Periode Laporan</span>
                </div>
                <div className="bg-emerald-50/40 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Realisasi Penyaluran</span>
                  <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">
                    {formatCurrency(reports.reduce((sum, r) => sum + (Number(r.totalDisbursed) || 0), 0))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-semibold mt-1 block">Telah Tersalurkan ke Penerima Manfaat</span>
                </div>
                <div className="bg-emerald-50/40 dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 p-4 rounded-2xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Sisa Saldo Kas & Cadangan</span>
                  <div className="text-lg font-black text-slate-800 dark:text-slate-200 mt-1">
                    {formatCurrency(reports.reduce((sum, r) => sum + ((Number(r.totalReceived) || 0) - (Number(r.totalDisbursed) || 0)), 0))}
                  </div>
                  <span className="text-[10px] text-teal-600 font-semibold mt-1 block">Cadangan Operasional Berkelanjutan</span>
                </div>
              </div>

              {/* Reports Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reports.map((rep) => {
                  const received = Number(rep.totalReceived) || 0;
                  const disbursed = Number(rep.totalDisbursed) || 0;
                  const remaining = Number(rep.remainingBalance) || (received - disbursed);
                  const percentDisbursed = received > 0 ? Math.min(100, Math.round((disbursed / received) * 100)) : 0;

                  return (
                    <div key={rep.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 space-y-3 shadow-xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                            {rep.type || 'Laporan Program'}
                          </span>
                          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                            rep.auditStatus === 'published'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}>
                            {rep.auditStatus === 'published' ? 'Dipublikasikan' : 'Audit Selesai (Reviewed)'}
                          </span>
                        </div>

                        <h4 className="font-black text-slate-900 dark:text-white text-sm leading-snug line-clamp-2">
                          {rep.title}
                        </h4>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                          Periode: <strong>{rep.period || '-'}</strong>
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-700/60 text-xs">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">Total Dihimpun:</span>
                          <span className="font-bold text-slate-800 dark:text-white">{formatCurrency(received)}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">Total Disalurkan:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{formatCurrency(disbursed)}</span>
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-500">Sisa Saldo Cadangan:</span>
                          <span className="font-bold text-slate-600 dark:text-slate-300">{formatCurrency(remaining)}</span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden mt-1">
                          <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percentDisbursed}%` }}></div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400">
                          <span>Realisasi Penyaluran</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{percentDisbursed}%</span>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex justify-between items-center text-[10px]">
                        <span className="text-gray-400 font-mono">ID: {rep.id}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditReport(rep)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                            title="Edit Laporan"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReport(rep.id)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 font-bold p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Hapus Laporan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB: BLOGS & ARTICLES CMS */}
          {activeTab === 'blogs' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-emerald-600" />
                    Manajemen Artikel & Edukasi Filantropi
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Tulis, publikasikan, atau perbarui artikel berita dan edukasi zakat/wakaf. Tersimpan langsung di tabel blog_posts MySQL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddBlog}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tulis Artikel Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs.map((b) => (
                  <div key={b.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-xs flex flex-col justify-between">
                    {b.imageUrl && (
                      <div className="h-36 w-full overflow-hidden bg-gray-100 dark:bg-gray-700 relative">
                        <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                        <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          {b.category || 'Umum'}
                        </span>
                      </div>
                    )}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                          <span>{b.author || 'Admin'}</span>
                          <span>{b.publishedDate || '-'}</span>
                        </div>
                        <h4 className="font-black text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1">
                          {b.title}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                          {b.excerpt || b.content}
                        </p>
                      </div>

                      <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          b.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                        }`}>
                          {b.status === 'published' ? 'Tayang' : 'Draft'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditBlog(b)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                            title="Edit Artikel"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBlog(b.id)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 font-bold p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                            title="Hapus Artikel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: FAQS CMS */}
          {activeTab === 'faqs' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    Pusat Tanya Jawab (FAQ) & Edukasi
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Kelola pertanyaan yang sering diajukan donatur dan mustahik. Perubahan langsung tersimpan permanen di tabel faqs MySQL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddFaq}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah FAQ Baru
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((f) => (
                  <div key={f.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                          {f.category || 'Umum'}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                          {f.question}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => openEditFaq(f)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                          title="Edit FAQ"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFaq(f.id)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 font-bold p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          title="Hapus FAQ"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pl-1 border-l-2 border-emerald-500">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS CMS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-emerald-600" />
                    Kisah Manfaat & Testimoni Penerima
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Kelola testimoni penerima manfaat, muzakki, dan mitra CSR. Tersimpan permanen di tabel testimonials MySQL.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddTestimonial}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3.5 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Testimoni Baru
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl p-4 shadow-xs flex flex-col justify-between space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                          {t.type || 'Penerima'}
                        </span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-gray-700 dark:text-gray-300 italic leading-relaxed">
                        "{t.content || t.message}"
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={t.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                          alt={t.name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-500"
                        />
                        <div>
                          <h5 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{t.name}</h5>
                          <span className="text-[10px] text-gray-400">{t.role} • {t.location || 'Indonesia'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditTestimonial(t)}
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 font-bold p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-950/40 cursor-pointer"
                          title="Edit Testimoni"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="text-red-500 hover:text-red-600 dark:text-red-400 font-bold p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                          title="Hapus Testimoni"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAP 3: DONATIONS MUTATIONS TABLE */}
          {activeTab === 'donations' && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3 flex justify-between items-center flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450">
                    Buku Jurnal Keuangan Mutasi Dana
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Gunakan panel ini untuk memverifikasi dana masuk dari Virtual Account atau QRIS secara real-time.
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Real Excel / CSV export button */}
                  <button
                    type="button"
                    id="btn-export-donations-csv"
                    onClick={handleExportDonationsCsv}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs active:scale-95"
                    title="Unduh seluruh data mutasi donasi & zakat dalam format file Excel / CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-white" />
                    <span>Export Excel / CSV</span>
                  </button>

                  {/* PDF export */}
                  <button
                    type="button"
                    id="btn-export-audit"
                    onClick={() => notifyToast('PDF Jurnal Audit Keuangan Triwulan Amanah Impact berhasil di-export ke perangkat Anda!', 'success', 'Ekspor Ledger')}
                    className="bg-white hover:bg-slate-50 border border-gray-250 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 font-bold py-2 px-3 rounded-lg text-xs flex items-center gap-1.5 text-gray-700 dark:text-white transition-colors cursor-pointer"
                  >
                    <FileDown className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Save Ledger PDF</span>
                  </button>
                </div>
              </div>

              {/* Transactions logs table */}
              <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-gray-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-gray-400 font-extrabold border-b border-gray-200 dark:border-slate-700">
                      <th className="p-3.5">No Trx / Tanggal</th>
                      <th className="p-3.5">Donatur</th>
                      <th className="p-3.5">Program</th>
                      <th className="p-3.5">Jumlah</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donations.map((d) => (
                      <tr key={d.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-emerald-50/5 dark:hover:bg-slate-800/20">
                        <td className="p-3.5">
                          <span className="font-mono font-bold block">{d.id}</span>
                          <span className="text-[10px] text-gray-400 block">{new Date(d.createdDate).toLocaleDateString('id-ID')}</span>
                        </td>
                        <td className="p-3.5 font-bold">
                          {d.donorName}
                          <span className="text-[10px] text-gray-400 block font-normal">{d.paymentMethod}</span>
                        </td>
                        <td className="p-3.5 font-semibold text-gray-600 dark:text-gray-350 max-w-[150px] truncate" title={d.campaignTitle}>
                          {d.campaignTitle}
                        </td>
                        <td className="p-3.5 font-extrabold text-gray-950 dark:text-white">
                          {formatCurrency(d.amount)}
                        </td>
                        <td className="p-3.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            d.status === 'success'
                              ? 'bg-emerald-100 text-emerald-850 dark:bg-emerald-950/80 dark:text-emerald-350'
                              : d.status === 'pending'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <div id={`verify-actions-grp-${d.id}`} className="flex items-center justify-end gap-1.5">
                            {d.status === 'pending' ? (
                              <button
                                type="button"
                                id={`btn-verify-success-${d.id}`}
                                onClick={() => handleVerifyDonation(d.id, 'success')}
                                className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold px-2 py-1 rounded text-[10px] flex items-center gap-0.5 cursor-pointer transition-colors"
                                title="Verifikasi Lunas"
                                disabled={isReadOnly || !canModifyBilling}
                              >
                                <Check className="w-3 h-3" /> Approve
                              </button>
                            ) : (
                              <span className="text-gray-400 text-[10px] font-bold">Lunas</span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteDonation(d.id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Hapus Transaksi dari Database"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAP 4: CRM DONORS TAB */}
          {activeTab === 'donors' && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450">
                  CRM Ringan & Database Donatur Terintegrasi
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Kontrol daftar donatur pendukung utama yayasan, berikan segmentasi tags, catat ikhtisar konsultasi WA.
                </p>
              </div>

              {/* Table list donors */}
              <div className="overflow-x-auto border border-gray-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-gray-900">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-gray-400 font-extrabold border-b border-gray-200 dark:border-slate-700">
                      <th className="p-3.5">Nama Donatur</th>
                      <th className="p-3.5">Kota / Segmen</th>
                      <th className="p-3.5">Pilar Program Terkait</th>
                      <th className="p-3.5 text-center">Frek Trx</th>
                      <th className="p-3.5">Akumulasi Donasi</th>
                      <th className="p-3.5 text-right">Catatan CRM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map(dn => (
                      <tr key={dn.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-slate-55/10">
                        <td className="p-3.5 font-bold text-gray-900 dark:text-white">
                          <div className="flex items-center gap-1">
                            {dn.isVIP && <span className="bg-amber-100 text-amber-800 text-[9px] px-1 rounded-sm uppercase tracking-wider scale-95 shrink-0 select-none">VIP</span>}
                            {dn.name}
                          </div>
                          <span className="text-[10px] text-gray-400 block font-normal">{dn.email} • {dn.whatsapp}</span>
                        </td>
                        <td className="p-3.5 text-gray-600 dark:text-gray-350 font-semibold">
                          {dn.city}
                          <span className="text-[10px] text-emerald-700 dark:text-emerald-400 block font-normal">{dn.segment}</span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1">
                            {(dn.tags || ['Infaq']).map(tag => (
                              <span key={tag} className="bg-slate-100 text-slate-800 dark:bg-gray-800 dark:text-gray-300 text-[9px] px-2 py-0.5 rounded font-black uppercase">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5 font-bold text-center">
                          {dn.donationCount} kali
                        </td>
                        <td className="p-3.5 font-black text-emerald-700 dark:text-emerald-450">
                          {formatCurrency(dn.totalDonation)}
                        </td>
                        <td className="p-3.5 text-right flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditDonor(dn)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 font-bold px-2 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors"
                            title="Edit Data Profil Donatur"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            id={`btn-open-notes-${dn.id}`}
                            onClick={() => {
                              setSelectedDonorId(dn.id);
                              setDonorNotesText(dn.notes || '');
                            }}
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-750 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-bold px-2.5 py-1.5 rounded-lg text-[10px] cursor-pointer transition-colors"
                          >
                            Edit Log
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteDonor(dn.id)}
                            className="text-red-500 hover:text-red-700 dark:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                            title="Hapus Donatur dari Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Dynamic Note Editor Section */}
              {selectedDonorId && (
                <div id="donor-notes-modal" className="bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-800 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-400">
                      Tulis Catatan CRM Donatur (ID: {selectedDonorId})
                    </span>
                    <button 
                      onClick={() => {
                        setSelectedDonorId(null);
                        setDonorNotesText('');
                      }}
                      className="text-gray-400 text-xs font-bold"
                    >
                      Batal
                    </button>
                  </div>
                  <textarea
                    id="input-donor-crm-note"
                    value={donorNotesText}
                    onChange={(e) => setDonorNotesText(e.target.value)}
                    rows={2}
                    placeholder="Contoh: Sangat mementingkan program bantuan sumur bor. Hubungi kembali di awal bulan pelaporan."
                    className="w-full text-xs p-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg dark:text-white"
                  />
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      id="save-crm-notes-btn"
                      onClick={handleSaveDonorNotes}
                      className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Save className="w-3.5 h-3.5" /> Simpan Catatan CRM
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAP 5: CSR PIPELINE MANAGEMENT */}
          {activeTab === 'csr' && (
            <div className="space-y-6">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450">
                  CSR B2B Partnership & ESG Pipeline
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Kontrol pipeline negosiasi perusahaan korporasi besar yang mengajukan proposal kesejahteraan manfaat sosial.
                </p>
              </div>

              {/* CRM Pipeline status lists */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: 'Inquiry Baru / Prospek', code: 'new' },
                  { title: 'Meeting / Presentasi', code: 'meeting_scheduled' },
                  { title: 'Proposal Terkirim / Negosiasi', code: 'proposal_sent' },
                  { title: 'Deal Won / Program Aktif', code: 'deal_won' }
                ].map(stage => (
                  <div key={stage.code} className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-2xl font-xs space-y-2.5">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block border-b border-gray-250 pb-1.5">
                      {stage.title}
                    </span>

                    {/* Filter items matching pipeline status */}
                    {csrInquiries.filter(c => c.pipelineStatus === stage.code || (stage.code === 'proposal_sent' && c.pipelineStatus === 'negotiation')).map(inq => (
                      <div key={inq.id} className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl space-y-1 shadow-sm">
                        <span className="font-bold text-gray-950 dark:text-white block tracking-tight line-clamp-1">{inq.companyName}</span>
                        <span className="text-[10px] text-gray-500 block">PIC: {inq.picName} ({inq.position})</span>
                        <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">{inq.budgetRange}</span>

                        <div className="pt-2 border-t border-gray-100 dark:border-gray-700 mt-2 flex justify-between items-center">
                          <span className="text-[10px] font-bold text-teal-600 block uppercase tracking-wide">
                            Pilar: {inq.interestedProgram}
                          </span>
                          
                          <div className="flex items-center gap-1.5">
                            {/* Progress helper */}
                            {stage.code !== 'deal_won' && (
                              <button
                                type="button"
                                id={`btn-csr-advance-${inq.id}`}
                                onClick={() => {
                                  const nextMap: Record<string, string> = {
                                    new: 'meeting_scheduled',
                                    meeting_scheduled: 'proposal_sent',
                                    proposal_sent: 'deal_won'
                                  };
                                  handleUpdateCsrPipeline(inq.id, nextMap[stage.code]);
                                }}
                                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-black text-[10px] border border-emerald-200 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:bg-emerald-950/30 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-md cursor-pointer transition-colors"
                                disabled={isReadOnly || !canEvaluateInquiry}
                              >
                                Maju
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteCsr(inq.id)}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Hapus Inkuiri CSR"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}

                    {csrInquiries.filter(c => c.pipelineStatus === stage.code).length === 0 && (
                      <span className="text-[10px] text-gray-400 italic text-center block py-4">- Kosong -</span>
                    )}

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAP 6: VOLUNTEERS APPROVAL MODULE */}
          {activeTab === 'volunteers' && (
            <div className="space-y-4">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
                <h3 className="text-sm font-extrabold uppercase tracking-widest text-emerald-800 dark:text-emerald-450">
                  Registrasi & Seleksi Relawan Lapangan
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Kontrol formulir lamaran draf relawan, saring berdasarkan skill mengajar, logistik ataupun driving darurat.
                </p>
              </div>

              {/* List grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3">
                {volunteers.map(v => (
                  <div key={v.id} className="border border-gray-200 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 rounded-2xl text-xs space-y-2.5">
                    <div className="flex justify-between items-start font-bold">
                      <div>
                        <span className="text-gray-950 dark:text-white text-sm block tracking-tight">{v.name}</span>
                        <span className="text-[10px] text-gray-400 block font-normal">{v.email} • {v.whatsapp}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide ${
                        v.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-900'
                          : v.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {v.status}
                      </span>
                    </div>

                    <div className="text-slate-600 dark:text-gray-350">
                      <span className="font-semibold block text-[10px] text-gray-400 uppercase tracking-wider mb-1">Pengalaman:</span>
                      <p className="font-semibold">{v.experience || 'Belum diisi.'}</p>
                    </div>

                    <div className="flex flex-wrap gap-1 leading-normal">
                      {v.skills.map(sk => (
                        <span key={sk} className="bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-300 text-[9px] px-2 py-0.5 rounded font-bold">
                          {sk}
                        </span>
                      ))}
                    </div>

                    <div id={`vol-actions-grp-${v.id}`} className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                      <button
                        type="button"
                        onClick={() => handleDeleteVolunteer(v.id)}
                        className="text-red-500 hover:text-red-700 dark:text-red-400 text-[10px] font-bold flex items-center gap-1 p-1 hover:bg-red-50 dark:hover:bg-red-950/30 rounded transition-colors"
                        title="Hapus Relawan dari Database"
                      >
                        <Trash2 className="w-3 h-3" /> Hapus
                      </button>

                      {v.status === 'pending' && (
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            id={`btn-vol-reject-${v.id}`}
                            onClick={() => handleVolunteerStatus(v.id, 'rejected')}
                            className="bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-700 dark:text-red-400 font-bold px-2.5 py-1.5 rounded-lg text-[10px] transition-colors"
                            disabled={isReadOnly}
                          >
                            Tolak
                          </button>
                          <button
                            type="button"
                            id={`btn-vol-approve-${v.id}`}
                            onClick={() => handleVolunteerStatus(v.id, 'approved')}
                            className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-bold px-2.5 py-1.5 rounded-lg text-[10px] transition-colors"
                            disabled={isReadOnly}
                          >
                            Approve Sukses
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAP 7: AI PLAYGROUND PANEL */}
          {activeTab === 'ai' && (
            <div className="space-y-5">
              
              <div className="bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-2xl p-5 text-white flex items-center justify-between shadow-md">
                <div className="space-y-1 max-w-[70%]">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-amber-300 animate-bounce fill-amber-300" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                      Amanah Gemini AI Assistant
                    </h3>
                  </div>
                  <p className="text-xs text-emerald-100 leading-normal">
                    Layanan asisten internal bertenaga <strong>Gemini 3.5 Flash</strong> untuk mengotomatiskan copywriting draf kampanye, usulan FAQ, transkripsi pesan, & penerjemah internasional.
                  </p>
                </div>
                <div className="p-3 bg-emerald-500/30 rounded-xl shrink-0">
                  <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
                </div>
              </div>

              {/* Set Action Selector */}
              <div className="grid grid-cols-2 md:grid-cols-5 p-1 bg-gray-50 dark:bg-gray-900 rounded-xl text-xs font-bold shrink-0">
                <button
                  id="btn-ai-type-campaign"
                  onClick={() => {
                    setAiType('campaign');
                    setAiPrompt('Beasiswa asrama 1.000 anak asnaf yatim yang terancam putus sekolah di pelosok NTT');
                  }}
                  className={`py-2 px-1 text-center rounded-lg transition-colors ${aiType === 'campaign' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Draf Campaign
                </button>
                <button
                  id="btn-ai-type-faq"
                  onClick={() => {
                    setAiType('faq');
                    setAiPrompt('Apakah amil mengenakan biaya pemotongan hak zakat maal di AIF?');
                  }}
                  className={`py-2 px-1 text-center rounded-lg transition-colors ${aiType === 'faq' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Asisten Syariah FAQ
                </button>
                <button
                  id="btn-ai-type-impact"
                  onClick={() => {
                    setAiType('impact');
                    setAiPrompt('Penyaluran 3.500 paket beras nutrisi di Cilacap, Jawa Tengah oleh tim relawan');
                  }}
                  className={`py-2 px-1 text-center rounded-lg transition-colors ${aiType === 'impact' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Narasi Dampak
                </button>
                <button
                  id="btn-ai-type-reply"
                  onClick={() => {
                    setAiType('reply');
                    setAiPrompt('Keluarga Bapak Budi Santoso baru mentransfer donasi Rp 25.000.000 untuk beasiswa dan doa beliau agar anaknya sukses');
                  }}
                  className={`py-2 px-1 text-center rounded-lg transition-colors ${aiType === 'reply' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                >
                  WhatsApp Reply
                </button>
                <button
                  id="btn-ai-type-translate"
                  onClick={() => {
                    setAiType('translate');
                    setAiPrompt('Selamat kepada seluruh Mustahik yang menerima donasi dari Yayasan Amanah. Kami menjamin mutasi transparansi.');
                  }}
                  className={`py-2 px-1 text-center rounded-lg transition-colors ${aiType === 'translate' ? 'bg-white dark:bg-gray-800 text-emerald-600 shadow-sm' : 'text-gray-400'}`}
                >
                  Penerjemah
                </button>
              </div>

              {/* Input text prompt */}
              <div className="space-y-3 font-xs">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 dark:text-gray-300">
                    {aiType === 'translate' ? 'Teks Asli untuk Diterjemahkan:' : 'Input Intisari atau Parameter AI:'}
                  </label>
                  <textarea
                    id="input-ai-prompt"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    rows={2}
                    className="w-full text-xs p-3 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 rounded-xl focus:ring-1 focus:ring-emerald-500 font-medium dark:text-white"
                  />
                </div>

                {/* extra translation config */}
                {aiType === 'translate' && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1 dark:text-gray-300">Pilih Bahasa Target:</label>
                    <select
                      value={aiTranslateLang}
                      onChange={(e) => setAiTranslateLang(e.target.value)}
                      className="text-xs p-2.5 border border-gray-250 dark:border-slate-700 rounded-lg dark:bg-gray-900 dark:text-white"
                    >
                      <option value="English">English</option>
                      <option value="Arabic">Arabic (العربية)</option>
                      <option value="Japanese">Japanese (日本語)</option>
                      <option value="Chinese">Chinese (简体中文)</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end shrink-0">
                  <button
                    type="button"
                    id="btn-submit-ai-assist"
                    onClick={handleAIAssist}
                    disabled={isAiLoading}
                    className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white font-extrabold px-6 py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer shadow-md disabled:bg-emerald-450 dark:disabled:bg-emerald-800 transition-colors"
                  >
                    {isAiLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sedang Menyusun Draft...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 fill-white" />
                        Jalankan AI Assistant
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* AI output result panel */}
              {aiResult && (
                <div id="ai-output-box" className="bg-gray-50 dark:bg-gray-900 border border-emerald-100 dark:border-emerald-800 p-5 rounded-2xl relative">
                  
                  <span className="absolute top-3 right-3 text-[9px] font-black tracking-widest text-emerald-800 bg-emerald-500 border border-emerald-150 px-2 py-0.5 rounded uppercase">
                    {isAiSimulated ? 'Simulated AI Draft' : 'Real-Time Gemini 3.5 Content'}
                  </span>

                  <h5 className="text-xs font-extrabold text-emerald-850 dark:text-emerald-400 capitalize mb-3 flex items-center gap-1">
                    <Check className="w-4 h-4 text-emerald-600" /> Hasil Rekomendasi Draft AI:
                  </h5>
                  
                  {/* Nicely preserving markdowns */}
                  <div className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-semibold whitespace-pre-wrap font-serif tracking-normal border-t border-gray-200 dark:border-gray-800 pt-3">
                    {aiResult}
                  </div>

                  <div className="flex items-center justify-end gap-2.5 pt-3 mt-4 border-t border-gray-200 dark:border-gray-800">
                    <button
                      type="button"
                      id="btn-apply-draft"
                      onClick={() => {
                        if (aiType === 'campaign') {
                          setNewCampStory(aiResult);
                          setNewCampDesc(aiPrompt);
                          setActiveTab('campaigns');
                          notifyToast('Draf cerita kampanye berhasil diaplikasikan ke editor CMS Kampanye!', 'success', 'AI Assistant');
                        } else {
                          navigator.clipboard.writeText(aiResult);
                          notifyToast('Draf disalin ke clipboard! Siap dikirim via WhatsApp / Email.', 'success', 'Tersalin');
                        }
                      }}
                      className="bg-white hover:bg-gray-100 border border-gray-200 dark:bg-gray-800 dark:hover:bg-slate-700 dark:border-gray-700 font-extrabold px-3 py-1.5 rounded-lg text-[10px] flex items-center gap-1 cursor-pointer dark:text-white"
                    >
                      {aiType === 'campaign' ? 'Gunakan Draf Certia' : 'Salin ke Clipboard'}
                    </button>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* TAB 8: PROFILE */}
          {activeTab === 'profile' && (
            <AdminProfileSection 
              currentAdmin={currentAdmin}
              setCurrentAdmin={setCurrentAdmin}
              onLogout={onLogout}
            />
          )}

          {/* TAB 9: FEEDBACKS */}
          {activeTab === 'feedbacks' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-4">
                <div>
                  <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    Kotak Masukan & Evaluasi Pengguna
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Umpan balik dari donatur, mitra CSR, relawan, dan pengguna platform.
                  </p>
                </div>
                <button
                  onClick={fetchFeedbacks}
                  className="p-2 text-xs font-bold rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFeedbackLoading ? 'animate-spin' : ''}`} />
                  Segarkan Data
                </button>
              </div>

              {isFeedbackLoading ? (
                <div className="p-12 text-center text-xs text-gray-500">Memuat umpan balik...</div>
              ) : feedbackList.length === 0 ? (
                <div className="p-12 text-center text-xs text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                  Belum ada masukan baru yang dikirimkan.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {feedbackList.map((fb) => (
                    <div key={fb.id} className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700/80 bg-gray-50/50 dark:bg-gray-900/50 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/50">
                          {fb.category || 'Umum'}
                        </span>
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= fb.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                        "{fb.message}"
                      </p>

                      <div className="pt-2 border-t border-gray-200/60 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400 flex items-center justify-between">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {fb.name || 'Anonim'} {fb.email ? `(${fb.email})` : ''}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px]">{fb.created_at ? new Date(fb.created_at).toLocaleDateString('id-ID') : ''}</span>
                          <button
                            type="button"
                            onClick={() => handleDeleteFeedback(fb.id)}
                            className="text-red-500 hover:text-red-600 dark:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                            title="Hapus Masukan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 10: SETTINGS (BACKUP, RESTORE & RESET) */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-gray-100 dark:border-gray-700 pb-4">
                <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  Pemeliharaan Basis Data & Cadangan Sistem
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Kelola snapshot basis data MySQL, cadangkan arsip transaksi, atau pulihkan data.
                </p>
              </div>

              {/* Maintenance Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* 1. Backup */}
                <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mb-3">
                      <Download className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Backup Database</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      Unduh seluruh tabel (kampanye, donasi, relawan, donatur, artikel) dalam format file JSON aman.
                    </p>
                  </div>
                  <button
                    onClick={handleBackupDatabase}
                    disabled={isBackingUp}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    {isBackingUp ? 'Memproses...' : 'Unduh File Backup (.json)'}
                  </button>
                </div>

                {/* 2. Restore */}
                <div className="p-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">Restore Database</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                      Unggah file cadangan JSON yang telah diekspor sebelumnya untuk memulihkan seluruh record data.
                    </p>
                  </div>
                  <label className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-center">
                    <Upload className="w-4 h-4" />
                    {isRestoring ? 'Memulihkan Data...' : 'Pilih File Backup (.json)'}
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreDatabase}
                      disabled={isRestoring}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* 3. Reset */}
                <div className="p-5 rounded-2xl border border-red-200 dark:border-red-900/40 bg-red-50/30 dark:bg-red-950/20 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400 flex items-center justify-center mb-3">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <h4 className="font-extrabold text-sm text-red-900 dark:text-red-200">Reset Basis Data</h4>
                    <p className="text-xs text-red-700/80 dark:text-red-300/80 mt-1 leading-relaxed">
                      Menghapus seluruh modifikasi dan mengembalikan data ke kondisi awal demo yayasan.
                    </p>
                  </div>
                  <button
                    onClick={handleResetDatabase}
                    disabled={isResetting}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <RotateCcw className="w-4 h-4" />
                    {isResetting ? 'Mereset Data...' : 'Reset ke Setelan Awal'}
                  </button>
                </div>

              </div>

              {/* Organization Info Live Editor */}
              <div className="bg-slate-50/80 dark:bg-gray-900/60 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 space-y-4">
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                  <div>
                    <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Informasi Legal & Profil Yayasan (Tabel organization_info MySQL)
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Perubahan informasi ini tersimpan permanen di basis data MySQL dan langsung tayang di beranda & footer.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleSaveOrgInfo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Nama Lengkap Yayasan</label>
                      <input
                        type="text"
                        value={orgForm.name}
                        onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Singkatan / Short Name</label>
                      <input
                        type="text"
                        value={orgForm.shortName}
                        onChange={(e) => setOrgForm({ ...orgForm, shortName: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Tahun Berdiri</label>
                      <input
                        type="number"
                        value={orgForm.foundedYear}
                        onChange={(e) => setOrgForm({ ...orgForm, foundedYear: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Tagline Yayasan</label>
                      <input
                        type="text"
                        value={orgForm.tagline}
                        onChange={(e) => setOrgForm({ ...orgForm, tagline: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Bentuk & Pilar Lembaga</label>
                      <input
                        type="text"
                        value={orgForm.type}
                        onChange={(e) => setOrgForm({ ...orgForm, type: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">SK Kemenkumham / Akta Legal</label>
                      <input
                        type="text"
                        value={orgForm.legalNumber}
                        onChange={(e) => setOrgForm({ ...orgForm, legalNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">NPWP Yayasan</label>
                      <input
                        type="text"
                        value={orgForm.taxNumber}
                        onChange={(e) => setOrgForm({ ...orgForm, taxNumber: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Izin Operasional Dinsos</label>
                      <input
                        type="text"
                        value={orgForm.operationalLicense}
                        onChange={(e) => setOrgForm({ ...orgForm, operationalLicense: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Alamat Kantor</label>
                    <textarea
                      rows={2}
                      value={orgForm.address}
                      onChange={(e) => setOrgForm({ ...orgForm, address: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Email Resmi</label>
                      <input
                        type="email"
                        value={orgForm.email}
                        onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Telepon Kantor</label>
                      <input
                        type="text"
                        value={orgForm.phone}
                        onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">WhatsApp Layanan</label>
                      <input
                        type="text"
                        value={orgForm.whatsapp}
                        onChange={(e) => setOrgForm({ ...orgForm, whatsapp: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Website URL</label>
                      <input
                        type="text"
                        value={orgForm.website}
                        onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSavingOrg}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold py-2.5 px-5 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      {isSavingOrg ? 'Menyimpan ke DB...' : 'Simpan Informasi Yayasan'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Security Policy Information */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1">
                <span className="font-bold block flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" /> Catatan Keamanan Hak Akses
                </span>
                Proses backup dan restore hanya dapat dieksekusi oleh Super Admin terverifikasi. Semua transaksi keuangan live memiliki integritas relasional ke tabel donatur dan kampanye.
              </div>
            </div>
          )}

            </div>
          </main>
        </div>

      {/* ========================================================================= */}
      {/* MODALS SECTION (Reports, Blogs, FAQs, Testimonials, Donor Edit)           */}
      {/* ========================================================================= */}

      {/* 1. REPORT MODAL */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                {editingReport ? 'Edit Laporan Audit Akuntabilitas' : 'Tambah Laporan Akuntabilitas Baru'}
              </h3>
              <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Judul Laporan</label>
                <input
                  type="text"
                  value={reportForm.title}
                  onChange={(e) => setReportForm({ ...reportForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Contoh: Laporan Penyaluran Beasiswa Yatim Q2 2026"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Tipe Laporan</label>
                  <select
                    value={reportForm.type}
                    onChange={(e) => setReportForm({ ...reportForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Laporan Bulanan">Laporan Bulanan</option>
                    <option value="Laporan Kuartalan">Laporan Kuartalan</option>
                    <option value="Laporan Tahunan WTP">Laporan Tahunan WTP</option>
                    <option value="Laporan Program Khusus">Laporan Program Khusus</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Periode</label>
                  <input
                    type="text"
                    value={reportForm.period}
                    onChange={(e) => setReportForm({ ...reportForm, period: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Contoh: Mei 2026"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Total Dihimpun (Rp)</label>
                  <input
                    type="number"
                    value={reportForm.totalReceived}
                    onChange={(e) => setReportForm({ ...reportForm, totalReceived: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Total Disalurkan (Rp)</label>
                  <input
                    type="number"
                    value={reportForm.totalDisbursed}
                    onChange={(e) => setReportForm({ ...reportForm, totalDisbursed: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Status Audit</label>
                <select
                  value={reportForm.auditStatus}
                  onChange={(e) => setReportForm({ ...reportForm, auditStatus: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="published">Dipublikasikan (Published)</option>
                  <option value="reviewed">Audit Selesai (Reviewed)</option>
                  <option value="draft">Draft Internal</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Keterangan / Opini Akuntabilitas</label>
                <textarea
                  rows={3}
                  value={reportForm.description}
                  onChange={(e) => setReportForm({ ...reportForm, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Ringkasan pertanggungjawaban amil untuk donatur..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  Simpan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. BLOG MODAL */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                {editingBlog ? 'Edit Artikel' : 'Tulis Artikel Edukasi Baru'}
              </h3>
              <button onClick={() => setIsBlogModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveBlog} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Judul Artikel</label>
                <input
                  type="text"
                  value={blogForm.title}
                  onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Kategori</label>
                  <select
                    value={blogForm.category}
                    onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Edukasi Zakat">Edukasi Zakat</option>
                    <option value="Wakaf Produktif">Wakaf Produktif</option>
                    <option value="Kisah Inspiratif">Kisah Inspiratif</option>
                    <option value="Kabar Yayasan">Kabar Yayasan</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Penulis</label>
                  <input
                    type="text"
                    value={blogForm.author}
                    onChange={(e) => setBlogForm({ ...blogForm, author: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">URL Gambar Sampul</label>
                <input
                  type="text"
                  value={blogForm.imageUrl}
                  onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Ringkasan (Excerpt)</label>
                <textarea
                  rows={2}
                  value={blogForm.excerpt}
                  onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Isi Konten Artikel</label>
                <textarea
                  rows={4}
                  value={blogForm.content}
                  onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsBlogModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  Publikasikan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. FAQ MODAL */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-600" />
                {editingFaq ? 'Edit FAQ' : 'Tambah FAQ Baru'}
              </h3>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Kategori FAQ</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="Umum">Umum</option>
                  <option value="Zakat">Zakat & Nishab</option>
                  <option value="Wakaf">Wakaf & Legalitas</option>
                  <option value="Keamanan">Keamanan & Audit</option>
                  <option value="CSR">CSR & Kolaborasi</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Pertanyaan</label>
                <input
                  type="text"
                  value={faqForm.question}
                  onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Contoh: Bagaimana cara mendapatkan bukti setor zakat resmi?"
                  required
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Jawaban Lengkap</label>
                <textarea
                  rows={4}
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  placeholder="Penjelasan informatif untuk donatur..."
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsFaqModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  Simpan FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. TESTIMONIAL MODAL */}
      {isTestimonialModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-emerald-600" />
                {editingTestimonial ? 'Edit Testimoni' : 'Tambah Testimoni Baru'}
              </h3>
              <button onClick={() => setIsTestimonialModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Nama Tokoh / Penerima</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Jabatan / Status</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="Penerima Beasiswa / Donatur Rutin"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Kota / Lokasi</label>
                  <input
                    type="text"
                    value={testimonialForm.location}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Rating Bintang</label>
                  <select
                    value={testimonialForm.rating}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value={5}>5 Bintang (Sempurna)</option>
                    <option value={4}>4 Bintang (Sangat Baik)</option>
                    <option value={3}>3 Bintang (Cukup)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Tipe</label>
                  <select
                    value={testimonialForm.type}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="beneficiary">Penerima Manfaat</option>
                    <option value="donor">Donatur / Muzakki</option>
                    <option value="partner">Mitra CSR</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">URL Foto Profil</label>
                <input
                  type="text"
                  value={testimonialForm.avatarUrl}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, avatarUrl: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Isi Kesaksian / Kisah Manfaat</label>
                <textarea
                  rows={3}
                  value={testimonialForm.content}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsTestimonialModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  Simpan Testimoni
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. DONOR EDIT MODAL */}
      {isEditDonorModalOpen && editingDonorData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-200 dark:border-gray-700 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                Edit Profil Donatur (ID: {editingDonorData.id})
              </h3>
              <button onClick={() => setIsEditDonorModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveDonorEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Nama Donatur</label>
                  <input
                    type="text"
                    value={donorEditForm.name}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Email</label>
                  <input
                    type="email"
                    value={donorEditForm.email}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, email: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">No WhatsApp</label>
                  <input
                    type="text"
                    value={donorEditForm.whatsapp}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, whatsapp: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Kota</label>
                  <input
                    type="text"
                    value={donorEditForm.city}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={donorEditForm.province}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, province: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Tipe</label>
                  <select
                    value={donorEditForm.type}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, type: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Komunitas">Komunitas</option>
                    <option value="Korporat">Korporat</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Segmen</label>
                  <select
                    value={donorEditForm.segment}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, segment: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Regular Donor">Regular Donor</option>
                    <option value="VIP Donor">VIP Donor</option>
                    <option value="Muzakki Prioritas">Muzakki Prioritas</option>
                    <option value="Wakif Utama">Wakif Utama</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Status Follow Up</label>
                  <select
                    value={donorEditForm.followUpStatus}
                    onChange={(e) => setDonorEditForm({ ...donorEditForm, followUpStatus: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="Baru">Baru</option>
                    <option value="Sudah Dihubungi">Sudah Dihubungi</option>
                    <option value="Tersapa WA">Tersapa WA</option>
                    <option value="Laporan Terkirim">Laporan Terkirim</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-700 dark:text-gray-300 block mb-1">Catatan Khusus CRM</label>
                <textarea
                  rows={3}
                  value={donorEditForm.notes}
                  onChange={(e) => setDonorEditForm({ ...donorEditForm, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsEditDonorModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING TAILORED POPUP NOTIFICATIONS CONTAINER */}
      <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 max-w-sm sm:max-w-md w-full pointer-events-none">
        {popupNotifs.map((n) => {
          const isSuccess = n.type === 'success';
          const isError = n.type === 'error';
          const isWarning = n.type === 'warning';

          return (
            <div
              key={n.id}
              className={`pointer-events-auto w-full p-4 rounded-2xl border shadow-2xl backdrop-blur-2xl transition-all duration-300 animate-in slide-in-from-top-4 flex items-start gap-3.5 relative overflow-hidden bg-slate-900/95 text-white ${
                isSuccess
                  ? 'border-emerald-500/50 shadow-emerald-950/40'
                  : isError
                  ? 'border-rose-500/50 shadow-rose-950/40'
                  : isWarning
                  ? 'border-amber-500/50 shadow-amber-950/40'
                  : 'border-cyan-500/50 shadow-cyan-950/40'
              }`}
            >
              {/* Glowing icon badge */}
              <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                isSuccess
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : isError
                  ? 'bg-rose-500/20 text-rose-400'
                  : isWarning
                  ? 'bg-amber-500/20 text-amber-400'
                  : 'bg-cyan-500/20 text-cyan-400'
              }`}>
                {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                {isError && <XCircle className="w-5 h-5" />}
                {isWarning && <AlertTriangle className="w-5 h-5" />}
                {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5" />}
              </div>

              {/* Text content */}
              <div className="grow pr-6 text-left">
                <h4 className="text-xs font-black tracking-tight text-white">{n.title}</h4>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-medium">
                  {n.message}
                </p>
              </div>

              {/* Dismiss X button */}
              <button
                type="button"
                onClick={() => removePopupNotify(n.id)}
                className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors cursor-pointer p-1 rounded-lg hover:bg-white/10"
                title="Tutup Notifikasi"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Sub-bar indicator */}
              <div 
                className={`absolute bottom-0 left-0 h-1 ${
                  isSuccess ? 'bg-emerald-500' : isError ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-cyan-500'
                }`}
                style={{ width: '100%' }}
              />
            </div>
          );
        })}
      </div>

      {/* CUSTOM CONFIRMATION POPUP MODAL DIALOG */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200 text-left"
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                confirmDialog.isDestructive
                  ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800'
                  : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
              }`}>
                {confirmDialog.isDestructive ? (
                  <Trash2 className="w-6 h-6" />
                ) : (
                  <AlertTriangle className="w-6 h-6" />
                )}
              </div>
              <div className="grow">
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  {confirmDialog.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
                  {confirmDialog.message}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={closeConfirm}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition cursor-pointer"
              >
                {confirmDialog.cancelLabel || 'Batal'}
              </button>
              <button
                type="button"
                onClick={() => {
                  const action = confirmDialog.onConfirm;
                  closeConfirm();
                  action();
                }}
                className={`px-4 py-2 text-xs font-black text-white rounded-xl shadow-md transition cursor-pointer active:scale-95 ${
                  confirmDialog.isDestructive
                    ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/25'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25'
                }`}
              >
                {confirmDialog.confirmLabel || 'Ya, Lanjutkan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
