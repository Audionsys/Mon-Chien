// Offline-Speicher: Beim ersten Öffnen wird alles gemerkt – danach läuft das Spiel auch ohne Netz (z. B. im Zug).
const CACHE='chien-v48';
const FILES=['./','index.html','filou-model.js','music.mp3','manifest.json','icon.png','title.jpg','sfx/bark1.mp3','sfx/bark2.mp3','sfx/bark3.mp3','sfx/bark4.mp3','dogs/shepherd-model.js','dogs/filou.jpg','dogs/shepherd.jpg',
  'coco/idle.webp','coco/talk.webp','coco/point.webp','coco/laugh.webp','coco/fly.webp','engine/coco.js','engine/badges.js','engine/main.js','engine/scene.js','engine/dog.js','engine/poses.js','engine/lang.js','engine/ui.js','engine/audio.js','engine/progress.js','engine/steps.js','engine/items.js',
  'content/course.js','content/commands.js','content/lexique.js','content/scenes.js','content/world.js','content/vocab.js','content/dog.js','content/betises.js','content/items.js','content/banter.js',
  'content/chapitre1.js','content/chapitre1b.js','content/chapitre2.js','content/chapitre3.js','content/chapitre4.js','content/chapitre5.js','content/chapitre6.js','content/chapitre7.js','content/chapitre8.js','content/chapitre9.js','content/chapitre1c.js','content/chapitre10.js','content/chapitre11.js','content/chapitre12.js','content/chapitre13.js','content/chapitre14.js','content/chapitre15.js','content/chapitre1d.js','content/chapitre10b.js','content/chapitre11b.js',
  'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js',
  'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/loaders/GLTFLoader.js',
  'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/environments/RoomEnvironment.js',
  'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/utils/BufferGeometryUtils.js',
  'https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/geometries/RoundedBoxGeometry.js'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>Promise.allSettled(FILES.map(f=>c.add(f))))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  e.respondWith(caches.open(CACHE).then(async c=>{ const hit=await c.match(e.request,{ignoreSearch:true});
    const isCode=/\.(js|html|json)$|\/$/.test(new URL(e.request.url).pathname) && new URL(e.request.url).origin===location.origin && !/model\.js$/.test(e.request.url);
    const net=fetch(e.request, isCode?{cache:'no-cache'}:undefined).then(r=>{ if(r && (r.ok||r.type==='opaque')) c.put(e.request,r.clone()); return r; }).catch(()=>hit);
    const fresh=/\.(js|html)$|\/$/.test(new URL(e.request.url).pathname) && !/model\.js$/.test(e.request.url) && new URL(e.request.url).origin===location.origin;
    if(fresh){ try{ return await Promise.race([net, new Promise((_,rej)=>setTimeout(rej,2500))]); }catch(_){ return hit || net; } }
    return hit || net; })); });
