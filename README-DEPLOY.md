# متجر ESTILO-CO — ساعة الحية

موقع كامل: Landing page + فورم طلبات + لوحة تحكم Admin + إشعارات تيليغرام.

## التشغيل محلياً (للتطوير)

```bash
npm install
cp .env.example .env   # واملأ القيم
npm run db:push        # إنشاء جدول الطلبات في قاعدة البيانات
npm run dev            # http://localhost:3000
```

## النشر على سيرفر (Node.js 18+)

```bash
npm ci
cp .env.example .env   # واملأ القيم (DATABASE_URL وغيرها)
npm run build
npm run db:push
npm start              # يخدم على المنفذ 3000
```

## النشر بـ Docker

```bash
docker build -t estilo-co .
docker run -p 3000:3000 --env-file .env estilo-co
```

## المتغيرات المطلوبة (.env)

| المتغير | الوصف |
|---|---|
| `DATABASE_URL` | رابط قاعدة MySQL — مثال: `mysql://user:pass@host:3306/estilo_co` |
| `ADMIN_KEY` | كلمة سر لوحة التحكم (الافتراضية: `estilo2026`) |
| `TELEGRAM_BOT_TOKEN` | توكن البوت (موجود افتراضياً) |
| `TELEGRAM_CHAT_ID` | رقم الشات ديالك: `820512914` (موجود افتراضياً) |

## الروابط

- `/` — صفحة الزبون (Landing + فورم الطلب)
- `/admin` — لوحة التحكم (كلمة السر = ADMIN_KEY)

## كيفاش كيخدم

1. الزبون كيعمّر الفورم → الطلب كيتسجل فقاعدة البيانات
2. إشعار فوري كيوصل لتيليغرام `@estilo-co (بوت التيليغرام ديالك)`
3. نتا كتشوف الطلبات فـ `/admin` وتبدل الحالة (Confirmed / Shipped / Cancelled) ولا تمسحها
