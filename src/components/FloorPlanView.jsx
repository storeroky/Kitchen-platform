
import DimensionLine from './DimensionLine.jsx'
import { m, sumWidths } from '../utils/kitchenModel.js'

const PAD = 50
const VIEW_W = 900
const VIEW_H = 220
const DEPTH_PX = 70
const TOP_Y = 60

export default function FloorPlanView({ layout }) {
  const { sections, totalWidth, depth } = layout
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

  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className="w-full h-auto" role="img" aria-label="مخطط أرضي للمطبخ">
      {/* الكاونتر بعمق ثابت */}
      <rect x={PAD} y={TOP_Y} width={drawableW} height={DEPTH_PX} fill="#171b22" stroke="#c9a24b" strokeWidth="0.75" />

      {drawn.map((s) => (
        <g key={s.id}>
          <line x1={s.x} y1={TOP_Y} x2={s.x} y2={TOP_Y + DEPTH_PX} stroke="#3a3f47" strokeWidth="0.75" />
          <DimensionLine x1={s.x} y1={TOP_Y - 14} x2={s.x + s.w} y2={TOP_Y - 14} label={m(s.width)} fontSize={9.5} />
        </g>
      ))}

      <DimensionLine x1={PAD} y1={20} x2={VIEW_W - PAD} y2={20} label={m(totalWidth)} />
      <DimensionLine x1={VIEW_W - 25} y1={TOP_Y} x2={VIEW_W - 25} y2={TOP_Y + DEPTH_PX} label={m(depth)} />
    </svg>
  )
}
