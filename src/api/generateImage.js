// يتصل هذا الملف بالباك-إند (server/index.js) الذي يحفظ مفتاح الـ AI بأمان
// ولا يكشفه أبداً للمتصفح. غيّر API_BASE إذا نشرت الباك-إند على رابط منفصل
// (مثال: Render أو Railway) بدل تشغيله محلياً بجانب الواجهة.

const API_BASE = import.meta.env.VITE_API_BASE || ''

export async function generateKitchenImage({ prompt, style, material, dimensions }) {
  const res = await fetch(`${API_BASE}/api/generate-design`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, style, material, dimensions })
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `فشل الاتصال بخادم الذكاء الاصطناعي (${res.status})`)
  }

  return res.json() // { imageUrl }
}
