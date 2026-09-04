const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

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

module.exports = app;
