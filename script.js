// ===== VARIABEL GLOBAL =====
let rowCount = 0;
let currentEditRow = null;
let currentEditField = null;
let calendarDate = new Date();
let selectedDate = null;

let selectedHour = 0;
let selectedMinute = 0;
let clockMode = 'hour';

// ===== KONSTANTA =====
const CLOCK_RADIUS = 130;
const CLOCK_CENTER = 130;
const OUTER_NUM_RADIUS = 108;
const INNER_NUM_RADIUS = 72;

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const monthNamesFull = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

// Mapping posisi jam: luar = 12,1-11 | dalam = 00,13-23
const HOUR_MAP = [
    { outer: 12, inner: 0 },
    { outer: 1,  inner: 13 },
    { outer: 2,  inner: 14 },
    { outer: 3,  inner: 15 },
    { outer: 4,  inner: 16 },
    { outer: 5,  inner: 17 },
    { outer: 6,  inner: 18 },
    { outer: 7,  inner: 19 },
    { outer: 8,  inner: 20 },
    { outer: 9,  inner: 21 },
    { outer: 10, inner: 22 },
    { outer: 11, inner: 23 },
];

// ===== FUNGSI FORMAT =====
function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mmm = monthNames[date.getMonth()];
    const yyyy = date.getFullYear();
    return dd + '-' + mmm + '-' + yyyy;
}

function formatTime(h, m) {
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
}

// ===== TABEL: TAMBAH BARIS =====
function addRow(data) {
    rowCount++;
    var tbody = document.getElementById('tableBody');
    var tr = document.createElement('tr');
    tr.setAttribute('data-row', rowCount);

    var now = new Date();
    var dateVal = data ? data.tanggal : formatDate(now);
    var timeVal = data ? data.jam : formatTime(now.getHours(), now.getMinutes());
    var kegiatanVal = data ? data.kegiatan : '';
    var tagVal = data ? data.tag : '';
    var keteranganVal = data ? data.keterangan : '';

    tr.innerHTML =
        '<td class="no-col">' + rowCount + '</td>' +
        '<td class="date-col">' +
            '<div class="picker-wrapper">' +
                '<input type="text" class="picker-input date-input" value="' + dateVal + '" placeholder="Pilih tanggal" readonly onclick="openDatePicker(this)">' +
            '</div>' +
        '</td>' +
        '<td class="time-col">' +
            '<div class="picker-wrapper">' +
                '<input type="text" class="picker-input time-input" value="' + timeVal + '" placeholder="Pilih waktu" readonly onclick="openTimePicker(this)">' +
            '</div>' +
        '</td>' +
        '<td class="kegiatan-col">' +
            '<input type="text" class="text-input kegiatan-input" value="' + kegiatanVal + '" placeholder="Tulis kegiatan..." onkeydown="handleKegiatanEnter(event, this)">' +
        '</td>' +
        '<td class="tag-col">' +
            '<select class="tag-select tag-input">' +
                '<option value="">-- Pilih Tag --</option>' +
                '<option value="shalat"' + (tagVal === 'shalat' ? ' selected' : '') + '>🕌 Shalat</option>' +
                '<option value="makan"' + (tagVal === 'makan' ? ' selected' : '') + '>🍽️ Makan</option>' +
                '<option value="baca quran"' + (tagVal === 'baca quran' ? ' selected' : '') + '>📖 Baca Quran</option>' +
                '<option value="belajar"' + (tagVal === 'belajar' ? ' selected' : '') + '>📚 Belajar</option>' +
                '<option value="tidur"' + (tagVal === 'tidur' ? ' selected' : '') + '>😴 Tidur</option>' +
                '<option value="olahraga"' + (tagVal === 'olahraga' ? ' selected' : '') + '>🏃 Olahraga</option>' +
                '<option value="lainnya"' + (tagVal === 'lainnya' ? ' selected' : '') + '>📌 Lainnya</option>' +
            '</select>' +
        '</td>' +
        '<td class="waktu-col"><span class="waktu-display">-</span></td>' +
        '<td class="keterangan-col">' +
            '<input type="text" class="text-input keterangan-input" value="' + keteranganVal + '" placeholder="Keterangan...">' +
        '</td>' +
        '<td>' +
            '<button class="btn-delete-row" onclick="deleteRow(this)" title="Hapus baris">' +
                '<i class="ri-close-line"></i>' +
            '</button>' +
        '</td>';

    tbody.appendChild(tr);
    updateRowNumbers();
    calculateWaktuTerpakai();

    // Scroll otomatis ke baris terbaru
    setTimeout(scrollToLatestRow, 100);
}

// ===== TABEL: HAPUS BARIS =====
function deleteRow(btn) {
    btn.closest('tr').remove();
    updateRowNumbers();
    calculateWaktuTerpakai();
}

// ===== TABEL: UPDATE NOMOR URUT =====
function updateRowNumbers() {
    var rows = document.querySelectorAll('#tableBody tr');
    rows.forEach(function(row, index) {
        row.querySelector('.no-col').textContent = index + 1;
    });
    rowCount = rows.length;
}

// ===== TABEL: HITUNG WAKTU TERPAKAI =====
function calculateWaktuTerpakai() {
    const rows = document.querySelectorAll('#tableBody tr');
    const now = new Date(); // Waktu perangkat saat ini
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const waktuDisplay = row.querySelector('.waktu-display');
        const dateInput = row.querySelector('.date-input');
        const timeInput = row.querySelector('.time-input');

        // Ambil waktu baris saat ini
        const currentDateTime = parseCustomDate(dateInput.value, timeInput.value);
        if (!currentDateTime) {
                waktuDisplay.textContent = '-';
            continue;
        }

        let nextDateTime = null;
        // Cek apakah ada baris berikutnya dan apakah sudah diisi tanggal/jamnya
        if (i + 1 < rows.length) {
            const nextRow = rows[i + 1];
            const nextDateInput = nextRow.querySelector('.date-input');
            const nextTimeInput = nextRow.querySelector('.time-input');
            nextDateTime = parseCustomDate(nextDateInput.value, nextTimeInput.value);
}

        // Jika tidak ada baris berikutnya ATAU baris berikutnya belum diisi, pakai waktu saat ini (real-time)
        if (!nextDateTime) {
            nextDateTime = now;
        }

        // Hitung selisih dalam menit
        let diffMs = nextDateTime - currentDateTime;
        let diffMinutes = Math.floor(diffMs / (1000 * 60));

        if (diffMinutes < 0) {
            waktuDisplay.textContent = '0m';
    } else {
            waktuDisplay.textContent = formatDuration(diffMinutes);
    }
}
}

// ===== DATE PICKER =====
function openDatePicker(input) {
    currentEditRow = input.closest('tr');
    currentEditField = input;
    selectedDate = null;

    var val = input.value;
    if (val && val !== 'Pilih tanggal') {
        var parts = val.split('-');
        var day = parseInt(parts[0]);
        var monthIndex = monthNames.indexOf(parts[1]);
        var year = parseInt(parts[2]);
        calendarDate = new Date(year, monthIndex, day);
    } else {
        calendarDate = new Date();
    }

    renderCalendar();
    document.getElementById('dateModal').classList.add('active');
}

function closeDateModal() {
    document.getElementById('dateModal').classList.remove('active');
}

function renderCalendar() {
    var grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';

    var year = calendarDate.getFullYear();
    var month = calendarDate.getMonth();

    document.getElementById('calendarMonthYear').textContent = monthNamesFull[month] + ' ' + year;

    dayNames.forEach(function(name) {
        var div = document.createElement('div');
        div.className = 'calendar-day-name';
        div.textContent = name;
        grid.appendChild(div);
    });

    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var daysInPrevMonth = new Date(year, month, 0).getDate();
    var today = new Date();

    // Hari bulan sebelumnya
    for (var i = firstDay - 1; i >= 0; i--) {
        var div = document.createElement('div');
        div.className = 'calendar-day other-month';
        div.textContent = daysInPrevMonth - i;
        grid.appendChild(div);
    }

    // Hari bulan ini
    for (var i = 1; i <= daysInMonth; i++) {
        var div = document.createElement('div');
        div.className = 'calendar-day';
        div.textContent = i;

        if (i === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            div.classList.add('today');
        }

        if (selectedDate && i === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear()) {
            div.classList.add('selected');
        }

        (function(y, m, d) {
            div.onclick = function() { selectDate(y, m, d); };
        })(year, month, i);

        grid.appendChild(div);
    }

    // Hari bulan berikutnya
    var totalCells = grid.children.length;
    var remaining = 42 - totalCells;
    for (var i = 1; i <= remaining; i++) {
        var div = document.createElement('div');
        div.className = 'calendar-day other-month';
        div.textContent = i;
        grid.appendChild(div);
    }
}

function selectDate(year, month, day) {
    selectedDate = new Date(year, month, day);
    renderCalendar();
}

function prevMonth() {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    renderCalendar();
}

function confirmDate() {
    if (selectedDate) {
        currentEditField.value = formatDate(selectedDate);
        closeDateModal();
        var timeInput = currentEditRow.querySelector('.time-input');
        setTimeout(function() { openTimePicker(timeInput); }, 200);
        } else {
        showToast('Silakan pilih tanggal terlebih dahulu', 'error');
        }
}

// ===== ANALOG TIME PICKER =====
function openTimePicker(input) {
    currentEditRow = input.closest('tr');
    currentEditField = input;

    var now = new Date();
    var currentH = now.getHours();
    var currentM = now.getMinutes();

    var val = input.value;
    if (val && val !== 'Pilih waktu') {
        var parts = val.split(':');
        currentH = parseInt(parts[0]);
        currentM = parseInt(parts[1]);
    }

    selectedHour = currentH;
    selectedMinute = currentM;
    clockMode = 'hour';
    renderClockFace();
    updateClockDisplay();

    document.getElementById('timeModal').classList.add('active');
}

function closeTimeModal() {
    document.getElementById('timeModal').classList.remove('active');
}

function renderClockFace() {
    var clockFace = document.getElementById('clockFace');
    clockFace.querySelectorAll('.clock-number, .clock-tick').forEach(function(el) { el.remove(); });
    if (clockMode === 'hour') {
        renderHourNumbers(clockFace);
        } else {
        renderMinuteNumbers(clockFace);
        }

    updateClockLine();
    }

function renderHourNumbers(clockFace) {
    for (var pos = 0; pos < 12; pos++) {
        var map = HOUR_MAP[pos];
        var angle = (pos / 12) * 360 - 90;
        var rad = angle * Math.PI / 180;

        // Angka luar (12, 1, 2, ..., 11)
        var outerNum = document.createElement('div');
        outerNum.className = 'clock-number outer-num';
        var outerX = CLOCK_CENTER + OUTER_NUM_RADIUS * Math.cos(rad) - 16;
        var outerY = CLOCK_CENTER + OUTER_NUM_RADIUS * Math.sin(rad) - 16;
        outerNum.style.left = outerX + 'px';
        outerNum.style.top = outerY + 'px';
        outerNum.textContent = String(map.outer);

        if (map.outer === selectedHour) {
            outerNum.classList.add('selected');
        }

        (function(hourVal) {
            outerNum.onclick = function(e) {
                e.stopPropagation();
                selectHour(hourVal);
};
        })(map.outer);

        clockFace.appendChild(outerNum);

        // Angka dalam (00, 13, 14, ..., 23)
        var innerNum = document.createElement('div');
        innerNum.className = 'clock-number inner-num';
        var innerX = CLOCK_CENTER + INNER_NUM_RADIUS * Math.cos(rad) - 16;
        var innerY = CLOCK_CENTER + INNER_NUM_RADIUS * Math.sin(rad) - 16;
        innerNum.style.left = innerX + 'px';
        innerNum.style.top = innerY + 'px';
        innerNum.textContent = String(map.inner).padStart(2, '0');

        if (map.inner === selectedHour) {
            innerNum.classList.add('selected');
        }

        (function(hourVal) {
            innerNum.onclick = function(e) {
                e.stopPropagation();
                selectHour(hourVal);
            };
        })(map.inner);

        clockFace.appendChild(innerNum);
    }

    // Tick marks
    for (var i = 0; i < 12; i++) {
        var tick = document.createElement('div');
        tick.className = 'clock-tick major';
        var angle = (i / 12) * 360;
        tick.style.transform = 'translate(-50%, -124px) rotate(' + angle + 'deg)';
        clockFace.appendChild(tick);
    }
}

function renderMinuteNumbers(clockFace) {
    for (var i = 0; i < 12; i++) {
        var minute = i * 5;
        var num = document.createElement('div');
        num.className = 'clock-number outer-num';

        var angle = (i / 12) * 360 - 90;
        var rad = angle * Math.PI / 180;

        var x = CLOCK_CENTER + OUTER_NUM_RADIUS * Math.cos(rad) - 16;
        var y = CLOCK_CENTER + OUTER_NUM_RADIUS * Math.sin(rad) - 16;

        num.style.left = x + 'px';
        num.style.top = y + 'px';
        num.textContent = String(minute).padStart(2, '0');

        if (minute === selectedMinute) {
            num.classList.add('selected');
        }

        (function(minVal) {
            num.onclick = function(e) {
                e.stopPropagation();
                selectMinute(minVal);
            };
        })(minute);

        clockFace.appendChild(num);
    }

    // Tick marks setiap menit
    for (var i = 0; i < 60; i++) {
        var tick = document.createElement('div');
        tick.className = 'clock-tick' + (i % 5 === 0 ? ' major' : '');
        var angle = (i / 60) * 360;
        tick.style.transform = 'translate(-50%, -124px) rotate(' + angle + 'deg)';
        tick.style.cursor = 'pointer';
        tick.style.pointerEvents = 'auto';

        (function(minVal) {
            tick.onclick = function(e) {
                e.stopPropagation();
                selectMinute(minVal);
            };
        })(i);

        clockFace.appendChild(tick);
    }
}

function selectHour(h) {
    selectedHour = h;
    updateClockDisplay();
    renderClockFace();

    // Otomatis pindah ke mode menit setelah pilih jam
    setTimeout(function() {
        clockMode = 'minute';
        renderClockFace();
        updateClockDisplay();
    }, 300);
}

function selectMinute(m) {
    selectedMinute = m;
    updateClockDisplay();
    renderClockFace();
}

function updateClockLine() {
    var clockLine = document.getElementById('clockLine');
    var angle, length;

    if (clockMode === 'hour') {
        var pos;
        if (selectedHour === 0 || selectedHour === 12) {
            pos = 0;
        } else {
            pos = selectedHour % 12;
        }
        angle = (pos / 12) * 360 - 90;
        length = OUTER_NUM_RADIUS;
    } else {
        angle = (selectedMinute / 60) * 360 - 90;
        length = OUTER_NUM_RADIUS;
    }

    clockLine.style.width = length + 'px';
    clockLine.style.transform = 'rotate(' + angle + 'deg)';
}

function updateClockDisplay() {
    var label = document.getElementById('tpModeLabel');
    label.textContent = clockMode === 'hour' ? 'PILIH JAM' : 'PILIH MENIT';

    document.getElementById('tpHour').textContent = String(selectedHour).padStart(2, '0');
    document.getElementById('tpMinute').textContent = String(selectedMinute).padStart(2, '0');

    document.getElementById('tpHour').classList.toggle('active', clockMode === 'hour');
    document.getElementById('tpMinute').classList.toggle('active', clockMode === 'minute');
}

function switchClockMode(mode) {
    clockMode = mode;
    renderClockFace();
    updateClockDisplay();
}

// Klik pada clock face
document.getElementById('clockFace').addEventListener('click', function(e) {
    var rect = this.getBoundingClientRect();
    var x = e.clientX - rect.left - CLOCK_CENTER;
    var y = e.clientY - rect.top - CLOCK_CENTER;
    var distance = Math.sqrt(x * x + y * y);

    var angle = Math.atan2(y, x) * 180 / Math.PI + 90;
    if (angle < 0) angle += 360;

    if (clockMode === 'hour') {
        var pos = Math.round((angle / 360) * 12) % 12;
        var map = HOUR_MAP[pos];

        var hour;
        if (distance < (OUTER_NUM_RADIUS + INNER_NUM_RADIUS) / 2) {
            hour = map.inner;
        } else {
            hour = map.outer;
        }

        selectHour(hour);
    } else {
        var minute = Math.round((angle / 360) * 60) % 60;
        selectMinute(minute);
    }
});

function confirmTime() {
    currentEditField.value = formatTime(selectedHour, selectedMinute);
    closeTimeModal();
    calculateWaktuTerpakai();
    showToast('Waktu ' + formatTime(selectedHour, selectedMinute) + ' dipilih', 'success');

    // Fokus otomatis ke input kegiatan
    var kegiatanInput = currentEditRow.querySelector('.kegiatan-input');
    if (kegiatanInput) {
        kegiatanInput.focus();
    }
}

// ===== SIMPAN & MUAT DATA =====
function saveData() {
    var rows = document.querySelectorAll('#tableBody tr');
    var data = [];

    rows.forEach(function(row) {
        data.push({
            tanggal: row.querySelector('.date-input').value,
            jam: row.querySelector('.time-input').value,
            kegiatan: row.querySelector('.kegiatan-input').value,
            tag: row.querySelector('.tag-input').value,
            keterangan: row.querySelector('.keterangan-input').value
        });
    });

    localStorage.setItem('catatanKegiatanHarian', JSON.stringify(data));
    showToast('Data berhasil disimpan!', 'success');
}

function loadData() {
    var saved = localStorage.getItem('catatanKegiatanHarian');
    if (saved) {
        var data = JSON.parse(saved);
        data.forEach(function(item) { addRow(item); });
        if (data.length > 0) {
            showToast(data.length + ' data berhasil dimuat', 'info');
        }
    }
}

function deleteAll() {
    if (confirm('Apakah Anda yakin ingin menghapus semua data?')) {
        document.getElementById('tableBody').innerHTML = '';
        rowCount = 0;
        localStorage.removeItem('catatanKegiatanHarian');
        showToast('Semua data berhasil dihapus', 'error');
    }
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type) {
    var toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'toast toast-' + type + ' show';
    setTimeout(function() {
        toast.classList.remove('show');
    }, 3000);
}

// ===== TUTUP MODAL SAAT KLIK DI LUAR =====
document.getElementById('dateModal').addEventListener('click', function(e) {
    if (e.target === this) closeDateModal();
});
document.getElementById('timeModal').addEventListener('click', function(e) {
    if (e.target === this) closeTimeModal();
});

// ===== FUNGSI BARU =====
// Fungsi untuk memunculkan dropdown Tag setelah selesai isi Kegiatan (Tekan Enter)
function handleKegiatanEnter(event, input) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Mencegah form submit/default behavior
        var row = input.closest('tr');
        var tagSelect = row.querySelector('.tag-input');
        if (tagSelect) {
            // Untuk browser modern (Chrome, Edge, Safari terbaru)
            if (typeof tagSelect.showPicker === 'function') {
                tagSelect.showPicker();
            } else {
                // Fallback untuk browser lama
                tagSelect.focus();
            }
        }
    }
}

// Fungsi untuk scroll otomatis ke baris terbaru (terbawah)
function scrollToLatestRow() {
  var wrapper = document.getElementById('tableScrollWrapper');
  var tbody = document.getElementById('tableBody');
  var rows = tbody.querySelectorAll('tr');
  if (rows.length > 0) {
    var lastRow = rows[rows.length - 1];
    // Scroll wrapper ke posisi baris terakhir
    wrapper.scrollTo({
      top: lastRow.offsetTop,
      behavior: 'smooth'
    });
  }
}

// ===== FUNGSI HELPER =====
// Fungsi untuk mengubah string "dd-Mmm-yyyy" dan "HH:MM" menjadi Object Date
function parseCustomDate(dateStr, timeStr) {
    if (!dateStr || !timeStr || dateStr === 'Pilih tanggal' || timeStr === 'Pilih waktu') return null;
    const parts = dateStr.split('-');
    const day = parseInt(parts[0], 10);
    const monthStr = parts[1];
    const year = parseInt(parts[2], 10);
    const monthIndex = monthNames.indexOf(monthStr);
    if (monthIndex === -1) return null;
    const timeParts = timeStr.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    return new Date(year, monthIndex, day, hours, minutes, 0);
}

// Fungsi untuk memformat menit menjadi "Xj Ym" atau "Ym"
function formatDuration(totalMinutes) {
    if (totalMinutes < 0) return "0m";
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    if (hours > 0 && mins > 0) return hours + 'j ' + mins + 'm';
    if (hours > 0) return hours + 'j';
    return mins + 'm';
}

// Update otomatis setiap 1 menit agar "Waktu Terpakai" baris terakhir berjalan real-time
setInterval(calculateWaktuTerpakai, 60000);

// ===== INISIALISASI =====
window.onload = function() {
    loadData();
    if (rowCount === 0) {
        addRow();
    }
};

