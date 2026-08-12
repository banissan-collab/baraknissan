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

  function addSourceStyles(){
    if (document.getElementById('managerSourceStyles')) return;
    const style = document.createElement('style');
    style.id = 'managerSourceStyles';
    style.textContent = `
      .inventory-sources{background:var(--bg);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
      .source-intro{max-width:820px;margin:0 auto 34px;text-align:center;color:var(--muted);font-size:15px;line-height:1.7}
      .source-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}
      .source-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px;display:flex;flex-direction:column;gap:12px;min-height:230px}
      .source-card h3{font-size:20px;color:var(--navy)}
      .source-areas{font-size:13px;color:var(--muted)}
      .source-status{display:inline-flex;align-self:flex-start;padding:6px 10px;border-radius:999px;font-size:11px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;background:rgba(15,30,46,.06);color:var(--navy)}
      .source-status.op-visible{background:rgba(31,122,77,.10);color:#1F7A4D}
      .source-status.conditional{background:rgba(184,146,74,.14);color:var(--gold-2)}
      .source-note{font-size:13.5px;color:var(--muted);line-height:1.55;flex:1}
      .source-link{display:inline-flex;align-items:center;gap:8px;color:var(--gold-2);font-weight:700;font-size:13px;margin-top:auto}
      .source-link:hover{color:var(--navy)}
      .source-footnote{margin-top:24px;padding:16px 18px;border:1px solid var(--line);border-radius:10px;background:#fff;color:var(--muted);font-size:13px;line-height:1.6}
      @media(max-width:900px){.source-grid{grid-template-columns:repeat(2,1fr)}}
      @media(max-width:640px){.source-grid{grid-template-columns:1fr}.source-card{min-height:0}}
    `;
    document.head.appendChild(style);
  }

  function renderSourceSection(sources){
    const listingsSection = document.getElementById('listings');
    if (!listingsSection || document.getElementById('inventorySources')) return;
    const section = document.createElement('section');
    section.className = 'inventory-sources';
    section.id = 'inventorySources';
    section.innerHTML = `
      <div class="container">
        <div class="section-head">
          <div class="eyebrow">NYC Rental Inventory Sources</div>
          <h2>Open & active rentals from major property managers</h2>
          <p>Current inventory sources I monitor for broker-friendly opportunities across New York City.</p>
        </div>
        <div class="source-intro">The links below point to each manager's current availability or broker resources. Apartments are only republished on BarakNissan.com after advertising permission and broker compensation terms are verified.</div>
        <div class="source-grid">
          ${sources.map((source) => `
            <article class="source-card">
              <h3>${escapeHtml(source.name)}</h3>
              <div class="source-areas">${escapeHtml(source.areas)}</div>
              <span class="source-status ${escapeHtml(source.status)}">${escapeHtml(source.statusLabel)}</span>
              <p class="source-note">${escapeHtml(source.note)}</p>
              <a class="source-link" href="${escapeHtml(source.inventoryUrl)}" target="_blank" rel="noopener">View current availability →</a>
            </article>
          `).join('')}
        </div>
        <div class="source-footnote"><strong>Coming next:</strong> approved manager feeds will be connected to the Featured Listings section below so eligible apartments can appear and update automatically without manual page uploads.</div>
      </div>
    `;
    listingsSection.parentNode.insertBefore(section, listingsSection);
  }

  async function loadManagerSources(){
    try {
      addSourceStyles();
      const response = await fetch('manager-sources.json', { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const sources = await response.json();
      renderSourceSection(sources);
    } catch (error) {
      console.error('Unable to load manager-sources.json', error);
    }
  }

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

  loadManagerSources();
  loadRentals();
})();
