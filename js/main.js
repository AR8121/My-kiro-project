/* ===========================
   AUDIO INTELLIGENCE — MAIN JS
   =========================== */

// ---- Cart State ----
let cart = JSON.parse(localStorage.getItem('ai_cart') || '[]');

function saveCart() { localStorage.setItem('ai_cart', JSON.stringify(cart)); }

function updateCartUI() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = count);
  const cartItemsEl = document.getElementById('cartItems');
  const cartFooter = document.getElementById('cartFooter');
  const cartTotalEl = document.getElementById('cartTotal');
  if (!cartItemsEl) return;
  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty"><i class="fas fa-music"></i><p>Your cart is empty</p></div>';
    if (cartFooter) cartFooter.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map((item, idx) => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">$${item.price.toFixed(2)} × ${item.qty}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})"><i class="fas fa-trash-alt"></i></button>
      </div>`).join('');
    if (cartFooter) { cartFooter.style.display = 'block'; }
    if (cartTotalEl) cartTotalEl.textContent = '$' + total.toFixed(2);
  }
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) { existing.qty++; }
  else { cart.push({ name, price, qty: 1 }); }
  saveCart(); updateCartUI();
  showToast(`<i class="fas fa-check-circle"></i> "${name}" added to cart`);
  openCart();
}

function removeFromCart(idx) { cart.splice(idx, 1); saveCart(); updateCartUI(); }

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

// ---- Toast Notification ----
function showToast(msg) {
  let toast = document.getElementById('globalToast');
  if (!toast) { toast = document.createElement('div'); toast.id = 'globalToast'; toast.className = 'toast'; document.body.appendChild(toast); }
  toast.innerHTML = msg; toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ---- Navbar Scroll ----
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
  const toggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }
}

// ---- Scroll Animations ----
function initScrollAnimations() {
  const els = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.1 });
  els.forEach(el => observer.observe(el));
}

// ---- FAQ Accordion ----
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      document.querySelectorAll('.faq-question.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
    });
  });
}

// ---- Newsletter ----
function subscribeNewsletter(e) {
  e.preventDefault();
  showToast('<i class="fas fa-envelope"></i> You\'re subscribed! Check your email.');
  e.target.reset();
}

// ---- Filter Buttons ----
function initFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      document.querySelectorAll('.product-card').forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}


// ---- Products Data ----
const products = [
  { id: 1, name: 'AI Compressor X', category: 'plugins', price: 149, badge: 'NEW', badgeType: 'new', icon: 'fa-compress-alt', desc: 'Intelligent VCA compressor with harmonic saturation and transient shaping.', formats: ['VST3','AU','AAX'] },
  { id: 2, name: 'Transformer EQ Pro', category: 'plugins', price: 129, badge: 'POPULAR', badgeType: '', icon: 'fa-sliders-h', desc: 'Analog-modeled equalizer with transformer iron saturation.', formats: ['VST3','AU','AAX'] },
  { id: 3, name: 'Space Reverb AI', category: 'plugins', price: 99, badge: null, icon: 'fa-water', desc: 'Algorithmic reverb with AI-powered room modeling.', formats: ['VST3','AU'] },
  { id: 4, name: 'AI Channel Strip', category: 'bundles', price: 249, originalPrice: 377, badge: 'SALE', badgeType: 'sale', icon: 'fa-layer-group', desc: 'Complete channel strip bundle: EQ + Compressor + Saturator.', formats: ['VST3','AU','AAX'] },
  { id: 5, name: 'Analog Preamp 500', category: 'hardware', price: 499, badge: null, icon: 'fa-microchip', desc: '500-series class-A preamp with transformer balanced I/O.', formats: ['500-Series'] },
  { id: 6, name: 'Tape Saturator', category: 'plugins', price: 79, badge: null, icon: 'fa-circle', desc: 'Vintage tape machine emulation with wow, flutter, and harmonic drive.', formats: ['VST3','AU','AAX'] },
  { id: 7, name: 'Free Limiter X', category: 'free', price: 0, badge: 'FREE', badgeType: 'new', icon: 'fa-shield-alt', desc: 'Transparent brickwall limiter. Absolutely free, forever.', formats: ['VST3','AU'] },
  { id: 8, name: 'Analog Bus Comp', category: 'hardware', price: 899, badge: null, icon: 'fa-microchip', desc: 'Stereo VCA bus compressor. Rack-mounted, studio-grade.', formats: ['Rack'] },
];

function createProductCard(product, showFull = false) {
  const priceHTML = product.price === 0
    ? `<span class="price-free">FREE</span>`
    : `<span class="price-current">$${product.price}</span>${product.originalPrice ? `<span class="price-original">$${product.originalPrice}</span>` : ''}`;
  const badgeHTML = product.badge ? `<div class="product-badge ${product.badgeType}">${product.badge}</div>` : '';
  return `
    <div class="product-card fade-up" data-category="${product.category}">
      <div class="product-image">
        <i class="fas ${product.icon} product-image-icon"></i>
        ${badgeHTML}
      </div>
      <div class="product-body">
        <div class="product-category">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.desc}</div>
        <div class="product-formats">${product.formats.map(f => `<span class="format-tag">${f}</span>`).join('')}</div>
        <div class="product-footer">
          <div class="product-price">${priceHTML}</div>
          <button class="btn-add-cart" onclick="addToCart('${product.name}', ${product.price})">
            <i class="fas fa-${product.price === 0 ? 'download' : 'cart-plus'}"></i>
            ${product.price === 0 ? 'Download' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>`;
}

function renderFeaturedProducts() {
  const grid = document.getElementById('featuredGrid');
  if (!grid) return;
  const featured = products.slice(0, 4);
  grid.innerHTML = featured.map(p => createProductCard(p)).join('');
  initScrollAnimations();
}

function renderAllProducts() {
  const grid = document.getElementById('allProductsGrid');
  if (!grid) return;
  grid.innerHTML = products.map(p => createProductCard(p, true)).join('');
  initScrollAnimations();
  // Check URL filter
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  if (cat) {
    const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
    if (btn) btn.click();
  }
}

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initScrollAnimations();
  initFAQ();
  initFilters();
  updateCartUI();
  renderFeaturedProducts();
  renderAllProducts();
  document.getElementById('cartBtn')?.addEventListener('click', openCart);
  document.getElementById('cartClose')?.addEventListener('click', closeCart);
  document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
});
