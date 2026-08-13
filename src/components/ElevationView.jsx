
import DimensionLine from './DimensionLine.jsx'
import { SECTION_TYPES, m, sumWidths } from '../utils/kitchenModel.js'

const PAD = 60
const VIEW_W = 900
const VIEW_H = 420
const WALL_TOP = 70
const WALL_BOTTOM = 330
const COUNTER_Y = 250
const UPPER_BOTTOM = 130

export default function ElevationView({ layout, material, cabinetColor }) {
  const { sections, totalWidth, height } = layout
  const total = sumWidths(sections) || 1
  const drawableW = VIEW_W - PAD * 2
  const scale = drawableW / total

  let cursorX = PAD
  const drawn = sections.map((s) => {
    const w = Number(s.width) * scale
    const rect = { ...s, x: cursorX, w }
    cursorX += w
    return rect
  })

  const countertopColor = material?.hex || '#efe8da'
  // الأجهزة (فرن/غسالة/ميكروويف/ثلاجة) تبقى بلون معدني محايد — اللون المختار يطبّق فقط على أبواب الخزائن المدهونة
  const APPLIANCE_TYPES = ['oven', 'washer', 'microwave', 'tall']

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" role="img" aria-label="مخطط واجهة المطبخ">
      <defs>
        <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#171b22" />
          <stop offset="100%" stopColor="#0f1218" />
        </linearGradient>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#20242b" />
          <stop offset="100%" stopColor="#0c0f14" />
        </linearGradient>
      </defs>

      {/* الجدار والأرضية */}
      <rect x="0" y="0" width={VIEW_W} height={WALL_BOTTOM} fill="url(#wallGrad)" />
      <rect x="0" y={WALL_BOTTOM} width={VIEW_W} height={VIEW_H - WALL_BOTTOM} fill="url(#floorGrad)" />

      {/* الوحدات */}
      {drawn.map((s) => {
        const def = SECTION_TYPES[s.type]
        const doorColor = cabinetColor && !APPLIANCE_TYPES.includes(s.type) ? cabinetColor : def.color
        return (
          <g key={s.id}>
            {/* خزانة سفلية */}
            <rect
              x={s.x}
              y={COUNTER_Y}
              width={s.w - 3}
              height={WALL_BOTTOM - COUNTER_Y}
              fill={doorColor}
              stroke="#0c0f14"
              strokeWidth="1"
            />
            {/* السطح العلوي (كاونتر) */}
            <rect x={s.x - 1} y={COUNTER_Y - 6} width={s.w - 1} height="6" fill={countertopColor} />

            {/* وحدة علوية إن وجدت */}
            {def.hasUpper && (
              <rect
                x={s.x}
                y={WALL_TOP}
                width={s.w - 3}
                height={UPPER_BOTTOM - WALL_TOP}
                fill={doorColor}
                opacity="0.92"
                stroke="#0c0f14"
                strokeWidth="1"
              />
            )}

            {/* رمز بسيط حسب نوع الوحدة */}
            {s.type === 'cooktop' && (
              <g>
                {[0.28, 0.5, 0.72].map((f, i) => (
                  <circle key={i} cx={s.x + s.w * f} cy={COUNTER_Y - 14} r="6" fill="#0c0f14" />
                ))}
              </g>
            )}
            {s.type === 'sink' && (
              <rect x={s.x + s.w * 0.2} y={COUNTER_Y - 18} width={s.w * 0.6} height="12" rx="2" fill="#0c0f14" />
            )}
            {s.type === 'tall' && (
              <>
                <rect x={s.x + 4} y={WALL_TOP + 20} width={s.w - 11} height={COUNTER_Y - WALL_TOP - 26} fill="#171b22" stroke="#c9a24b" strokeWidth="0.5" />
                <line x1={s.x + 4} y1={WALL_TOP + 90} x2={s.x + s.w - 7} y2={WALL_TOP + 90} stroke="#c9a24b" strokeWidth="0.5" />
              </>
            )}
            {s.type === 'oven' && (
              <>
                <rect x={s.x + 6} y={COUNTER_Y - 100} width={s.w - 15} height="34" fill="#171b22" stroke="#c9a24b" strokeWidth="0.5" />
                <rect x={s.x + 6} y={COUNTER_Y - 58} width={s.w - 15} height="46" fill="#171b22" stroke="#c9a24b" strokeWidth="0.5" />
              </>
            )}
            {s.type === 'washer' && (
              <circle cx={s.x + s.w / 2} cy={WALL_BOTTOM - 45} r={Math.min(28, s.w / 2 - 8)} fill="#171b22" stroke="#c9a24b" strokeWidth="1" />
            )}

            {/* بُعد عرض كل وحدة */}
            <DimensionLine x1={s.x} y1={365} x2={s.x + s.w - 3} y2={365} label={m(s.width)} fontSize={10} />
          </g>
        )
      })}

      {/* البُعد الكلي للعرض */}
      <DimensionLine x1={PAD} y1={35} x2={VIEW_W - PAD} y2={35} label={m(totalWidth)} gold />

      {/* بُعد الارتفاع */}
      <DimensionLine x1={VIEW_W - 25} y1={WALL_TOP} x2={VIEW_W - 25} y2={WALL_BOTTOM} label={m(height)} gold />
    </svg>
  )
}
