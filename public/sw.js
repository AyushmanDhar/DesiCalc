const CACHE_STATIC = 'desicalc-static-v1'
const CACHE_PAGES = 'desicalc-pages-v1'

const STATIC_ASSETS = [
  '/assets/css/style.css',
  '/assets/js/calc-core.js',
  '/assets/js/lang-en.js',
  '/assets/js/lang-hi.js',
  '/assets/js/slabs-2026.js',
  '/assets/js/state-rates.js',
  '/assets/js/ad.js',
  '/assets/img/og-home.jpg',
  '/assets/img/og-tax-calculator.jpg',
  '/assets/img/og-stamp-duty.jpg',
  '/assets/img/og-rto-tax.jpg'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_STATIC && k !== CACHE_PAGES)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  if (url.origin !== location.origin) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request))
    return
  }

  if (/\.(css|js|png|svg|ico|woff2?)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }

  if (/\.(jpg|jpeg|gif|webp|avif)$/.test(url.pathname)) {
    event.respondWith(cacheFirst(request))
    return
  }
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) {
    const cache = await caches.open(CACHE_STATIC)
    cache.put(request, response.clone())
  }
  return response
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(CACHE_PAGES)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    const cached = await caches.match(request)
    if (cached) return cached
    return new Response('Offline', { status: 503 })
  }
}
