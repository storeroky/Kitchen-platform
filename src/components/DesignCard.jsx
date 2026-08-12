import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import ElevationView from './ElevationView.jsx'
import FloorPlanView from './FloorPlanView.jsx'
import { MATERIALS, DEFAULT_SPECS, sumWidths } from '../utils/kitchenModel.js'

export default function DesignCard({ layout, material, aiImageUrl }) {
  const cardRef = useRef(null)
  const [exporting, setExporting] = useState(false)
  const measuredWidth = sumWidths(layout.sections)

  async function handleExport() {
    if (!cardRef.current) return
    setExporting(true)
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: '#07090c', scale: 2 })
      const link = document.createElement('a')
      link.download = 'raqiy-kitchen-design.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setExporting(false)
    }
  }

  return (
    <div>
      <div ref={cardRef} className="bg-ink-950 border hairline rounded-2xl p-6 max-w-5xl mx-auto">
        {/* الشريط العلوي بالشعار */}
        <div className="flex items-center justify-between border-b hairline pb-4 mb-5">
          <div className="text-right">
            <p className="text-[10px] text-bone/40 tracking-widest2">تصميم بيوت راقي</p>
            <p className="text-[9px] text-bone/30">راحة تدوم</p>
          </div>
          <h2 className="gold-text font-arabicDisplay text-xl sm:text-2xl font-bold">تصميم مطبخ متكامل</h2>
          <p className="text-[10px] text-bone/40">مودرن | عصري | أنيق</p>
        </div>

        {/* الصورة الرئيسية: صورة AI إن وجدت، وإلا المخطط */}
        <div className="rounded-lg overflow-hidden border hairline mb-5">
          {aiImageUrl ? (
            <img src={aiImageUrl} alt="تصميم المطبخ" className="w-full h-auto" />
          ) : (
            <div className="bg-gradient-to-b from-ink-800 to-ink-900 p-3">
              <ElevationView layout={{ ...layout, totalWidth: measuredWidth }} material={material} />
            </div>
          )}
        </div>

        <div className="bg-gradient-to-b from-ink-800 to-ink-900 rounded-lg p-3 border hairline mb-5">
          <FloorPlanView layout={{ ...layout, totalWidth: measuredWidth }} />
        </div>

        {/* الصف السفلي: المواصفات + اختيار المواد */}
        <div className="grid sm:grid-cols-[1fr_auto_180px] gap-4 items-start text-sm">
          <div>
            <p className="text-gold-300 text-xs font-semibold mb-2">المواصفات</p>
            <ul className="space-y-1 text-bone/70 text-xs">
              <li>• {layout.sections.length} وحدات متكاملة</li>
              {DEFAULT_SPECS.slice(0, 4).map((s, i) => (
                <li key={i}>• {s}</li>
              ))}
            </ul>
          </div>
          <div className="hidden sm:block w-px bg-gold-500/20 self-stretch" />
          <div>
            <p className="text-gold-300 text-xs font-semibold mb-2">اختيار المواد</p>
            <div className="space-y-1.5">
              {MATERIALS.map((mat) => (
                <div key={mat.id} className="flex items-center gap-2">
                  <span
                    className="w-4 h-4 rounded-sm border border-black/30"
                    style={{
                      backgroundColor: mat.hex,
                      outline: material?.id === mat.id ? '1.5px solid #c9a24b' : 'none',
                      outlineOffset: '1px'
                    }}
                  />
                  <span className="text-[11px] text-bone/60">{mat.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-[9px] text-bone/25 tracking-widest2 mt-5 pt-4 border-t hairline">
          LUXURY · ELEGANCE · PERFECTION
        </p>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handleExport}
          disabled={exporting}
          className="bg-gold-500 hover:bg-gold-400 disabled:opacity-50 text-ink-950 font-semibold text-sm rounded-md px-6 py-2.5 transition focus-ring"
        >
          {exporting ? 'جارٍ التصدير…' : 'تنزيل البطاقة كصورة PNG'}
        </button>
      </div>
    </div>
  )
}
