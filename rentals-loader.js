(() => {
  const grid = document.getElementById('gridView');
  if (!grid) return;

  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const formatPrice = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number.toLocaleString('en-US') : escapeHtml(value);
  };

  async function loadRentals() {
    try {
      const response = await fetch('rentals.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const rentals = await response.json();
      const activeRentals = rentals.filter((rental) => rental.active !== false);

      grid.innerHTML = activeRentals.map((rental) => `
        <div class="listing-card-compact" data-property-index="${Number(rental.propertyIndex) || 0}">
          <div class="card-image">
            <img src="${escapeHtml(rental.image)}" alt="${escapeHtml(rental.title)}" />
            ${rental.badge ? `<span class="card-badge">${escapeHtml(rental.badge)}</span>` : ''}
          </div>
          <div class="card-info">
            <div class="card-price">$${formatPrice(rental.price)}<span>${escapeHtml(rental.priceSuffix || '/month')}</span></div>
            <div class="card-title">${escapeHtml(rental.title)}</div>
            <div class="card-address">${escapeHtml(rental.address)}</div>
            <div class="card-specs">
              ${rental.beds ? `<span>${escapeHtml(rental.beds)}</span>` : ''}
              ${rental.baths ? `<span>${escapeHtml(rental.baths)}</span>` : ''}
              ${rental.availability ? `<span>${escapeHtml(rental.availability)}</span>` : ''}
            </div>
          </div>
        </div>
      `).join('');

      grid.querySelectorAll('.listing-card-compact').forEach((card) => {
        card.addEventListener('click', () => {
          const index = Number(card.dataset.propertyIndex);
          if (typeof window.showDetailView === 'function') {
            window.showDetailView(index);
          }
        });
      });
    } catch (error) {
      console.error('Unable to load rentals.json', error);
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;">Listings are temporarily unavailable. Please contact Barak for current availability.</p>';
    }
  }

  loadRentals();
})();
