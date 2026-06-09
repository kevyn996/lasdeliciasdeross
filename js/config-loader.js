/* ══════════════════════════════════════════════
   CONFIG LOADER
   Lee data/config.json y arranca la app
   ══════════════════════════════════════════════ */

let CONFIG = {};
let MENUS  = {};
const CAT_BASE_PRICE = {};
const DIAS_SEMANA = ['Lunes','Martes','Miércoles','Jueves','Viernes'];

async function loadConfig() {
  const res  = await fetch('/data/config.json');
  const data = await res.json();

  CONFIG = {
    nombre:       data.nombre,
    nombreCorto:  data.nombreCorto,
    emoji:        data.emoji,
    tagline:      data.tagline,
    descripcion:  data.descripcion,
    telefono:     data.telefono,
    wa:           data.wa,
    email:        data.email,
    horario:      data.horario,
    colorPrimario:data.colorPrimario,
    colorBg:      data.colorBg,
    moneda:       data.moneda,
    año:          data.año,
  };

  Object.assign(CAT_BASE_PRICE, data.catPrecios);
  Object.assign(MENUS, data.menus);

  /* Aplicar colores desde CONFIG */
  const root = document.documentElement;
  root.style.setProperty('--naranja',  CONFIG.colorPrimario);
  root.style.setProperty('--bg-color', CONFIG.colorBg);

  /* Aplicar textos estáticos */
  const $ = id => document.getElementById(id);
  if ($('hero-nombre'))   $('hero-nombre').textContent   = CONFIG.nombre;
  if ($('hero-tagline'))  $('hero-tagline').textContent  = CONFIG.tagline;
  if ($('foot-horario'))  $('foot-horario').textContent  = CONFIG.horario;
  if ($('foot-copy'))     $('foot-copy').textContent     = `© ${CONFIG.año} ${CONFIG.nombre} · Todos los derechos reservados`;
  if ($('sheet-title'))   $('sheet-title').textContent   = CONFIG.nombre;
  document.title = CONFIG.nombre;

  /* Inyectar manifest PWA dinámicamente */
  const iconSvg = (size, rx) =>
    `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}'><rect width='${size}' height='${size}' rx='${rx}' fill='${encodeURIComponent(CONFIG.colorPrimario)}'/><text y='.85em' font-size='${Math.round(size*.72)}' x='${Math.round(size*.1)}'>${CONFIG.emoji}</text></svg>`;

  const manifest = {
    name:             CONFIG.nombre,
    short_name:       CONFIG.nombreCorto,
    description:      CONFIG.descripcion,
    start_url:        '/',
    display:          'standalone',
    background_color: CONFIG.colorBg,
    theme_color:      CONFIG.colorPrimario,
    orientation:      'portrait',
    icons: [
      { src: iconSvg(192, 40),  sizes: '192x192',  type: 'image/svg+xml', purpose: 'any maskable' },
      { src: iconSvg(512, 100), sizes: '512x512',  type: 'image/svg+xml', purpose: 'any maskable' },
    ]
  };
  const blob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
  const el = document.getElementById('pwa-manifest');
  if (el) el.href = URL.createObjectURL(blob);

  /* Registrar Service Worker */
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  /* Arrancar la app */
  initApp();
}

/* fmt necesita CONFIG.moneda — se define aquí para que app.js lo use */
const fmt = n => (CONFIG.moneda || 'S/ ') + Number(n).toFixed(2);
const WA  = () => CONFIG.wa;

document.addEventListener('DOMContentLoaded', loadConfig);
