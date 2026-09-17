-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.4.3 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping structure for table amanah impact foundation.blog_posts
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `author` varchar(100) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'published',
  `excerpt` text,
  `content` longtext,
  `language` varchar(10) DEFAULT 'id',
  `published_date` varchar(64) DEFAULT NULL,
  `image_url` text,
  `thumbnail_url` text,
  `is_demo` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.blog_posts: ~3 rows (approximately)
INSERT INTO `blog_posts` (`id`, `user_id`, `title`, `slug`, `category`, `author`, `status`, `excerpt`, `content`, `language`, `published_date`, `image_url`, `thumbnail_url`, `is_demo`, `created_at`) VALUES
	('B-01', 'usr-admin-demo', 'Mengapa Transparansi Donasi Penting untuk Yayasan Modern', 'mengapa-transparansi-donasi-penting', 'Transparansi', 'Salsabila Putri', 'published', 'Kepercayaan publik dibangun dari laporan yang jelas, dokumentasi nyata di lapangan, serta audit transparansi keuangan yang konsisten.', 'Di era digital yang serba cepat ini, trust (kepercayaan) menjadi mata uang terpenting bagi sebuah lembaga nirlaba atau NGO kemanusiaan. Transparansi bukan lagi sekadar kewajiban pelaporan administratif kepada dewan pembina, melainkan sebuah bentuk pertanggungjawaban sosial yang mutlak kepada publik luas.\n\nDengan sistem pencoretan dana digital atau real-time public ledger, donatur bisa secara presisi melihat kemana mengalirnya rupiah yang mereka percayakan. Hal ini memperkuat hubungan batin donatur, meyakinkan bahwa bantuan telah sampai tuntas pada yang paling berpendidikan dan paling membutuhkan secara profesional.', 'id', '2026-05-10', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600', NULL, 1, '2026-09-08 03:34:07'),
	('B-02', 'usr-admin-demo', 'Panduan Menghitung Zakat Penghasilan Lengkap', 'panduan-menghitung-zakat-penghasilan-lengkap', 'Zakat', 'Ahmad Zaini', 'published', 'Pelajari secara mudah cara menghitung zakat penghasilan, nisab nisbah bulanan dan tahunan, serta dalil amil syariah.', 'Zakat penghasilan (zakat profesi) adalah bagian dari zakat mal yang wajib dikeluarkan atas harta yang diperoleh dari hasil profesi atau pekerjaan/pendapatan halal.\n\nCara menghitungnya sangat sederhana: Jika pendapatan bulanan bersih Anda melebihi batas nisab emas (sekitar setara 85 gram emas per tahun, atau kurang lebih Rp85.000.000 pertahun alias Rp7.000.000 per bulan), maka wajib mengeluarkan zakat pendapatan sebesar 2,5%. Menggunakan Zakat Calculator di AIF, Anda tinggal memasukkan nominal pendapatan kotor maupun bersih beserta pemotongan utang jatuh tempo, untuk langsung berzakat tuntas seketika kian berkah.', 'id', '2026-05-15', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600', NULL, 1, '2026-09-08 03:34:07'),
	('B-03', 'usr-admin-demo', 'How CSR Programs Can Create Measurable Social Impact', 'csr-programs-measurable-social-impact', 'CSR', 'Rendy Saputra', 'published', 'Corporate social responsibility becomes stronger and more meaningful when driven by data, local community ownership, and measurable outcomes.', 'Modern corporations are no longer assessed solely on quarterly profits or stock values. The rise of ESG (Environmental, Social, and Governance) principles means that corporate social responsibility is fully under the microscope.\n\nTo make a CSR campaign truly successful, it must pivot from traditional cash handouts to sustainable, measurable development plans, such as providing solar water wells, backing formal tahfidz boarding schools, or vocational educational grants that yield long-term livelihood security. Dynamic dashboards provided by Amanah Impact Foundation help partners download live data points and field photos suitable for corporate reports.', 'en', '2026-05-18', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600', NULL, 1, '2026-09-08 03:34:07');

-- Dumping structure for table amanah impact foundation.campaigns
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE IF NOT EXISTS `campaigns` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `status` enum('active','draft','completed') DEFAULT 'active',
  `is_featured` tinyint(1) DEFAULT '0',
  `is_urgent` tinyint(1) DEFAULT '0',
  `target_amount` bigint NOT NULL DEFAULT '0',
  `collected_amount` bigint NOT NULL DEFAULT '0',
  `disbursed_amount` bigint NOT NULL DEFAULT '0',
  `beneficiary_target` int DEFAULT '0',
  `beneficiary_reached` int DEFAULT '0',
  `location` varchar(255) DEFAULT NULL,
  `start_date` varchar(64) DEFAULT NULL,
  `end_date` varchar(64) DEFAULT NULL,
  `short_description` text,
  `story` longtext,
  `fund_usage` json DEFAULT NULL,
  `image_url` text,
  `thumbnail_url` text,
  `video_url` text,
  `urgency` varchar(32) DEFAULT 'medium',
  `is_demo` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.campaigns: ~9 rows (approximately)
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `fund_usage`, `image_url`, `thumbnail_url`, `video_url`, `urgency`, `is_demo`, `created_at`) VALUES
	('C-01', 'usr-admin-demo', 'Beasiswa 1.000 Anak Yatim dan Dhuafa', 'beasiswa-1000-anak-yatim-dhuafa', 'Pendidikan', 'active', 1, 0, 750000000, 486600000, 325000000, 1000, 643, 'Jakarta, Bogor, Depok, Tangerang, Bekasi', '2026-01-01', '2026-12-31', 'Bantu anak yatim dan dhuafa melanjutkan pendidikan melalui beasiswa bulanan, perlengkapan sekolah, dan mentoring.', 'Banyak anak yatim dan dhuafa memiliki semangat belajar tinggi, namun terkendala biaya sekolah, perlengkapan belajar, dan akses mentoring. Program ini membantu mereka tetap sekolah dan tumbuh percaya diri.', '[{"item": "Beasiswa bulanan", "amount": 450000000}, {"item": "Perlengkapan sekolah", "amount": 175000000}, {"item": "Mentoring dan pembinaan", "amount": 85000000}, {"item": "Operasional program", "amount": 40000000}]', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200', NULL, 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'medium', 1, '2026-09-08 03:34:07'),
	('C-02', 'usr-admin-demo', 'Wakaf Pembangunan Pesantren Tahfidz', 'wakaf-pembangunan-pesantren-tahfidz', 'Wakaf', 'active', 1, 0, 2500000000, 1287500000, 925000000, 500, 180, 'Cianjur, Jawa Barat', '2025-08-01', '2026-11-30', 'Bangun pesantren tahfidz untuk santri yatim dan dhuafa dengan fasilitas asrama, kelas, masjid, dan dapur umum.', 'Pesantren ini dirancang menjadi pusat pendidikan Al-Qur\'an dan pemberdayaan santri dhuafa. Wakaf akan digunakan untuk pembangunan fisik dan fasilitas pembelajaran.', '[{"item": "Pembangunan asrama santri", "amount": 950000000}, {"item": "Ruang kelas", "amount": 650000000}, {"item": "Masjid pesantren", "amount": 600000000}, {"item": "Dapur dan fasilitas umum", "amount": 300000000}]', 'https://images.unsplash.com/photo-1541829011853-89101397013e?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 1, '2026-09-08 03:34:07'),
	('C-03', 'usr-admin-demo', 'Bantuan Pangan untuk 5.000 Keluarga Dhuafa', 'bantuan-pangan-5000-keluarga-dhuafa', 'Pangan', 'active', 1, 1, 500000000, 379250000, 310000000, 5000, 3820, 'DKI Jakarta, Banten, Jawa Barat', '2026-03-01', '2026-08-31', 'Paket pangan berisi beras, minyak, telur, gula, dan kebutuhan pokok lainnya untuk keluarga dhuafa prasejahtera.', 'Kenaikan harga kebutuhan pokok membuat banyak keluarga rentan kesulitan memenuhi kebutuhan harian terkecil sekalipun. Program ini menyalurkan bantuan paket pangan darurat untuk keluarga miskin.', '[{"item": "Paket sembako santri & dhuafa", "amount": 425000000}, {"item": "Distribusi & Pengiriman", "amount": 50000000}, {"item": "Dokumentasi dan laporan", "amount": 25000000}]', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 1, '2026-09-08 03:34:07'),
	('C-04', 'usr-admin-demo', 'Sumur Bersih untuk Desa Kekeringan', 'sumur-bersih-desa-kekeringan', 'Air Bersih', 'active', 0, 1, 900000000, 512050000, 380000000, 12000, 6401, 'Gunungkidul, NTT, Lombok Timur', '2026-02-10', '2026-10-30', 'Bangun sumur bor dalam dan instalasi air bersih ramah lingkungan untuk desa yang mengalami kekeringan ekstrem.', 'Akses air bersih yang layak masih menjadi barang langka di beberapa wilayah terpencil Indonesia. Donasi digunakan untuk survei geolisterik, pengeboran sumur dalam, tangki air penampungan, dan instalasi perpipaan ke rumah warga.', '[{"item": "Pengeboran sumur dalam", "amount": 520000000}, {"item": "Tangki air dan pompa submersible", "amount": 230000000}, {"item": "Instalasi pipa warga", "amount": 110000000}, {"item": "Edukasi kebersihan & sanitasi", "amount": 40000000}]', 'https://images.unsplash.com/photo-1541829011853-89101397013e?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 1, '2026-09-08 03:34:07'),
	('C-05', 'usr-admin-demo', 'Bantuan Medis Darurat untuk Pasien Dhuafa', 'bantuan-medis-darurat-pasien-dhuafa', 'Kesehatan', 'active', 0, 1, 650000000, 245750000, 188000000, 300, 91, 'Jabodetabek dan Jawa Barat', '2026-04-01', '2026-12-31', 'Bantuan biaya operasional pengobatan, pembelian obat non-BPJS, serta penyediaan fasilitas ambulans gratis bagi dhuafa.', 'Meskipun sebagian besar biaya rumah sakit dijamin, pasien miskin kerap kesulitan membeli vitamin khusus, alat bantu dengar/jalan, hingga ongkos transportasi harian untuk kemoterapi atau cuci darah rutin.', '[{"item": "Bantuan obat khusus non-BPJS", "amount": 420000000}, {"item": "Penyewaan alat kesehatan & ambulans", "amount": 130000000}, {"item": "Transportasi & logistik harian pasien", "amount": 70000000}, {"item": "Pendampingan kerelawanan medis", "amount": 30000000}]', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 1, '2026-09-08 03:34:07'),
	('C-06', 'usr-admin-demo', 'Tanam 100.000 Pohon untuk Masa Depan', 'tanam-100000-pohon-untuk-masa-depan', 'Lingkungan', 'active', 0, 0, 1200000000, 458000000, 210000000, 100000, 28500, 'Jawa Barat, Jawa Tengah, Bali, Kalimantan Selatan', '2026-01-15', '2027-01-15', 'Reboisasi lahan kritis hutan kemasyarakatan dengan menanam bibit buah produktif, mangrove pesisir, serta pendampingan adopsi pohon.', 'Program peduli lingkungan ini berfokus pada keseimbangan iklim dan peningkatan ekonomi warga sekitar hutan dengan menanam bibit produktif serba guna.', '[{"item": "Pembelian bibit pohon berkualitas", "amount": 600000000}, {"item": "Biaya penanaman & reboisasi lapangan", "amount": 300000000}, {"item": "Sistem tagging digital & monitoring", "amount": 180000000}, {"item": "Sosialisasi & pembekalan petani lokal", "amount": 120000000}]', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 1, '2026-09-08 03:34:07'),
	('C-07', 'usr-admin-demo', 'Modal Usaha Mikro untuk Ibu Tangguh', 'modal-usaha-mikro-ibu-tangguh', 'Pemberdayaan Ekonomi', 'active', 0, 0, 800000000, 368500000, 240000000, 400, 135, 'Bandung, Garut, Tasikmalaya', '2026-02-01', '2026-12-31', 'Pemberian dana modal usaha bergulir tanpa bunga (qardhul hasan), workshop pembukuan keuangan, serta pendampingan branding digital.', 'Banyak ibu-ibu pengusaha makanan ringan atau warung klontong terpapar pinjaman online atau rentenir karena keterbatasan modal usaha. Kami membantu menghadirkan modal berkah dan pembekalan bisnis.', '[{"item": "Penyaluran modal usaha mandiri", "amount": 560000000}, {"item": "Workshop & modul pembukuan gratis", "amount": 120000000}, {"item": "Pendampingan kemasan & branding digital", "amount": 90000000}, {"item": "Evaluasi berkala & monitoring", "amount": 30000000}]', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 1, '2026-09-08 03:34:07'),
	('C-08', 'usr-admin-demo', 'Zakat Maal untuk Mustahik Produktif', 'zakat-maal-mustahik-produktif', 'Zakat', 'active', 1, 0, 1000000000, 632000000, 475000000, 800, 520, 'Indonesia', '2026-01-01', '2026-12-31', 'Salurkan zakat maal Anda untuk program mustahik transformatif agar mereka mampu berdaya dan mandiri secara ekonomi.', 'Dana zakat disalurkan dengan pola asasi syariah 8 asnaf, diprioritaskan bagi program beasiswa vokasi, jaminan nutrisi lansia sebatang kara, serta pendayagunaan zakat produktif bagi mustahik.', '[{"item": "Bantuan santunan langsung fakir miskin", "amount": 520000000}, {"item": "Penyaluran dana modal kerja produktif", "amount": 300000000}, {"item": "Beasiswa pendidikan yatim & asnaf", "amount": 120000000}, {"item": "Hak Amil (pengelolaan zakat)", "amount": 60000000}]', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 1, '2026-09-08 03:34:07'),
	('C-2166', 'usr-1788838763585', 'Bantuan Gempa Sumbar', 'bantuan-gempa-sumbar', 'Bencana Alam', 'active', 0, 0, 300000000, 0, 0, 250, 0, 'Nasional', '2026-09-08', '2026-11-07', 'Bantuan tanggap darurat pasca gempa.', 'Bantuan Gempa Sumbar adalah ikhtiar bersama dalam menyalurkan bantuan berkelanjutan bagi masyarakat.', '[{"item": "Operasional Lapangan", "amount": 300000000}]', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200', NULL, '', 'medium', 0, '2026-09-08 03:39:42');

-- Dumping structure for table amanah impact foundation.campaign_updates
DROP TABLE IF EXISTS `campaign_updates`;
CREATE TABLE IF NOT EXISTS `campaign_updates` (
  `id` varchar(64) NOT NULL,
  `campaign_slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `date` varchar(64) DEFAULT NULL,
  `description` longtext,
  `media_type` enum('image','video','text') DEFAULT 'image',
  `image_url` text,
  `visibility` enum('public','private') DEFAULT 'public',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.campaign_updates: ~3 rows (approximately)
INSERT INTO `campaign_updates` (`id`, `campaign_slug`, `title`, `date`, `description`, `media_type`, `image_url`, `visibility`, `created_at`) VALUES
	('U-01', 'beasiswa-1000-anak-yatim-dhuafa', '642 Anak Telah Menerima Bantuan Beasiswa', '2026-05-20', 'Alhamdulillah, bantuan beasiswa tahap kedua telah sukses disalurkan kepada 642 anak asnaf dan dhuafa di wilayah Jabodetabek. Penerima menerima dana bantuan tuntas, paket tas sekolah, dan buku pelajaran.', 'image', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600', 'public', '2026-09-08 03:34:07'),
	('U-02', 'wakaf-pembangunan-pesantren-tahfidz', 'Proses Pembangunan Asrama Mencapai 55%', '2026-05-12', 'Proses pembangunan fisik asrama santri tahfidz di Cianjur kini telah memasuki perakitan konstruksi atap baja ringan dan pemasangan instalasi listrik interior.', 'video', '', 'public', '2026-09-08 03:34:07'),
	('U-03', 'sumur-bersih-desa-kekeringan', '3 Titik Sumur Bor Baru Siap Pakai di NTT', '2026-04-30', 'Tiga titik sumur bor dalam di wilayah Lombok Timur dan NTT kini sudah rampung dipasangi pipa dan motor penggerak submersible bertenaga surya. Air mengalir lancar.', 'image', 'https://images.unsplash.com/photo-1541829011853-89101397013e?auto=format&fit=crop&q=80&w=600', 'public', '2026-09-08 03:34:07');

-- Dumping structure for table amanah impact foundation.csr_inquiries
DROP TABLE IF EXISTS `csr_inquiries`;
CREATE TABLE IF NOT EXISTS `csr_inquiries` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `company_name` varchar(255) NOT NULL,
  `pic_name` varchar(255) NOT NULL,
  `position` varchar(100) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `whatsapp` varchar(64) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `budget_range` varchar(100) DEFAULT NULL,
  `interested_program` varchar(100) DEFAULT NULL,
  `location_target` varchar(100) DEFAULT NULL,
  `message` text,
  `pipeline_status` enum('new','contacted','meeting_scheduled','proposal_sent','negotiation','deal_won','deal_lost','program_running') DEFAULT 'new',
  `created_date` varchar(64) DEFAULT NULL,
  `is_demo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.csr_inquiries: ~3 rows (approximately)
INSERT INTO `csr_inquiries` (`id`, `user_id`, `company_name`, `pic_name`, `position`, `email`, `whatsapp`, `website`, `budget_range`, `interested_program`, `location_target`, `message`, `pipeline_status`, `created_date`, `is_demo`) VALUES
	('CSR-01', 'usr-admin-demo', 'PT Surya Digital Nusantara', 'Michael Tan', 'Head of CSR', 'michael.tan@suryadigital.co.id', '+6281411110001', 'https://suryadigital.co.id', 'Rp250.000.000 - Rp500.000.000', 'Lingkungan', 'Jawa Barat pesisir', 'Kami ingin mendongkrak inisiasi program reboisasi 100.000 pohon untuk wilayah rawan abrasi.', 'deal_won', '2026-05-05', 1),
	('CSR-02', 'usr-admin-demo', 'PT Harmoni Sehat Indonesia', 'dr. Laura Amanda', 'Corporate Affairs Manager', 'laura@harmonisehat.co.id', '+6281411110002', 'https://harmonisehat.co.id', 'Rp100.000.000 - Rp250.000.000', 'Kesehatan', 'Jabodetabek', '', 'proposal_sent', '2026-05-12', 1),
	('CSR-03', 'usr-admin-demo', 'Bank Amanah Syariah', 'Rizky Ramadhan', 'CSR Partnership Lead', 'rizky@bankamanah.co.id', '+6281411110003', 'https://bankamanah.co.id', 'Rp500.000.000 - Rp1.000.000.000', 'Zakat dan Wakaf', 'Nasional', '', 'meeting_scheduled', '2026-05-20', 1);

-- Dumping structure for table amanah impact foundation.donations
DROP TABLE IF EXISTS `donations`;
CREATE TABLE IF NOT EXISTS `donations` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `donor_name` varchar(255) NOT NULL,
  `donor_email` varchar(255) NOT NULL,
  `donor_phone` varchar(64) DEFAULT NULL,
  `campaign_title` varchar(255) DEFAULT NULL,
  `campaign_slug` varchar(255) NOT NULL,
  `amount` bigint NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `payment_method` varchar(100) DEFAULT NULL,
  `status` enum('pending','success','failed','expired','manual_review','refunded') DEFAULT 'pending',
  `is_anonymous` tinyint(1) DEFAULT '0',
  `message` text,
  `receipt_number` varchar(128) DEFAULT NULL,
  `created_date` varchar(64) DEFAULT NULL,
  `paid_date` varchar(64) DEFAULT NULL,
  `certificate_number` varchar(128) DEFAULT NULL,
  `is_demo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.donations: ~7 rows (approximately)
INSERT INTO `donations` (`id`, `user_id`, `donor_name`, `donor_email`, `donor_phone`, `campaign_title`, `campaign_slug`, `amount`, `category`, `payment_method`, `status`, `is_anonymous`, `message`, `receipt_number`, `created_date`, `paid_date`, `certificate_number`, `is_demo`) VALUES
	('D-0001', 'usr-admin-demo', 'Budi Santoso', 'budi.santoso@example.com', '+6281211110001', 'Beasiswa 1.000 Anak Yatim dan Dhuafa', 'beasiswa-1000-anak-yatim-dhuafa', 25000000, 'Pendidikan', 'Virtual Account BCA', 'success', 0, 'Semoga anak-anak Indonesia bisa terus sekolah dan meraih masa depan emas.', 'AIF-RCPT-2026-000001', '2026-05-18T10:00:00Z', '2026-05-18T10:05:00Z', 'AIF-CERT-ED-0001', 1),
	('D-0002', 'usr-admin-demo', 'Aisyah Putri', 'aisyah.putri@example.com', '+6281211110002', 'Zakat Maal untuk Mustahik Produktif', 'zakat-maal-mustahik-produktif', 5500000, 'Zakat', 'QRIS', 'success', 0, 'Zakat maal tunai pribadi. Mohon disalurkan kepada mereka yang benar-benar mustahik sesuai asnaf.', 'AIF-RCPT-2026-000002', '2026-05-20T14:30:00Z', '2026-05-20T14:31:00Z', 'AIF-CERT-ZK-0002', 1),
	('D-0003', 'usr-admin-demo', 'PT Surya Digital Nusantara', 'csr@suryadigital.co.id', '+6281211110003', 'Tanam 100.000 Pohon untuk Masa Depan', 'tanam-100000-pohon-untuk-masa-depan', 250000000, 'CSR', 'Corporate Transfer', 'success', 0, 'Sumbangan CSR Resmi Perusahaan untuk Program Penghijauan Lingkungan Pesisir Jawa Barat.', 'AIF-RCPT-2026-000003', '2026-05-22T09:00:00Z', '2026-05-22T11:00:00Z', 'AIF-CERT-CSR-0003', 1),
	('D-0004', 'usr-admin-demo', 'Hamba Allah', 'anonymous001@example.com', '+6281211110004', 'Wakaf Pembangunan Pesantren Tahfidz', 'wakaf-pembangunan-pesantren-tahfidz', 10000000, 'Wakaf', 'GoPay', 'success', 1, 'Wakaf jariah diniatkan penuh atas nama kedua orang tua kandung kami tercinta.', 'AIF-RCPT-2026-000004', '2026-05-23T19:40:00Z', '2026-05-23T19:41:00Z', 'AIF-CERT-WK-0004', 1),
	('D-0005', 'usr-admin-demo', 'Yayasan Keluarga Harmoni', 'keluargaharmoni@example.org', '+6281211110005', 'Bantuan Pangan untuk 5.000 Keluarga Dhuafa', 'bantuan-pangan-5000-keluarga-dhuafa', 35000000, 'Pangan', 'Virtual Account Mandiri', 'success', 0, 'Semoga menjadi amalan berkah dan membantu keringanan logistik keluarga dhuafa.', 'AIF-RCPT-2026-000005', '2026-05-25T08:15:00Z', '2026-05-25T08:18:00Z', 'AIF-CERT-PG-0005', 1),
	('D-220582', 'usr-admin-demo', 'Ahmad Syahid', 'ahmad.syahid@example.com', '08123456789', 'Sumur Bersih untuk Desa Kekeringan', 'sumur-bersih-desa-kekeringan', 50000, 'Air Bersih', 'QRIS', 'success', 0, 'Semoga berkah', 'AIF-RCPT-2026-220582', '2026-09-15T02:43:40.582Z', '2026-09-15T02:43:40.582Z', 'AIF-CERT-GEN-0582', 1),
	('D-296420', 'usr-admin-demo', 'Hamba Allah', 'udin@gmail.com', '089123212312', 'Beasiswa 1.000 Anak Yatim dan Dhuafa', 'beasiswa-1000-anak-yatim-dhuafa', 100000, 'Pendidikan', 'QRIS', 'success', 1, 'semangat sejahtera', 'AIF-RCPT-2026-296420', '2026-09-15T06:38:16.420Z', '2026-09-15T06:38:16.420Z', 'AIF-CERT-GEN-6420', 1);

-- Dumping structure for table amanah impact foundation.donors
DROP TABLE IF EXISTS `donors`;
CREATE TABLE IF NOT EXISTS `donors` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `whatsapp` varchar(64) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `type` varchar(64) DEFAULT 'Individual',
  `segment` varchar(64) DEFAULT 'Regular Donor',
  `total_donation` bigint DEFAULT '0',
  `donation_count` int DEFAULT '0',
  `is_recurring` tinyint(1) DEFAULT '0',
  `is_vip` tinyint(1) DEFAULT '0',
  `tags` json DEFAULT NULL,
  `follow_up_status` varchar(64) DEFAULT 'Baru',
  `notes` text,
  `is_demo` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.donors: ~6 rows (approximately)
INSERT INTO `donors` (`id`, `user_id`, `name`, `email`, `whatsapp`, `city`, `province`, `type`, `segment`, `total_donation`, `donation_count`, `is_recurring`, `is_vip`, `tags`, `follow_up_status`, `notes`, `is_demo`, `created_at`) VALUES
	('DN-01', 'usr-admin-demo', 'Budi Santoso', 'budi.santoso@example.com', '+6281211110001', 'Jakarta Selatan', 'DKI Jakarta', 'Individual', 'VIP Donor', 125000000, 18, 1, 1, '["Donatur Sembako", "Pendidikan"]', 'Sudah di-WA', 'Sangat peduli beasiswa anak dhuafa.', 1, '2026-09-08 03:34:07'),
	('DN-02', 'usr-admin-demo', 'Aisyah Putri', 'aisyah.putri@example.com', '+6281211110002', 'Bandung', 'Jawa Barat', 'Individual', 'Regular Donor', 18500000, 12, 1, 0, '["Zakat Maal"]', 'Sudah di-WA', 'Rutin membayar zakat tabungan tahunan.', 1, '2026-09-08 03:34:07'),
	('DN-03', 'usr-admin-demo', 'PT Surya Digital Nusantara', 'csr@suryadigital.co.id', '+6281211110003', 'Jakarta Pusat', 'DKI Jakarta', 'Corporate', 'CSR Donor', 350000000, 4, 0, 1, '["CSR Partner", "Lingkungan"]', 'Meeting Terjadwal', 'Tertarik memperpanjang program reboisasi pesisir.', 1, '2026-09-08 03:34:07'),
	('DN-04', 'usr-admin-demo', 'Yayasan Keluarga Harmoni', 'keluargaharmoni@example.org', '+6281211110005', 'Tangerang Selatan', 'Banten', 'Community', 'Community Donor', 68000000, 7, 0, 1, '["Sponsor Komunitas", "Wakaf"]', 'Terkirim Proposal', 'Komunitas donatur keluarga terdidik.', 1, '2026-09-08 03:34:07'),
	('DN-0607', 'usr-admin-demo', 'Ahmad Syahid', 'ahmad.syahid@example.com', '08123456789', 'Jakarta', 'DKI Jakarta', 'Individual', 'Regular Donor', 50000, 1, 0, 0, '["Air Bersih"]', 'Baru', 'Terdaftar otomatis dari transaksi donasi.', 1, '2026-09-15 02:43:40'),
	('DN-6436', 'usr-admin-demo', 'Hamba Allah', 'udin@gmail.com', '089123212312', 'Jakarta', 'DKI Jakarta', 'Individual', 'Regular Donor', 100000, 1, 0, 0, '["Pendidikan"]', 'Baru', 'Terdaftar otomatis dari transaksi donasi.', 1, '2026-09-15 06:38:16');

-- Dumping structure for table amanah impact foundation.faqs
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE IF NOT EXISTS `faqs` (
  `id` varchar(64) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `question` text NOT NULL,
  `answer` longtext NOT NULL,
  `is_demo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.faqs: ~4 rows (approximately)
INSERT INTO `faqs` (`id`, `category`, `question`, `answer`, `is_demo`) VALUES
	('F-01', 'Donasi', 'Apakah donasi saya akan mendapatkan bukti pembayaran resmi?', 'Ya, sistem kami secara otomatis memproses dan men-generate Receipt resmi atau Bukti Penerimaan Donasi Elektronik lengkap dengan tanda tangan digital dan nomor transaksi unik sesaat setelah donasi terverifikasi sukses.', 1),
	('F-02', 'Zakat', 'Berapa standard nisab zakat profesi bulanan yang berlaku saat ini?', 'Nisab zakat profesi bulanan merujuk pada ketetapan Baznas, yakni setara nilai harga 653 kg gabah kering atau setara 85 gram emas per tahun (sekitar Rp6.800.000 hingga Rp7.500.000 per bulan tergantung fluktuasi harga emas).', 1),
	('F-03', 'Wakaf', 'Apakah wakaf tunai mendapatkan sertifikat digital resmi?', 'Ya, donatur yang menyalurkan wakaf uang di Amanah Impact Foundation berhak mengunduh Sertifikat Wakaf Digital (Digital Wakaf Pledge) berisi data nama pewakaf, ikrar wakaf, peruntukan aset, dan tanda tangan resmi nadzir.', 1);

-- Dumping structure for table amanah impact foundation.feedbacks
DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE IF NOT EXISTS `feedbacks` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `rating` int DEFAULT '5',
  `category` varchar(100) DEFAULT 'Fitur Baru',
  `message` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.feedbacks: ~2 rows (approximately)
INSERT INTO `feedbacks` (`id`, `name`, `email`, `rating`, `category`, `message`, `created_at`) VALUES
	('FB-01', 'Hendra Kusuma', 'hendra@example.com', 5, 'UI/UX', 'Tampilan platform sangat bersih, transparan, dan memudahkan kami melacak penyaluran zakat secara live!', '2026-09-08 07:05:56'),
	('FB-02', 'Dewi Lestari', 'dewi.lestari@corporate.id', 5, 'Fitur Baru', 'Fitur pipeline CSR dan download sertifikat wakaf digital sangat membantu pelaporan ESG perusahaan kami.', '2026-09-08 07:05:56');

-- Dumping structure for table amanah impact foundation.migrations
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.migrations: ~0 rows (approximately)

-- Dumping structure for table amanah impact foundation.organization_info
DROP TABLE IF EXISTS `organization_info`;
CREATE TABLE IF NOT EXISTS `organization_info` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `short_name` varchar(64) DEFAULT NULL,
  `tagline` text,
  `type` varchar(255) DEFAULT NULL,
  `founded_year` int DEFAULT NULL,
  `legal_number` varchar(255) DEFAULT NULL,
  `tax_number` varchar(255) DEFAULT NULL,
  `operational_license` varchar(255) DEFAULT NULL,
  `address` text,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `whatsapp` varchar(64) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `tiktok` varchar(255) DEFAULT NULL,
  `youtube` varchar(255) DEFAULT NULL,
  `facebook` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.organization_info: ~0 rows (approximately)
INSERT INTO `organization_info` (`id`, `name`, `short_name`, `tagline`, `type`, `founded_year`, `legal_number`, `tax_number`, `operational_license`, `address`, `email`, `phone`, `whatsapp`, `website`, `instagram`, `tiktok`, `youtube`, `facebook`) VALUES
	(1, 'Amanah Impact Foundation', 'AIF', 'Transparan Berdampak, Amanah Menggerakkan Kebaikan', 'Yayasan Sosial, Zakat, Wakaf, dan Kemanusiaan', 2014, 'AHU-0012345.AH.01.04.Tahun 2014', '09.123.456.7-012.000', 'SK Dinas Sosial No. 421/DS/2022', 'Jl. Kebaikan Raya No. 88, Jakarta Selatan, Indonesia', 'halo@amanahimpact.org', '+62 21 8888 1234', '+62 812 8888 1234', 'https://amanahimpact.org', 'https://instagram.com/amanahimpact', 'https://tiktok.com/@amanahimpact', 'https://youtube.com/@amanahimpact', 'https://facebook.com/amanahimpact');

-- Dumping structure for table amanah impact foundation.reports
DROP TABLE IF EXISTS `reports`;
CREATE TABLE IF NOT EXISTS `reports` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `campaign_slug` varchar(255) DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `period` varchar(100) DEFAULT NULL,
  `total_received` bigint DEFAULT '0',
  `total_disbursed` bigint DEFAULT '0',
  `remaining_balance` bigint DEFAULT '0',
  `public_visibility` tinyint(1) DEFAULT '1',
  `audit_status` enum('reviewed','published','draft') DEFAULT 'published',
  `description` longtext,
  `published_date` varchar(64) DEFAULT NULL,
  `is_demo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.reports: ~3 rows (approximately)
INSERT INTO `reports` (`id`, `user_id`, `title`, `campaign_slug`, `type`, `period`, `total_received`, `total_disbursed`, `remaining_balance`, `public_visibility`, `audit_status`, `description`, `published_date`, `is_demo`) VALUES
	('RP-01', 'usr-admin-demo', 'Laporan Penyaluran Beasiswa Tahap 2', 'beasiswa-1000-anak-yatim-dhuafa', 'Monthly Report', 'Mei 2026', 486500000, 325000000, 161500000, 1, 'reviewed', 'Laporan rinci amil dan pendistribusian dana beasiswa bagi 642 anak asnaf dan dhuafa di wilayah Jabodetabek terbukti tuntas.', '2026-05-20', 1),
	('RP-02', 'usr-admin-demo', 'Laporan Progress Wakaf Pesantren', 'wakaf-pembangunan-pesantren-tahfidz', 'Progress Report', 'Mei 2026', 1287500000, 925000000, 362500000, 1, 'reviewed', 'Update komprehensif audit fisik pembangunan asrama (55%), kelas baru (40%), dan masjid pesantren (35%).', '2026-05-15', 1),
	('RP-03', 'usr-admin-demo', 'Laporan Bantuan Pangan Ramadan', 'bantuan-pangan-5000-keluarga-dhuafa', 'Distribution Report', 'April 2026', 379250000, 310000000, 69250000, 1, 'published', 'Laporan lengkap aksi pangan kemanusiaan sebar sapa sembako ramadan tersalurkan untuk 3.820 penerima.', '2026-04-20', 1);

-- Dumping structure for table amanah impact foundation.testimonials
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE IF NOT EXISTS `testimonials` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `content` text,
  `message` text,
  `avatar_url` text,
  `location` varchar(100) DEFAULT NULL,
  `rating` int DEFAULT '5',
  `type` varchar(50) DEFAULT 'beneficiary',
  `is_demo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.testimonials: ~5 rows (approximately)
INSERT INTO `testimonials` (`id`, `name`, `role`, `content`, `message`, `avatar_url`, `location`, `rating`, `type`, `is_demo`) VALUES
	('T-01', 'Siti Aminah', 'Orang Tua Penerima Beasiswa', 'Bantuan beasiswa bulanan AIF membuat anak saya bisa tetap sekolah dan membeli perlengkapan sekolah dasar tuntas tanpa cemas.', 'Bantuan beasiswa bulanan AIF membuat anak saya bisa tetap sekolah dan membeli perlengkapan sekolah dasar tuntas tanpa cemas.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', 'Sukabumi', 5, 'beneficiary', 1),
	('T-02', 'Budi Santoso', 'Donatur Rutin', 'Amanah Impact Foundation luar biasa transparan. Setiap bulan saya mendapatkan PDF laporan penyaluran yang didokumentasikan mendetail!', 'Amanah Impact Foundation luar biasa transparan. Setiap bulan saya mendapatkan PDF laporan penyaluran yang didokumentasikan mendetail!', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', 'Jakarta', 5, 'donor', 1),
	('T-03', 'Michael Tan', 'Head of CSR PT Surya Digital', 'Sistem monitoring CSR AIF dan peta distribusinya sangat membantu penyusunan laporan tahunan ESG korporasi kami secara presisi.', 'Sistem monitoring CSR AIF dan peta distribusinya sangat membantu penyusunan laporan tahunan ESG korporasi kami secara presisi.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150', 'Surabaya', 5, 'csr_partner', 1),
	('T-04', 'Ustadz Ahmad Fauzi', 'Penerima Manfaat Sumur Bor', 'Alhamdulillah, sumur bor dari Amanah Impact Foundation mengalirkan air bersih yang sangat melimpah untuk wudhu 300 santri pesantren kami di Cilacap.', 'Alhamdulillah, sumur bor dari Amanah Impact Foundation mengalirkan air bersih yang sangat melimpah untuk wudhu 300 santri pesantren kami di Cilacap.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', 'Cilacap', 5, 'beneficiary', 1);

-- Dumping structure for table amanah impact foundation.users
DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` varchar(64) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(64) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(64) DEFAULT 'admin',
  `photo_url` text,
  `is_demo` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.users: ~0 rows (approximately)
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `photo_url`, `is_demo`, `created_at`) VALUES
	('usr-1788838763585', 'Pengurus Baru', 'pengurus@amanah.org', '081299998888', 'password123', 'Admin', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150', 0, '2026-09-08 03:39:23'),
	('usr-1789455407657', 'Bung Karyatan', 'kar@gmail.com', '0891232131231', 'asdasdasd', 'Admin', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150', 0, '2026-09-15 06:56:47'),
	('usr-admin-demo', 'Ahmad Syarif', 'admin@amanah.org', '081234567890', 'admin123', 'Super Admin', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150', 1, '2026-09-08 03:34:07');

-- Dumping structure for table amanah impact foundation.volunteers
DROP TABLE IF EXISTS `volunteers`;
CREATE TABLE IF NOT EXISTS `volunteers` (
  `id` varchar(64) NOT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `whatsapp` varchar(64) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `skills` json DEFAULT NULL,
  `interest_area` json DEFAULT NULL,
  `availability` varchar(100) DEFAULT NULL,
  `experience` text,
  `status` enum('pending','approved','rejected','inactive') DEFAULT 'pending',
  `registered_date` varchar(64) DEFAULT NULL,
  `is_demo` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table amanah impact foundation.volunteers: ~3 rows (approximately)
INSERT INTO `volunteers` (`id`, `user_id`, `name`, `email`, `whatsapp`, `city`, `skills`, `interest_area`, `availability`, `experience`, `status`, `registered_date`, `is_demo`) VALUES
	('V-01', 'usr-admin-demo', 'Rina Oktaviani', 'rina.volunteer@example.com', '+6281311110001', 'Jakarta Timur', '["Event Management", "Dokumentasi", "Mengajar"]', '["Pendidikan", "Anak Yatim"]', 'Weekend', 'Mengajar relawan di pelosok Maluku 1 tahun.', 'approved', '2026-05-01', 1),
	('V-02', 'usr-admin-demo', 'Dimas Prakoso', 'dimas.volunteer@example.com', '+6281311110002', 'Bandung', '["Logistik", "Driving", "Distribusi"]', '["Bencana", "Pangan"]', 'Flexible', 'Bantuan evakuasi bencana gempa Cianjur.', 'approved', '2026-05-15', 1),
	('V-03', 'usr-admin-demo', 'Nurul Azizah', 'nurul.volunteer@example.com', '+6281311110003', 'Depok', '["Desain Grafis", "Social Media", "Copywriting"]', '["Lingkungan", "CSR"]', 'Weekday Evening', 'Mendesain feed Instagram LSM Hijau.', 'approved', '2026-05-10', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
