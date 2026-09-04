const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// السماح بالطلبات واستقبال JSON
app.use(cors());
app.use(express.json());

// مصفوفة مؤقتة لحفظ الطلبات (يمكن ربطها بقاعدة بيانات مستقبلاً)
const orders = [];

// اختبار الخادم
app.get('/', (req, res) => {
  res.send('Ali Store API is running smoothly!');
});

// استقبال طلب جديد من الواجهة
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
    message: 'تم استقبال الطلب بنجاح',
    orderId: newOrder.id
  });
});

// جلب قائمة الطلبات
app.get('/api/orders', (req, res) => {
  res.json({ success: true, orders });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
