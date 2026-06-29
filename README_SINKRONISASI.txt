================================================================================
                    SINKRONISASI GOOGLE SHEET - SELESAI!
================================================================================

✅ FITUR YANG SUDAH DITAMBAHKAN:

1. Sinkronisasi 2 Arah:
   - Aplikasi → Google Sheet (otomatis saat simpan)
   - Google Sheet → Aplikasi (otomatis saat buka aplikasi)

2. Tombol Baru:
   - "Refresh dari Sheet" - untuk mengambil data terbaru dari Google Sheet

3. Auto-Save:
   - Setiap kali simpan data, otomatis terkirim ke Google Sheet

4. Auto-Load:
   - Setiap kali buka aplikasi, data otomatis dimuat dari Google Sheet

================================================================================
                              CARA SETUP (5 MENIT)
================================================================================

LANGKAH 1: Siapkan Google Sheet
-------------------------------
1. Buka https://sheets.google.com
2. Buat spreadsheet baru
3. Tambahkan HEADER di baris pertama:
   
   | Tanggal | Jam | Kegiatan | Tag | Keterangan |

LANGKAH 2: Copy Apps Script
----------------------------
1. Di Google Sheet, klik Extensions → Apps Script
2. Hapus semua kode yang ada
3. Buka file: GOOGLE_APPS_SCRIPT.js (di folder aplikasi Anda)
4. Copy SEMUA isinya
5. Paste ke editor Apps Script
6. Save (Ctrl+S)

LANGKAH 3: Deploy Web App
--------------------------
1. Di Apps Script, klik Deploy → New deployment
2. Pilih type: Web app
3. Execute as: Me
4. Who has access: Anyone
5. Klik Deploy
6. COPY URL yang muncul!

LANGKAH 4: Update URL di Aplikasi
----------------------------------
1. Buka file: script.js
2. Cari baris: const GOOGLE_SHEET_API = '...'
3. Ganti URL dengan URL dari langkah 3
4. Save file

LANGKAH 5: Test
---------------
1. Refresh aplikasi (Ctrl+F5)
2. Buka Console (F12)
3. Lihat log: "Data berhasil diambil dari Google Sheet. Jumlah baris: X"
4. Cek tabel → data dari Google Sheet harus muncul!

================================================================================
                                 CARA KERJA
================================================================================

SAAT APLIKASI DIBUKA:
1. Aplikasi → ambil data dari Google Sheet (GET)
2. Google Sheet → kirim semua data
3. Aplikasi → tampilkan di tabel
4. Jika Google Sheet kosong → pakai data dari localStorage

SAAT DATA DISIMPAN:
1. Aplikasi → kirim data ke Google Sheet (POST)
2. Google Sheet → clear data lama
3. Google Sheet → tulis data baru
4. Konfirmasi berhasil

CONTOH:
- Di Google Sheet ada 11 baris data
- Buka aplikasi → otomatis muncul 11 baris
- Tambah 1 baris di aplikasi → di Google Sheet jadi 12 baris
- Edit di Google Sheet → klik "Refresh dari Sheet" → aplikasi update!

================================================================================
                              STRUKTUR DATA
================================================================================

KOLOM DI GOOGLE SHEET:
A: Tanggal    (format: 29-Jun-2026)
B: Jam        (format: 08:30)
C: Kegiatan   (text bebas)
D: Tag        (shalat/makan/baca quran/belajar/tidur/olahraga/lainnya)
E: Keterangan (text bebas)

PENTING:
- Baris 1 = HEADER (tidak dihitung sebagai data)
- Baris 2 dst = DATA
- Baris kosong akan di-skip otomatis

================================================================================
                            TROUBLESHOOTING
================================================================================

MASALAH: Data tidak muncul di aplikasi
SOLUSI: 
- Cek URL di script.js sudah benar
- Buka URL di browser → harus muncul JSON
- Re-deploy Apps Script dengan akses "Anyone"

MASALAH: Error "Sheet tidak ditemukan"
SOLUSI:
- Ubah nama sheet di Google Sheet menjadi "Sheet1"
- ATAU ubah di GOOGLE_APPS_SCRIPT.js: const SHEET_NAME = 'NamaSheetAnda'

MASALAH: Data tidak sinkron setelah edit di Google Sheet
SOLUSI:
- Klik tombol "Refresh dari Sheet" di aplikasi
- ATAU hard refresh (Ctrl+F5)

MASALAH: Data dari aplikasi tidak muncul di Google Sheet
SOLUSI:
- Klik tombol "Simpan" di aplikasi
- Cek Console → harus ada log "Sinkronisasi berhasil"
- Refresh Google Sheet (F5)

================================================================================
                                FILE YANG DIUBAH
================================================================================

1. script.js
   - Tambah fungsi: loadFromGoogleSheets()
   - Tambah fungsi: refreshFromGoogleSheet()
   - Update fungsi: syncToGoogleSheets()
   - Update fungsi: loadData()
   - Update fungsi: deleteAll()

2. index.html
   - Tambah tombol: "Refresh dari Sheet"

3. GOOGLE_APPS_SCRIPT.js (BARU)
   - Kode untuk Google Apps Script
   - Handle GET dan POST request

4. PANDUAN_SINKRONISASI.md (BARU)
   - Panduan lengkap setup
   - Troubleshooting guide

================================================================================
                                   TOMBOL BARU
================================================================================

1. Tambah - Tambah baris kosong
2. Isi via Form - Wizard form untuk input cepat
3. Simpan - Simpan data ke localStorage + Google Sheet
4. Refresh dari Sheet - Ambil data terbaru dari Google Sheet (BARU!)
5. Hapus Semua - Hapus semua data (juga di Google Sheet)

================================================================================
                                     TIPS
================================================================================

1. BACKUP OTOMATIS:
   - Google Sheet otomatis backup semua data
   - File → Version history → lihat perubahan

2. EDIT DI GOOGLE SHEET:
   - Bisa edit data langsung di Google Sheet
   - Klik "Refresh dari Sheet" di aplikasi untuk update

3. SHARE KE ORANG LAIN:
   - Share Google Sheet ke email mereka
   - Beri URL aplikasi
   - Mereka bisa lihat data yang sama!

4. AKSES DARI MANA SAJA:
   - Deploy aplikasi ke Netlify (HTTPS)
   - Bisa diakses dari HP, tablet, laptop
   - Data selalu sinkron!

================================================================================
                                   SELESAI!
================================================================================

Aplikasi Anda sekarang TERHUBUNG dengan Google Sheet!

✓ Data tersimpan aman di cloud (Google Sheet)
✓ Bisa diakses dari mana saja
✓ Backup otomatis
✓ Sinkronisasi real-time

Jika ada masalah, baca: PANDUAN_SINKRONISASI.md

================================================================================
