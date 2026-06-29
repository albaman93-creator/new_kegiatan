// ============================================
// GOOGLE APPS SCRIPT - COPY KE GOOGLE SHEET ANDA
// ============================================
// CARA PAKAI:
// 1. Buka Google Sheet Anda
// 2. Klik menu Extensions > Apps Script
// 3. Hapus semua kode yang ada, lalu paste kode ini
// 4. Klik Deploy > New deployment
// 5. Pilih type: Web app
// 6. Execute as: Me
// 7. Who has access: Anyone
// 8. Klik Deploy, copy URL yang diberikan
// 9. Paste URL tersebut ke variabel GOOGLE_SHEET_API di script.js
// ============================================

// NAMA SHEET (ubah sesuai nama sheet Anda, default "Sheet1")
const SHEET_NAME = 'Sheet1';

// Handle GET request - untuk mengambil data dari Google Sheet
function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Sheet "' + SHEET_NAME + '" tidak ditemukan'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Jika sheet kosong atau hanya ada header
    if (data.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        data: []
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Skip header row (baris pertama)
    const headers = data[0];
    const rows = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip baris kosong
      if (row.every(cell => cell === '' || cell === null)) continue;
      
      rows.push({
        tanggal: row[0] || '',
        jam: row[1] || '',
        kegiatan: row[2] || '',
        tag: row[3] || '',
        keterangan: row[4] || ''
      });
    }
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      data: rows,
      count: rows.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// Handle POST request - untuk menyimpan data dari aplikasi ke Google Sheet
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Sheet "' + SHEET_NAME + '" tidak ditemukan'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse data dari request
    const dataArray = JSON.parse(e.postData.contents);
    
    // Clear sheet (hapus semua data lama)
    sheet.clear();
    
    // Tulis header
    const headers = ['Tanggal', 'Jam', 'Kegiatan', 'Tag', 'Keterangan'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format header agar bold
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    
    // Jika data kosong, selesai
    if (!dataArray || dataArray.length === 0) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Data kosong, sheet sudah di-clear',
        count: 0
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Siapkan data untuk ditulis
    const rows = dataArray.map(item => [
      item.tanggal || '',
      item.jam || '',
      item.kegiatan || '',
      item.tag || '',
      item.keterangan || ''
    ]);
    
    // Tulis data ke sheet
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    
    // Auto-resize kolom agar rapi
    sheet.autoResizeColumns(1, headers.length);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Data berhasil disimpan',
      count: rows.length
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

// ============================================
// FUNGSI TAMBAHAN (OPSIONAL)
// ============================================

// Fungsi untuk test manual dari Apps Script editor
function testGet() {
  const result = doGet({});
  console.log(result.getContent());
}

function testPost() {
  const testData = [
    {
      tanggal: '29-Jun-2026',
      jam: '08:00',
      kegiatan: 'Test kegiatan',
      tag: 'belajar',
      keterangan: 'Test keterangan'
    }
  ];
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log(result.getContent());
}
