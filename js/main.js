/* ==============================================
   AUDIO INTELLIGENCE — MAIN JS (Final)
   ============================================== */

/* ---- PRODUCTS DATA ---- */
const PRODUCTS = [
  { id:1, name:'AI Compressor X',    cat:'plugins',  price:149, badge:'NEW',  bc:'new',  icon:'fa-compress-alt', desc:'Intelligent VCA compressor with harmonic saturation and transient shaping for the modern mix.',    fmts:['VST3','AU','AAX'] },
  { id:2, name:'Transformer EQ Pro', cat:'plugins',  price:129, badge:'HOT',  bc:'hot',  icon:'fa-sliders-h',    desc:'Analog-modeled equalizer with iron-core transformer saturation for warmth and character.',            fmts:['VST3','AU','AAX'] },
  { id:3, name:'Space Reverb AI',    cat:'plugins',  price:99,  badge:null,   bc:'',     icon:'fa-water',        desc:'Algorithmic reverb powered by neural room modeling. From intimate chambers to infinite plates.',     fmts:['VST3','AU'] },
  { id:4, name:'AI Channel Strip',   cat:'bundles',  price:249, origPrice:377,badge:'SALE',bc:'sale',icon:'fa-layer-group',desc:'Complete channel strip bundle: EQ + Compressor + Saturator. Save $128 vs buying separately.', fmts:['VST3','AU','AAX'] },
  { id:5, name:'Analog Preamp 500',  cat:'hardware', price:499, badge:null,   bc:'',     icon:'fa-microchip',    desc:'Class-A 500-series preamp. Transformer-balanced I/O with a silky, extended top end.',                fmts:['500-Series'] },
  { id:6, name:'Tape Saturator',     cat:'plugins',  price:79,  badge:null,   bc:'',     icon:'fa-circle',       desc:'Vintage tape emulation with wow, flutter and bias controls. Brings life to sterile recordings.',     fmts:['VST3','AU','AAX'] },
  { id:7, name:'Analog Bus Comp',    cat:'hardware', price:899, badge:'NEW',  bc:'new',  icon:'fa-microchip',    desc:'Stereo VCA bus compressor. Rack-mount studio grade. The glue your mixes have been missing.',         fmts:['Rack 2U'] },
  { id:8, name:'Free Limiter X',     cat:'free',     price:0,   badge:'FREE', bc:'free', icon:'fa-shield-alt',   desc:'Transparent brick-wall limiter. Absolutely free, forever. No catch, no sign-up required.',          fmts:['VST3','AU'] },
];

/* =============================
   CART STATE
   ============================= */
let cart = JSON.parse(localStorage.getItem('ai_cart') || '[]');

function saveCart() {
  localStorage.setItem('ai_cart', JSON.stringify(cart));
}

/* ---- ADD TO CART ---- */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  if (p.price === 0) {
    toast(`<i class="fas fa-download"></i> <strong>${p.name}</strong> is free — downloading!`);
    return;
  }
  const ex = cart.find(x => x.id === id);
  if (ex) { ex.qty++; }
  else { cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 }); }
  saveCart();
  renderCart();
  openCart();
  toast(`<i class="fas fa-check-circle"></i> <strong>${p.name}</strong> added to cart`);
}

/* ---- REMOVE FROM CART ---- */
function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
  renderCart();
}

/* ---- RENDER CART DRAWER ---- */
function renderCart() {
  const itemsEl = document.getElementById('cartItems');
  const footEl  = document.getElementById('cartFoot');
  const badgeEl = document.getElementById('cartBadge');
  if (!itemsEl) return;

  const count    = cart.reduce((a, x) => a + x.qty, 0);
  const subtotal = cart.reduce((a, x) => a + x.price * x.qty, 0);

  if (badgeEl) badgeEl.textContent = count;

  if (cart.length === 0) {
    itemsEl.innerHTML = `
      <div class="cart-empty">
        <i class="fas fa-music"></i>
        <p>Your cart is empty</p>
        <a href="products.html" class="btn btn-primary" style="margin-top:14px;padding:10px 20px;font-size:.85rem;">
          Browse Products
        </a>
      </div>`;
    if (footEl) footEl.style.display = 'none';
  } else {
    itemsEl.innerHTML = cart.map(x => `
      <div class="cart-item">
        <div class="ci-info">
          <div class="ci-name">${x.name}</div>
          <div class="ci-price">$${x.price.toFixed(2)}${x.qty > 1 ? ' <span style="color:var(--text-3);font-weight:400;">×' + x.qty + '</span>' : ''}</div>
        </div>
        <button class="ci-del" onclick="removeFromCart(${x.id})" title="Remove">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>`).join('');

    if (footEl) {
      footEl.style.display = 'block';
      const subtotalEl = document.getElementById('cartSubtotal');
      const totalEl    = document.getElementById('cartTotal');
      if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
      if (totalEl)    totalEl.textContent    = '$' + subtotal.toFixed(2);
      // Payment logos strip
      const logoStrip = document.getElementById('payLogoStrip');
      if (logoStrip) logoStrip.style.display = 'flex';
    }
  }
}

/* ---- OPEN / CLOSE CART ---- */
function openCart() {
  document.getElementById('drawer')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('drawer')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('on');
  document.body.style.overflow = '';
}

/* ---- TOAST ---- */
function toast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.innerHTML = msg;
  t.classList.add('show');
  clearTimeout(t._t);
  t._t = setTimeout(() => t.classList.remove('show'), 3500);
}

/* =============================
   NAVBAR
   ============================= */
function initNavbar() {
  const nb = document.getElementById('navbar');
  if (nb) window.addEventListener('scroll', () => nb.classList.toggle('scrolled', scrollY > 40));
  const tog   = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (tog && links) tog.addEventListener('click', () => links.classList.toggle('open'));
}

/* =============================
   SCROLL ANIMATIONS
   ============================= */
function initAnim() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
}

/* =============================
   FAQ ACCORDION
   ============================= */
function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const ans  = btn.nextElementSibling;
      const open = btn.classList.contains('open');
      document.querySelectorAll('.faq-q.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      if (!open) { btn.classList.add('open'); ans.classList.add('open'); }
    });
  });
}

/* =============================
   PRODUCT FILTERS
   ============================= */
function initFilters() {
  document.querySelectorAll('.fbtn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.fbtn').forEach(b => b.classList.remove('on'));
      btn.classList.add('on');
      const f = btn.dataset.f;
      document.querySelectorAll('.card').forEach(c => {
        c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
      });
    });
  });
}

/* =============================
   RENDER PRODUCT CARDS
   ============================= */
function cardHTML(p) {
  const badge = p.badge
    ? `<span class="badge ${p.bc}">${p.badge}</span>` : '';
  const priceHTML = p.price === 0
    ? `<span class="price-free">FREE</span>`
    : `<span class="price-cur">$${p.price}</span>${p.origPrice ? `<span class="price-was">$${p.origPrice}</span>` : ''}`;
  const btnLabel = p.price === 0
    ? '<i class="fas fa-download"></i> Download Free'
    : '<i class="fas fa-cart-plus"></i> Add to Cart';
  return `
    <div class="card fade-up" data-cat="${p.cat}">
      <div class="card-img"><i class="fas ${p.icon}"></i>${badge}</div>
      <div class="card-body">
        <div class="card-cat">${p.cat}</div>
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-fmts">${p.fmts.map(f => `<span class="fmt">${f}</span>`).join('')}</div>
        <div class="card-foot">
          <div>${priceHTML}</div>
          <button class="btn-cart-add" onclick="addToCart(${p.id})">${btnLabel}</button>
        </div>
      </div>
    </div>`;
}

function renderFeatured() {
  const el = document.getElementById('featuredGrid');
  if (!el) return;
  el.innerHTML = PRODUCTS.slice(0, 4).map(cardHTML).join('');
  initAnim();
}

function renderAll() {
  const el = document.getElementById('allGrid');
  if (!el) return;
  el.innerHTML = PRODUCTS.map(cardHTML).join('');
  initAnim();
  // Handle ?cat= URL param
  const cat = new URLSearchParams(location.search).get('cat');
  if (cat) {
    const btn = document.querySelector(`.fbtn[data-f="${cat}"]`);
    if (btn) btn.click();
  }
}

/* =============================
   NEWSLETTER / FORMS
   ============================= */
function subscribeNewsletter(e) {
  e.preventDefault();
  toast('<i class="fas fa-envelope"></i> Subscribed! Check your inbox.');
  e.target.reset();
}

function submitContact(e) {
  e.preventDefault();
  toast('<i class="fas fa-check-circle"></i> Message sent! We\'ll reply within 4 hours.');
  e.target.reset();
}

/* =============================
   INIT ON DOM READY
   ============================= */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAnim();
  initFAQ();
  initFilters();
  renderCart();
  renderFeatured();
  renderAll();

  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('drawerClose')?.addEventListener('click', closeCart);
  document.getElementById('overlay')?.addEventListener('click', closeCart);
});
