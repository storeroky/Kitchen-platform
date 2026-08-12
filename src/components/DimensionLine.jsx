// خط أبعاد بأسهم على الطرفين وتسمية بالمنتصف — نفس أسلوب مخططات الصور المرفقة
export default function DimensionLine({ x1, y1, x2, y2, label, gold = true, fontSize = 11 }) {
  const isHorizontal = Math.abs(y1 - y2) < 0.5
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2
  const stroke = gold ? '#c9a24b' : '#8a94a6'

  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="0.75" />
      {/* أسهم الطرفين */}
      {isHorizontal ? (
        <>
          <line x1={x1} y1={y1 - 4} x2={x1} y2={y1 + 4} stroke={stroke} strokeWidth="0.75" />
          <line x1={x2} y1={y2 - 4} x2={x2} y2={y2 + 4} stroke={stroke} strokeWidth="0.75" />
        </>
      ) : (
        <>
          <line x1={x1 - 4} y1={y1} x2={x1 + 4} y2={y1} stroke={stroke} strokeWidth="0.75" />
          <line x1={x2 - 4} y1={y2} x2={x2 + 4} y2={y2} stroke={stroke} strokeWidth="0.75" />
        </>
      )}
      <rect
        x={isHorizontal ? midX - label.length * 3 - 3 : midX - 12}
        y={isHorizontal ? midY - fontSize - 2 : midY - 6}
        width={isHorizontal ? label.length * 6 + 6 : 24}
        height={fontSize + 3}
        fill="#0c0f14"
      />
      <text
        x={midX}
        y={isHorizontal ? midY - 5 : midY + 3}
        fill="#e8ce93"
        fontSize={fontSize}
        textAnchor="middle"
        fontFamily="Tajawal, sans-serif"
        transform={isHorizontal ? undefined : `rotate(-90 ${midX} ${midY})`}
      >
        {label}
      </text>
    </g>
  )
}
