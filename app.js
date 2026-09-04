function renderProducts() {
  const q = (document.getElementById("search").value || "").toLowerCase();
  const list = products.filter(p => (activeCat === "all" || p.cat === activeCat) && (`${p.name} ${p.desc}`).toLowerCase().includes(q));
  
  document.getElementById("products").innerHTML = list.map(p => `
    <article class="product-card">
      <span class="badge-vip">منتج VIP</span>
      <div class="p-icon">${p.icon}</div>
      <h3 class="p-title">${p.name}</h3>
      <p class="p-desc">${p.desc}</p>
      <div class="p-footer">
        <div class="p-price">${p.price.toFixed(2)} <small style="font-size: 11px; color: #fff;">USDT</small></div>
        <button class="btn-buy" onclick="addToCart(${p.id})">شراء الآن 🛒</button>
      </div>
    </article>
  `).join("");
}
