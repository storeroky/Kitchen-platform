# رقي | منصة تصميم مطابخ ذكية بالذكاء الاصطناعي

منصة ويب متكاملة تتيح للعميل:
1. رسم مخطط مطبخه (واجهة أمامية + مخطط أرضي) بمقاسات دقيقة وتفاعلية.
2. اختيار المواد (خشب طبيعي، رخام، أسطح مطفية).
3. توليد **صورة تصميم واقعية** للمطبخ عبر الذكاء الاصطناعي بناءً على المقاسات والمواد المختارة.
4. تصدير بطاقة تصميم احترافية جاهزة للطباعة/المشاركة (PNG) بنفس هوية "رقي" البصرية.

---

## 🧱 البنية التقنية

```
kitchen-ai-platform/
├── src/                  ← الواجهة (React + Vite + Tailwind)
│   ├── components/       ← المخطط التفاعلي، اختيار المواد، مولّد الـ AI، البطاقة النهائية
│   ├── api/               ← الاتصال بالباك-إند
│   └── utils/             ← نموذج بيانات المطبخ
├── server/                ← باك-إند Express بسيط يحفظ مفتاح الـ AI بأمان
│   └── index.js
└── .github/workflows/     ← نشر تلقائي على GitHub Pages
```

**لماذا يوجد باك-إند منفصل؟**
مفاتيح الذكاء الاصطناعي (OpenAI / Stability AI) يجب ألا تُكشف أبداً داخل كود الواجهة الأمامية،
لأن أي زائر للموقع يمكنه رؤيتها والتلاعب بها. لذلك الواجهة ترسل الطلب إلى باك-إند صغير،
وهو من يتصل بمزوّد الذكاء الاصطناعي باستخدام المفتاح السري المخزّن في متغيرات البيئة.

---

## 🚀 التشغيل محلياً

### 1) الباك-إند (يجب تشغيله أولاً)
```bash
cd server
cp .env.example .env
# افتح .env وضع مفتاح OPENAI_API_KEY (أو STABILITY_API_KEY)
npm install
npm start
# يعمل على http://localhost:5174
```

### 2) الواجهة الأمامية
```bash
# من المجلد الرئيسي للمشروع
npm install
npm run dev
# يعمل على http://localhost:5173 ويتصل تلقائياً بالباك-إند عبر proxy
```

افتح المتصفح على الرابط الذي يظهر في الطرفية.

---

## ☁️ الرفع على GitHub

```bash
git init
git add .
git commit -m "إطلاق منصة رقي لتصميم المطابخ بالذكاء الاصطناعي"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

> ⚠️ لا ترفع أبداً ملف `.env` أو `server/.env` — هما مُستبعدان تلقائياً عبر `.gitignore`.

---

## 🌐 النشر (Deployment)

### أ) نشر الواجهة على GitHub Pages (مجاني، تلقائي)
1. من إعدادات المستودع: **Settings → Pages → Source → GitHub Actions**.
2. أضف الـ secret الخاص برابط الباك-إند: **Settings → Secrets and variables → Actions → New repository secret**
   باسم `VITE_API_BASE` وقيمته رابط الباك-إند بعد نشره (الخطوة التالية).
3. عدّل `base` داخل `vite.config.js` إلى `'/REPO_NAME/'` إذا كان اسم المستودع مختلفاً عن الدومين الجذري.
4. عند أي `git push` على `main`، سينشر الووركفلو الموجود في `.github/workflows/deploy.yml` الموقع تلقائياً.

### ب) نشر الباك-إند (لازم لتشغيل توليد الصور فعلياً)
الباك-إند لا يمكن نشره على GitHub Pages (لأنه سيرفر Node وليس ملفات ثابتة). اختر أحد الخيارات المجانية/الرخيصة:
- **Render.com** (الأسهل): New → Web Service → اربط المستودع → Root Directory: `server` → Build: `npm install` → Start: `npm start` → أضف متغيرات البيئة من `.env.example`.
- **Railway.app**: نفس الفكرة، اختر مجلد `server` كنقطة انطلاق.
- **Vercel Serverless Functions**: يتطلب تحويل `server/index.js` إلى دالة Serverless (بنية مختلفة قليلاً).

بعد الحصول على رابط الباك-إند المنشور (مثال: `https://raqiy-api.onrender.com`)، ضعه في:
- الـ secret `VITE_API_BASE` على GitHub (للنشر التلقائي)، أو
- ملف `.env` المحلي عند التطوير.

---

## 🎨 تخصيص الهوية البصرية

- الألوان: `tailwind.config.js` (تدرجات `ink` الكحلية و`gold` الذهبية).
- الخطوط: مستوردة من Google Fonts في `index.html` (Aref Ruqaa للعناوين العربية، Cormorant Garamond للتفاصيل اللاتينية، Tajawal للنصوص).
- اسم العلامة والشعار النصي: `src/components/Header.jsx` و `src/components/DesignCard.jsx`.
- المواد الافتراضية والمواصفات: `src/utils/kitchenModel.js`.

---

## 🔌 تبديل مزوّد الذكاء الاصطناعي

الملف `server/index.js` مبني بنمط "مزوّدين قابلين للتبديل". القيمة الافتراضية `openai` (نموذج `gpt-image-1`).
للتبديل إلى Stability AI: غيّر `AI_IMAGE_PROVIDER=stability` في `.env` وأضف `STABILITY_API_KEY`.
يمكنك إضافة مزوّد آخر (مثل Replicate أو مزوّد محلي) بإضافة دالة جديدة بنفس نمط `generateWithOpenAI`.

---

## 📋 قائمة تحقق قبل الإطلاق للعميل الحقيقي (مصنع رقي)

- [ ] استبدال شعار "رقي" بالشعار الفعلي (صورة SVG في `src/components/Header.jsx`).
- [ ] ضبط مفتاح API حقيقي وحد استخدام شهري (Billing limits) في لوحة تحكم OpenAI/Stability.
- [ ] إضافة نطاق مخصص (Custom Domain) بدل رابط GitHub Pages الافتراضي.
- [ ] مراجعة نصوص المواصفات والمواد لتطابق منتجات المصنع الفعلية.
- [ ] اختبار المنصة على الجوال (التصميم متجاوب بالكامل افتراضياً).
