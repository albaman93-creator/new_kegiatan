// Service Worker untuk Catatan Kegiatan Harian
const CACHE_NAME = 'kegiatan-harian-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css'
];

// Install service worker dan cache file-file penting
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache terbuka:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('[SW] Gagal cache:', err);
      })
  );
  // Aktifkan service worker segera tanpa menunggu reload
  self.skipWaiting();
});

// Ambil data dari cache jika offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Jika ada di cache, kembalikan
        if (response) {
          return response;
        }
        // Jika tidak ada di cache, ambil dari network
        return fetch(event.request).then(
          response => {
            // Cek apakah response valid
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response karena response hanya bisa dikonsumsi sekali
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(err => {
          console.log('[SW] Fetch gagal:', err);
          // Jika offline dan tidak ada di cache, bisa tampilkan halaman offline
          // return caches.match('/offline.html');
        });
      })
  );
});

// Activate service worker - hapus cache lama
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Klaim semua client segera
  return self.clients.claim();
});
