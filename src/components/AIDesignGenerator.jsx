import { useState } from 'react'
import { generateKitchenImage } from '../api/generateImage.js'

const STYLES = [
  { id: 'luxury-modern', label: 'عصري فاخر' },
  { id: 'classic-gold', label: 'كلاسيكي ذهبي' },
  { id: 'minimal-marble', label: 'رخامي بسيط' },
  { id: 'dark-wood', label: 'خشب داكن' }
]

export default function AIDesignGenerator({ layout, material, onGenerated }) {
  const [style, setStyle] = useState('luxury-modern')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const dimensions = `${layout.height.toFixed(2)}×${layout.depth.toFixed(2)} م، ${layout.sections.length} وحدات`
      const prompt = buildPrompt({ style, notes, material, dimensions })
      const { imageUrl } = await generateKitchenImage({
        prompt,
        style,
        material: material?.name,
        dimensions
      })
      setImageUrl(imageUrl)
      onGenerated?.(imageUrl)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-ink-900/70 border hairline rounded-xl p-5">
      <h3 className="text-gold-300 font-semibold text-sm tracking-wide mb-1">توليد صورة واقعية بالذكاء الاصطناعي</h3>
      <p className="text-xs text-bone/45 mb-4">
        يحوّل النظام مخططك ومقاساتك إلى صورة تصميم داخلي واقعية بنفس النمط الفاخر.
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-[11px] text-bone/50 mb-1">النمط</label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full bg-ink-950 border hairline rounded-md text-sm px-2 py-1.5 focus-ring"
          >
            {STYLES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[11px] text-bone/50 mb-1">المادة المختارة</label>
          <div className="w-full bg-ink-950 border hairline rounded-md text-sm px-2 py-1.5 text-bone/70">
            {material?.name || 'لم يتم الاختيار بعد'}
          </div>
        </div>
      </div>

      <label className="block text-[11px] text-bone/50 mb-1">تفاصيل إضافية (اختياري)</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        placeholder="مثال: إضاءة دافئة، جزيرة وسطية، تباين بين الألوان..."
        className="w-full bg-ink-950 border hairline rounded-md text-sm px-3 py-2 mb-4 focus-ring resize-none"
      />

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-ink-950 font-semibold text-sm rounded-md py-2.5 transition focus-ring"
      >
        {loading ? 'جارٍ توليد التصميم…' : 'توليد التصميم الواقعي'}
      </button>

      {error && (
        <p className="text-xs text-red-300 mt-3 leading-relaxed">
          {error} — تأكد من تشغيل الباك-إند (server) وإضافة مفتاح الـ API في ملف .env كما هو موضح في README.
        </p>
      )}

      {imageUrl && (
        <div className="mt-4 rounded-lg overflow-hidden border hairline">
          <img src={imageUrl} alt="تصميم مطبخ مولّد بالذكاء الاصطناعي" className="w-full h-auto" />
        </div>
      )}
    </div>
  )
}

function buildPrompt({ style, notes, material, dimensions }) {
  const styleMap = {
    'luxury-modern': 'modern luxury kitchen, sleek matte cabinetry, brushed gold accents',
    'classic-gold': 'classic elegant kitchen with warm gold trims and rich wood tones',
    'minimal-marble': 'minimalist kitchen with marble countertops and clean lines',
    'dark-wood': 'dark wood cabinetry kitchen with warm ambient under-cabinet lighting'
  }
  return [
    styleMap[style],
    material ? `main surface material: ${material}` : null,
    `kitchen proportions approx ${dimensions}`,
    notes,
    'professional interior design photography, wide elevation shot, soft warm lighting, ultra realistic, 4k'
  ]
    .filter(Boolean)
    .join(', ')
}
