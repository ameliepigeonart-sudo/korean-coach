const CACHE_NAME = 'korean-coach-v2'
const STATIC_ASSETS = [
    '/',
    '/manifest.json',
  ]

self.addEventListener('install', (event) => {
    event.waitUntil(
          caches.open(CACHE_NAME).then((cache) => {
                  return cache.addAll(STATIC_ASSETS)
          })
        )
    self.skipWaiting()
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
          caches.keys().then((keys) => {
                  return Promise.all(
                            keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
                          )
          })
        )
    self.clients.claim()
})

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return
    if (event.request.url.includes('supabase.co')) return

                        const url = new URL(event.request.url)

                        // Never cache index.html — always fetch from network so updated asset hashes are served
                        if (url.pathname === '/' || url.pathname === '/index.html') {
                              event.respondWith(
                                      fetch(event.request).catch(() => caches.match('/index.html'))
                                    )
                              return
                        }

                        // Cache-first for static assets (JS, CSS, images)
                        event.respondWith(
                              caches.match(event.request).then((cached) => {
                                      if (cached) return cached
                                      return fetch(event.request).then((response) => {
                                                if (!response || response.status !== 200) return response
                                                const clone = response.clone()
                                                caches.open(CACHE_NAME).then((cache) => {
                                                            cache.put(event.request, clone)
                                                })
                                                return response
                                      }).catch(() => {
                                                return caches.match('/index.html')
                                      })
                              })
                            )
})
