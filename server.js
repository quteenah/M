const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// قراءة ملفات الواجهة (index.html, style.css, app.js) من المسار الرئيسي مباشرة
app.use(express.static(__dirname));

const orders = [];

// API استقبال الطلبات
app.post('/api/orders', (req, res) => {
  const { network, txid, contact, items, total } = req.body;

  if (!txid || !contact || !items) {
    return res.status(400).json({ success: false, message: 'بيانات الطلب غير مكتملة' });
  }

  const newOrder = {
    id: "ALI-" + Date.now().toString().slice(-8),
    network,
    txid,
    contact,
    items,
    total,
    status: 'pending',
    createdAt: new Date()
  };

  orders.push(newOrder);
  console.log('📌 طلب جديد تم استقباله:', newOrder);

  res.status(201).json({
    success: true,
    message: 'تم تسجيل الطلب بنجاح',
    orderId: newOrder.id
  });
});

// API عرض الطلبات
app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders });
});

// توجيه أي مسار آخر إلى الواجهة الرئيسية
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
