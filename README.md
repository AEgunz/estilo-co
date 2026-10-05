# ESTILO-CO — متجر ساعة الحية النسائية 🐍⌚

موقع تجارة إلكترونية متكامل مخصص لبيع **ساعة الحية النسائية** (Landing Page + طلب سريع + لوحة تحكم الأدمن + إشعارات تلغرام الفورية).

---

## 🌟 الميزات الرئيسية

- 📱 **واجهة مستخدم عصرية وسريعة (Landing Page):** مصممة لتجربة تحويل عالية مع ألوان وتفاصيل الساعة.
- 🎨 **تحديد الألوان بصرياً:** دعم اختيار اللون (روز غولد، ذهبي، فضي) مع كروت تفاعلية وصور حقيقية للساعات.
- 📦 **دعم الطلبات المتعددة (Multi-pack & Multi-color):** إمكانية تحديد ألوان مختلفة لكل ساعة في الطلبات المزدوجة أو الثلاثية.
- ⚡ **طلب سريع (Cash On Delivery):** نموذج طلب مبسط بالدفع عند الاستلام.
- 📲 **إشعارات تلغرام فورية (Telegram Notifications):** وصول كل طلب جديد لحظياً إلى بوت التلغرام.
- 📊 **لوحة تحكم الأدمن (`/admin`):** إدارة الطلبات، تغيير الحالات (New, Confirmed, Shipped, Cancelled)، وحذف الطلبات.

---

## 🚀 التقنيات المستخدمة (Tech Stack)

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Hono Framework + Node.js
- **API:** tRPC + Zod
- **Database:** MySQL / MariaDB + Drizzle ORM
- **Styling & UI:** Tailwind CSS + Radix UI + Lucide Icons

---

## ⚙️ التشغيل والتطوير محلياً (Local Development)

```bash
# 1. تثبيت الحزم
npm install

# 2. إنشاء قاعدة البيانات ومزامنة الجداول
npm run db:push

# 3. تشغيل سيرفر التطوير
npm run dev
# افتح المتصفح على: http://localhost:3000
```

---

## 🛠️ المتغيرات البيئية (.env)

قم بإنشاء ملف `.env` في جذر المشروع وأضف القيم التالية:

```env
DATABASE_URL=mysql://user:password@host:3306/dbname
ADMIN_KEY=estilo2026
TELEGRAM_BOT_TOKEN=8647674350:AAEASVBsD8xxtN0jvEC3t4Hh8cfe7TXm_ts
TELEGRAM_CHAT_ID=820512914
```

---

## 📦 البناء والنشر على السيرفر (Production Deployment)

```bash
# بناء المشروع
npm run build

# تشغيل التطبيق في الإنتاج
npm start
```

---

© 2026 **ESTILO-CO** — جميع الحقوق محفوظة.
