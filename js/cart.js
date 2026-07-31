/**
 * CART SYSTEM
 * Mengelola keranjang belanja menggunakan localStorage
 */
const Cart = (() => {
  let cartItems = [];
  const CART_KEY = 'ngopiDulu_cart';

  // DOM Elements
  const cartIcon = document.getElementById('cart-icon');
  const cartSidebar = document.getElementById('cart-sidebar');
  const cartOverlay = document.getElementById('cart-overlay');
  const cartItemsContainer = document.getElementById('cart-items');
  const cartCount = document.getElementById('cart-count');
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountEl = document.getElementById('cart-discount');
  const totalEl = document.getElementById('cart-total');

  // Inisialisasi
  function init() {
    loadCart();
    renderCart();
    bindEvents();
  }

  // Load dari localStorage
  function loadCart() {
    const saved = localStorage.getItem(CART_KEY);
    cartItems = saved ? JSON.parse(saved) : [];
  }

  // Simpan ke localStorage
  function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }

  // Tambah item ke cart
  function addItem(item) {
    const existingItem = cartItems.find(i => i.id === item.id && !i.isMystery);

    if (existingItem && !item.isMystery) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        ...item,
        quantity: 1
      });
    }

    saveCart();
    renderCart();
    openCart();

    // Animasi item masuk
    animateCartIcon();
  }

  // Hapus item dari cart
  function removeItem(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    saveCart();
    renderCart();
  }

  // Update quantity
  function updateQuantity(itemId, newQuantity) {
    const item = cartItems.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, newQuantity);
      saveCart();
      renderCart();
    }
  }

  // Hitung subtotal
  function calculateSubtotal() {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  // Hitung total diskon
  function calculateDiscount() {
    return cartItems.reduce((sum, item) => {
      if (item.isMystery && item.originalPrice) {
        return sum + ((item.originalPrice - item.price) * item.quantity);
      }
      return sum;
    }, 0);
  }

  // Hitung total
  function calculateTotal() {
    return calculateSubtotal();
  }

  // Render cart UI
  function renderCart() {
    // Update count badge
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    cartCount.style.display = totalItems > 0 ? 'flex' : 'none';

    // Render items
    if (cartItems.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Keranjangmu kosong nih...</p>
          <small>Yuk pesan sesuatu! ☕</small>
        </div>
      `;
    } else {
      cartItemsContainer.innerHTML = cartItems.map(item => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-info">
            <h4>${item.name}</h4>
            ${item.isMystery ? `<span class="mystery-badge">🎲 Mystery -${item.discountPercent}%</span>` : ''}
            <div class="cart-item-price">
              ${item.isMystery ? `<small class="original-price">Rp ${formatRupiah(item.originalPrice)}</small>` : ''}
              <span>Rp ${formatRupiah(item.price)}</span>
            </div>
          </div>
          <div class="cart-item-actions">
            <button class="qty-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
            <span class="qty-display">${item.quantity}</span>
            <button class="qty-btn" onclick="Cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
            <button class="remove-btn" onclick="Cart.removeItem('${item.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    }

    // Update totals
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();

    subtotalEl.textContent = `Rp ${formatRupiah(subtotal)}`;
    discountEl.textContent = `-Rp ${formatRupiah(discount)}`;
    totalEl.textContent = `Rp ${formatRupiah(subtotal)}`;
  }

  // Buka sidebar cart
  function openCart() {
    cartSidebar.classList.add('active');
    cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Tutup sidebar cart
  function closeCart() {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Animasi icon cart
  function animateCartIcon() {
    cartIcon.classList.add('bounce');
    setTimeout(() => cartIcon.classList.remove('bounce'), 300);
  }

  // Event listeners
  function bindEvents() {
    cartIcon?.addEventListener('click', openCart);
    cartOverlay?.addEventListener('click', closeCart);
    document.getElementById('close-cart')?.addEventListener('click', closeCart);
  }

  // Get cart items
  function getItems() {
    return cartItems;
  }

  // Clear cart
  function clearCart() {
    cartItems = [];
    saveCart();
    renderCart();
  }

  // Helper format rupiah
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
  }

  return {
    init,
    addItem,
    removeItem,
    updateQuantity,
    getItems,
    clearCart,
    openCart,
    closeCart
  };
})();
