# نظام إدارة المخزون - لاروزا 

نظام شامل لإدارة مخزون الأزياء النسائية مع واجهة عربية ودعم كامل لـ RTL.

## 📁 هيكل المشروع

```
laroza-inventory-system/
├── frontend/          # واجهة المستخدم (React + TypeScript)
├── backend/           # خادم API (Node.js + Express)
├── shared/            # الأنواع والمخططات المشتركة
└── README.md         # هذا الملف
```

## 🚀 تشغيل المشروع

### الطريقة الأولى: تشغيل منفصل

#### Frontend (واجهة المستخدم)
```bash
cd frontend
npm install
npm run dev
# يعمل على http://localhost:3000
```

#### Backend (الخادم)
```bash
cd backend
npm install  
npm run dev
# يعمل على http://localhost:5000
```

### الطريقة الثانية: تشغيل متزامن
```bash
# تثبيت المتطلبات لجميع المجلدات
npm run install:all

# تشغيل Frontend و Backend معاً
npm run dev
```

## ✨ الميزات

### إدارة المخزون
- ✅ إضافة وتعديل وحذف الفساتين
- ✅ إدارة الألوان والمقاسات بمرونة
- ✅ تحميل صور المنتجات
- ✅ نظام تسعير مزدوج (إلكتروني + متجر)

### واجهة المستخدم
- ✅ تصميم عربي كامل مع دعم RTL
- ✅ واجهة متجاوبة لجميع الأجهزة
- ✅ ألوان أنيقة (ذهبي + وردي) تناسب علامة الأزياء
- ✅ لوحة إحصائيات تفاعلية
- ✅ بحث وتصفية متقدمين

### التقنيات
- ✅ **Frontend**: React 18 + TypeScript + Tailwind CSS + Radix UI
- ✅ **Backend**: Node.js + Express + TypeScript + Drizzle ORM
- ✅ **Database**: PostgreSQL (اختياري) + Memory Storage للتطوير
- ✅ **Validation**: Zod schemas للتحقق من البيانات
- ✅ **Forms**: React Hook Form مع التحقق الذكي

## 🗄️ قاعدة البيانات

### وضع التطوير
يستخدم النظام Memory Storage (التخزين في الذاكرة) للتطوير السريع.

### وضع الإنتاج
مُعدّ للعمل مع PostgreSQL عبر Drizzle ORM. يمكن تفعيله بإضافة:

```env
DATABASE_URL=postgresql://username:password@host:port/database
```

## 🌐 النشر

النظام جاهز للنشر على:
- **Replit Deployments** (الأسهل)
- **Vercel** للـ Frontend
- **Railway/Render** للـ Backend
- **Heroku**
- أي خدمة استضافة تدعم Node.js

### نشر على Replit
1. اضغط على زر "Deploy"
2. اختر "Autoscale Deployment"
3. سيتم نشر النظام كاملاً تلقائياً

## 🔧 التخصيص

### الألوان والتصميم
عدّل ملف `frontend/src/index.css` لتغيير الألوان الأساسية.

### الشعار
استبدل `frontend/public/assets/LR_1754863757279.jpg` بشعار متجرك.

### اللغة
النصوص العربية موجودة في ملفات المكونات، يمكن تعديلها بسهولة.

## 📱 الاستخدام

1. **إضافة فستان جديد**: اضغط "إضافة فستان جديد"
2. **ملء البيانات**: رقم الموديل، اسم الشركة، نوع القطعة
3. **إضافة الألوان**: اكتب اسم اللون (مثل: فوشي، أزرق سماوي)
4. **إضافة المقاسات**: لكل لون أضف المقاسات المتاحة
5. **تحديد الأسعار**: سعر البيع الإلكتروني وسعر المتجر
6. **حفظ**: البيانات تُحفظ تلقائياً

## 🔍 البحث والتصفية

- البحث في رقم الموديل واسم الشركة
- التصفية حسب نوع القطعة
- عرض سريع للألوان والمقاسات المتاحة
- إحصائيات شاملة للمخزون

## 🛠️ التطوير

### إضافة ميزة جديدة
1. أضف النوع في `shared/schema.ts`
2. حدّث واجهة التخزين في `backend/src/storage.ts`
3. أضف API endpoint في `backend/src/routes.ts`
4. أنشئ مكون الواجهة في `frontend/src/components/`

### اتصال قاعدة البيانات
```typescript
// backend/src/storage.ts
export class DbStorage implements IStorage {
  // تنفيذ العمليات باستخدام Drizzle ORM
}
```

---

**تطوير**: فريق لاروزا التقني  
**الإصدار**: 1.0.0  
**الترخيص**: MIT