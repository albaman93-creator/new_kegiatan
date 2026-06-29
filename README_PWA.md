# 📱 Catatan Kegiatan Harian - PWA

Aplikasi web untuk mencatat kegiatan harian yang sudah dikonfigurasi sebagai **Progressive Web App (PWA)** dan bisa diinstal di ponsel seperti aplikasi native.

## ✨ Fitur

- ✅ Catatan kegiatan harian dengan tabel
- ✅ Wizard Form untuk input cepat (tanggal → jam → kegiatan)
- ✅ Date Picker dan Time Picker analog
- ✅ Bisa berjalan offline (setelah pertama kali dibuka)
- ✅ Bisa diinstal di Android dan iOS

## 📦 File PWA yang Sudah Dibuat

1. **`manifest.json`** - Konfigurasi PWA (nama app, icon, warna tema, dll)
2. **`sw.js`** - Service Worker untuk offline support
3. **`generate_icons.py`** - Script untuk generate icon (opsional)

## 🎨 Cara Membuat Icon

### Opsi 1: Gunakan Script Python (Otomatis)

```bash
# Install Pillow jika belum ada
pip install Pillow

# Jalankan script
python generate_icons.py
```

Script akan otomatis membuat `icon-192.png` dan `icon-512.png`.

### Opsi 2: Buat Manual (Online)

1. Buka website: **https://favicon.io/** atau **https://realfavicongenerator.net/**
2. Upload gambar atau buat icon
3. Download icon dengan ukuran **192x192** dan **512x512**
4. Rename file menjadi:
   - `icon-192.png`
   - `icon-512.png`
5. Letakkan di folder yang sama dengan `index.html`

### Opsi 3: Gunakan Icon Default

Jika Anda tidak ingin membuat icon, Anda bisa menggunakan icon placeholder sementara. Aplikasi tetap bisa diinstal, tapi icon-nya akan default dari browser.

## 🚀 Cara Menjalankan Aplikasi

### ⚠️ PENTING: Aplikasi TIDAK bisa dijalankan dengan klik dua kali file HTML!

PWA **harus** dijalankan melalui server (HTTP/HTTPS). Berikut cara termudah:

### Metode 1: Menggunakan VS Code (Paling Mudah)

1. Install ekstensi **"Live Server"** di VS Code
2. Buka folder `new_kegiatan` di VS Code
3. Klik kanan pada `index.html`
4. Pilih **"Open with Live Server"**
5. Browser akan otomatis terbuka di `http://127.0.0.1:5500`

### Metode 2: Menggunakan Python

```bash
# Buka Command Prompt/Terminal di folder new_kegiatan
cd "C:\Users\admin\Documents\project codingan\HTML\Belajar Html\buat aplikasi\kegiatan_harian\new_kegiatan"

# Jalankan server Python
python -m http.server 8000

# Buka browser ke: http://localhost:8000
```

### Metode 3: Menggunakan Node.js (http-server)

```bash
# Install http-server (sekali saja)
npm install -g http-server

# Jalankan server
http-server -p 8000

# Buka browser ke: http://localhost:8000
```

## 📱 Cara Menginstal di Ponsel

### Syarat:
- Ponsel dan komputer harus terhubung ke **Wi-Fi/jaringan yang sama**
- Aplikasi sudah berjalan di server lokal (lihat bagian "Cara Menjalankan")

### Untuk Android (Chrome):

1. Buka browser **Chrome** di HP
2. Ketik alamat IP komputer Anda:
   - Contoh: `http://192.168.1.5:5500` (jika pakai Live Server)
   - Contoh: `http://192.168.1.5:8000` (jika pakai Python)
   
   **Cara mengetahui IP komputer:**
   - Windows: Buka CMD, ketik `ipconfig`, lihat "IPv4 Address"
   - Mac/Linux: Buka Terminal, ketik `ifconfig` atau `ip addr`

3. Akan muncul banner di bawah: **"Install App"** atau **"Tambahkan ke Layar Utama"**
4. Jika tidak muncul, klik **titik tiga (⋮)** di pojok kanan atas
5. Pilih **"Install aplikasi"** atau **"Add to Home screen"**
6. Klik **Install**

### Untuk iOS/iPhone (Safari):

1. Buka browser **Safari** di iPhone
2. Ketik alamat IP komputer Anda (contoh: `http://192.168.1.5:8000`)
3. Klik tombol **Share** (ikon kotak dengan panah ke atas)
4. Gulir ke bawah dan pilih **"Add to Home Screen"**
5. Klik **Add** di pojok kanan atas

## 🌐 Cara Publikasi Online (Opsional)

Jika Anda ingin aplikasi bisa diinstal oleh orang lain tanpa harus satu jaringan Wi-Fi, upload ke hosting gratis yang mendukung HTTPS:

### Rekomendasi Hosting Gratis:

1. **Netlify** (Paling Mudah)
   - Buka https://www.netlify.com/
   - Drag & drop folder `new_kegiatan`
   - Selesai! Dapat URL HTTPS otomatis

2. **GitHub Pages**
   - Upload ke repository GitHub
   - Aktifkan GitHub Pages di Settings
   - Dapat URL HTTPS otomatis

3. **Vercel**
   - Buka https://vercel.com/
   - Import dari GitHub atau upload manual
   - Dapat URL HTTPS otomatis

Setelah di-upload, aplikasi bisa diinstal oleh siapa saja dari seluruh dunia!

## 🔧 Troubleshooting

### Aplikasi tidak bisa diinstal di ponsel?

**Ceklist:**
- [ ] Aplikasi dijalankan melalui server (bukan file://)
- [ ] File `manifest.json` sudah ada
- [ ] File `sw.js` sudah ada
- [ ] Icon `icon-192.png` dan `icon-512.png` sudah ada
- [ ] Ponsel dan komputer di jaringan Wi-Fi yang sama
- [ ] Firewall tidak memblokir koneksi

### Service Worker tidak terdaftar?

Buka Console browser (F12), cek apakah ada error. Pastikan:
- File `sw.js` bisa diakses (cek di Network tab)
- Tidak ada error di console

### Icon tidak muncul?

Pastikan:
- File `icon-192.png` dan `icon-512.png` ada di folder yang sama dengan `index.html`
- Ukuran file sesuai (192x192 dan 512x512 piksel)
- Format file PNG (bukan JPG atau format lain)

## 📝 Catatan Penting

- **Pertama kali dibuka**, aplikasi akan men-cache semua file untuk offline
- **Update aplikasi**: Jika Anda mengubah kode, increment versi di `sw.js` (baris `CACHE_NAME`)
- **Clear cache**: Untuk reset cache, buka DevTools → Application → Clear Storage

## 🎯 Struktur File

```
new_kegiatan/
├── index.html          # File utama aplikasi
├── style.css           # Styling
├── script.js           # Logika aplikasi
├── manifest.json       # Konfigurasi PWA ✨ BARU
├── sw.js               # Service Worker ✨ BARU
├── icon-192.png        # Icon 192x192 (perlu dibuat)
├── icon-512.png        # Icon 512x512 (perlu dibuat)
└── generate_icons.py   # Script generate icon ✨ BARU
```

## 📞 Bantuan

Jika ada masalah, cek Console browser (F12) untuk melihat error messages.

---

**Selamat! Aplikasi Anda sekarang bisa diinstal di ponsel seperti PWA! 🎉**
