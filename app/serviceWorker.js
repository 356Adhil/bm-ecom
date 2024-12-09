export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope:', registration.scope);

          registration.addEventListener('updatefound', () => {
            // A new service worker is being installed
            const installingWorker = registration.installing;
            console.log('A new service worker is being installed:', installingWorker);
          });
        })
        .catch((err) => {
          console.log('ServiceWorker registration failed: ', err);
        });
    });
  }
}
