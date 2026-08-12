export default function SpecsPanel({ specs, sectionCount }) {
  return (
    <div>
      <h3 className="text-gold-300 font-semibold text-sm tracking-wide mb-3">المواصفات</h3>
      <ul className="space-y-2 text-sm text-bone/75">
        <li className="flex items-center gap-2">
          <Dot /> {sectionCount} وحدات متكاملة
        </li>
        {specs.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <Dot /> {s}
          </li>
        ))}
      </ul>
    </div>
  )
}

function Dot() {
  return <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
}
