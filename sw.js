// Nur die App-Hülle wird offline gespeichert – die Aufträge selbst liegen im Browser-Speicher und auf GitHub.
const C = "nitro-zettel-v1";
const SHELL = ["./", "index.html", "manifest.webmanifest", "icon.svg", "icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(C).then(c => c.addAll(SHELL))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== C).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET" || u.hostname === "api.github.com") return;
  if (u.origin === location.origin) {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(C).then(c => c.put(e.request, cp)); return r; })
      .catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
  }
});
