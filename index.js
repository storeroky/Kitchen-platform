// باك-إند بسيط لمنصة "رقي" لتصميم المطابخ
// وظيفته الوحيدة: استقبال طلب توليد صورة من الواجهة، ثم مناداة مزوّد AI
// خارجي باستخدام مفتاح API مخزّن في متغيرات البيئة (لا يصل أبداً للمتصفح).
//
// لتشغيله محلياً:
//   1) انسخ .env.example إلى .env داخل مجلد server وضع مفاتيحك
//   2) npm install
//   3) npm start   (يعمل افتراضياً على http://localhost:5174)

import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({ limit: '15mb' })) // صور SketchUp المرفوعة تُرسل كـ base64، تحتاج حد أكبر

const PORT = process.env.PORT || 5174
const PROVIDER = process.env.AI_IMAGE_PROVIDER || 'pollinations' // pollinations (مجاني) | openai | stability

// حد بسيط لعدد الطلبات لكل IP لمنع إساءة الاستخدام
const requestLog = new Map()
function rateLimited(ip) {
  const now = Date.now()
  const windowMs = 60_000
  const max = 10
  const entry = requestLog.get(ip) || []
  const recent = entry.filter((t) => now - t < windowMs)
  recent.push(now)
  requestLog.set(ip, recent)
  return recent.length > max
}

app.post('/api/generate-design', async (req, res) => {
  const ip = req.ip
  if (rateLimited(ip)) {
    return res.status(429).json({ message: 'عدد كبير من الطلبات، حاول بعد دقيقة.' })
  }

  const { prompt, referenceImage } = req.body || {}
  if (!prompt || typeof prompt !== 'string' || prompt.length < 5) {
    return res.status(400).json({ message: 'الوصف (prompt) مطلوب.' })
  }
  if (referenceImage && !isValidDataUrl(referenceImage)) {
    return res.status(400).json({ message: 'صورة SketchUp المرفوعة غير صالحة.' })
  }

  try {
    let imageUrl
    if (referenceImage) {
      if (PROVIDER === 'pollinations') {
        return res.status(400).json({
          message:
            'ميزة "تحويل صورة SketchUp" تحتاج مزوّد مدفوع (OpenAI أو Stability) لأنها تتطلب رفع صورة كمدخل. المزوّد المجاني الحالي يدعم فقط "توليد من المخطط التفاعلي". لتفعيلها، أضف AI_IMAGE_PROVIDER=openai ومفتاح API في متغيرات البيئة بالباك-إند.'
        })
      }
      imageUrl =
        PROVIDER === 'stability'
          ? await transformWithStability(prompt, referenceImage)
          : await transformWithOpenAI(prompt, referenceImage)
    } else {
      if (PROVIDER === 'stability') imageUrl = await generateWithStability(prompt)
      else if (PROVIDER === 'openai') imageUrl = await generateWithOpenAI(prompt)
      else imageUrl = await generateWithPollinations(prompt)
    }
    res.json({ imageUrl })
  } catch (err) {
    console.error('AI generation error:', err.message)
    res.status(502).json({ message: 'تعذّر توليد الصورة من مزوّد الذكاء الاصطناعي. تحقق من مفتاح الـ API وحدود الاستخدام.' })
  }
})

function isValidDataUrl(str) {
  return typeof str === 'string' && /^data:image\/(png|jpeg|jpg|webp);base64,/.test(str)
}

function dataUrlToBuffer(dataUrl) {
  const base64 = dataUrl.split(',')[1]
