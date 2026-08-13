
import { useState } from 'react'
import ElevationView from './ElevationView.jsx'
import FloorPlanView from './FloorPlanView.jsx'
import { SECTION_TYPES, defaultLayout, sumWidths } from '../utils/kitchenModel.js'

let uid = 100
const nextId = () => `s${uid++}`

export default function KitchenConfigurator({ layout, setLayout, material, cabinetColor }) {
  const [openSection, setOpenSection] = useState(null)

  function updateField(field, value) {
    setLayout((prev) => ({ ...prev, [field]: value }))
  }

  function updateSection(id, patch) {
    setLayout((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === id ? { ...s, ...patch } : s))
    }))
  }

  function addSection() {
    setLayout((prev) => ({
      ...prev,
      sections: [...prev.sections, { id: nextId(), type: 'cabinet', width: 0.6 }]
    }))
  }

  function removeSection(id) {
    setLayout((prev) => ({ ...prev, sections: prev.sections.filter((s) => s.id !== id) }))
  }

  // تعديل العرض الكلي يدوياً: يعيد توزيع العرض على كل الوحدات بنفس نسبها الحالية
  function updateTotalWidth(newTotal) {
    setLayout((prev) => {
      const currentTotal = sumWidths(prev.sections)
      if (!newTotal || newTotal <= 0 || !currentTotal) return prev
      const scale = newTotal / currentTotal
      return {
        ...prev,
        totalWidth: newTotal,
        sections: prev.sections.map((s) => ({
          ...s,
          width: Math.round(Number(s.width) * scale * 100) / 100
        }))
      }
    })
  }

  const measuredWidth = sumWidths(layout.sections)

  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-6">
      {/* لوحة التحكم */}
      <div className="bg-ink-900/70 border hairline rounded-xl p-5 space-y-6">
        <div>
          <h3 className="text-gold-300 font-semibold mb-3 text-sm tracking-wide">أبعاد المطبخ العامة</h3>
          <div className="grid grid-cols-2 gap-3">
            <NumberField label="العرض الكلي (م)" value={measuredWidth} step={0.01} onChange={updateTotalWidth} />
            <NumberField label="الارتفاع (م)" value={layout.height} step={0.01} onChange={(v) => updateField('height', v)} />
            <NumberField label="العمق (م)" value={layout.depth} step={0.01} onChange={(v) => updateField('depth', v)} />
          </div>
          <p className="text-xs text-bone/50 mt-2">
            تغيير العرض الكلي يعيد توزيعه تلقائياً على كل الوحدات بنفس نسبها الحالية.
          </p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gold-300 font-semibold text-sm tracking-wide">الوحدات والأجهزة</h3>
            <button
              onClick={addSection}
              className="text-xs bg-gold-500/10 border border-gold-500/40 text-gold-300 rounded-full px-3 py-1 hover:bg-gold-500/20 transition focus-ring"
            >
              + إضافة وحدة
            </button>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {layout.sections.map((s, i) => (
              <div key={s.id} className="border hairline rounded-lg p-3 bg-ink-800/60">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-bone/60">وحدة {i + 1}</span>
                  <button
                    onClick={() => removeSection(s.id)}
                    className="text-xs text-red-300/70 hover:text-red-300 focus-ring"
                    aria-label="حذف الوحدة"
                  >
                    حذف
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <select
                    value={s.type}
                    onChange={(e) => updateSection(s.id, { type: e.target.value })}
                    className="bg-ink-950 border hairline rounded-md text-xs px-2 py-1.5 focus-ring"
                  >
                    {Object.entries(SECTION_TYPES).map(([key, def]) => (
                      <option key={key} value={key}>
                        {def.label}
                      </option>
                    ))}
                  </select>
                  <NumberField compact label="" value={s.width} step={0.01} onChange={(v) => updateSection(s.id, { width: v })} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setLayout(defaultLayout())}
          className="text-xs text-bone/50 hover:text-gold-300 transition focus-ring"
        >
          إعادة تعيين إلى التصميم الافتراضي
        </button>
      </div>

      {/* المعاينة الحية */}
      <div className="space-y-6">
        <div className="bg-gradient-to-b from-ink-800 to-ink-900 border hairline rounded-xl p-4">
          <p className="text-[11px] text-bone/40 mb-2 tracking-widest2 uppercase">واجهة المطبخ</p>
          <ElevationView layout={{ ...layout, totalWidth: measuredWidth }} material={material} cabinetColor={cabinetColor} />
        </div>
        <div className="bg-gradient-to-b from-ink-800 to-ink-900 border hairline rounded-xl p-4">
          <p className="text-[11px] text-bone/40 mb-2 tracking-widest2 uppercase">المخطط الأرضي</p>
          <FloorPlanView layout={{ ...layout, totalWidth: measuredWidth }} />
        </div>
      </div>
    </div>
  )
}

function NumberField({ label, value, onChange, step = 1, compact = false }) {
  return (
    <label className={compact ? '' : 'block'}>
      {label && <span className="block text-[11px] text-bone/50 mb-1">{label}</span>}
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value || 0))}
        className="w-full bg-ink-950 border hairline rounded-md text-sm px-2 py-1.5 focus-ring"
      />
    </label>
  )
}
