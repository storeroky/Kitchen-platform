import { CABINET_COLORS } from '../utils/kitchenModel.js'

export default function ColorPalette({ selected, onSelect }) {
  return (
    <div>
      <h3 className="text-gold-300 font-semibold text-sm tracking-wide mb-3">لون واجهات الخزائن</h3>
      <div className="grid grid-cols-4 gap-3">
        {CABINET_COLORS.map((color) => {
          const active = selected?.id === color.id
          return (
            <button
              key={color.id}
              onClick={() => onSelect(color)}
              title={color.name}
              className={`group flex flex-col items-center gap-1.5 focus-ring rounded-md p-1 transition ${
                active ? 'bg-gold-500/10' : 'hover:bg-ink-800/60'
              }`}
            >
              <span
                className={`w-9 h-9 rounded-full border transition ${
                  active ? 'border-gold-400 ring-2 ring-gold-400/40' : 'border-black/30'
                }`}
                style={{ backgroundColor: color.hex }}
              />
              <span className="text-[10px] text-bone/55 text-center leading-tight">{color.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
