import { useState } from 'react'
import { generateKitchenImage } from '../api/generateImage.js'
import ImageUpload from './ImageUpload.jsx'

const STYLES = [
  { id: 'luxury-modern', label: 'عصري فاخر' },
  { id: 'classic-gold', label: 'كلاسيكي ذهبي' },
  { id: 'minimal-marble', label: 'رخامي بسيط' },
  { id: 'dark-wood', label: 'خشب داكن' }
]

const MODES = [
  { id: 'generate', label: 'توليد من المخطط التفاعلي' },
  { id: 'transform', label: 'تحويل صورة SketchUp' }
]

export default function AIDesignGenerator({ layout, material, cabinetColor, onGenerated }) {
  const [mode, setMode] = useState('generate')
  const [style, setStyle] = useState('luxury-modern')
  const [notes, setNotes] = useState('')
  const [referenceImage, setReferenceImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imageUrl, setImageUrl] = useState(null)

  const canGenerate = mode === 'generate' || (mode === 'transform' && !!referenceImage)

  async function handleGenerate() {
    if (!canGenerate) return
    setLoading(true)
    setError(null)
    try {
      const dimensions = `${layout.height.toFixed(2)}×${layout.depth.toFixed(2)} م، ${layout.sections.length} وحدات`
      const prompt = buildPrompt({
        style,
        notes,
        material: material?.name,
        cabinetColor: cabinetColor?.name,
        dimensions,
        mode
      })
      const { imageUrl } = await generateKitchenImage({
        prompt,
        style,
        material: material?.name,
        dimensions,
        referenceImage: mode === 'transform' ? referenceImage : null
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
        يحوّل النظام مخططك ومقاساتك — أو صورة SketchUp جاهزة — إلى تصميم داخلي واقعي بنفس النمط الفاخر.
      </p>

      {/* تبديل النمط: من الصفر أو تحويل صورة */}
      <div className="flex gap-2 mb-4">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`flex-1 text-xs sm:text-sm rounded-md px-3 py-2 border transition focus-ring ${
              mode === m.id ? 'bg-gold-500/15 border-gold-400 text-gold-300' : 'hairline text-bone/50 hover:text-bone/75'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === 'transform' && (
        <div className="mb-4">
          <label className="block text-[11px] text-bone/50 mb-2">
            ارفع مخطط 2D مُصدّر من SketchUp (منظور علوي أو واجهة أمامية)
          </label>
          <ImageUpload onImageReady={setReferenceImage} onClear={() => setReferenceImage(null)} />
        </div>
      )}

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

      <div className="mb-3">
        <label className="block text-[11px] text-bone/50 mb-1">لون الخزائن المختار</label>
        <div className="w-full bg-ink-950 border hairline rounded-md text-sm px-2 py-1.5 text-bone/70 flex items-center gap-2">
          {cabinetColor && (
            <span
              className="w-3.5 h-3.5 rounded-full border border-black/30 shrink-0"
              style={{ backgroundColor: cabinetColor.hex }}
            />
          )}
          {cabinetColor?.name || 'لم يتم الاختيار بعد'}
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
        disabled={loading || !canGenerate}
        className="w-full bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-ink-950 font-semibold text-sm rounded-md py-2.5 transition focus-ring"
      >
        {loading
          ? 'جارٍ توليد التصميم…'
          : mode === 'transform'
            ? 'تحويل صورة SketchUp إلى تصميم واقعي'
            : 'توليد التصميم الواقعي'}
      </button>

      {mode === 'transform' && !referenceImage && (
        <p className="text-[11px] text-bone/40 mt-2">ارفع صورة أولاً لتفعيل الزر.</p>
      )}

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

function buildPrompt({ style, notes, material, cabinetColor, dimensions, mode }) {
  const styleMap = {
    'luxury-modern': 'modern luxury kitchen, sleek matte cabinetry, brushed gold accents',
    'classic-gold': 'classic elegant kitchen with warm gold trims and rich wood tones',
    'minimal-marble': 'minimalist kitchen with marble countertops and clean lines',
    'dark-wood': 'dark wood cabinetry kitchen with warm ambient under-cabinet lighting'
  }

  const base =
    mode === 'transform'
      ? 'transform this 2D SketchUp kitchen layout/elevation into a photorealistic professional interior design render, preserve the exact same layout, proportions, cabinet placement and dimensions shown in the sketch, do not change the floor plan'
      : styleMap[style]

  return [
    base,
    mode === 'transform' ? styleMap[style] : null,
    cabinetColor ? `cabinet door color: ${cabinetColor}` : null,
    material ? `main surface material: ${material}` : null,
    `kitchen proportions approx ${dimensions}`,
    notes,
    'professional interior design photography, wide elevation shot, soft warm lighting, ultra realistic, 4k'
  ]
    .filter(Boolean)
    .join(', ')
}
