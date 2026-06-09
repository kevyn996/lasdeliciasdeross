/* ── PWA Install Logic ── */
(function() {
  const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                    || window.navigator.standalone === true;

  /* Si ya está instalada no mostrar nada */
  if (isStandalone) return;

  const dismissedKey = 'pwa-dismissed';

  if (isIos) {
    /* iOS: mostrar hint si no fue descartado antes */
    if (!sessionStorage.getItem(dismissedKey)) {
      setTimeout(() => {
        document.getElementById('ios-hint-overlay')?.classList.add('show');
      }, 3000);
    }
  } else {
    /* Android / Chrome: esperar beforeinstallprompt */
    let deferredPrompt;
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      if (!sessionStorage.getItem(dismissedKey)) {
        document.getElementById('pwa-banner')?.classList.add('visible');
      }
    });

    document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      deferredPrompt = null;
      document.getElementById('pwa-banner')?.classList.remove('visible');
    });

    document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
      sessionStorage.setItem(dismissedKey, '1');
      document.getElementById('pwa-banner')?.classList.remove('visible');
    });
  }
})();

function closeIosHint() {
  sessionStorage.setItem('pwa-dismissed', '1');
  document.getElementById('ios-hint-overlay')?.classList.remove('show');
}

