<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amanah Impact Foundation — Backend API & Production Database Engine</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        brand: {
                            50: '#ecfdf5',
                            100: '#d1fae5',
                            500: '#10b981',
                            600: '#059669',
                            700: '#047857',
                            800: '#065f46',
                            900: '#064e3b',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .code-font { font-family: 'JetBrains Mono', monospace; }
        .glow-emerald { box-shadow: 0 0 25px -5px rgba(16, 185, 129, 0.25); }
    </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen flex flex-col antialiased selection:bg-emerald-500 selection:text-white">

    <!-- Top Navigation Bar -->
    <header class="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-emerald-500/20">
                    A
                </div>
                <div>
                    <h1 class="text-base font-extrabold text-white tracking-tight flex items-center gap-2">
                        Amanah Impact Foundation
                        <span class="text-[10px] uppercase font-black tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">Backend API</span>
                    </h1>
                    <p class="text-[11px] text-slate-400">Laravel 12 Engine • MySQL Production Database</p>
                </div>
            </div>

            <div class="flex items-center gap-3">
                <!-- Database status badge -->
                <div class="hidden sm:flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs px-3 py-1.5 rounded-xl font-medium">
                    <span class="relative flex h-2 w-2">
                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>Database: <strong class="font-mono text-white">{{ $dbName ?? config('database.connections.mysql.database') }}</strong></span>
                </div>

                <a href="{{ env('FRONTEND_URL', 'https://amanah.kembangin.online') }}" target="_blank" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20">
                    <span>Buka Frontend App</span>
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </a>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">

        <!-- Welcome Banner -->
        <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 border border-slate-800 p-6 sm:p-8 glow-emerald">
            <div class="relative z-10 max-w-3xl space-y-3">
                <div class="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    REST API & Database Service Siap & Aktif
                </div>
                <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Sistem Backend Laravel 12 Terhubung ke Database MySQL
                </h2>
                <p class="text-sm text-slate-300 leading-relaxed">
                    Layanan backend ini melayani seluruh permintaan REST API untuk data kampanye, transaksi donasi, sistem CRM donatur, relawan, program kemitraan CSR, hingga transparansi dana tanpa menggunakan <code class="text-emerald-300 font-mono">localStorage</code>.
                </p>
                <div class="pt-2 flex flex-wrap items-center gap-3 text-xs">
                    <span class="bg-slate-800/80 border border-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg">
                        Server: <strong class="text-white font-mono">{{ url('/') }}</strong>
                    </span>
                    <span class="bg-slate-800/80 border border-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg">
                        MySQL Host: <strong class="text-emerald-400 font-mono">{{ config('database.connections.mysql.host') }}</strong>
                    </span>
                    <span class="bg-slate-800/80 border border-slate-700/60 text-slate-300 px-3 py-1.5 rounded-lg">
                        API Prefix: <strong class="text-emerald-400 font-mono">/api/*</strong>
                    </span>
                </div>
            </div>
        </div>

        <!-- Live Statistics Counters from Production Database -->
        <section class="space-y-3">
            <div class="flex items-center justify-between">
                <h3 class="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2 1 3 3 3h10c2 0 3-1 3-3V7c0-2-1-3-3-3H7C5 4 4 5 4 7z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-4m4 4v-8m4 8v-2"></path></svg>
                    Ringkasan Data Live (Database Produksi)
                </h3>
                <span class="text-xs text-emerald-400 font-medium">Status: Sinkronisasi Otomatis</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                    <span class="text-[11px] text-slate-400 block font-medium">Total Kampanye</span>
                    <span class="text-2xl font-extrabold text-white">{{ $counts['campaigns'] ?? 0 }}</span>
                    <span class="text-[10px] text-emerald-400 block mt-1">Tabel: campaigns</span>
                </div>

                <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                    <span class="text-[11px] text-slate-400 block font-medium">Transaksi Donasi</span>
                    <span class="text-2xl font-extrabold text-emerald-400">{{ $counts['donations'] ?? 0 }}</span>
                    <span class="text-[10px] text-emerald-400 block mt-1">Tabel: donations</span>
                </div>

                <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                    <span class="text-[11px] text-slate-400 block font-medium">Donatur Terdaftar</span>
                    <span class="text-2xl font-extrabold text-white">{{ $counts['donors'] ?? 0 }}</span>
                    <span class="text-[10px] text-emerald-400 block mt-1">Tabel: donors</span>
                </div>

                <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                    <span class="text-[11px] text-slate-400 block font-medium">Relawan Lapangan</span>
                    <span class="text-2xl font-extrabold text-teal-300">{{ $counts['volunteers'] ?? 0 }}</span>
                    <span class="text-[10px] text-teal-400 block mt-1">Tabel: volunteers</span>
                </div>

                <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                    <span class="text-[11px] text-slate-400 block font-medium">Inkuiri CSR</span>
                    <span class="text-2xl font-extrabold text-white">{{ $counts['csr_inquiries'] ?? 0 }}</span>
                    <span class="text-[10px] text-emerald-400 block mt-1">Tabel: csr_inquiries</span>
                </div>

                <div class="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                    <span class="text-[11px] text-slate-400 block font-medium">Laporan & Artikel</span>
                    <span class="text-2xl font-extrabold text-indigo-300">{{ ($counts['reports'] ?? 0) + ($counts['blogs'] ?? 0) }}</span>
                    <span class="text-[10px] text-indigo-400 block mt-1">Tabel: reports, blogs</span>
                </div>
            </div>
        </section>

        <!-- API Endpoints Directory (Interactive Explorer) -->
        <section class="space-y-4">
            <div class="flex items-center justify-between">
                <div>
                    <h3 class="text-base font-extrabold text-white tracking-tight">Katalog REST API Endpoints</h3>
                    <p class="text-xs text-slate-400">Klik tombol di bawah untuk langsung menguji response JSON langsung dari server Laravel & MySQL Database.</p>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <!-- Endpoint Card 1 -->
                <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">GET</span>
                            <span class="text-[10px] text-slate-400">Tabel: campaigns</span>
                        </div>
                        <h4 class="font-bold text-white font-mono text-xs">/api/campaigns</h4>
                        <p class="text-slate-400 text-[11px] mt-1">Mengambil seluruh daftar program kampanye donasi aktif dan terverifikasi.</p>
                    </div>
                    <a href="/api/campaigns" target="_blank" class="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold border border-slate-800 transition">
                        Buka Endpoint JSON →
                    </a>
                </div>

                <!-- Endpoint Card 2 -->
                <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">GET</span>
                            <span class="text-[10px] text-slate-400">Tabel: donations</span>
                        </div>
                        <h4 class="font-bold text-white font-mono text-xs">/api/donations</h4>
                        <p class="text-slate-400 text-[11px] mt-1">Mengambil riwayat transaksi donasi lengkap (QRIS, VA, Bank Transfer).</p>
                    </div>
                    <a href="/api/donations" target="_blank" class="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold border border-slate-800 transition">
                        Buka Endpoint JSON →
                    </a>
                </div>

                <!-- Endpoint Card 3 -->
                <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">GET</span>
                            <span class="text-[10px] text-slate-400">Tabel: donors</span>
                        </div>
                        <h4 class="font-bold text-white font-mono text-xs">/api/donors</h4>
                        <p class="text-slate-400 text-[11px] mt-1">Data master CRM donatur, akumulasi donasi, status VIP, dan catatan log.</p>
                    </div>
                    <a href="/api/donors" target="_blank" class="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold border border-slate-800 transition">
                        Buka Endpoint JSON →
                    </a>
                </div>

                <!-- Endpoint Card 4 -->
                <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">GET</span>
                            <span class="text-[10px] text-slate-400">Tabel: organization_info</span>
                        </div>
                        <h4 class="font-bold text-white font-mono text-xs">/api/organization</h4>
                        <p class="text-slate-400 text-[11px] mt-1">Profil resmi yayasan, legalitas SK Kemenkumham, kontak, dan medsos.</p>
                    </div>
                    <a href="/api/organization" target="_blank" class="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold border border-slate-800 transition">
                        Buka Endpoint JSON →
                    </a>
                </div>

                <!-- Endpoint Card 5 -->
                <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">GET</span>
                            <span class="text-[10px] text-slate-400">Tabel: reports</span>
                        </div>
                        <h4 class="font-bold text-white font-mono text-xs">/api/reports</h4>
                        <p class="text-slate-400 text-[11px] mt-1">Laporan pertanggungjawaban penyaluran dana sosial & audit publik.</p>
                    </div>
                    <a href="/api/reports" target="_blank" class="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold border border-slate-800 transition">
                        Buka Endpoint JSON →
                    </a>
                </div>

                <!-- Endpoint Card 6 -->
                <div class="bg-slate-950/80 border border-slate-800 p-4 rounded-2xl flex flex-col justify-between space-y-3 hover:border-slate-700 transition">
                    <div>
                        <div class="flex items-center justify-between gap-2 mb-1.5">
                            <span class="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">GET</span>
                            <span class="text-[10px] text-slate-400">JSON Export</span>
                        </div>
                        <h4 class="font-bold text-white font-mono text-xs">/api/admin/backup</h4>
                        <p class="text-slate-400 text-[11px] mt-1">Ekspor seluruh rekaman tabel database ke dalam satu file berkas JSON.</p>
                    </div>
                    <a href="/api/admin/backup" target="_blank" class="w-full text-center py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-400 font-bold border border-slate-800 transition">
                        Unduh Backup Database →
                    </a>
                </div>
            </div>
        </section>

        <!-- Live Database Tables Preview -->
        <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Table 1: Latest Campaigns -->
            <div class="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-white">Pratinjau Program Kampanye (Database MySQL)</h4>
                        <p class="text-xs text-slate-400">5 baris terakhir dari tabel <code class="text-emerald-400 font-mono">campaigns</code></p>
                    </div>
                    <a href="/api/campaigns" target="_blank" class="text-xs text-emerald-400 hover:underline">Semua JSON →</a>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-slate-800 text-slate-400 font-bold">
                                <th class="pb-2">ID</th>
                                <th class="pb-2">Judul Program</th>
                                <th class="pb-2">Kategori</th>
                                <th class="pb-2 text-right">Target</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            @forelse($recentCampaigns ?? [] as $camp)
                            <tr>
                                <td class="py-2.5 font-mono text-slate-500">{{ $camp->id }}</td>
                                <td class="py-2.5 font-semibold text-white truncate max-w-[200px]" title="{{ $camp->title }}">{{ $camp->title }}</td>
                                <td class="py-2.5">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                        {{ $camp->category }}
                                    </span>
                                </td>
                                <td class="py-2.5 text-right font-mono text-emerald-400">Rp {{ number_format($camp->target_amount, 0, ',', '.') }}</td>
                            </tr>
                            @empty
                            <tr><td colspan="4" class="py-4 text-center text-slate-500">Tidak ada data kampanye.</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Table 2: Latest Donations -->
            <div class="bg-slate-950/80 border border-slate-800 rounded-3xl p-5 space-y-4">
                <div class="flex items-center justify-between">
                    <div>
                        <h4 class="text-sm font-bold text-white">Transaksi Donasi Terakhir (Database MySQL)</h4>
                        <p class="text-xs text-slate-400">5 baris terakhir dari tabel <code class="text-emerald-400 font-mono">donations</code></p>
                    </div>
                    <a href="/api/donations" target="_blank" class="text-xs text-emerald-400 hover:underline">Semua JSON →</a>
                </div>

                <div class="overflow-x-auto">
                    <table class="w-full text-left text-xs">
                        <thead>
                            <tr class="border-b border-slate-800 text-slate-400 font-bold">
                                <th class="pb-2">ID Trx</th>
                                <th class="pb-2">Donatur</th>
                                <th class="pb-2">Metode</th>
                                <th class="pb-2 text-right">Jumlah</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-800/60">
                            @forelse($recentDonations ?? [] as $don)
                            <tr>
                                <td class="py-2.5 font-mono text-slate-500">{{ $don->id }}</td>
                                <td class="py-2.5 font-semibold text-white">{{ $don->donor_name }}</td>
                                <td class="py-2.5">
                                    <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                                        {{ $don->payment_method ?? 'QRIS' }}
                                    </span>
                                </td>
                                <td class="py-2.5 text-right font-mono font-bold text-emerald-400">Rp {{ number_format($don->amount, 0, ',', '.') }}</td>
                            </tr>
                            @empty
                            <tr><td colspan="4" class="py-4 text-center text-slate-500">Tidak ada data transaksi.</td></tr>
                            @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Credentials & Database Configuration Guide -->
        <section class="bg-slate-950/60 border border-slate-800 rounded-3xl p-6 space-y-4">
            <h4 class="text-sm font-bold text-white flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Kredensial Akun & Detail Sambungan Database MySQL
            </h4>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span class="text-slate-400 block text-[11px]">Akun Super Admin</span>
                    <p class="font-mono text-emerald-300 font-bold">superadmin@amanah.org</p>
                    <p class="font-mono text-slate-400">Password: <span class="text-white">admin123</span></p>
                </div>

                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span class="text-slate-400 block text-[11px]">Akun Admin Donasi</span>
                    <p class="font-mono text-emerald-300 font-bold">admin@amanah.org</p>
                    <p class="font-mono text-slate-400">Password: <span class="text-white">admin123</span></p>
                </div>

                <div class="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                    <span class="text-slate-400 block text-[11px]">Koneksi MySQL Database</span>
                    <p class="font-mono text-white">Database: <span class="text-emerald-400">{{ $dbName ?? config('database.connections.mysql.database') }}</span></p>
                    <p class="font-mono text-slate-400">Host: {{ config('database.connections.mysql.host') }} (User: {{ config('database.connections.mysql.username') }})</p>
                </div>
            </div>
        </section>

    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        <p>© 2026 Amanah Impact Foundation. Platform Filantropi Terintegrasi MySQL & Laravel 12.</p>
        <p class="mt-1">Dibuat & Distandardisasi oleh <a href="https://contech.id" target="_blank" class="text-emerald-400 hover:underline">Contech ID</a></p>
    </footer>

</body>
</html>
