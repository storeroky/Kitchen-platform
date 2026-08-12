export default function Header() {
  return (
    <header className="relative overflow-hidden border-b hairline bg-radial-fade">
      <div className="max-w-6xl mx-auto px-6 py-10 text-center">
        <p className="text-gold-400/80 text-[11px] tracking-widest2 uppercase mb-3">Raqiy · رقي للتصميم الداخلي</p>
        <h1 className="font-arabicDisplay text-4xl sm:text-5xl gold-text font-bold mb-3">
          منصة تصميم المطابخ الذكية
        </h1>
        <p className="text-bone/50 text-sm sm:text-base max-w-xl mx-auto">
          ارسم مخطط مطبخك بمقاسات دقيقة، اختر المواد، ودع الذكاء الاصطناعي يحوّله إلى تصميم واقعي بجودة استوديو تصوير.
        </p>
        <div className="h-px w-40 bg-gold-line mx-auto mt-8" />
      </div>
    </header>
  )
}
