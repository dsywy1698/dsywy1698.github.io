const CACHE_NAME = 'v1';
const BASE_PATH = '/repo/c/';  // 子目录路径

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => 
      cache.addAll([
        BASE_PATH,
        BASE_PATH + 'index.html',
        BASE_PATH + 'fa.css'  // 其他需要缓存的资源
      ])
    )
  );
});

self.addEventListener('fetch', (e) => {
  if (e.request.url.startsWith(location.origin + BASE_PATH)) {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request))
    );
  }
});