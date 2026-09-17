<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

echo "<h2>Amanah Impact Foundation - Diagnostik Server</h2>";
echo "<b>PHP Version:</b> " . phpversion() . "<br>";
echo "<b>PDO MySQL:</b> " . (extension_loaded('pdo_mysql') ? 'Aktif (OK)' : '<span style="color:red">TIDAK AKTIF</span>') . "<br>";
echo "<b>OpenSSL:</b> " . (extension_loaded('openssl') ? 'Aktif (OK)' : '<span style="color:red">TIDAK AKTIF</span>') . "<br>";
echo "<b>Mbstring:</b> " . (extension_loaded('mbstring') ? 'Aktif (OK)' : '<span style="color:red">TIDAK AKTIF</span>') . "<br>";

echo "<hr>";

try {
    if (!file_exists(__DIR__ . '/../vendor/autoload.php')) {
        die("<span style='color:red'>Gagal: vendor/autoload.php tidak ditemukan!</span>");
    }
    require __DIR__ . '/../vendor/autoload.php';
    echo "1. Autoload Composer: <b>BERHASIL</b><br>";

    $app = require_once __DIR__ . '/../bootstrap/app.php';
    echo "2. Bootstrap Laravel: <b>BERHASIL</b><br>";

    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();
    echo "3. Kernel Initialization: <b>BERHASIL</b><br>";

    // Test DB connection
    $db = Illuminate\Support\Facades\DB::connection();
    $db->getPdo();
    echo "4. Koneksi Database MySQL: <b style='color:green'>BERHASIL TERHUBUNG</b> (" . $db->getDatabaseName() . ")<br>";

    echo "<h3 style='color:green'>SEMUA SISTEM BACKEND NORMAL!</h3>";
} catch (\Throwable $e) {
    echo "<h3 style='color:red'>DITEMUKAN MASALAH:</h3>";
    echo "<b>Pesan Error:</b> " . $e->getMessage() . "<br>";
    echo "<b>File:</b> " . $e->getFile() . " (Baris: " . $e->getLine() . ")<br>";
    echo "<pre style='background:#f4f4f4;padding:10px;'>" . $e->getTraceAsString() . "</pre>";
}
