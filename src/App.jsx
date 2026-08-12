import { useState } from 'react'
import Header from './components/Header.jsx'
import KitchenConfigurator from './components/KitchenConfigurator.jsx'
import MaterialSelector from './components/MaterialSelector.jsx'
import SpecsPanel from './components/SpecsPanel.jsx'
import AIDesignGenerator from './components/AIDesignGenerator.jsx'
import DesignCard from './components/DesignCard.jsx'
import { defaultLayout, MATERIALS, DEFAULT_SPECS } from './utils/kitchenModel.js'

const STEPS = [
  { id: 1, label: 'المخطط والمقاسات' },
  { id: 2, label: 'المواد والذكاء الاصطناعي' },
  { id: 3, label: 'البطاقة النهائية' }
]

function NextButton({ onClick, label }) {
  return (
    <button
      onClick={onClick}
      className="text-xs sm:text-sm border border-gold-500/40 text-gold-300 hover:bg-gold-500/10 rounded-full px-5 py-2 transition focus-ring"
    >
      {label} ←
    </button>
  )
}

export default function App() {
  const [layout, setLayout] = useState(defaultLayout())
  const [material, setMaterial] = useState(MATERIALS[0])
  const [aiImageUrl, setAiImageUrl] = useState(null)
  const [step, setStep] = useState(1)

  return (
    <div className="min-h-full">
      <Header />

      <nav className="max-w-6xl mx-auto px-6 mt-8 flex items-center justify-center gap-2 sm:gap-6">
        {STEPS.map((s) => (
          <button
            key={s.id}
            onClick={() => setStep(s.id)}
            className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border transition focus-ring ${
              step === s.id
                ? 'bg-gold-500/15 border-gold-400 text-gold-300'
                : 'hairline text-bone/45 hover:text-bone/70'
            }`}
          >
            {s.id}. {s.label}
          </button>
        ))}
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-10">
        {step === 1 && (
          <>
            <KitchenConfigurator layout={layout} setLayout={setLayout} material={material} />
            <div className="flex justify-center mt-6">
              <NextButton onClick={() => setStep(2)} label="التالي: المواد والذكاء الاصطناعي" />
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="grid lg:grid-cols-[280px_1fr] gap-6">
              <div className="space-y-8 bg-ink-900/70 border hairline rounded-xl p-5 h-fit">
                <MaterialSelector selected={material} onSelect={setMaterial} />
                <SpecsPanel specs={DEFAULT_SPECS} sectionCount={layout.sections.length} />
              </div>
              <AIDesignGenerator
                layout={layout}
                material={material}
                onGenerated={setAiImageUrl}
              />
            </div>
            <div className="flex justify-center mt-6">
              <NextButton onClick={() => setStep(3)} label="التالي: البطاقة النهائية" />
            </div>
          </>
        )}

        {step === 3 && <DesignCard layout={layout} material={material} aiImageUrl={aiImageUrl} />}
      </main>

      <footer className="text-center text-[10px] text-bone/25 pb-10 tracking-widest2">
        RAQIY DESIGN STUDIO — LUXURY KITCHEN AI PLATFORM
      </footer>
    </div>
  )
}
