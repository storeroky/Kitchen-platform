import { MATERIALS } from '../utils/kitchenModel.js'

export default function MaterialSelector({ selected, onSelect }) {
  return (
    <div>
      <h3 className="text-gold-300 font-semibold text-sm tracking-wide mb-3">اختيار المواد</h3>
      <div className="space-y-3">
        {MATERIALS.map((mat) => {
          const active = selected?.id === mat.id
          return (
            <button
              key={mat.id}
              onClick={() => onSelect(mat)}
              className={`w-full flex items-center gap-3 rounded-lg border px-3 py-2 transition focus-ring ${
                active ? 'border-gold-400 bg-gold-500/10' : 'hairline hover:border-gold-500/40'
              }`}
            >
              <span
                className="w-9 h-9 rounded-md border border-black/30 shrink-0"
                style={{ backgroundColor: mat.hex }}
              />
              <span className="text-sm text-bone/80">{mat.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
