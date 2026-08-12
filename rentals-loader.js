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

  function addStyles(){
    if (document.getElementById('openRentalStyles')) return;
    const style = document.createElement('style');
    style.id = 'openRentalStyles';
    style.textContent = `
      #listings{background:linear-gradient(180deg,#fff 0%,#f7f5ef 100%);position:relative;overflow:hidden}
      #listings:before{content:"";position:absolute;width:520px;height:520px;border-radius:50%;right:-180px;top:-180px;background:radial-gradient(circle,rgba(184,146,74,.16),rgba(184,146,74,0) 68%);pointer-events:none}
      #listings .section-head{max-width:860px;margin-bottom:34px;position:relative;z-index:1}
      #listings .section-head h2{font-size:clamp(38px,5vw,58px);letter-spacing:-.035em}
      #listings .section-head p{font-size:18px;max-width:760px;margin:0 auto}
      .open-rental-toolbar{display:flex;gap:10px;justify-content:center;align-items:center;flex-wrap:wrap;margin:0 auto 28px;position:relative;z-index:1}
      .rental-filter{border:1px solid var(--line);background:#fff;color:var(--navy);padding:10px 15px;border-radius:999px;font:600 13px/1 'Inter',sans-serif;cursor:pointer;transition:.2s}
      .rental-filter:hover,.rental-filter.active{background:var(--navy);color:#fff;border-color:var(--navy);transform:translateY(-1px)}
      .move-in-strip{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin:0 auto 34px;position:relative;z-index:1}
      .move-chip{padding:8px 13px;border-radius:999px;background:rgba(184,146,74,.12);color:var(--gold-2);font-weight:700;font-size:12px;letter-spacing:.03em}
      .listings-grid-view{max-width:1180px!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:20px!important;margin-bottom:24px!important}
      .open-card{position:relative;border:1px solid rgba(15,30,46,.08);background:rgba(255,255,255,.94);border-radius:20px;overflow:hidden;box-shadow:0 18px 55px -34px rgba(15,30,46,.45);transition:.28s;display:flex;flex-direction:column;min-height:360px}
      .open-card:hover{transform:translateY(-6px);box-shadow:0 28px 70px -36px rgba(15,30,46,.5);border-color:rgba(184,146,74,.45)}
      .open-card-visual{min-height:145px;padding:22px;display:flex;flex-direction:column;justify-content:space-between;background:linear-gradient(135deg,#102438,#1d3c55);color:#fff;position:relative;overflow:hidden}
      .open-card-visual:after{content:"";position:absolute;right:-48px;top:-48px;width:170px;height:170px;border-radius:50%;background:rgba(184,146,74,.17)}
      .open-card:nth-child(3n+2) .open-card-visual{background:linear-gradient(135deg,#132a3f,#314d61)}
      .open-card:nth-child(3n+3) .open-card-visual{background:linear-gradient(135deg,#1e3141,#5a4931)}
      .open-badges{display:flex;gap:8px;flex-wrap:wrap;position:relative;z-index:1}
      .open-badge{display:inline-flex;padding:6px 9px;border-radius:999px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);font-size:10.5px;font-weight:800;letter-spacing:.06em;text-transform:uppercase}
      .op-badge{background:var(--gold);border-color:var(--gold);color:#fff}
      .open-building{position:relative;z-index:1}
      .open-building strong{display:block;font-family:'Fraunces',serif;font-size:26px;line-height:1.05;margin-bottom:5px}
      .open-building span{font-size:12px;color:rgba(255,255,255,.72)}
      .open-card-body{padding:20px 20px 18px;display:flex;flex-direction:column;gap:13px;flex:1}
      .open-price-row{display:flex;align-items:flex-end;justify-content:space-between;gap:12px}
      .open-price{font-family:'Fraunces',serif;font-size:30px;color:var(--navy);font-weight:600;line-height:1}
      .open-price small{font-family:'Inter',sans-serif;font-size:12px;color:var(--muted);font-weight:500;margin-left:3px}
      .open-unit{font-size:12px;font-weight:700;color:var(--gold-2)}
      .open-address{font-size:13.5px;color:var(--muted);line-height:1.45}
      .open-specs{display:flex;gap:7px;flex-wrap:wrap}
      .open-specs span{font-size:11.5px;padding:6px 8px;border-radius:8px;background:#f4f3ef;color:var(--navy);font-weight:600}
      .open-incentive{font-size:13px;line-height:1.45;color:#1f6844;font-weight:700;padding:10px 12px;border-radius:10px;background:rgba(31,122,77,.08);border:1px solid rgba(31,122,77,.12)}
      .open-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:auto}
      .open-action{display:flex;justify-content:center;align-items:center;padding:11px 10px;border-radius:10px;font-size:12.5px;font-weight:800;transition:.2s}
      .open-action.primary{background:var(--navy);color:#fff}
      .open-action.primary:hover{background:var(--gold)}
      .open-action.secondary{border:1px solid var(--line);color:var(--navy);background:#fff}
      .open-action.secondary:hover{border-color:var(--gold);color:var(--gold-2)}
      .inventory-meta{display:flex;justify-content:space-between;gap:16px;align-items:center;margin:16px auto 0;max-width:1180px;padding:16px 18px;border-radius:14px;background:#fff;border:1px solid var(--line);font-size:12.5px;color:var(--muted);position:relative;z-index:1}
      .inventory-meta strong{color:var(--navy)}
      .inventory-count{font-family:'Fraunces',serif;font-size:24px;color:var(--navy);font-weight:600;white-space:nowrap}
      .inventory-count span{font-family:'Inter',sans-serif;font-size:11px;color:var(--muted);font-weight:600;margin-left:4px;text-transform:uppercase;letter-spacing:.05em}
      .inventory-note{max-width:780px;line-height:1.55}
      .direct-listings-wrap{max-width:1180px;margin:28px auto 0;padding-top:26px;border-top:1px solid var(--line)}
      .direct-listings-title{font-family:'Fraunces',serif;font-size:26px;color:var(--navy);margin-bottom:8px}
      .direct-listings-sub{font-size:13.5px;color:var(--muted);margin-bottom:18px}
      .direct-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
      .direct-mini{display:flex;gap:14px;padding:14px;border:1px solid var(--line);border-radius:14px;background:#fff;align-items:center}
      .direct-mini img{width:110px;height:82px;border-radius:10px;object-fit:cover}
      .direct-mini h4{font-family:'Fraunces',serif;color:var(--navy);font-size:17px;margin-bottom:4px}
      .direct-mini p{font-size:12.5px;color:var(--muted);line-height:1.4}
      @media(max-width:980px){.listings-grid-view{grid-template-columns:repeat(2,minmax(0,1fr))!important}}
      @media(max-width:640px){.listings-grid-view{grid-template-columns:1fr!important}.open-card{min-height:0}.inventory-meta{flex-direction:column;align-items:flex-start}.direct-grid{grid-template-columns:1fr}.direct-mini img{width:92px;height:72px}}
    `;
    document.head.appendChild(style);
  }

  function setSectionHeader(){
    const section = document.getElementById('listings');
    if (!section) return;
    const eyebrow = section.querySelector('.section-head .eyebrow');
    const title = section.querySelector('.section-head h2');
    const copy = section.querySelector('.section-head p');
    if (eyebrow) eyebrow.textContent = 'Open NYC Rentals';
    if (title) title.textContent = 'Find your August, September or October move';
    if (copy) copy.textContent = 'Current broker opportunities across Manhattan, Brooklyn and Queens. Filter by area or apartment type, then contact me to verify the exact move-in date and arrange a showing.';
    const detail = document.getElementById('detailView');
    if (detail) detail.style.display = 'none';
  }

  function insertControls(rentals){
    const section = document.getElementById('listings');
    const head = section?.querySelector('.section-head');
    if (!head || document.getElementById('openRentalToolbar')) return;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="move-in-strip" aria-label="Move-in window">
        <span class="move-chip">AUGUST MOVE-IN</span>
        <span class="move-chip">SEPTEMBER MOVE-IN</span>
        <span class="move-chip">OCTOBER MOVE-IN</span>
      </div>
      <div class="open-rental-toolbar" id="openRentalToolbar">
        <button class="rental-filter active" data-filter="all">All Open Rentals</button>
        <button class="rental-filter" data-filter="Manhattan">Manhattan</button>
        <button class="rental-filter" data-filter="Queens">Queens</button>
        <button class="rental-filter" data-filter="Brooklyn">Brooklyn</button>
        <button class="rental-filter" data-filter="Studio">Studios</button>
        <button class="rental-filter" data-filter="1 Bedroom">1 Bedrooms</button>
        <button class="rental-filter" data-filter="2 Bedroom">2 Bedrooms</button>
      </div>`;
    head.insertAdjacentElement('afterend', wrapper);

    document.querySelectorAll('.rental-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.rental-filter').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderOpenRentals(rentals, btn.dataset.filter);
      });
    });
  }

  function rentalCard(rental){
    const inquiryText = encodeURIComponent(`Hi Barak, I'm interested in ${rental.address} Apt ${rental.unit} (${rental.beds}) at $${formatPrice(rental.price)}/mo. I'm looking for an Aug/Sept/Oct move-in. Please verify availability and showing options.`);
    return `
      <article class="open-card">
        <div class="open-card-visual">
          <div class="open-badges">
            <span class="open-badge op-badge">${escapeHtml(rental.incentive)}</span>
            <span class="open-badge">${escapeHtml(rental.borough)}</span>
          </div>
          <div class="open-building">
            <strong>${escapeHtml(rental.building)}</strong>
            <span>${escapeHtml(rental.neighborhood)}</span>
          </div>
        </div>
        <div class="open-card-body">
          <div class="open-price-row">
            <div class="open-price">$${formatPrice(rental.price)}<small>/mo</small></div>
            <div class="open-unit">APT ${escapeHtml(rental.unit)}</div>
          </div>
          <div class="open-address">${escapeHtml(rental.address)} · ${escapeHtml(rental.neighborhood)}</div>
          <div class="open-specs"><span>${escapeHtml(rental.beds)}</span><span>${escapeHtml(rental.baths)}</span><span>Move-in date: verify</span></div>
          <div class="open-incentive">Broker opportunity: ${escapeHtml(rental.incentive)}</div>
          <div class="open-actions">
            <a class="open-action primary" href="mailto:bnissan@findrealestate.com?subject=NYC%20Rental%20Inquiry&body=${inquiryText}">Ask Barak</a>
            <a class="open-action secondary" href="${escapeHtml(rental.sourceUrl)}" target="_blank" rel="noopener">Check Source</a>
          </div>
        </div>
      </article>`;
  }

  function renderOpenRentals(rentals, filter='all'){
    const filtered = rentals.filter(r => {
      if (filter === 'all') return true;
      if (['Manhattan','Queens','Brooklyn'].includes(filter)) return r.borough === filter;
      return r.beds === filter || (filter === 'Studio' && /Studio/i.test(r.beds));
    });
    grid.innerHTML = filtered.map(rentalCard).join('');
    let meta = document.getElementById('inventoryMeta');
    if (!meta) {
      meta = document.createElement('div');
      meta.id = 'inventoryMeta';
      meta.className = 'inventory-meta';
      grid.insertAdjacentElement('afterend', meta);
    }
    meta.innerHTML = `<div class="inventory-count">${filtered.length}<span>current opportunities</span></div><div class="inventory-note"><strong>Updated Aug. 12, 2026.</strong> These are current public broker opportunities with owner-paid incentives shown by the source. Exact availability, concessions and August/September/October move-in timing must be reconfirmed before advertising, showing or application.</div>`;
  }

  function renderDirectListings(rentals){
    const section = document.getElementById('listings');
    if (!section || document.getElementById('directListingsWrap')) return;
    const container = section.querySelector('.container');
    if (!container || !rentals.length) return;
    const wrap = document.createElement('div');
    wrap.id = 'directListingsWrap';
    wrap.className = 'direct-listings-wrap';
    wrap.innerHTML = `<div class="direct-listings-title">Barak's direct featured listings</div><div class="direct-listings-sub">Properties already featured directly on BarakNissan.com.</div><div class="direct-grid">${rentals.map(r => `<div class="direct-mini"><img src="${escapeHtml(r.image)}" alt="${escapeHtml(r.title)}"><div><h4>${escapeHtml(r.title)}</h4><p>$${formatPrice(r.price)}${escapeHtml(r.priceSuffix || '/month')} · ${escapeHtml(r.address)}</p></div></div>`).join('')}</div>`;
    container.appendChild(wrap);
  }

  async function load(){
    try {
      addStyles();
      setSectionHeader();
      const [openResponse, directResponse] = await Promise.all([
        fetch('open-rentals.json', {cache:'no-store'}),
        fetch('rentals.json', {cache:'no-store'})
      ]);
      if (!openResponse.ok) throw new Error(`Open rentals HTTP ${openResponse.status}`);
      const openRentals = await openResponse.json();
      const directRentals = directResponse.ok ? (await directResponse.json()).filter(r => r.active !== false) : [];
      insertControls(openRentals);
      renderOpenRentals(openRentals);
      renderDirectListings(directRentals);
    } catch (error) {
      console.error('Unable to load open rentals', error);
      grid.innerHTML = '<p style="grid-column:1/-1;text-align:center;padding:30px;color:#5A6573">Current inventory is refreshing. Please contact Barak for today\'s available apartments.</p>';
    }
  }

  load();
})();
