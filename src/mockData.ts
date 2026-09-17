import { 
  Campaign, Donation, Donor, Volunteer, CsrInquiry, Report, BlogPost, Testimonial, FAQ, OrganizationInfo 
} from './types';

export const organizationMock: OrganizationInfo = {
  name: 'Amanah Impact Foundation',
  shortName: 'AIF',
  tagline: 'Transparan Berdampak, Amanah Menggerakkan Kebaikan',
  type: 'Yayasan Sosial, Zakat, Wakaf, dan Kemanusiaan',
  foundedYear: 2014,
  legalNumber: 'AHU-0012345.AH.01.04.Tahun 2014',
  taxNumber: '09.123.456.7-012.000',
  operationalLicense: 'SK Dinas Sosial No. 421/DS/2022',
  address: 'Jl. Kebaikan Raya No. 88, Jakarta Selatan, Indonesia',
  email: 'info@contech.id',
  phone: '+62 21 8888 1234',
  whatsapp: '+62 812 8888 1234',
  website: 'https://contech.id/',
  instagram: 'https://instagram.com/amanahimpact',
  tiktok: 'https://tiktok.com/@amanahimpact',
  youtube: 'https://youtube.com/@amanahimpact',
  facebook: 'https://facebook.com/amanahimpact'
};

export const campaignsMock: Campaign[] = [
  {
    id: 'C-01',
    title: 'Beasiswa 1.000 Anak Yatim dan Dhuafa',
    slug: 'beasiswa-1000-anak-yatim-dhuafa',
    category: 'Pendidikan',
    status: 'active',
    isFeatured: true,
    isUrgent: false,
    targetAmount: 750000000,
    collectedAmount: 486500000,
    disbursedAmount: 325000000,
    beneficiaryTarget: 1000,
    beneficiaryReached: 642,
    location: 'Jakarta, Bogor, Depok, Tangerang, Bekasi',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    shortDescription: 'Bantu anak yatim dan dhuafa melanjutkan pendidikan melalui beasiswa bulanan, perlengkapan sekolah, dan mentoring.',
    story: 'Banyak anak yatim dan dhuafa memiliki semangat belajar tinggi, namun terkendala biaya sekolah, perlengkapan belajar, dan akses mentoring. Program ini membantu mereka tetap sekolah dan tumbuh percaya diri.',
    fundUsage: [
      { item: 'Beasiswa bulanan', amount: 450000000 },
      { item: 'Perlengkapan sekolah', amount: 175000000 },
      { item: 'Mentoring dan pembinaan', amount: 85000000 },
      { item: 'Operasional program', amount: 40000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'C-02',
    title: 'Wakaf Pembangunan Pesantren Tahfidz',
    slug: 'wakaf-pembangunan-pesantren-tahfidz',
    category: 'Wakaf',
    status: 'active',
    isFeatured: true,
    isUrgent: false,
    targetAmount: 2500000000,
    collectedAmount: 1287500000,
    disbursedAmount: 925000000,
    beneficiaryTarget: 500,
    beneficiaryReached: 180,
    location: 'Cianjur, Jawa Barat',
    startDate: '2025-08-01',
    endDate: '2026-11-30',
    shortDescription: 'Bangun pesantren tahfidz untuk santri yatim dan dhuafa dengan fasilitas asrama, kelas, masjid, dan dapur umum.',
    story: 'Pesantren ini dirancang menjadi pusat pendidikan Al-Qur\'an dan pemberdayaan santri dhuafa. Wakaf akan digunakan untuk pembangunan fisik dan fasilitas pembelajaran.',
    fundUsage: [
      { item: 'Pembangunan asrama santri', amount: 950000000 },
      { item: 'Ruang kelas', amount: 650000000 },
      { item: 'Masjid pesantren', amount: 600000000 },
      { item: 'Dapur dan fasilitas umum', amount: 300000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200',
    videoUrl: ''
  },
  {
    id: 'C-03',
    title: 'Bantuan Pangan untuk 5.000 Keluarga Dhuafa',
    slug: 'bantuan-pangan-5000-keluarga-dhuafa',
    category: 'Pangan',
    status: 'active',
    isFeatured: true,
    isUrgent: true,
    targetAmount: 500000000,
    collectedAmount: 379250000,
    disbursedAmount: 310000000,
    beneficiaryTarget: 5000,
    beneficiaryReached: 3820,
    location: 'DKI Jakarta, Banten, Jawa Barat',
    startDate: '2026-03-01',
    endDate: '2026-08-31',
    shortDescription: 'Paket pangan berisi beras, minyak, telur, gula, dan kebutuhan pokok lainnya untuk keluarga dhuafa prasejahtera.',
    story: 'Kenaikan harga kebutuhan pokok membuat banyak keluarga rentan kesulitan memenuhi kebutuhan harian terkecil sekalipun. Program ini menyalurkan bantuan paket pangan darurat untuk keluarga miskin.',
    fundUsage: [
      { item: 'Paket sembako santri & dhuafa', amount: 425000000 },
      { item: 'Distribusi & Pengiriman', amount: 50000000 },
      { item: 'Dokumentasi dan laporan', amount: 25000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
    videoUrl: ''
  },
  {
    id: 'C-04',
    title: 'Sumur Bersih untuk Desa Kekeringan',
    slug: 'sumur-bersih-desa-kekeringan',
    category: 'Air Bersih',
    status: 'active',
    isFeatured: false,
    isUrgent: true,
    targetAmount: 900000000,
    collectedAmount: 512000000,
    disbursedAmount: 380000000,
    beneficiaryTarget: 12000,
    beneficiaryReached: 6400,
    location: 'Gunungkidul, NTT, Lombok Timur',
    startDate: '2026-02-10',
    endDate: '2026-10-30',
    shortDescription: 'Bangun sumur bor dalam dan instalasi air bersih ramah lingkungan untuk desa yang mengalami kekeringan ekstrem.',
    story: 'Akses air bersih yang layak masih menjadi barang langka di beberapa wilayah terpencil Indonesia. Donasi digunakan untuk survei geolisterik, pengeboran sumur dalam, tangki air penampungan, dan instalasi perpipaan ke rumah warga.',
    fundUsage: [
      { item: 'Pengeboran sumur dalam', amount: 520000000 },
      { item: 'Tangki air dan pompa submersible', amount: 230000000 },
      { item: 'Instalasi pipa warga', amount: 110000000 },
      { item: 'Edukasi kebersihan & sanitasi', amount: 40000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1200',
    videoUrl: ''
  },
  {
    id: 'C-05',
    title: 'Bantuan Medis Darurat untuk Pasien Dhuafa',
    slug: 'bantuan-medis-darurat-pasien-dhuafa',
    category: 'Kesehatan',
    status: 'active',
    isFeatured: false,
    isUrgent: true,
    targetAmount: 650000000,
    collectedAmount: 245750000,
    disbursedAmount: 188000000,
    beneficiaryTarget: 300,
    beneficiaryReached: 91,
    location: 'Jabodetabek dan Jawa Barat',
    startDate: '2026-04-01',
    endDate: '2026-12-31',
    shortDescription: 'Bantuan biaya operasional pengobatan, pembelian obat non-BPJS, serta penyediaan fasilitas ambulans gratis bagi dhuafa.',
    story: 'Meskipun sebagian besar biaya rumah sakit dijamin, pasien miskin kerap kesulitan membeli vitamin khusus, alat bantu dengar/jalan, hingga ongkos transportasi harian untuk kemoterapi atau cuci darah rutin.',
    fundUsage: [
      { item: 'Bantuan obat khusus non-BPJS', amount: 420000000 },
      { item: 'Penyewaan alat kesehatan & ambulans', amount: 130000000 },
      { item: 'Transportasi & logistik harian pasien', amount: 70000000 },
      { item: 'Pendampingan kerelawanan medis', amount: 30000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
    videoUrl: ''
  },
  {
    id: 'C-06',
    title: 'Tanam 100.000 Pohon untuk Masa Depan',
    slug: 'tanam-100000-pohon-untuk-masa-depan',
    category: 'Lingkungan',
    status: 'active',
    isFeatured: false,
    isUrgent: false,
    targetAmount: 1200000000,
    collectedAmount: 458000000,
    disbursedAmount: 210000000,
    beneficiaryTarget: 100000,
    beneficiaryReached: 28500,
    location: 'Jawa Barat, Jawa Tengah, Bali, Kalimantan Selatan',
    startDate: '2026-01-15',
    endDate: '2027-01-15',
    shortDescription: 'Reboisasi lahan kritis hutan kemasyarakatan dengan menanam bibit buah produktif, mangrove pesisir, serta pendampingan adopsi pohon.',
    story: 'Program peduli lingkungan ini berfokus pada keseimbangan iklim dan peningkatan ekonomi warga sekitar hutan dengan menanam bibit produktif serba guna.',
    fundUsage: [
      { item: 'Pembelian bibit pohon berkualitas', amount: 600000000 },
      { item: 'Biaya penanaman & reboisasi lapangan', amount: 300000000 },
      { item: 'Sistem tagging digital & monitoring', amount: 180000000 },
      { item: 'Sosialisasi & pembekalan petani lokal', amount: 120000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
    videoUrl: ''
  },
  {
    id: 'C-07',
    title: 'Modal Usaha Mikro untuk Ibu Tangguh',
    slug: 'modal-usaha-mikro-ibu-tangguh',
    category: 'Pemberdayaan Ekonomi',
    status: 'active',
    isFeatured: false,
    isUrgent: false,
    targetAmount: 800000000,
    collectedAmount: 368500000,
    disbursedAmount: 240000000,
    beneficiaryTarget: 400,
    beneficiaryReached: 135,
    location: 'Bandung, Garut, Tasikmalaya',
    startDate: '2026-02-01',
    endDate: '2026-12-31',
    shortDescription: 'Pemberian dana modal usaha bergulir tanpa bunga (qardhul hasan), workshop pembukuan keuangan, serta pendampingan branding digital.',
    story: 'Banyak ibu-ibu pengusaha makanan ringan atau warung klontong terpapar pinjaman online atau rentenir karena keterbatasan modal usaha. Kami membantu menghadirkan modal berkah dan pembekalan bisnis.',
    fundUsage: [
      { item: 'Penyaluran modal usaha mandiri', amount: 560000000 },
      { item: 'Workshop & modul pembukuan gratis', amount: 120000000 },
      { item: 'Pendampingan kemasan & branding digital', amount: 90000000 },
      { item: 'Evaluasi berkala & monitoring', amount: 30000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200',
    videoUrl: ''
  },
  {
    id: 'C-08',
    title: 'Zakat Maal untuk Mustahik Produktif',
    slug: 'zakat-maal-mustahik-produktif',
    category: 'Zakat',
    status: 'active',
    isFeatured: true,
    isUrgent: false,
    targetAmount: 1000000000,
    collectedAmount: 632000000,
    disbursedAmount: 475000000,
    beneficiaryTarget: 800,
    beneficiaryReached: 520,
    location: 'Indonesia',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    shortDescription: 'Salurkan zakat maal Anda untuk program mustahik transformatif agar mereka mampu berdaya dan mandiri secara ekonomi.',
    story: 'Dana zakat disalurkan dengan pola asasi syariah 8 asnaf, diprioritaskan bagi program beasiswa vokasi, jaminan nutrisi lansia sebatang kara, serta pendayagunaan zakat produktif bagi mustahik.',
    fundUsage: [
      { item: 'Bantuan santunan langsung fakir miskin', amount: 520000000 },
      { item: 'Penyaluran dana modal kerja produktif', amount: 300000000 },
      { item: 'Beasiswa pendidikan yatim & asnaf', amount: 120000000 },
      { item: 'Hak Amil (pengelolaan zakat)', amount: 60000000 }
    ],
    imageUrl: 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200',
    videoUrl: ''
  }
];

export const donationsMock: Donation[] = [
  {
    id: 'D-0001',
    donorName: 'Budi Santoso',
    donorEmail: 'budi.santoso@example.com',
    donorPhone: '+6281211110001',
    campaignTitle: 'Beasiswa 1.000 Anak Yatim dan Dhuafa',
    campaignSlug: 'beasiswa-1000-anak-yatim-dhuafa',
    amount: 25000000,
    category: 'Pendidikan',
    paymentMethod: 'Virtual Account BCA',
    status: 'success',
    isAnonymous: false,
    message: 'Semoga anak-anak Indonesia bisa terus sekolah dan meraih masa depan emas.',
    receiptNumber: 'AIF-RCPT-2026-000001',
    createdDate: '2026-05-18T10:00:00Z',
    paidDate: '2026-05-18T10:05:00Z',
    certificateNumber: 'AIF-CERT-ED-0001'
  },
  {
    id: 'D-0002',
    donorName: 'Aisyah Putri',
    donorEmail: 'aisyah.putri@example.com',
    donorPhone: '+6281211110002',
    campaignTitle: 'Zakat Maal untuk Mustahik Produktif',
    campaignSlug: 'zakat-maal-mustahik-produktif',
    amount: 5500000,
    category: 'Zakat',
    paymentMethod: 'QRIS',
    status: 'success',
    isAnonymous: false,
    message: 'Zakat maal tunai pribadi. Mohon disalurkan kepada mereka yang benar-benar mustahik sesuai asnaf.',
    receiptNumber: 'AIF-RCPT-2026-000002',
    createdDate: '2026-05-20T14:30:00Z',
    paidDate: '2026-05-20T14:31:00Z',
    certificateNumber: 'AIF-CERT-ZK-0002'
  },
  {
    id: 'D-0003',
    donorName: 'PT Surya Digital Nusantara',
    donorEmail: 'csr@suryadigital.co.id',
    donorPhone: '+6281211110003',
    campaignTitle: 'Tanam 100.000 Pohon untuk Masa Depan',
    campaignSlug: 'tanam-100000-pohon-untuk-masa-depan',
    amount: 250000000,
    category: 'CSR',
    paymentMethod: 'Corporate Transfer',
    status: 'success',
    isAnonymous: false,
    message: 'Sumbangan CSR Resmi Perusahaan untuk Program Penghijauan Lingkungan Pesisir Jawa Barat.',
    receiptNumber: 'AIF-RCPT-2026-000003',
    createdDate: '2026-05-22T09:00:00Z',
    paidDate: '2026-05-22T11:00:00Z',
    certificateNumber: 'AIF-CERT-CSR-0003'
  },
  {
    id: 'D-0004',
    donorName: 'Hamba Allah',
    donorEmail: 'anonymous001@example.com',
    donorPhone: '+6281211110004',
    campaignTitle: 'Wakaf Pembangunan Pesantren Tahfidz',
    campaignSlug: 'wakaf-pembangunan-pesantren-tahfidz',
    amount: 10000000,
    category: 'Wakaf',
    paymentMethod: 'GoPay',
    status: 'success',
    isAnonymous: true,
    message: 'Wakaf jariah diniatkan penuh atas nama kedua orang tua kandung kami tercinta.',
    receiptNumber: 'AIF-RCPT-2026-000004',
    createdDate: '2026-05-23T19:40:00Z',
    paidDate: '2026-05-23T19:41:00Z',
    certificateNumber: 'AIF-CERT-WK-0004'
  },
  {
    id: 'D-0005',
    donorName: 'Yayasan Keluarga Harmoni',
    donorEmail: 'keluargaharmoni@example.org',
    donorPhone: '+6281211110005',
    campaignTitle: 'Bantuan Pangan untuk 5.000 Keluarga Dhuafa',
    campaignSlug: 'bantuan-pangan-5000-keluarga-dhuafa',
    amount: 35000000,
    category: 'Pangan',
    paymentMethod: 'Virtual Account Mandiri',
    status: 'success',
    isAnonymous: false,
    message: 'Semoga menjadi amalan berkah dan membantu keringanan logistik keluarga dhuafa.',
    receiptNumber: 'AIF-RCPT-2026-000005',
    createdDate: '2026-05-25T08:15:00Z',
    paidDate: '2026-05-25T08:18:00Z',
    certificateNumber: 'AIF-CERT-PG-0005'
  }
];

export const donorsMock: Donor[] = [
  { id: 'DN-01', name: 'Budi Santoso', email: 'budi.santoso@example.com', whatsapp: '+6281211110001', city: 'Jakarta Selatan', province: 'DKI Jakarta', type: 'Individual', segment: 'VIP Donor', totalDonation: 125000000, donationCount: 18, isRecurring: true, isVIP: true, tags: ['Donatur Sembako', 'Pendidikan'], followUpStatus: 'Sudah di-WA', notes: 'Sangat peduli beasiswa anak dhuafa.' },
  { id: 'DN-02', name: 'Aisyah Putri', email: 'aisyah.putri@example.com', whatsapp: '+6281211110002', city: 'Bandung', province: 'Jawa Barat', type: 'Individual', segment: 'Regular Donor', totalDonation: 18500000, donationCount: 12, isRecurring: true, isVIP: false, tags: ['Zakat Maal'], followUpStatus: 'Sudah di-WA', notes: 'Rutin membayar zakat tabungan tahunan.' },
  { id: 'DN-03', name: 'PT Surya Digital Nusantara', email: 'csr@suryadigital.co.id', whatsapp: '+6281211110003', city: 'Jakarta Pusat', province: 'DKI Jakarta', type: 'Corporate', segment: 'CSR Donor', totalDonation: 350000000, donationCount: 4, isRecurring: false, isVIP: true, tags: ['CSR Partner', 'Lingkungan'], followUpStatus: 'Meeting Terjadwal', notes: 'Tertarik memperpanjang program reboisasi pesisir.' },
  { id: 'DN-04', name: 'Yayasan Keluarga Harmoni', email: 'keluargaharmoni@example.org', whatsapp: '+6281211110005', city: 'Tangerang Selatan', province: 'Banten', type: 'Community', segment: 'Community Donor', totalDonation: 68000000, donationCount: 7, isRecurring: false, isVIP: true, tags: ['Sponsor Komunitas', 'Wakaf'], followUpStatus: 'Terkirim Proposal', notes: 'Komunitas donatur keluarga terdidik.' }
];

export const volunteersMock: Volunteer[] = [
  { id: 'V-01', name: 'Rina Oktaviani', email: 'rina.volunteer@example.com', whatsapp: '+6281311110001', city: 'Jakarta Timur', skills: ['Event Management', 'Dokumentasi', 'Mengajar'], interestArea: ['Pendidikan', 'Anak Yatim'], availability: 'Weekend', experience: 'Mengajar relawan di pelosok Maluku 1 tahun.', status: 'approved', registeredDate: '2026-05-01' },
  { id: 'V-02', name: 'Dimas Prakoso', email: 'dimas.volunteer@example.com', whatsapp: '+6281311110002', city: 'Bandung', skills: ['Logistik', 'Driving', 'Distribusi'], interestArea: ['Bencana', 'Pangan'], availability: 'Flexible', experience: 'Bantuan evakuasi bencana gempa Cianjur.', status: 'pending', registeredDate: '2026-05-15' },
  { id: 'V-03', name: 'Nurul Azizah', email: 'nurul.volunteer@example.com', whatsapp: '+6281311110003', city: 'Depok', skills: ['Desain Grafis', 'Social Media', 'Copywriting'], interestArea: ['Lingkungan', 'CSR'], availability: 'Weekday Evening', experience: 'Mendesain feed Instagram LSM Hijau.', status: 'approved', registeredDate: '2026-05-10' }
];

export const csrInquiriesMock: CsrInquiry[] = [
  { id: 'CSR-01', companyName: 'PT Surya Digital Nusantara', picName: 'Michael Tan', position: 'Head of CSR', email: 'michael.tan@suryadigital.co.id', whatsapp: '+6281411110001', website: 'https://suryadigital.co.id', budgetRange: 'Rp250.000.000 - Rp500.000.000', interestedProgram: 'Lingkungan', locationTarget: 'Jawa Barat pesisir', message: 'Kami ingin mendongkrak inisiasi program reboisasi 100.000 pohon untuk wilayah rawan abrasi.', pipelineStatus: 'deal_won', createdDate: '2026-05-05' },
  { id: 'CSR-02', companyName: 'PT Harmoni Sehat Indonesia', picName: 'dr. Laura Amanda', position: 'Corporate Affairs Manager', email: 'laura@harmonisehat.co.id', whatsapp: '+6281411110002', website: 'https://harmonisehat.co.id', budgetRange: 'Rp100.000.000 - Rp250.000.000', interestedProgram: 'Kesehatan', locationTarget: 'Jabodetabek', pipelineStatus: 'proposal_sent', createdDate: '2026-05-12' },
  { id: 'CSR-03', companyName: 'Bank Amanah Syariah', picName: 'Rizky Ramadhan', position: 'CSR Partnership Lead', email: 'rizky@bankamanah.co.id', whatsapp: '+6281411110003', website: 'https://bankamanah.co.id', budgetRange: 'Rp500.000.000 - Rp1.000.000.000', interestedProgram: 'Zakat dan Wakaf', locationTarget: 'Nasional', pipelineStatus: 'meeting_scheduled', createdDate: '2026-05-20' }
];

export const reportsMock: Report[] = [
  { id: 'RP-01', title: 'Laporan Penyaluran Beasiswa Tahap 2', campaignSlug: 'beasiswa-1000-anak-yatim-dhuafa', type: 'Monthly Report', period: 'Mei 2026', totalReceived: 486500000, totalDisbursed: 325000000, remainingBalance: 161500000, publicVisibility: true, auditStatus: 'reviewed', description: 'Laporan rinci amil dan pendistribusian dana beasiswa bagi 642 anak asnaf dan dhuafa di wilayah Jabodetabek terbukti tuntas.', publishedDate: '2026-05-20' },
  { id: 'RP-02', title: 'Laporan Progress Wakaf Pesantren', campaignSlug: 'wakaf-pembangunan-pesantren-tahfidz', type: 'Progress Report', period: 'Mei 2026', totalReceived: 1287500000, totalDisbursed: 925000000, remainingBalance: 362500000, publicVisibility: true, auditStatus: 'reviewed', description: 'Update komprehensif audit fisik pembangunan asrama (55%), kelas baru (40%), dan masjid pesantren (35%).', publishedDate: '2026-05-15' },
  { id: 'RP-03', title: 'Laporan Bantuan Pangan Ramadan', campaignSlug: 'bantuan-pangan-5000-keluarga-dhuafa', type: 'Distribution Report', period: 'April 2026', totalReceived: 379250000, totalDisbursed: 310000000, remainingBalance: 69250000, publicVisibility: true, auditStatus: 'published', description: 'Laporan lengkap aksi pangan kemanusiaan sebar sapa sembako ramadan tersalurkan untuk 3.820 penerima.', publishedDate: '2026-04-20' }
];

export const blogsMock: BlogPost[] = [
  {
    id: 'B-01',
    title: 'Mengapa Transparansi Donasi Penting untuk Yayasan Modern',
    slug: 'mengapa-transparansi-donasi-penting',
    category: 'Transparansi',
    author: 'Salsabila Putri',
    status: 'published',
    excerpt: 'Kepercayaan publik dibangun dari laporan yang jelas, dokumentasi nyata di lapangan, serta audit transparansi keuangan yang konsisten.',
    content: 'Di era digital yang serba cepat ini, trust (kepercayaan) menjadi mata uang terpenting bagi sebuah lembaga nirlaba atau NGO kemanusiaan. Transparansi bukan lagi sekadar kewajiban pelaporan administratif kepada dewan pembina, melainkan sebuah bentuk pertanggungjawaban sosial yang mutlak kepada publik luas.\n\nDengan sistem pencoretan dana digital atau real-time public ledger, donatur bisa secara presisi melihat kemana mengalirnya rupiah yang mereka percayakan. Hal ini memperkuat hubungan batin donatur, meyakinkan bahwa bantuan telah sampai tuntas pada yang paling berpendidikan dan paling membutuhkan secara profesional.',
    language: 'id',
    publishedDate: '2026-05-10',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'B-02',
    title: 'Panduan Menghitung Zakat Penghasilan Lengkap',
    slug: 'panduan-menghitung-zakat-penghasilan-lengkap',
    category: 'Zakat',
    author: 'Ahmad Zaini',
    status: 'published',
    excerpt: 'Pelajari secara mudah cara menghitung zakat penghasilan, nisab nisbah bulanan dan tahunan, serta dalil amil syariah.',
    content: 'Zakat penghasilan (zakat profesi) adalah bagian dari zakat mal yang wajib dikeluarkan atas harta yang diperoleh dari hasil profesi atau pekerjaan/pendapatan halal.\n\nCara menghitungnya sangat sederhana: Jika pendapatan bulanan bersih Anda melebihi batas nisab emas (sekitar setara 85 gram emas per tahun, atau kurang lebih Rp85.000.000 pertahun alias Rp7.000.000 per bulan), maka wajib mengeluarkan zakat pendapatan sebesar 2,5%. Menggunakan Zakat Calculator di AIF, Anda tinggal memasukkan nominal pendapatan kotor maupun bersih beserta pemotongan utang jatuh tempo, untuk langsung berzakat tuntas seketika kian berkah.',
    language: 'id',
    publishedDate: '2026-05-15',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'B-03',
    title: 'How CSR Programs Can Create Measurable Social Impact',
    slug: 'csr-programs-measurable-social-impact',
    category: 'CSR',
    author: 'Rendy Saputra',
    status: 'published',
    excerpt: 'Corporate social responsibility becomes stronger and more meaningful when driven by data, local community ownership, and measurable outcomes.',
    content: 'Modern corporations are no longer assessed solely on quarterly profits or stock values. The rise of ESG (Environmental, Social, and Governance) principles means that corporate social responsibility is fully under the microscope.\n\nTo make a CSR campaign truly successful, it must pivot from traditional cash handouts to sustainable, measurable development plans, such as providing solar water wells, backing formal tahfidz boarding schools, or vocational educational grants that yield long-term livelihood security. Dynamic dashboards provided by Amanah Impact Foundation help partners download live data points and field photos suitable for corporate reports.',
    language: 'en',
    publishedDate: '2026-05-18',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600'
  }
];

export const testimonialsMock: Testimonial[] = [
  { 
    id: 'T-01', 
    name: 'Siti Aminah', 
    role: 'Orang Tua Penerima Beasiswa', 
    content: 'Bantuan beasiswa bulanan AIF membuat anak saya bisa tetap sekolah dan membeli perlengkapan sekolah dasar tuntas tanpa cemas.', 
    message: 'Bantuan beasiswa bulanan AIF membuat anak saya bisa tetap sekolah dan membeli perlengkapan sekolah dasar tuntas tanpa cemas.',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150',
    location: 'Sukabumi',
    rating: 5, 
    type: 'beneficiary' 
  },
  { 
    id: 'T-04', 
    name: 'Ustadz Ahmad Fauzi', 
    role: 'Penerima Manfaat Sumur Bor', 
    content: 'Alhamdulillah, sumur bor dari Amanah Impact Foundation mengalirkan air bersih yang sangat melimpah untuk wudhu 300 santri pesantren kami di Cilacap.', 
    message: 'Alhamdulillah, sumur bor dari Amanah Impact Foundation mengalirkan air bersih yang sangat melimpah untuk wudhu 300 santri pesantren kami di Cilacap.',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
    location: 'Cilacap',
    rating: 5, 
    type: 'beneficiary' 
  },
  { 
    id: 'T-02', 
    name: 'Budi Santoso', 
    role: 'Donatur Rutin', 
    content: 'Amanah Impact Foundation luar biasa transparan. Setiap bulan saya mendapatkan PDF laporan penyaluran yang didokumentasikan mendetail!', 
    message: 'Amanah Impact Foundation luar biasa transparan. Setiap bulan saya mendapatkan PDF laporan penyaluran yang didokumentasikan mendetail!',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
    location: 'Jakarta',
    rating: 5, 
    type: 'donor' 
  },
  { 
    id: 'T-03', 
    name: 'Michael Tan', 
    role: 'Head of CSR PT Surya Digital', 
    content: 'Sistem monitoring CSR AIF dan peta distribusinya sangat membantu penyusunan laporan tahunan ESG korporasi kami secara presisi.', 
    message: 'Sistem monitoring CSR AIF dan peta distribusinya sangat membantu penyusunan laporan tahunan ESG korporasi kami secara presisi.',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150',
    location: 'Surabaya',
    rating: 5, 
    type: 'csr_partner' 
  }
];

export const faqsMock: FAQ[] = [
  { id: 'F-01', category: 'Donasi', question: 'Apakah donasi saya akan mendapatkan bukti pembayaran resmi?', answer: 'Ya, sistem kami secara otomatis memproses dan men-generate Receipt resmi atau Bukti Penerimaan Donasi Elektronik lengkap dengan tanda tangan digital dan nomor transaksi unik sesaat setelah donasi terverifikasi sukses.' },
  { id: 'F-02', category: 'Zakat', question: 'Berapa standard nisab zakat profesi bulanan yang berlaku saat ini?', answer: 'Nisab zakat profesi bulanan merujuk pada ketetapan Baznas, yakni setara nilai harga 653 kg gabah kering atau setara 85 gram emas per tahun (sekitar Rp6.800.000 hingga Rp7.500.000 per bulan tergantung fluktuasi harga emas).' },
  { id: 'F-03', category: 'Wakaf', question: 'Apakah wakaf tunai mendapatkan sertifikat digital resmi?', answer: 'Ya, donatur yang menyalurkan wakaf uang di Amanah Impact Foundation berhak mengunduh Sertifikat Wakaf Digital (Digital Wakaf Pledge) berisi data nama pewakaf, ikrar wakaf, peruntukan aset, dan tanda tangan resmi nadzir.' }
];
