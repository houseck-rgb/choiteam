/* 최우영 직원관리 — 항상 새 버전 먼저, 인터넷이 안 될 때만 저장본 사용 */
const CACHE = 'cwy-staff-v20261111-6';
self.addEventListener('install', e=>{ self.skipWaiting(); });
self.addEventListener('activate', e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys()) if(k !== CACHE) await caches.delete(k);   // 옛 저장본 지우기
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e=>{
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return;
  e.respondWith((async()=>{
    try{
      // 페이지 열기(navigate) 요청은 옵션을 붙일 수 없어서 주소로 새로 만듦
      const res = await fetch(req.mode === 'navigate' ? new Request(req.url, {cache:'no-store', credentials:'same-origin'}) : new Request(req, {cache:'no-store'}));
      if(res && res.ok){ const c = await caches.open(CACHE); c.put(req, res.clone()); }
      return res;
    }catch(err){
      const hit = await caches.match(req, {ignoreSearch:true});
      if(hit) return hit;
      if(req.mode === 'navigate'){ const home = await caches.match('./index.html') || await caches.match('./'); if(home) return home; }
      return Response.error();
    }
  })());
});
