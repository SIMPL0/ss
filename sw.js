const CACHE_NAME = 'fit-training-cache-v2'; // Versão atualizada do cache
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    // Simulação de ícones. O usuário deve fornecer os arquivos reais.
    // Assumindo que os ícones estão na raiz ou em 'icons/'
    '/icons/icon-192x192.png', 
    '/icons/icon-512x512.png'
];

// Instala o Service Worker e armazena recursos no cache
self.addEventListener('install', event => {
    console.log('[Service Worker] Instalando...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Cache aberto, adicionando arquivos.');
                // Adiciona os arquivos ao cache, ignorando falhas de arquivos não encontrados (como ícones)
                return cache.addAll(urlsToCache.map(url => {
                    return new Request(url, { cache: 'no-cache' });
                })).catch(error => {
                    console.warn('[Service Worker] Falha ao adicionar alguns arquivos ao cache:', error);
                    // Continua mesmo com falhas, pois alguns arquivos (como ícones) podem não existir
                });
            })
    );
});

// Estratégia Cache-First com fallback para Network
self.addEventListener('fetch', event => {
    // Apenas para requisições GET
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna o recurso do cache se encontrado
                if (response) {
                    return response;
                }
                
                // Se não estiver no cache, busca na rede
                return fetch(event.request)
                    .then(networkResponse => {
                        // Verifica se a resposta é válida
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }
                        
                        // Clona a resposta para colocá-la no cache
                        const responseToCache = networkResponse.clone();
                        
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Não armazena no cache requisições de terceiros ou extensões
                                if (event.request.url.startsWith(self.location.origin)) {
                                    cache.put(event.request, responseToCache);
                                }
                            });
                        
                        return networkResponse;
                    })
                    .catch(error => {
                        // Fallback para uma página offline se a requisição falhar
                        console.error('[Service Worker] Falha na busca:', error);
                        // Você pode adicionar um fallback para uma página offline aqui, se tiver uma
                        // return caches.match('/offline.html');
                    });
            })
    );
});

// Atualiza o Service Worker e remove caches antigos (limpeza)
self.addEventListener('activate', event => {
    console.log('[Service Worker] Ativando e limpando caches antigos.');
    const cacheWhitelist = [CACHE_NAME];
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => !cacheWhitelist.includes(cacheName))
                          .map(cacheName => {
                              console.log(`[Service Worker] Deletando cache antigo: ${cacheName}`);
                              return caches.delete(cacheName);
                          })
            );
        })
    );
    // Garante que o Service Worker assume o controle da página imediatamente
    return self.clients.claim();
});
