/**
 * MYSTERY COFFEE ROULETTE
 * Gimmick pemesanan unik: Dapatkan menu random dengan diskon!
 */
const MysteryRoulette = (() => {
  // State
  let reRollCount = 0;
  const MAX_REROLL = 3;
  let currentMysteryItem = null;
  let menuData = [];

  // DOM Elements
  const rouletteBtn = document.getElementById('roulette-btn');
  const rouletteModal = document.getElementById('roulette-modal');
  const slotMachine = document.getElementById('slot-machine');
  const resultDisplay = document.getElementById('roulette-result');
  const acceptBtn = document.getElementById('accept-mystery');
  const rerollBtn = document.getElementById('reroll-mystery');
  const closeBtn = document.getElementById('close-roulette');

  // Inisialisasi
  function init(menu) {
    menuData = menu;
    bindEvents();
  }

  // Event Listeners
  function bindEvents() {
    rouletteBtn?.addEventListener('click', openRoulette);
    acceptBtn?.addEventListener('click', acceptMysteryItem);
    rerollBtn?.addEventListener('click', rerollMysteryItem);
    closeBtn?.addEventListener('click', closeRoulette);
  }

  // Buka Roulette
  function openRoulette() {
    if (reRollCount >= MAX_REROLL) {
      Swal.fire({
        title: 'Oops! 😅',
        text: 'Kesempatan re-roll sudah habis! Coba lagi besok ya~',
        icon: 'info',
        confirmButtonColor: '#8B4513'
      });
      return;
    }

    rouletteModal.classList.add('active');
    spinTheWheel();
  }

  // Animasi Slot Machine
  async function spinTheWheel() {
    // Disable buttons selama animasi
    acceptBtn.disabled = true;
    rerollBtn.disabled = true;

    // Play spin sound
    playSound('roulette-spin');

    // Animasi slot machine
    slotMachine.classList.add('spinning');
    resultDisplay.innerHTML = '<div class="slot-animation">🎰</div>';

    // Delay untuk efek dramatis
    await delay(2000);

    // Get random item
    const randomItem = getRandomMenuItem();
    currentMysteryItem = {
      ...randomItem,
      originalPrice: randomItem.price,
      discountedPrice: calculateDiscount(randomItem.price),
      discountPercent: Math.floor(Math.random() * 21) + 30 // 30-50%
    };

    // Tampilkan hasil dengan animasi
    displayResult();

    // Enable buttons
    acceptBtn.disabled = false;
    rerollBtn.disabled = false;
  }

  // Dapatkan menu random
  function getRandomMenuItem() {
    const randomIndex = Math.floor(Math.random() * menuData.length);
    return menuData[randomIndex];
  }

  // Kalkulasi diskon
  function calculateDiscount(originalPrice) {
    const discountPercent = Math.floor(Math.random() * 21) + 30; // 30-50%
    const discount = (originalPrice * discountPercent) / 100;
    return Math.floor(originalPrice - discount);
  }

  // Tampilkan hasil roulette
  function displayResult() {
    slotMachine.classList.remove('spinning');

    // Trigger confetti
    triggerConfetti();

    // Play win sound
    playSound('win-jingle');

    resultDisplay.innerHTML = `
      <div class="mystery-reveal">
        <div class="reveal-animation">🎉</div>
        <div class="mystery-item-detail">
          <img src="./assets/images/menu/${currentMysteryItem.image}" 
               alt="${currentMysteryItem.name}"
               class="mystery-item-img">
          <h3>${currentMysteryItem.name}</h3>
          <p class="mystery-category">${currentMysteryItem.category}</p>
          <div class="price-tag">
            <span class="original-price">Rp ${formatRupiah(currentMysteryItem.originalPrice)}</span>
            <span class="discounted-price">Rp ${formatRupiah(currentMysteryItem.discountedPrice)}</span>
            <span class="discount-badge">-${currentMysteryItem.discountPercent}%</span>
          </div>
        </div>
      </div>
    `;

    // Update re-roll info
    updateRerollInfo();
  }

  // Terima mystery item
  function acceptMysteryItem() {
    if (!currentMysteryItem) return;

    // Tambahkan ke cart dengan harga diskon
    Cart.addItem({
      id: `mystery-${currentMysteryItem.id}-${Date.now()}`,
      name: currentMysteryItem.name,
      price: currentMysteryItem.discountedPrice,
      originalPrice: currentMysteryItem.originalPrice,
      category: currentMysteryItem.category,
      image: currentMysteryItem.image,
      isMystery: true,
      discountPercent: currentMysteryItem.discountPercent
    });

    // Notifikasi sukses
    Swal.fire({
      title: 'Berhasil! 🎉',
      text: `${currentMysteryItem.name} berhasil ditambahkan ke keranjang dengan diskon ${currentMysteryItem.discountPercent}%!`,
      icon: 'success',
      confirmButtonColor: '#8B4513',
      timer: 3000
    });

    // Reset roulette
    resetRoulette();
    closeRoulette();
  }

  // Re-roll
  function rerollMysteryItem() {
    reRollCount++;

    if (reRollCount >= MAX_REROLL) {
      rerollBtn.disabled = true;
      rerollBtn.textContent = 'Re-roll Habis 😢';
    }

    spinTheWheel();
  }

  // Update info re-roll
  function updateRerollInfo() {
    const remainingRerolls = MAX_REROLL - reRollCount;
    rerollBtn.textContent = `Re-roll (${remainingRerolls}x)`;
    
    if (remainingRerolls <= 0) {
      rerollBtn.disabled = true;
      rerollBtn.textContent = 'Re-roll Habis 😢';
    }
  }

  // Reset roulette
  function resetRoulette() {
    reRollCount = 0;
    currentMysteryItem = null;
    resultDisplay.innerHTML = '';
    updateRerollInfo();
  }

  // Tutup roulette
  function closeRoulette() {
    rouletteModal.classList.remove('active');
    resetRoulette();
  }

  // Trigger confetti effect
  function triggerConfetti() {
    if (typeof confetti !== 'undefined') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }

  // Play sound
  function playSound(soundName) {
    const audio = new Audio(`./assets/sounds/${soundName}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Ignore autoplay restrictions
  }

  // Helper: Format rupiah
  function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID').format(angka);
  }

  // Helper: Delay
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return { init };
})();
