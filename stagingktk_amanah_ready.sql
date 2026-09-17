-- Amanah Impact Foundation Database Dump
-- Target Database: stagingktk_amanah
-- Generated for cPanel MySQL Import

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+07:00";

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `phone` VARCHAR(64),
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(64) DEFAULT 'admin',
  `photo_url` TEXT,
  `is_demo` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password`, `role`, `photo_url`, `is_demo`) VALUES
('usr-1', 'Ustadz Salman Farisi', 'admin@amanah.org', '081234567890', 'admin123', 'superadmin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250', 1),
('usr-2', 'Fadhlur Rahman', 'amil@amanah.org', '081298765432', 'amil123', 'admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250', 1);

-- --------------------------------------------------------
-- Table structure for table `organization_info`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `organization_info`;
CREATE TABLE `organization_info` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `short_name` VARCHAR(64),
  `tagline` TEXT,
  `type` VARCHAR(255),
  `founded_year` INT,
  `legal_number` VARCHAR(255),
  `tax_number` VARCHAR(255),
  `operational_license` VARCHAR(255),
  `address` TEXT,
  `email` VARCHAR(255),
  `phone` VARCHAR(64),
  `whatsapp` VARCHAR(64),
  `website` VARCHAR(255),
  `instagram` VARCHAR(255),
  `tiktok` VARCHAR(255),
  `youtube` VARCHAR(255),
  `facebook` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `organization_info` (`id`, `name`, `short_name`, `tagline`, `type`, `founded_year`, `legal_number`, `tax_number`, `operational_license`, `address`, `email`, `phone`, `whatsapp`, `website`, `instagram`, `tiktok`, `youtube`, `facebook`) VALUES
(1, 'Amanah Impact Foundation', 'AIF', 'Transparan Berdampak, Amanah Menggerakkan Kebaikan', 'Yayasan Sosial, Zakat, Wakaf, dan Kemanusiaan', 2014, 'AHU-0012345.AH.01.04.Tahun 2014', '09.123.456.7-012.000', 'SK Dinas Sosial No. 421/DS/2022', 'Jl. Kebaikan Raya No. 88, Jakarta Selatan, Indonesia', 'info@contech.id', '+62 21 8888 1234', '+62 812 8888 1234', 'https://contech.id/', 'https://instagram.com/amanahimpact', 'https://tiktok.com/@amanahimpact', 'https://youtube.com/@amanahimpact', 'https://facebook.com/amanahimpact');

-- --------------------------------------------------------
-- Table structure for table `campaigns`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE `campaigns` (
  `id` VARCHAR(64) PRIMARY KEY,
  `user_id` VARCHAR(64),
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(100),
  `status` ENUM('active', 'draft', 'completed') DEFAULT 'active',
  `is_featured` TINYINT(1) DEFAULT 0,
  `is_urgent` TINYINT(1) DEFAULT 0,
  `target_amount` BIGINT NOT NULL DEFAULT 0,
  `collected_amount` BIGINT NOT NULL DEFAULT 0,
  `disbursed_amount` BIGINT NOT NULL DEFAULT 0,
  `beneficiary_target` INT DEFAULT 0,
  `beneficiary_reached` INT DEFAULT 0,
  `location` VARCHAR(255),
  `start_date` VARCHAR(64),
  `end_date` VARCHAR(64),
  `short_description` TEXT,
  `story` LONGTEXT,
  `image_url` TEXT,
  `thumbnail_url` TEXT,
  `user_email` VARCHAR(255),
  `is_demo` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-01', 'usr-1', 'Beasiswa 1.000 Anak Yatim dan Dhuafa', 'beasiswa-1000-anak-yatim-dhuafa', 'Pendidikan', 'active', 1, 0, 750000000, 486500000, 325000000, 1000, 642, 'Jakarta, Bogor, Depok, Tangerang, Bekasi', '2026-01-01', '2026-12-31', 'Bantu anak yatim dan dhuafa melanjutkan pendidikan melalui beasiswa bulanan, perlengkapan sekolah, dan mentoring.', 'Banyak anak yatim dan dhuafa memiliki semangat belajar tinggi, namun terkendala biaya sekolah, perlengkapan belajar, dan akses mentoring. Program ini membantu mereka tetap sekolah dan tumbuh percaya diri.', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-02', 'usr-1', 'Wakaf Pembangunan Pesantren Tahfidz', 'wakaf-pembangunan-pesantren-tahfidz', 'Wakaf', 'active', 1, 0, 2500000000, 1287500000, 925000000, 500, 180, 'Cianjur, Jawa Barat', '2025-08-01', '2026-11-30', 'Bangun pesantren tahfidz untuk santri yatim dan dhuafa dengan fasilitas asrama, kelas, masjid, dan dapur umum.', 'Pesantren ini dirancang menjadi pusat pendidikan Al-Qur''an dan pemberdayaan santri dhuafa. Wakaf akan digunakan untuk pembangunan fisik dan fasilitas pembelajaran.', 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-03', 'usr-1', 'Bantuan Pangan untuk 5.000 Keluarga Dhuafa', 'bantuan-pangan-5000-keluarga-dhuafa', 'Pangan', 'active', 1, 1, 500000000, 379250000, 310000000, 5000, 3820, 'DKI Jakarta, Banten, Jawa Barat', '2026-03-01', '2026-08-31', 'Paket pangan berisi beras, minyak, telur, gula, dan kebutuhan pokok lainnya untuk keluarga dhuafa prasejahtera.', 'Kenaikan harga kebutuhan pokok membuat banyak keluarga rentan kesulitan memenuhi kebutuhan harian terkecil sekalipun. Program ini menyalurkan bantuan paket pangan darurat untuk keluarga miskin.', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-04', 'usr-1', 'Sumur Bersih untuk Desa Kekeringan', 'sumur-bersih-desa-kekeringan', 'Air Bersih', 'active', 0, 1, 900000000, 512000000, 380000000, 12000, 6400, 'Gunungkidul, NTT, Lombok Timur', '2026-02-10', '2026-10-30', 'Bangun sumur bor dalam dan instalasi air bersih ramah lingkungan untuk desa yang mengalami kekeringan ekstrem.', 'Akses air bersih yang layak masih menjadi barang langka di beberapa wilayah terpencil Indonesia. Donasi digunakan untuk survei geolisterik, pengeboran sumur dalam, tangki air penampungan, dan instalasi perpipaan ke rumah warga.', 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-05', 'usr-1', 'Bantuan Medis Darurat untuk Pasien Dhuafa', 'bantuan-medis-darurat-pasien-dhuafa', 'Kesehatan', 'active', 0, 1, 650000000, 245750000, 188000000, 300, 91, 'Jabodetabek dan Jawa Barat', '2026-04-01', '2026-12-31', 'Bantuan biaya operasional pengobatan, pembelian obat non-BPJS, serta penyediaan fasilitas ambulans gratis bagi dhuafa.', 'Meskipun sebagian besar biaya rumah sakit dijamin, pasien miskin kerap kesulitan membeli vitamin khusus, alat bantu dengar/jalan, hingga ongkos transportasi harian untuk kemoterapi atau cuci darah rutin.', 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-06', 'usr-1', 'Tanam 100.000 Pohon untuk Masa Depan', 'tanam-100000-pohon-untuk-masa-depan', 'Lingkungan', 'active', 0, 0, 1200000000, 458000000, 210000000, 100000, 28500, 'Jawa Barat, Jawa Tengah, Bali, Kalimantan Selatan', '2026-01-15', '2027-01-15', 'Reboisasi lahan kritis hutan kemasyarakatan dengan menanam bibit buah produktif, mangrove pesisir, serta pendampingan adopsi pohon.', 'Program peduli lingkungan ini berfokus pada keseimbangan iklim dan peningkatan ekonomi warga sekitar hutan dengan menanam bibit produktif serba guna.', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-07', 'usr-1', 'Modal Usaha Mikro untuk Ibu Tangguh', 'modal-usaha-mikro-ibu-tangguh', 'Pemberdayaan Ekonomi', 'active', 0, 0, 800000000, 368500000, 240000000, 400, 135, 'Bandung, Garut, Tasikmalaya', '2026-02-01', '2026-12-31', 'Pemberian dana modal usaha bergulir tanpa bunga (qardhul hasan), workshop pembukuan keuangan, serta pendampingan branding digital.', 'Banyak ibu-ibu pengusaha makanan ringan atau warung klontong terpapar pinjaman online atau rentenir karena keterbatasan modal usaha. Kami membantu menghadirkan modal berkah dan pembekalan bisnis.', 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);
INSERT INTO `campaigns` (`id`, `user_id`, `title`, `slug`, `category`, `status`, `is_featured`, `is_urgent`, `target_amount`, `collected_amount`, `disbursed_amount`, `beneficiary_target`, `beneficiary_reached`, `location`, `start_date`, `end_date`, `short_description`, `story`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('C-08', 'usr-1', 'Zakat Maal untuk Mustahik Produktif', 'zakat-maal-mustahik-produktif', 'Zakat', 'active', 1, 0, 1000000000, 632000000, 475000000, 800, 520, 'Indonesia', '2026-01-01', '2026-12-31', 'Salurkan zakat maal Anda untuk program mustahik transformatif agar mereka mampu berdaya dan mandiri secara ekonomi.', 'Dana zakat disalurkan dengan pola asasi syariah 8 asnaf, diprioritaskan bagi program beasiswa vokasi, jaminan nutrisi lansia sebatang kara, serta pendayagunaan zakat produktif bagi mustahik.', 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200', NULL, 'admin@amanah.org', 1);

-- --------------------------------------------------------
-- Table structure for table `campaign_updates`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `campaign_updates`;
CREATE TABLE `campaign_updates` (
  `id` VARCHAR(64) PRIMARY KEY,
  `campaign_slug` VARCHAR(255) NOT NULL,
  `date` VARCHAR(64),
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image_url` TEXT,
  `amount_spent` BIGINT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- --------------------------------------------------------
-- Table structure for table `donations`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `donations`;
CREATE TABLE `donations` (
  `id` VARCHAR(64) PRIMARY KEY,
  `donor_name` VARCHAR(255),
  `donor_email` VARCHAR(255),
  `donor_phone` VARCHAR(64),
  `campaign_title` VARCHAR(255),
  `campaign_slug` VARCHAR(255),
  `amount` BIGINT NOT NULL,
  `category` VARCHAR(64),
  `payment_method` VARCHAR(64),
  `status` ENUM('pending', 'success', 'failed') DEFAULT 'success',
  `is_anonymous` TINYINT(1) DEFAULT 0,
  `message` TEXT,
  `receipt_number` VARCHAR(128),
  `created_date` VARCHAR(64),
  `paid_date` VARCHAR(64),
  `certificate_number` VARCHAR(128),
  `user_email` VARCHAR(255),
  `is_demo` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `donations` (`id`, `donor_name`, `donor_email`, `donor_phone`, `campaign_title`, `campaign_slug`, `amount`, `category`, `payment_method`, `status`, `is_anonymous`, `message`, `receipt_number`, `created_date`, `paid_date`, `certificate_number`, `user_email`, `is_demo`) VALUES
('D-0001', 'Budi Santoso', 'budi.santoso@example.com', '+6281211110001', 'Beasiswa 1.000 Anak Yatim dan Dhuafa', 'beasiswa-1000-anak-yatim-dhuafa', 25000000, 'Pendidikan', 'Virtual Account BCA', 'success', 0, 'Semoga anak-anak Indonesia bisa terus sekolah dan meraih masa depan emas.', 'AIF-RCPT-2026-000001', '2026-05-18T10:00:00Z', '2026-05-18T10:05:00Z', 'AIF-CERT-ED-0001', 'admin@amanah.org', 1);
INSERT INTO `donations` (`id`, `donor_name`, `donor_email`, `donor_phone`, `campaign_title`, `campaign_slug`, `amount`, `category`, `payment_method`, `status`, `is_anonymous`, `message`, `receipt_number`, `created_date`, `paid_date`, `certificate_number`, `user_email`, `is_demo`) VALUES
('D-0002', 'Aisyah Putri', 'aisyah.putri@example.com', '+6281211110002', 'Zakat Maal untuk Mustahik Produktif', 'zakat-maal-mustahik-produktif', 5500000, 'Zakat', 'QRIS', 'success', 0, 'Zakat maal tunai pribadi. Mohon disalurkan kepada mereka yang benar-benar mustahik sesuai asnaf.', 'AIF-RCPT-2026-000002', '2026-05-20T14:30:00Z', '2026-05-20T14:31:00Z', 'AIF-CERT-ZK-0002', 'admin@amanah.org', 1);
INSERT INTO `donations` (`id`, `donor_name`, `donor_email`, `donor_phone`, `campaign_title`, `campaign_slug`, `amount`, `category`, `payment_method`, `status`, `is_anonymous`, `message`, `receipt_number`, `created_date`, `paid_date`, `certificate_number`, `user_email`, `is_demo`) VALUES
('D-0003', 'PT Surya Digital Nusantara', 'csr@suryadigital.co.id', '+6281211110003', 'Tanam 100.000 Pohon untuk Masa Depan', 'tanam-100000-pohon-untuk-masa-depan', 250000000, 'CSR', 'Corporate Transfer', 'success', 0, 'Sumbangan CSR Resmi Perusahaan untuk Program Penghijauan Lingkungan Pesisir Jawa Barat.', 'AIF-RCPT-2026-000003', '2026-05-22T09:00:00Z', '2026-05-22T11:00:00Z', 'AIF-CERT-CSR-0003', 'admin@amanah.org', 1);
INSERT INTO `donations` (`id`, `donor_name`, `donor_email`, `donor_phone`, `campaign_title`, `campaign_slug`, `amount`, `category`, `payment_method`, `status`, `is_anonymous`, `message`, `receipt_number`, `created_date`, `paid_date`, `certificate_number`, `user_email`, `is_demo`) VALUES
('D-0004', 'Hamba Allah', 'anonymous001@example.com', '+6281211110004', 'Wakaf Pembangunan Pesantren Tahfidz', 'wakaf-pembangunan-pesantren-tahfidz', 10000000, 'Wakaf', 'GoPay', 'success', 1, 'Wakaf jariah diniatkan penuh atas nama kedua orang tua kandung kami tercinta.', 'AIF-RCPT-2026-000004', '2026-05-23T19:40:00Z', '2026-05-23T19:41:00Z', 'AIF-CERT-WK-0004', 'admin@amanah.org', 1);
INSERT INTO `donations` (`id`, `donor_name`, `donor_email`, `donor_phone`, `campaign_title`, `campaign_slug`, `amount`, `category`, `payment_method`, `status`, `is_anonymous`, `message`, `receipt_number`, `created_date`, `paid_date`, `certificate_number`, `user_email`, `is_demo`) VALUES
('D-0005', 'Yayasan Keluarga Harmoni', 'keluargaharmoni@example.org', '+6281211110005', 'Bantuan Pangan untuk 5.000 Keluarga Dhuafa', 'bantuan-pangan-5000-keluarga-dhuafa', 35000000, 'Pangan', 'Virtual Account Mandiri', 'success', 0, 'Semoga menjadi amalan berkah dan membantu keringanan logistik keluarga dhuafa.', 'AIF-RCPT-2026-000005', '2026-05-25T08:15:00Z', '2026-05-25T08:18:00Z', 'AIF-CERT-PG-0005', 'admin@amanah.org', 1);

-- --------------------------------------------------------
-- Table structure for table `donors`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `donors`;
CREATE TABLE `donors` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(64),
  `category` ENUM('Regular', 'Loyal', 'VIP', 'Corporate') DEFAULT 'Regular',
  `total_donated` BIGINT DEFAULT 0,
  `donation_count` INT DEFAULT 0,
  `last_donation_date` VARCHAR(64),
  `notes` TEXT,
  `is_demo` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `donors` (`id`, `name`, `email`, `phone`, `category`, `total_donated`, `donation_count`, `last_donation_date`, `notes`, `is_demo`) VALUES
('DN-01', 'Budi Santoso', 'budi.santoso@example.com', NULL, NULL, undefined, 18, NULL, 'Sangat peduli beasiswa anak dhuafa.', 1);
INSERT INTO `donors` (`id`, `name`, `email`, `phone`, `category`, `total_donated`, `donation_count`, `last_donation_date`, `notes`, `is_demo`) VALUES
('DN-02', 'Aisyah Putri', 'aisyah.putri@example.com', NULL, NULL, undefined, 12, NULL, 'Rutin membayar zakat tabungan tahunan.', 1);
INSERT INTO `donors` (`id`, `name`, `email`, `phone`, `category`, `total_donated`, `donation_count`, `last_donation_date`, `notes`, `is_demo`) VALUES
('DN-03', 'PT Surya Digital Nusantara', 'csr@suryadigital.co.id', NULL, NULL, undefined, 4, NULL, 'Tertarik memperpanjang program reboisasi pesisir.', 1);
INSERT INTO `donors` (`id`, `name`, `email`, `phone`, `category`, `total_donated`, `donation_count`, `last_donation_date`, `notes`, `is_demo`) VALUES
('DN-04', 'Yayasan Keluarga Harmoni', 'keluargaharmoni@example.org', NULL, NULL, undefined, 7, NULL, 'Komunitas donatur keluarga terdidik.', 1);

-- --------------------------------------------------------
-- Table structure for table `volunteers`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `volunteers`;
CREATE TABLE `volunteers` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(64),
  `skills` JSON,
  `experience` TEXT,
  `status` ENUM('Pending', 'Approved', 'Active', 'Inactive') DEFAULT 'Pending',
  `joined_date` VARCHAR(64)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `volunteers` (`id`, `name`, `email`, `phone`, `skills`, `experience`, `status`, `joined_date`) VALUES
('V-01', 'Rina Oktaviani', 'rina.volunteer@example.com', NULL, '["Event Management","Dokumentasi","Mengajar"]', 'Mengajar relawan di pelosok Maluku 1 tahun.', 'approved', NULL);
INSERT INTO `volunteers` (`id`, `name`, `email`, `phone`, `skills`, `experience`, `status`, `joined_date`) VALUES
('V-02', 'Dimas Prakoso', 'dimas.volunteer@example.com', NULL, '["Logistik","Driving","Distribusi"]', 'Bantuan evakuasi bencana gempa Cianjur.', 'pending', NULL);
INSERT INTO `volunteers` (`id`, `name`, `email`, `phone`, `skills`, `experience`, `status`, `joined_date`) VALUES
('V-03', 'Nurul Azizah', 'nurul.volunteer@example.com', NULL, '["Desain Grafis","Social Media","Copywriting"]', 'Mendesain feed Instagram LSM Hijau.', 'approved', NULL);

-- --------------------------------------------------------
-- Table structure for table `csr_inquiries`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `csr_inquiries`;
CREATE TABLE `csr_inquiries` (
  `id` VARCHAR(64) PRIMARY KEY,
  `company_name` VARCHAR(255) NOT NULL,
  `pic_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255),
  `phone` VARCHAR(64),
  `interested_program` VARCHAR(100),
  `budget_range` VARCHAR(100),
  `status` ENUM('New', 'In Discussion', 'Approved', 'Rejected') DEFAULT 'New',
  `notes` TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `csr_inquiries` (`id`, `company_name`, `pic_name`, `email`, `phone`, `interested_program`, `budget_range`, `status`, `notes`) VALUES
('CSR-01', 'PT Surya Digital Nusantara', 'Michael Tan', 'michael.tan@suryadigital.co.id', NULL, 'Lingkungan', 'Rp250.000.000 - Rp500.000.000', NULL, NULL);
INSERT INTO `csr_inquiries` (`id`, `company_name`, `pic_name`, `email`, `phone`, `interested_program`, `budget_range`, `status`, `notes`) VALUES
('CSR-02', 'PT Harmoni Sehat Indonesia', 'dr. Laura Amanda', 'laura@harmonisehat.co.id', NULL, 'Kesehatan', 'Rp100.000.000 - Rp250.000.000', NULL, NULL);
INSERT INTO `csr_inquiries` (`id`, `company_name`, `pic_name`, `email`, `phone`, `interested_program`, `budget_range`, `status`, `notes`) VALUES
('CSR-03', 'Bank Amanah Syariah', 'Rizky Ramadhan', 'rizky@bankamanah.co.id', NULL, 'Zakat dan Wakaf', 'Rp500.000.000 - Rp1.000.000.000', NULL, NULL);

-- --------------------------------------------------------
-- Table structure for table `reports`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `period` VARCHAR(100),
  `year` INT,
  `total_income` BIGINT DEFAULT 0,
  `total_disbursed` BIGINT DEFAULT 0,
  `operational_cost` BIGINT DEFAULT 0,
  `audit_opinion` VARCHAR(100),
  `pdf_url` TEXT,
  `is_published` TINYINT(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reports` (`id`, `title`, `period`, `year`, `total_income`, `total_disbursed`, `operational_cost`, `audit_opinion`, `pdf_url`, `is_published`) VALUES
('RP-01', 'Laporan Penyaluran Beasiswa Tahap 2', 'Mei 2026', undefined, undefined, 325000000, undefined, NULL, NULL, 0);
INSERT INTO `reports` (`id`, `title`, `period`, `year`, `total_income`, `total_disbursed`, `operational_cost`, `audit_opinion`, `pdf_url`, `is_published`) VALUES
('RP-02', 'Laporan Progress Wakaf Pesantren', 'Mei 2026', undefined, undefined, 925000000, undefined, NULL, NULL, 0);
INSERT INTO `reports` (`id`, `title`, `period`, `year`, `total_income`, `total_disbursed`, `operational_cost`, `audit_opinion`, `pdf_url`, `is_published`) VALUES
('RP-03', 'Laporan Bantuan Pangan Ramadan', 'April 2026', undefined, undefined, 310000000, undefined, NULL, NULL, 0);

-- --------------------------------------------------------
-- Table structure for table `blog_posts`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `blog_posts`;
CREATE TABLE `blog_posts` (
  `id` VARCHAR(64) PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `category` VARCHAR(100),
  `author` VARCHAR(100),
  `status` ENUM('published', 'draft') DEFAULT 'published',
  `excerpt` TEXT,
  `content` LONGTEXT,
  `language` VARCHAR(10) DEFAULT 'id',
  `published_date` VARCHAR(64),
  `image_url` TEXT,
  `thumbnail_url` TEXT,
  `user_email` VARCHAR(255),
  `is_demo` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `category`, `author`, `status`, `excerpt`, `content`, `language`, `published_date`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('B-01', 'Mengapa Transparansi Donasi Penting untuk Yayasan Modern', 'mengapa-transparansi-donasi-penting', 'Transparansi', 'Salsabila Putri', 'published', 'Kepercayaan publik dibangun dari laporan yang jelas, dokumentasi nyata di lapangan, serta audit transparansi keuangan yang konsisten.', 'Di era digital yang serba cepat ini, trust (kepercayaan) menjadi mata uang terpenting bagi sebuah lembaga nirlaba atau NGO kemanusiaan. Transparansi bukan lagi sekadar kewajiban pelaporan administratif kepada dewan pembina, melainkan sebuah bentuk pertanggungjawaban sosial yang mutlak kepada publik luas.

Dengan sistem pencoretan dana digital atau real-time public ledger, donatur bisa secara presisi melihat kemana mengalirnya rupiah yang mereka percayakan. Hal ini memperkuat hubungan batin donatur, meyakinkan bahwa bantuan telah sampai tuntas pada yang paling berpendidikan dan paling membutuhkan secara profesional.', 'id', '2026-05-10', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600', NULL, 'admin@amanah.org', 1);
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `category`, `author`, `status`, `excerpt`, `content`, `language`, `published_date`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('B-02', 'Panduan Menghitung Zakat Penghasilan Lengkap', 'panduan-menghitung-zakat-penghasilan-lengkap', 'Zakat', 'Ahmad Zaini', 'published', 'Pelajari secara mudah cara menghitung zakat penghasilan, nisab nisbah bulanan dan tahunan, serta dalil amil syariah.', 'Zakat penghasilan (zakat profesi) adalah bagian dari zakat mal yang wajib dikeluarkan atas harta yang diperoleh dari hasil profesi atau pekerjaan/pendapatan halal.

Cara menghitungnya sangat sederhana: Jika pendapatan bulanan bersih Anda melebihi batas nisab emas (sekitar setara 85 gram emas per tahun, atau kurang lebih Rp85.000.000 pertahun alias Rp7.000.000 per bulan), maka wajib mengeluarkan zakat pendapatan sebesar 2,5%. Menggunakan Zakat Calculator di AIF, Anda tinggal memasukkan nominal pendapatan kotor maupun bersih beserta pemotongan utang jatuh tempo, untuk langsung berzakat tuntas seketika kian berkah.', 'id', '2026-05-15', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600', NULL, 'admin@amanah.org', 1);
INSERT INTO `blog_posts` (`id`, `title`, `slug`, `category`, `author`, `status`, `excerpt`, `content`, `language`, `published_date`, `image_url`, `thumbnail_url`, `user_email`, `is_demo`) VALUES
('B-03', 'How CSR Programs Can Create Measurable Social Impact', 'csr-programs-measurable-social-impact', 'CSR', 'Rendy Saputra', 'published', 'Corporate social responsibility becomes stronger and more meaningful when driven by data, local community ownership, and measurable outcomes.', 'Modern corporations are no longer assessed solely on quarterly profits or stock values. The rise of ESG (Environmental, Social, and Governance) principles means that corporate social responsibility is fully under the microscope.

To make a CSR campaign truly successful, it must pivot from traditional cash handouts to sustainable, measurable development plans, such as providing solar water wells, backing formal tahfidz boarding schools, or vocational educational grants that yield long-term livelihood security. Dynamic dashboards provided by Amanah Impact Foundation help partners download live data points and field photos suitable for corporate reports.', 'en', '2026-05-18', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600', NULL, 'admin@amanah.org', 1);

-- --------------------------------------------------------
-- Table structure for table `testimonials`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `testimonials`;
CREATE TABLE `testimonials` (
  `id` VARCHAR(64) PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `role` VARCHAR(255),
  `content` TEXT,
  `message` TEXT,
  `avatar_url` TEXT,
  `location` VARCHAR(255),
  `rating` INT DEFAULT 5,
  `type` ENUM('beneficiary', 'donor', 'partner', 'volunteer') DEFAULT 'beneficiary'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `testimonials` (`id`, `name`, `role`, `content`, `message`, `avatar_url`, `location`, `rating`, `type`) VALUES
('T-01', 'Siti Aminah', 'Orang Tua Penerima Beasiswa', 'Bantuan beasiswa bulanan AIF membuat anak saya bisa tetap sekolah dan membeli perlengkapan sekolah dasar tuntas tanpa cemas.', 'Bantuan beasiswa bulanan AIF membuat anak saya bisa tetap sekolah dan membeli perlengkapan sekolah dasar tuntas tanpa cemas.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150', 'Sukabumi', 5, 'beneficiary');
INSERT INTO `testimonials` (`id`, `name`, `role`, `content`, `message`, `avatar_url`, `location`, `rating`, `type`) VALUES
('T-04', 'Ustadz Ahmad Fauzi', 'Penerima Manfaat Sumur Bor', 'Alhamdulillah, sumur bor dari Amanah Impact Foundation mengalirkan air bersih yang sangat melimpah untuk wudhu 300 santri pesantren kami di Cilacap.', 'Alhamdulillah, sumur bor dari Amanah Impact Foundation mengalirkan air bersih yang sangat melimpah untuk wudhu 300 santri pesantren kami di Cilacap.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150', 'Cilacap', 5, 'beneficiary');
INSERT INTO `testimonials` (`id`, `name`, `role`, `content`, `message`, `avatar_url`, `location`, `rating`, `type`) VALUES
('T-02', 'Budi Santoso', 'Donatur Rutin', 'Amanah Impact Foundation luar biasa transparan. Setiap bulan saya mendapatkan PDF laporan penyaluran yang didokumentasikan mendetail!', 'Amanah Impact Foundation luar biasa transparan. Setiap bulan saya mendapatkan PDF laporan penyaluran yang didokumentasikan mendetail!', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150', 'Jakarta', 5, 'donor');
INSERT INTO `testimonials` (`id`, `name`, `role`, `content`, `message`, `avatar_url`, `location`, `rating`, `type`) VALUES
('T-03', 'Michael Tan', 'Head of CSR PT Surya Digital', 'Sistem monitoring CSR AIF dan peta distribusinya sangat membantu penyusunan laporan tahunan ESG korporasi kami secara presisi.', 'Sistem monitoring CSR AIF dan peta distribusinya sangat membantu penyusunan laporan tahunan ESG korporasi kami secara presisi.', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150', 'Surabaya', 5, 'csr_partner');

-- --------------------------------------------------------
-- Table structure for table `faqs`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `faqs`;
CREATE TABLE `faqs` (
  `id` VARCHAR(64) PRIMARY KEY,
  `category` VARCHAR(100),
  `question` TEXT NOT NULL,
  `answer` TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `faqs` (`id`, `category`, `question`, `answer`) VALUES
('F-01', 'Donasi', 'Apakah donasi saya akan mendapatkan bukti pembayaran resmi?', 'Ya, sistem kami secara otomatis memproses dan men-generate Receipt resmi atau Bukti Penerimaan Donasi Elektronik lengkap dengan tanda tangan digital dan nomor transaksi unik sesaat setelah donasi terverifikasi sukses.');
INSERT INTO `faqs` (`id`, `category`, `question`, `answer`) VALUES
('F-02', 'Zakat', 'Berapa standard nisab zakat profesi bulanan yang berlaku saat ini?', 'Nisab zakat profesi bulanan merujuk pada ketetapan Baznas, yakni setara nilai harga 653 kg gabah kering atau setara 85 gram emas per tahun (sekitar Rp6.800.000 hingga Rp7.500.000 per bulan tergantung fluktuasi harga emas).');
INSERT INTO `faqs` (`id`, `category`, `question`, `answer`) VALUES
('F-03', 'Wakaf', 'Apakah wakaf tunai mendapatkan sertifikat digital resmi?', 'Ya, donatur yang menyalurkan wakaf uang di Amanah Impact Foundation berhak mengunduh Sertifikat Wakaf Digital (Digital Wakaf Pledge) berisi data nama pewakaf, ikrar wakaf, peruntukan aset, dan tanda tangan resmi nadzir.');

-- --------------------------------------------------------
-- Table structure for table `feedbacks`
-- --------------------------------------------------------
DROP TABLE IF EXISTS `feedbacks`;
CREATE TABLE `feedbacks` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255),
  `email` VARCHAR(255),
  `rating` INT DEFAULT 5,
  `category` VARCHAR(64),
  `message` TEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `feedbacks` (`name`, `email`, `rating`, `category`, `message`) VALUES
('Hamba Allah', 'donatur@gmail.com', 5, 'Kalkulator Zakat', 'Alhamdulillah fitur kalkulator zakat sangat membantu menghitung nisab dengan presisi.'),
('Dewi Lestari', 'dewi.csr@perusahaan.co.id', 5, 'Kemitraan CSR', 'Sistem proposal dan pelaporan auditnya sangat profesional dan transparan.');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
