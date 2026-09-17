<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\OrganizationInfo;
use App\Models\Campaign;
use App\Models\CampaignUpdate;
use App\Models\Donation;
use App\Models\Donor;
use App\Models\Volunteer;
use App\Models\CsrInquiry;
use App\Models\Report;
use App\Models\BlogPost;
use App\Models\Testimonial;
use App\Models\Faq;
use App\Models\Feedback;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users (Super Admin Demo & Amil)
        User::updateOrCreate(
            ['email' => 'admin@amanah.org'],
            [
                'name' => 'Ustadz Salman Farisi',
                'phone' => '081234567890',
                'password' => Hash::make('admin123'),
                'role' => 'superadmin',
                'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
                'is_demo' => true,
            ]
        );

        User::updateOrCreate(
            ['email' => 'amil@amanah.org'],
            [
                'name' => 'Fadhlur Rahman',
                'phone' => '081298765432',
                'password' => Hash::make('amil123'),
                'role' => 'amil',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250',
                'is_demo' => true,
            ]
        );

        // 2. Organization Info
        OrganizationInfo::updateOrCreate(
            ['slug' => 'amanah-impact-foundation'],
            [
                'name' => 'Amanah Impact Foundation',
                'phone' => '(021) 8888-1234',
                'email' => 'info@amanahimpact.org',
                'address' => 'Gedung Menara Amanah Lantai 4, Jl. Kemakmuran No. 12 Jakarta Pusat, Indonesia',
                'sk_kemenkumham' => 'AHU-00123.AH.01.04 TAHUN 2024',
                'npwp' => '45.123.456.7-012.000',
                'dinsos_reg' => '312/DINSOS-PP/2025',
                'description' => 'Lembaga amil zakat, wakaf, dan kemanusiaan modern bersertifikasi resmi. Transparan berdampak, amanah menggerakkan kedaulatan umat.',
            ]
        );

        // 3. Campaigns (8 Demo Campaigns)
        $campaignsData = [
            [
                'id' => 'C-01',
                'title' => 'Beasiswa 1.000 Anak Yatim dan Dhuafa',
                'slug' => 'beasiswa-1000-anak-yatim-dhuafa',
                'category' => 'Pendidikan',
                'status' => 'active',
                'is_featured' => true,
                'is_urgent' => false,
                'target_amount' => 500000000,
                'collected_amount' => 345000000,
                'disbursed_amount' => 280000000,
                'beneficiary_target' => 1000,
                'beneficiary_reached' => 690,
                'location' => 'Jawa Barat & Banten',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'short_description' => 'Bantuan SPP bulanan, perlengkapan belajar, seragam sekolah, dan pembinaan karakter berkala untuk santri yatim dan dhuafa berprestasi.',
                'story' => "Pendidikan adalah jembatan emas pemutus rantai kemiskinan antar generasi. Melalui program Beasiswa 1.000 Santri dan Pelajar Dhuafa, Amanah Impact Foundation memastikan anak-anak yatim berprestasi dari keluarga prasejahtera mendapatkan akses pendidikan bermutu tanpa terhalang biaya SPP, buku, atau seragam.\n\nSetiap penerima manfaat mendapatkan pendampingan amil terpadu dan pembinaan tahfidz Al-Quran mingguan.",
                'fund_usage' => [
                    ['item' => 'SPP & Biaya Pendidikan Formal 1 Tahun', 'amount' => 300000000],
                    ['item' => 'Seragam, Sepatu & Tas Sekolah', 'amount' => 100000000],
                    ['item' => 'Buku Pelajaran & Modul Belajar', 'amount' => 60000000],
                    ['item' => 'Pembinaan Karakter & Guru Pembimbing', 'amount' => 40000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'C-02',
                'title' => 'Sumur Bor dan Pipanisasi Air Bersih Pelosok NTT',
                'slug' => 'sumur-bor-pipanisasi-air-bersih-pelosok-ntt',
                'category' => 'Air Bersih',
                'status' => 'active',
                'is_featured' => true,
                'is_urgent' => true,
                'target_amount' => 350000000,
                'collected_amount' => 295000000,
                'disbursed_amount' => 250000000,
                'beneficiary_target' => 2500,
                'beneficiary_reached' => 2100,
                'location' => 'Timor Tengah Selatan, NTT',
                'start_date' => '2026-02-15',
                'end_date' => '2026-09-30',
                'short_description' => 'Pengeboran sumur air sedalam 80 meter, instalasi panel surya pompa air otomatis, dan tandon penampung 10.000 liter untuk 3 desa terisolir.',
                'story' => "Ratusan keluarga di pelosok Timor Tengah Selatan harus berjalan kaki mendaki bukit terjal sejauh 4 kilometer setiap subuh hanya untuk mengambil air keruh di kubangan sungai. Saat kemarau tiba, krisis air mengancam kesehatan balita dan sanitasi lansia.\n\nProgram ini menghadirkan sumur bor modern bertenaga surya ramah lingkungan yang mengalirkan air bersih layak minum 24 jam nonstop langsung ke pusat desa.",
                'fund_usage' => [
                    ['item' => 'Geolistrik & Pengeboran Sedalam 80 Meter', 'amount' => 150000000],
                    ['item' => 'Pompa Submersible & Solar Panel 3000WP', 'amount' => 90000000],
                    ['item' => 'Pipa HDPE 4.5 KM & Bak Penampungan Utama', 'amount' => 80000000],
                    ['item' => 'Uji Lab Kualitas Air Kemenkes & Pelatihan Warga', 'amount' => 30000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'C-03',
                'title' => 'Tanam 100.000 Pohon untuk Masa Depan',
                'slug' => 'tanam-100000-pohon-untuk-masa-depan',
                'category' => 'Lingkungan',
                'status' => 'active',
                'is_featured' => false,
                'is_urgent' => false,
                'target_amount' => 400000000,
                'collected_amount' => 180000000,
                'disbursed_amount' => 120000000,
                'beneficiary_target' => 5000,
                'beneficiary_reached' => 2250,
                'location' => 'Pesisir Pantai Utara & Lereng Merapi',
                'start_date' => '2026-03-01',
                'end_date' => '2026-12-31',
                'short_description' => 'Penanaman bibit mangrove, pohon buah produktif, dan tanaman penahan abrasi pesisir yang dikelola bersama kelompok tani lokal.',
                'story' => 'Menjaga bumi adalah amanah syariah. Abrasi pesisir dan degradasi hutan mengancam ekosistem nelayan dan petani. Kami menanam 100.000 bibit mangrove dan pohon produktif yang dipetakan dengan GPS koordinat terbuka.',
                'fund_usage' => [
                    ['item' => 'Pengadaan 100.000 Bibit Mangrove & Buah', 'amount' => 220000000],
                    ['item' => 'Operasional Tanam & Pemeliharaan 2 Tahun', 'amount' => 120000000],
                    ['item' => 'Monitoring Satelit & Sertifikasi Karbon', 'amount' => 60000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'C-04',
                'title' => 'Layanan Ambulans dan Klinik Gratis Dhuafa',
                'slug' => 'layanan-ambulans-klinik-gratis-dhuafa',
                'category' => 'Kesehatan',
                'status' => 'active',
                'is_featured' => false,
                'is_urgent' => true,
                'target_amount' => 600000000,
                'collected_amount' => 450000000,
                'disbursed_amount' => 380000000,
                'beneficiary_target' => 4000,
                'beneficiary_reached' => 3120,
                'location' => 'Jabodetabek & Jawa Tengah',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'short_description' => 'Operasional 2 unit ambulans siaga darurat 24 jam gratis, klinik keliling dokter umum & spesialis, serta distribusi obat-obatan dhuafa.',
                'story' => 'Bagi saudara kita yang kurang mampu, biaya transportasi ambulans darurat seringkali menjadi beban berat. Layanan Ambulans Siaga Gratis AIF siap 24 jam mengantar pasien gawat darurat dan jenazah tanpa dipungut biaya sepeserpun.',
                'fund_usage' => [
                    ['item' => 'BBM, Servis & Driver Ambulans 1 Tahun', 'amount' => 240000000],
                    ['item' => 'Pengadaan Obat-Obatan & Alat Medis', 'amount' => 200000000],
                    ['item' => 'Honor Dokter & Perawat Relawan Medis', 'amount' => 160000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'C-05',
                'title' => 'Dapur Pangan Berkah untuk Lansia Sebatang Kara',
                'slug' => 'dapur-pangan-berkah-lansia-sebatang-kara',
                'category' => 'Pangan',
                'status' => 'active',
                'is_featured' => false,
                'is_urgent' => false,
                'target_amount' => 250000000,
                'collected_amount' => 195000000,
                'disbursed_amount' => 160000000,
                'beneficiary_target' => 500,
                'beneficiary_reached' => 410,
                'location' => 'Surabaya, Malang, Pasuruan',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'short_description' => 'Pengiriman makanan bergizi siap santap setiap pagi dan sore hari langsung ke rumah lansia dhuafa sebatang kara.',
                'story' => 'Banyak kakek dan nenek lansia yang hidup sebatang kara dan kesulitan untuk memasak setiap harinya. Relawan Dapur Berkah menyiapkan 500 porsi makanan sehat hangat setiap hari yang diantarkan langsung ke rumah mereka.',
                'fund_usage' => [
                    ['item' => 'Bahan Baku Makanan Bergizi 1 Tahun', 'amount' => 180000000],
                    ['item' => 'Packaging Food Grade & Logistik Antar', 'amount' => 45000000],
                    ['item' => 'Suplemen & Vitamin Khusus Lansia', 'amount' => 25000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'C-06',
                'title' => 'Wakaf Pembangunan Pesantren Tahfidz Dhuafa',
                'slug' => 'wakaf-pembangunan-pesantren-tahfidz-dhuafa',
                'category' => 'Wakaf',
                'status' => 'active',
                'is_featured' => true,
                'is_urgent' => false,
                'target_amount' => 1500000000,
                'collected_amount' => 920000000,
                'disbursed_amount' => 750000000,
                'beneficiary_target' => 300,
                'beneficiary_reached' => 180,
                'location' => 'Bogor, Jawa Barat',
                'start_date' => '2026-01-01',
                'end_date' => '2027-06-30',
                'short_description' => 'Pembangunan asrama santri 3 lantai, ruang kelas berpendingin udara, masjid jami, dan perpustakaan digital terintegrasi.',
                'story' => 'Wakaf produktif abadi yang pahalanya terus mengalir sepanjang masa. Pesantren ini memberikan beasiswa 100% gratis bagi 300 santri penghafal Quran dari pelosok Nusantara.',
                'fund_usage' => [
                    ['item' => 'Struktur Bangunan & Pengecoran Lantai 2-3', 'amount' => 800000000],
                    ['item' => 'Penyelesaian Interior Asrama & Ranjang Tingkat', 'amount' => 400000000],
                    ['item' => 'Masjid & Sarana Sanitasi Wudhu Santri', 'amount' => 300000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'C-07',
                'title' => 'Pemberdayaan UMKM Ibu Tangguh Mandiri',
                'slug' => 'pemberdayaan-umkm-ibu-tangguh-mandiri',
                'category' => 'Pemberdayaan',
                'status' => 'active',
                'is_featured' => false,
                'is_urgent' => false,
                'target_amount' => 800000000,
                'collected_amount' => 540000000,
                'disbursed_amount' => 420000000,
                'beneficiary_target' => 200,
                'beneficiary_reached' => 145,
                'location' => 'Bandung, Garut, Tasikmalaya',
                'start_date' => '2026-02-01',
                'end_date' => '2026-12-31',
                'short_description' => 'Pemberian dana modal usaha bergulir tanpa bunga (qardhul hasan), workshop pembukuan keuangan, serta pendampingan branding digital.',
                'story' => 'Banyak ibu-ibu pengusaha makanan ringan atau warung klontong terpapar pinjaman online atau rentenir karena keterbatasan modal usaha. Kami membantu menghadirkan modal berkah dan pembekalan bisnis.',
                'fund_usage' => [
                    ['item' => 'Penyaluran modal usaha mandiri', 'amount' => 560000000],
                    ['item' => 'Workshop & modul pembukuan gratis', 'amount' => 120000000],
                    ['item' => 'Pendampingan kemasan & branding digital', 'amount' => 90000000],
                    ['item' => 'Evaluasi berkala & monitoring', 'amount' => 30000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'C-08',
                'title' => 'Zakat Maal untuk Mustahik Produktif',
                'slug' => 'zakat-maal-mustahik-produktif',
                'category' => 'Zakat',
                'status' => 'active',
                'is_featured' => true,
                'is_urgent' => false,
                'target_amount' => 1000000000,
                'collected_amount' => 632000000,
                'disbursed_amount' => 475000000,
                'beneficiary_target' => 800,
                'beneficiary_reached' => 520,
                'location' => 'Indonesia',
                'start_date' => '2026-01-01',
                'end_date' => '2026-12-31',
                'short_description' => 'Salurkan zakat maal Anda untuk program mustahik transformatif agar mereka mampu berdaya dan mandiri secara ekonomi.',
                'story' => 'Dana zakat disalurkan dengan pola asasi syariah 8 asnaf, diprioritaskan bagi program beasiswa vokasi, jaminan nutrisi lansia sebatang kara, serta pendayagunaan zakat produktif bagi mustahik.',
                'fund_usage' => [
                    ['item' => 'Bantuan santunan langsung fakir miskin', 'amount' => 520000000],
                    ['item' => 'Penyaluran dana modal kerja produktif', 'amount' => 300000000],
                    ['item' => 'Beasiswa pendidikan yatim & asnaf', 'amount' => 120000000],
                    ['item' => 'Hak Amil (pengelolaan zakat)', 'amount' => 60000000]
                ],
                'image_url' => 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=1200',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&q=80&w=600',
                'video_url' => '',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ]
        ];

        foreach ($campaignsData as $c) {
            Campaign::updateOrCreate(['id' => $c['id']], $c);
        }

        // 4. Campaign Updates
        CampaignUpdate::updateOrCreate(
            ['id' => 'CU-01'],
            [
                'campaign_slug' => 'sumur-bor-pipanisasi-air-bersih-pelosok-ntt',
                'title' => 'Pengeboran Tahap 1 Capai Kedalaman 60 Meter',
                'date' => '2026-04-10',
                'description' => 'Tim teknis relawan berhasil menembus lapisan akuifer air tawar berkualitas tinggi di Desa Oenino. Debit air terukur 3.5 liter per detik.',
                'image_url' => 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=600',
                'amount_spent' => 120000000,
            ]
        );

        // 5. Donations
        $donationsData = [
            [
                'id' => 'D-0001',
                'donor_name' => 'Budi Santoso',
                'donor_email' => 'budi.santoso@example.com',
                'donor_phone' => '+6281211110001',
                'campaign_title' => 'Beasiswa 1.000 Anak Yatim dan Dhuafa',
                'campaign_slug' => 'beasiswa-1000-anak-yatim-dhuafa',
                'amount' => 25000000,
                'category' => 'Pendidikan',
                'payment_method' => 'Virtual Account BCA',
                'status' => 'success',
                'is_anonymous' => false,
                'message' => 'Semoga anak-anak Indonesia bisa terus sekolah dan meraih masa depan emas.',
                'receipt_number' => 'AIF-RCPT-2026-000001',
                'created_date' => '2026-05-18 10:00:00',
                'paid_date' => '2026-05-18 10:05:00',
                'certificate_number' => 'AIF-CERT-ED-0001',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'D-0002',
                'donor_name' => 'Aisyah Putri',
                'donor_email' => 'aisyah.putri@example.com',
                'donor_phone' => '+6281211110002',
                'campaign_title' => 'Zakat Maal untuk Mustahik Produktif',
                'campaign_slug' => 'zakat-maal-mustahik-produktif',
                'amount' => 5500000,
                'category' => 'Zakat',
                'payment_method' => 'QRIS',
                'status' => 'success',
                'is_anonymous' => false,
                'message' => 'Zakat maal tunai pribadi. Mohon disalurkan kepada mereka yang benar-benar mustahik sesuai asnaf.',
                'receipt_number' => 'AIF-RCPT-2026-000002',
                'created_date' => '2026-05-20 14:30:00',
                'paid_date' => '2026-05-20 14:31:00',
                'certificate_number' => 'AIF-CERT-ZK-0002',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'D-0003',
                'donor_name' => 'PT Surya Digital Nusantara',
                'donor_email' => 'csr@suryadigital.co.id',
                'donor_phone' => '+6281211110003',
                'campaign_title' => 'Tanam 100.000 Pohon untuk Masa Depan',
                'campaign_slug' => 'tanam-100000-pohon-untuk-masa-depan',
                'amount' => 250000000,
                'category' => 'CSR',
                'payment_method' => 'Corporate Transfer',
                'status' => 'success',
                'is_anonymous' => false,
                'message' => 'Sumbangan CSR Resmi Perusahaan untuk Program Penghijauan Lingkungan Pesisir Jawa Barat.',
                'receipt_number' => 'AIF-RCPT-2026-000003',
                'created_date' => '2026-05-22 09:00:00',
                'paid_date' => '2026-05-22 11:00:00',
                'certificate_number' => 'AIF-CERT-CSR-0003',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'D-0004',
                'donor_name' => 'Hamba Allah',
                'donor_email' => 'anonymous@amanah.org',
                'donor_phone' => '',
                'campaign_title' => 'Sumur Bor dan Pipanisasi Air Bersih Pelosok NTT',
                'campaign_slug' => 'sumur-bor-pipanisasi-air-bersih-pelosok-ntt',
                'amount' => 50000000,
                'category' => 'Air Bersih',
                'payment_method' => 'QRIS',
                'status' => 'success',
                'is_anonymous' => true,
                'message' => 'Wakaf jariyah atas nama almarhum kedua orang tua. Semoga airnya mengalirkan pahala abadi.',
                'receipt_number' => 'AIF-RCPT-2026-000004',
                'created_date' => '2026-05-24 16:15:00',
                'paid_date' => '2026-05-24 16:16:00',
                'certificate_number' => 'AIF-CERT-WK-0004',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ]
        ];

        foreach ($donationsData as $don) {
            Donation::updateOrCreate(['id' => $don['id']], $don);
        }

        // 6. Donors CRM
        $donorsData = [
            [
                'id' => 'DNR-01',
                'name' => 'Budi Santoso',
                'email' => 'budi.santoso@example.com',
                'phone' => '+6281211110001',
                'category' => 'VIP',
                'total_donated' => 75000000,
                'donation_count' => 6,
                'last_donation_date' => '2026-05-18',
                'notes' => 'Donatur rutin program pendidikan beasiswa yatim. Preferensi komunikasi via WhatsApp.',
                'is_demo' => true,
            ],
            [
                'id' => 'DNR-02',
                'name' => 'Aisyah Putri',
                'email' => 'aisyah.putri@example.com',
                'phone' => '+6281211110002',
                'category' => 'Regular',
                'total_donated' => 12500000,
                'donation_count' => 3,
                'last_donation_date' => '2026-05-20',
                'notes' => 'Muzakki zakat maal bulanan. Kirimkan laporan audit tahunan.',
                'is_demo' => true,
            ],
            [
                'id' => 'DNR-03',
                'name' => 'PT Surya Digital Nusantara',
                'email' => 'csr@suryadigital.co.id',
                'phone' => '+6281211110003',
                'category' => 'Corporate',
                'total_donated' => 500000000,
                'donation_count' => 2,
                'last_donation_date' => '2026-05-22',
                'notes' => 'Mitra strategis CSR ESG. Membutuhkan laporan infografis berkala untuk RUPS.',
                'is_demo' => true,
            ]
        ];

        foreach ($donorsData as $dnr) {
            Donor::updateOrCreate(['id' => $dnr['id']], $dnr);
        }

        // 7. Volunteers
        Volunteer::updateOrCreate(
            ['id' => 'VOL-01'],
            [
                'name' => 'Muhammad Rizky Pratama',
                'email' => 'rizky.pratama@example.com',
                'phone' => '+6285711110001',
                'skills' => ['Penyuluh Pendidikan', 'Dokumentasi/Kamera'],
                'experience' => 'Pernah menjadi satgas relawan gempa Cianjur dan koordinator logistik posko banjir Bekasi 2024.',
                'status' => 'Approved',
                'joined_date' => '2026-01-15',
            ]
        );

        Volunteer::updateOrCreate(
            ['id' => 'VOL-02'],
            [
                'name' => 'Nurul Hidayati',
                'email' => 'nurul.hidayati@example.com',
                'phone' => '+6285711110002',
                'skills' => ['Penyalur Logistik Medis', 'Tenaga Medis/Perawat'],
                'experience' => 'Lulusan keperawatan, siap diterjunkan untuk klinik keliling dhuafa dan tanggap darurat bencana.',
                'status' => 'Approved',
                'joined_date' => '2026-02-10',
            ]
        );

        // 8. CSR Inquiries
        CsrInquiry::updateOrCreate(
            ['id' => 'CSR-01'],
            [
                'company_name' => 'PT Telko Mandiri Solusindo',
                'pic_name' => 'Bambang Kusuma',
                'email' => 'bambang.k@telkomandiri.co.id',
                'phone' => '+6281122220001',
                'interested_program' => 'Pendidikan Digital',
                'budget_range' => 'Rp100juta - Rp250juta',
                'status' => 'Proposal Sent',
                'notes' => 'Minat program laboratorium komputer pesantren pelosok.',
            ]
        );

        // 9. Transparency Reports
        Report::updateOrCreate(
            ['id' => 'REP-2025'],
            [
                'title' => 'Laporan Akuntabilitas Keuangan & Penyaluran Tahunan 2025',
                'period' => 'Januari - Desember 2025',
                'year' => 2025,
                'total_income' => 4580000000,
                'total_disbursed' => 4120000000,
                'operational_cost' => 380000000,
                'audit_opinion' => 'Wajar Tanpa Pengecualian (WTP)',
                'pdf_url' => 'https://example.com/reports/laporan-tahunan-2025.pdf',
                'is_published' => true,
            ]
        );

        // 10. Blog Posts
        $blogsData = [
            [
                'id' => 'B-01',
                'title' => 'Panduan Lengkap Menghitung Zakat Maal & Profesi Sesuai Fatwa MUI',
                'slug' => 'panduan-lengkap-menghitung-zakat-maal-profesi',
                'category' => 'Zakat',
                'author' => 'Ustadz Salman Farisi',
                'status' => 'published',
                'excerpt' => 'Pelajari secara mudah cara menghitung zakat penghasilan, nisab bulanan dan tahunan, serta dalil amil syariah.',
                'content' => "Zakat penghasilan (zakat profesi) adalah bagian dari zakat mal yang wajib dikeluarkan atas harta yang diperoleh dari hasil profesi atau pekerjaan halal.\n\nCara menghitungnya sangat sederhana: Jika pendapatan bulanan bersih Anda melebihi batas nisab emas (setara 85 gram emas per tahun atau Rp7.000.000 per bulan), maka wajib mengeluarkan zakat 2,5%. Melalui platform Amanah Impact Foundation, kalkulasi dilakukan secara otomatis dan transparan.",
                'language' => 'id',
                'published_date' => '2026-05-15',
                'image_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=600',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ],
            [
                'id' => 'B-02',
                'title' => 'Membangun Kemitraan CSR Berkelanjutan Berbasis ESG',
                'slug' => 'membangun-kemitraan-csr-berkelanjutan-esg',
                'category' => 'CSR',
                'author' => 'Dr. Siti Aminah',
                'status' => 'published',
                'excerpt' => 'Bagaimana korporasi modern dapat mengintegrasikan program tanggung jawab sosial dengan prinsip transparansi digital.',
                'content' => "Di era sekarang, program CSR bukan sekadar santunan seremonial sekali selesai, melainkan investasi sosial yang terukur dan berdampak panjang. Amanah Impact Foundation mendampingi korporasi menyusun program air bersih, beasiswa, dan reboisasi dengan laporan kepatuhan standar GRI.",
                'language' => 'id',
                'published_date' => '2026-05-18',
                'image_url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
                'thumbnail_url' => 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=600',
                'user_email' => 'admin@amanah.org',
                'is_demo' => true,
            ]
        ];

        foreach ($blogsData as $b) {
            BlogPost::updateOrCreate(['id' => $b['id']], $b);
        }

        // 11. Testimonials (4 Cards)
        $testiData = [
            [
                'id' => 'T-01',
                'name' => 'H. Hendra Wijaya',
                'role' => 'Donatur Zakat Maal',
                'location' => 'Jakarta',
                'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150',
                'content' => 'Sistem digital ledger real-time dari Amanah sangat luar biasa. Saya bisa langsung melihat dana zakat maal saya disalurkan ke program beasiswa dhuafa dalam hitungan jam. Transparansi seperti ini yang dicari umat.',
                'message' => 'Sistem digital ledger real-time dari Amanah sangat luar biasa. Saya bisa langsung melihat dana zakat maal saya disalurkan ke program beasiswa dhuafa dalam hitungan jam.',
                'rating' => 5,
                'type' => 'donor',
            ],
            [
                'id' => 'T-02',
                'name' => 'Ibu Ratna Kartika',
                'role' => 'Mitra CSR Korporasi',
                'location' => 'Bandung',
                'avatar_url' => 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150',
                'content' => 'Kami bermitra dengan Amanah untuk program pengadaan sumur bor air bersih di daerah kekeringan. Laporan dampak kualitatif sangat komprehensif, dilengkapi data sains dan kuitansi transparan.',
                'message' => 'Kami bermitra dengan Amanah untuk program pengadaan sumur bor air bersih di daerah kekeringan. Laporan dampak kualitatif sangat komprehensif.',
                'rating' => 5,
                'type' => 'csr_partner',
            ],
            [
                'id' => 'T-03',
                'name' => 'Zaki Al-Ghifari',
                'role' => 'Relawan Kemanusiaan',
                'location' => 'Surabaya',
                'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150',
                'content' => 'Menjadi bagian dari tim relawan tanggap darurat Amanah membuka mata saya tentang pentingnya ketulusan. Semua penyaluran diatur dengan integritas tinggi dan langsung menyentuh penerima manfaat di lapangan.',
                'message' => 'Menjadi bagian dari tim relawan tanggap darurat Amanah membuka mata saya tentang pentingnya ketulusan. Semua penyaluran diatur dengan integritas tinggi.',
                'rating' => 5,
                'type' => 'beneficiary',
            ],
            [
                'id' => 'T-04',
                'name' => 'Siti Rahma',
                'role' => 'Penerima Manfaat Santri',
                'location' => 'Sukabumi',
                'avatar_url' => 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150',
                'content' => 'Alhamdulillah, berkat beasiswa penuh dan asrama dari Amanah Impact Foundation, saya dapat melanjutkan sekolah ke jenjang menengah kejuruan. Terima kasih para donatur dan yayasan!',
                'message' => 'Alhamdulillah, berkat beasiswa penuh dan asrama dari Amanah Impact Foundation, saya dapat melanjutkan sekolah ke jenjang menengah kejuruan.',
                'rating' => 5,
                'type' => 'beneficiary',
            ]
        ];

        foreach ($testiData as $t) {
            Testimonial::updateOrCreate(['id' => $t['id']], $t);
        }

        // 12. FAQs
        $faqsData = [
            [
                'id' => 'F-01',
                'category' => 'Donasi',
                'question' => 'Apakah donasi saya akan mendapatkan bukti pembayaran resmi?',
                'answer' => 'Ya, sistem kami secara otomatis memproses dan menerbitkan Kuitansi Elektronik (Electronic Receipt) ber-QR Code dengan nomor referensi unik sesaat setelah pembayaran donasi Anda terverifikasi sukses.',
            ],
            [
                'id' => 'F-02',
                'category' => 'Zakat',
                'question' => 'Berapa standard nisab zakat profesi bulanan yang berlaku saat ini?',
                'answer' => 'Nisab zakat profesi bulanan merujuk pada ketetapan BAZNAS dan MUI, yakni setara nilai 653 kg beras atau setara 85 gram emas per tahun (sekitar Rp6.800.000 hingga Rp7.500.000 per bulan tergantung fluktuasi harga emas).',
            ],
            [
                'id' => 'F-03',
                'category' => 'Wakaf',
                'question' => 'Apakah wakaf tunai mendapatkan sertifikat digital resmi?',
                'answer' => 'Ya, donatur yang menyalurkan wakaf uang di Amanah Impact Foundation berhak mengunduh Sertifikat Wakaf Digital (Digital Wakaf Pledge) berisi data nama pewakaf, ikrar wakaf, peruntukan aset, dan tanda tangan resmi nadzir.',
            ],
            [
                'id' => 'F-04',
                'category' => 'Kemitraan',
                'question' => 'Bagaimana cara mendaftar program relawan atau kemitraan CSR?',
                'answer' => 'Anda dapat langsung mengisi formulir pendaftaran relawan atau proposal kemitraan CSR yang tersedia di website ini. Tim kami akan segera menjadwalkan sesi koordinasi lanjutan dalam 1x24 jam kerja.',
            ]
        ];

        foreach ($faqsData as $f) {
            Faq::updateOrCreate(['id' => $f['id']], $f);
        }

        // 13. Feedbacks
        Feedback::create([
            'name' => 'Hendra Wijaya',
            'email' => 'hendra@example.com',
            'rating' => 5,
            'category' => 'Fitur Baru',
            'message' => 'Tampilan kalkulator zakat sangat responsif dan mudah digunakan!',
        ]);
    }
}
