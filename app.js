const products = [
  { id: 1, cat: "games", icon: "🎮", name: "شحن Free Fire", desc: "شحن جواهر Free Fire حسب الكمية المطلوبة.", price: 5, fieldPlaceholder: "أدخل Player ID الخاص بـ Free Fire" },
  { id: 2, cat: "games", icon: "🎯", name: "شحن PUBG Mobile", desc: "شحن UC لحساب PUBG Mobile.", price: 5, fieldPlaceholder: "أدخل Player ID الخاص بـ PUBG" },
  { id: 3, cat: "games", icon: "⚔️", name: "شحن Call of Duty", desc: "شحن CP لحساب Call of Duty Mobile.", price: 5, fieldPlaceholder: "أدخل Player ID أو الإيميل" },
  { id: 4, cat: "web", icon: "🌐", name: "موقع شخصي احترافي", desc: "تصميم موقع تعريفي متجاوب للهاتف والكمبيوتر.", price: 25, fieldPlaceholder: "رابط اسم الدومين المطلوب أو التفاصيل" },
  { id: 5, cat: "web", icon: "🛍️", name: "متجر إلكتروني", desc: "متجر متجاوب مع منتجات وسلة وطلبات.", price: 60, fieldPlaceholder: "اسم المتجر ونوع النشاط" },
  { id: 6, cat: "web", icon: "🚀", name: "صفحة هبوط", desc: "Landing Page احترافية لخدمة أو منتج.", price: 15, fieldPlaceholder: "عنوان الخدمة أو المنتجات المطلوبة" },
  { id: 7, cat: "bot", icon: "🤖", name: "بوت واتساب رد تلقائي", desc: "بوت للردود والقوائم والأوامر حسب احتياجك.", price: 30, fieldPlaceholder: "رقم الواتساب المخصص للبوت" },
  { id: 8, cat: "bot", icon: "📲", name: "بوت متجر واتساب", desc: "استقبال الطلبات وإرسال القوائم والردود.", price: 45, fieldPlaceholder: "رقم الواتساب والتفاصيل الأساسية" },
  { id: 9, cat: "media", icon: "📥", name: "تحميل وسائط", desc: "واجهة خدمة لتحميل الوسائط من المصادر المسموح بها.", price: 3, fieldPlaceholder: "أدخل رابط الحساب أو الاستفسار" }
];

let cart = JSON.parse(localStorage.getItem("ali_cart") || "[]");
let activeCat = "all";

function renderProducts() {
  const q = (document.getElementById("search").value || "").toLowerCase();
  const list = products.filter(p => (activeCat === "all" || p.cat === activeCat) && (`${p.name} ${p.desc}`).toLowerCase().includes(q));
  document.getElementById("products").innerHTML = list.map(p => `
    <article class="card">
      <div class="icon">${p.icon}</div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="price">${p.price.toFixed(2)} <small>USDT</small></div>
      <button class="btn primary" onclick="addToCart(${p.id})">إضافة للسلة</button>
    </article>
  `).join("");
}

function filterCat(cat, el) {
  activeCat = cat;
  document.querySelectorAll(".filters button").forEach(x => x.classList.remove("active"));
  el.classList.add("active");
  renderProducts();
}

function addToCart(id) {
  const p = products.find(x => x.id === id);
  if (p) {
    cart.push({...p, cartId: Date.now() + Math.random()});
    saveCart();
    openCart();
  }
}

function saveCart() {
  localStorage.setItem("ali_cart", JSON.stringify(cart));
  document.getElementById("cartCount").textContent = cart.length;
}

function openCart() {
  document.getElementById("cartModal").classList.add("show");
  renderCart();
}

function closeCart() {
  document.getElementById("cartModal").classList.remove("show");
}

function renderCart() {
  const box = document.getElementById("cartItems");
  if (!cart.length) {
    box.innerHTML = '<p class="muted">السلة فارغة.</p>';
    document.getElementById("total").textContent = "0.00 USDT";
    return;
  }
  box.innerHTML = cart.map((p, i) => `
    <div class="cart-line">
      <div>
        <strong>${p.icon} ${p.name}</strong>
        <div style="font-size: 13px; color: #48adff;">${p.price.toFixed(2)} USDT</div>
      </div>
      <button class="btn-remove" onclick="removeItem(${i})">حذف</button>
    </div>
  `).join("");
  
  const totalSum = cart.reduce((s, p) => s + p.price, 0);
  document.getElementById("total").textContent = totalSum.toFixed(2) + " USDT";
}

function removeItem(i) {
  cart.splice(i, 1);
  saveCart();
  renderCart();
}

function checkout() {
  if (!cart.length) return alert("أضف خدمة إلى السلة أولاً.");
  closeCart();
  document.getElementById("checkoutModal").classList.add("show");
  document.getElementById("orderResult").innerHTML = "";
  
  const totalSum = cart.reduce((s, p) => s + p.price, 0);
  document.getElementById("checkoutTotal").textContent = totalSum.toFixed(2) + " USDT";
  
  const detailsBox = document.getElementById("customerDetailsFields");
  detailsBox.innerHTML = cart.map((p, i) => `
    <div class="field-group">
      <label>${p.icon} بيانات الخدمة (${p.name}):</label>
      <input type="text" id="cart_field_${i}" placeholder="${p.fieldPlaceholder || 'أدخل بيانات الخدمة المطلوبة'}" required>
    </div>
  `).join("");
}

function closeCheckout() {
  document.getElementById("checkoutModal").classList.remove("show");
}

function submitOrder() {
  const tx = document.getElementById("txid").value.trim();
  const net = document.getElementById("network").value;
  const userContact = document.getElementById("userContact").value.trim();
  
  if (!userContact) return alert("يرجى إدخال رقم الواتساب أو حساب التلجرام للتواصل معاك.");
  
  const itemDetails = [];
  for (let i = 0; i < cart.length; i++) {
    const val = document.getElementById(`cart_field_${i}`).value.trim();
    if (!val) {
      return alert(`يرجى إدخال البيانات المطلوبة لـ (${cart[i].name})`);
    }
    itemDetails.push({ service: cart[i].name, detail: val, price: cart[i].price });
  }

  if (!tx) return alert("أدخل TXID بعد إتمام التحويل.");
  
  const orderNum = "ALI-" + Date.now().toString().slice(-8);
  const totalAmount = cart.reduce((s, p) => s + p.price, 0);
  
  document.getElementById("orderResult").innerHTML = `
    <div class="success">
      ✅ <b>تم تسجيل الطلب بنجاح!</b><br>
      رقم الطلب: <b>${orderNum}</b><br>
      الشبكة: <b>${net}</b><br>
      المبلغ: <b>${totalAmount.toFixed(2)} USDT</b><br>
      <hr style="border:0; border-top:1px solid #1b7652; margin:8px 0;">
      سيتم مراجعة رقم المعاملة (TXID) والتواصل معك فور التأكيد.
    </div>
  `;
  
  localStorage.setItem("last_order", JSON.stringify({
    order: orderNum,
    network: net,
    txid: tx,
    contact: userContact,
    items: itemDetails,
    total: totalAmount,
    date: new Date().toISOString()
  }));

  cart = [];
  saveCart();
}

document.addEventListener("DOMContentLoaded", () => {
  saveCart();
  renderProducts();
});
