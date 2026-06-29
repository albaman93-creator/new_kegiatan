# 📊 PANDUAN SINKRONISASI GOOGLE SHEET

## 🎯 FITUR BARU: Sinkronisasi 2 Arah

Aplikasi sekarang **SINKRON** dengan Google Sheet:
- ✅ **Aplikasi → Google Sheet**: Setiap kali simpan data, otomatis terkirim ke Google Sheet
- ✅ **Google Sheet → Aplikasi**: Saat buka aplikasi, data otomatis dimuat dari Google Sheet
- ✅ **Contoh**: Jika di Google Sheet ada 11 baris, saat buka aplikasi juga akan muncul 11 baris

---

## 🚀 CARA SETUP (5 MENIT SELESAI!)

### **LANGKAH 1: Siapkan Google Sheet**

1. Buka [Google Sheets](https://sheets.google.com)
2. Buat spreadsheet baru atau buka yang sudah ada
3. **PENTING**: Pastikan nama sheet adalah **"Sheet1"** (atau ubah di kode nanti)
4. Tambahkan **HEADER** di baris pertama:

| A | B | C | D | E |
|---|---|---|---|---|
| Tanggal | Jam | Kegiatan | Tag | Keterangan |

**Contoh isi:**
```
| Tanggal      | Jam   | Kegiatan        | Tag    | Keterangan     |
|--------------|-------|-----------------|--------|----------------|
| 29-Jun-2026  | 08:00 | Shalat Subuh    | shalat | Di masjid      |
| 29-Jun-2026  | 09:00 | Sarapan         | makan  | Nasi goreng    |
| 29-Jun-2026  | 10:00 | Belajar HTML    | belajar | PWA           |
```

---

### **LANGKAH 2: Copy Google Apps Script**

1. Di Google Sheet, klik menu **Extensions** → **Apps Script**
2. Akan terbuka editor Apps Script di tab baru
3. **Hapus semua kode** yang ada di editor
4. Buka file `GOOGLE_APPS_SCRIPT.js` di folder aplikasi Anda
5. **Copy SEMUA isi file** tersebut
6. **Paste** ke editor Apps Script
7. Klik ikon **💾 Save** (atau Ctrl+S)
8. Beri nama project: **"Kegiatan Harian API"**

---

### **LANGKAH 3: Deploy Web App**

1. Di editor Apps Script, klik tombol **Deploy** (kanan atas)
2. Pilih **New deployment**
3. Klik ikon ⚙️ (gear) di sebelah "Select type"
4. Pilih **Web app**
5. Isi konfigurasi:
   - **Description**: Sinkronisasi Kegiatan Harian
   - **Execute as**: **Me** (email Anda)
   - **Who has access**: **Anyone** (siapa saja)
6. Klik **Deploy**
7. **Authorize access** jika diminta:
   - Pilih akun Google Anda
   - Klik **Advanced** → **Go to [project name] (unsafe)**
   - Klik **Allow**
8. **COPY URL** yang muncul! Contoh:
   ```
   https://script.google.com/macros/s/AKfycbwy6VhCJHAVoZp76WcdcsQR6yG-zAx3yZFXNZ6eExlkAWQFKAo3xrU4tfV_KJTElwWO/exec
   ```

---

### **LANGKAH 4: Update URL di Aplikasi**

1. Buka file `script.js` di folder aplikasi Anda
2. Cari baris ini di paling atas:
   ```javascript
   const GOOGLE_SHEET_API = 'https://script.google.com/macros/s/...';
   ```
3. **Ganti URL** tersebut dengan URL yang Anda copy dari langkah 3
4. **Save** file `script.js`

---

### **LANGKAH 5: Test Sinkronisasi**

1. **Refresh** aplikasi di browser (Ctrl+F5)
2. Buka **Console** (F12) → tab Console
3. Anda akan melihat log:
   ```
   Mengambil data dari Google Sheet...
   Data berhasil diambil dari Google Sheet. Jumlah baris: 11
   ✓ 11 data dimuat dari Google Sheet
   ```
4. **Cek tabel di aplikasi** → harus muncul 11 baris sesuai data di Google Sheet!

---

## 🔄 CARA KERJA SINKRONISASI

### **Saat Aplikasi Dibuka:**
```
1. Aplikasi → Google Sheet (GET request)
2. Google Sheet → kirim semua data
3. Aplikasi → tampilkan data di tabel
4. Aplikasi → simpan ke localStorage (cache)
```

### **Saat Data Disimpan:**
```
1. Aplikasi → kirim data ke Google Sheet (POST request)
2. Google Sheet → clear semua data lama
3. Google Sheet → tulis data baru dari aplikasi
4. Google Sheet → kirim konfirmasi berhasil
```

---

## 📋 STRUKTUR DATA DI GOOGLE SHEET

**KOLOM YANG HARUS ADA:**

| Kolom | Header | Format | Contoh |
|-------|--------|--------|--------|
| A | Tanggal | dd-Mmm-yyyy | 29-Jun-2026 |
| B | Jam | HH:MM | 08:30 |
| C | Kegiatan | Text | Shalat Subuh |
| D | Tag | Text | shalat |
| E | Keterangan | Text | Di masjid |

**PENTING:**
- Baris pertama = HEADER (tidak akan dimuat sebagai data)
- Data dimulai dari baris ke-2
- Jika ada baris kosong, akan di-skip otomatis

---

## ⚠️ TROUBLESHOOTING

### **Error: "Sheet 'Sheet1' tidak ditemukan"**
**Solusi**: Ubah nama sheet di Google Sheet menjadi "Sheet1" ATAU ubah di kode:
```javascript
const SHEET_NAME = 'NamaSheetAnda'; // di GOOGLE_APPS_SCRIPT.js
```

### **Error: "Gagal mengambil data dari Google Sheet"**
**Penyebab**: 
- URL salah
- Akses belum di-authorize
- Internet bermasalah

**Solusi**:
1. Cek URL di `script.js` sudah benar
2. Buka URL tersebut di browser → harus muncul JSON
3. Re-deploy Apps Script dengan akses "Anyone"

### **Data tidak sinkron setelah edit di Google Sheet**
**Penyebab**: Browser masih pakai cache lama

**Solusi**:
1. Tekan **Ctrl+F5** untuk hard refresh
2. Atau buka **F12** → Application → Storage → Clear site data
3. Refresh lagi

### **Data di aplikasi tidak muncul di Google Sheet**
**Penyebab**: Fungsi `saveData()` belum dipanggil

**Solusi**:
1. Klik tombol **"Simpan"** di aplikasi
2. Cek Console → harus ada log "Sinkronisasi ke Spreadsheet berhasil"
3. Buka Google Sheet → refresh → data harus muncul

---

## 🎨 FITUR TAMBAHAN

### **Auto-Save ke Google Sheet**
Setiap kali Anda:
- Tambah baris baru
- Edit tanggal/jam/kegiatan
- Hapus baris
- Klik tombol "Simpan"

Data otomatis terkirim ke Google Sheet!

### **Auto-Load dari Google Sheet**
Setiap kali aplikasi dibuka:
- Data terbaru dari Google Sheet otomatis dimuat
- Tidak perlu manual import
- Selalu up-to-date!

---

## 🔐 KEAMANAN DATA

- ✅ Data tersimpan di Google Sheet Anda (private)
- ✅ Hanya Anda yang bisa akses (kecuali share sheet)
- ✅ HTTPS encryption (aman)
- ✅ Backup otomatis (Google Sheet punya version history)

---

## 💡 TIPS & TRIK

### **Backup Manual**
Google Sheet otomatis backup, tapi Anda bisa:
1. File → Make a copy → buat backup manual
2. File → Version history → lihat perubahan

### **Edit Data di Google Sheet**
Anda bisa edit data langsung di Google Sheet:
1. Edit data di sheet
2. Refresh aplikasi (Ctrl+F5)
3. Data terbaru akan muncul di aplikasi

### **Share ke Orang Lain**
Jika ingin orang lain juga bisa akses:
1. Share Google Sheet ke email mereka
2. Beri mereka URL aplikasi
3. Mereka bisa lihat data yang sama!

---

## 📞 BANTUAN

Jika masih ada masalah:
1. Buka Console (F12) → lihat error message
2. Cek Google Sheet → pastikan ada data
3. Cek URL di `script.js` → pastikan benar
4. Re-deploy Apps Script → pastikan akses "Anyone"

---

## ✅ CHECKLIST SETUP

- [ ] Google Sheet sudah dibuat dengan header yang benar
- [ ] Apps Script sudah di-copy dan di-save
- [ ] Web app sudah di-deploy dengan akses "Anyone"
- [ ] URL sudah di-copy dan di-paste ke `script.js`
- [ ] Aplikasi sudah di-refresh (Ctrl+F5)
- [ ] Data dari Google Sheet muncul di aplikasi
- [ ] Data dari aplikasi tersimpan ke Google Sheet

---

**SELAMAT! Aplikasi Anda sekarang tersinkronisasi dengan Google Sheet! 🎉**
