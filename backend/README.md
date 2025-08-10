# Laroza Backend - خادم إدارة المخزون

خادم API لنظام إدارة المخزون لمتجر لاروزا للأزياء النسائية.

## التقنيات المستخدمة

- **Node.js** مع **Express.js**
- **TypeScript** مع ES Modules
- **Drizzle ORM** مع دعم PostgreSQL
- **Zod** للتحقق من البيانات
- **Memory Storage** للتطوير
- **Session Management** للمصادقة

## تشغيل المشروع

```bash
# تثبيت المتطلبات
npm install

# تشغيل الخادم المطوري
npm run dev

# بناء للإنتاج
npm run build

# تشغيل الإنتاج
npm start
```

## API Endpoints

### الفساتين
- `GET /api/dresses` - جلب جميع الفساتين
- `POST /api/dresses` - إضافة فستان جديد
- `PUT /api/dresses/:id` - تحديث فستان
- `DELETE /api/dresses/:id` - حذف فستان

## هيكل البيانات

### Dress (فستان)
```typescript
{
  id: string;
  modelNumber: string;
  companyName: string;
  pieceType: string;
  specifications?: string;
  onlinePrice?: string;
  storePrice?: string;
  imageUrl?: string;
  colorsAndSizes: ColorAndSize[];
  createdAt: Date;
  updatedAt: Date;
}
```

### ColorAndSize (لون ومقاس)
```typescript
{
  id: string;
  name: string;
  sizes: string[];
}
```

## متغيرات البيئة

```env
PORT=5000
SESSION_SECRET=your-secret-key
DATABASE_URL=postgresql://... (اختياري)
```

## التخزين

- **التطوير**: Memory Storage (في الذاكرة)
- **الإنتاج**: PostgreSQL مع Drizzle ORM (جاهز للاستخدام)

## الأمان

- CORS محكوم للأمان
- Session Management
- تحديد حجم الطلبات (10MB)
- التحقق من صحة البيانات مع Zod