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
  return Buffer.from(base64, 'base64')
}

app.get('/api/health', (_req, res) => res.json({ ok: true, provider: PROVIDER }))

// ---------- مزوّدو الصور (يمكن إضافة المزيد بنفس النمط) ----------

async function generateWithPollinations(prompt) {
  const encoded = encodeURIComponent(prompt.slice(0, 800))
  const seed = Math.floor(Math.random() * 1_000_000)
  return `https://image.pollinations.ai/prompt/${encoded}?width=1536&height=1024&nologo=true&seed=${seed}`
}

async function generateWithOpenAI(prompt) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY غير مضبوط في .env')

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024',
      n: 1
    })
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenAI API error: ${text}`)
  }

  const data = await response.json()
  const b64 = data.data?.[0]?.b64_json
  const url = data.data?.[0]?.url
  if (url) return url
  if (b64) return `data:image/png;base64,${b64}`
  throw new Error('لم يتم استلام صورة من OpenAI')
}

async function transformWithOpenAI(prompt, referenceImageDataUrl) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error('OPENAI_API_KEY غير مضبوط في .env')

  const imageBuffer = dataUrlToBuffer(referenceImageDataUrl)
  const form = new FormData()
  form.append('model', 'gpt-image-1')
  form.append('image', new Blob([imageBuffer]), 'sketchup-reference.png')
  form.append('prompt', prompt)
  form.append('size', '1536x1024')

  const response = await fetch('https://api.openai.com/v1/images/edits', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenAI images/edits error: ${text}`)
  }

  const data = await response.json()
  const b64 = data.data?.[0]?.b64_json
  const url = data.data?.[0]?.url
  if (url) return url
  if (b64) return `data:image/png;base64,${b64}`
  throw new Error('لم يتم استلام صورة محوّلة من OpenAI')
}

async function transformWithStability(prompt, referenceImageDataUrl) {
  const apiKey = process.env.STABILITY_API_KEY
  if (!apiKey) throw new Error('STABILITY_API_KEY غير مضبوط في .env')

  const imageBuffer = dataUrlToBuffer(referenceImageDataUrl)
  const form = new FormData()
  form.append('prompt', prompt)
  form.append('image', new Blob([imageBuffer]), 'sketchup-reference.png')
  form.append('control_strength', '0.7')
  form.append('output_format', 'png')

  const response = await fetch('https://api.stability.ai/v2beta/stable-image/control/structure', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json'
    },
    body: form
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Stability control/structure error: ${text}`)
  }

  const data = await response.json()
  if (data.image) return `data:image/png;base64,${data.image}`
  throw new Error('لم يتم استلام صورة محوّلة من Stability AI')
}

async function generateWithStability(prompt) {
  const apiKey = process.env.STABILITY_API_KEY
  if (!apiKey) throw new Error('STABILITY_API_KEY غير مضبوط في .env')

  const response = await fetch(
    'https://api.stability.ai/v2beta/stable-image/generate/core',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: 'application/json'
      },
      body: (() => {
        const form = new FormData()
        form.append('prompt', prompt)
        form.append('output_format', 'png')
        return form
      })()
    }
  )

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Stability API error: ${text}`)
  }

  const data = await response.json()
  if (data.image) return `data:image/png;base64,${data.image}`
  throw new Error('لم يتم استلام صورة من Stability AI')
}

app.listen(PORT, () => {
  console.log(`✔ Raqiy AI server running on http://localhost:${PORT} (provider: ${PROVIDER})`)
})
