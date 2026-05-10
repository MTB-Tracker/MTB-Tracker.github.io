const CACHE_NAME = 'mtb-tracker-v1'
const FILES = [
  '/accueil.html',
  '/index.html',
  '/suspension.html',
  '/entretien.html',
  '/profil.html',
  '/style.css',
  '/script.js',
  '/suspension.js',
  '/entretien.js',
  '/profil.js',
  '/auth.js',
  '/supabase.js',
  '/logo.jpg',
  '/bg.jpg'
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  )
})

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  )
})