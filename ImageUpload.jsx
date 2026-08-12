import { useRef, useState } from 'react'

const MAX_SIZE_MB = 8
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp']

export default function ImageUpload({ onImageReady, onClear }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  function handleFile(file) {
    setError(null)
    if (!file) return

    if (!ACCEPTED.includes(file.type)) {
      setError('صيغة غير مدعومة. ارفع صورة PNG أو JPG مُصدّرة من SketchUp.')
      return
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`حجم الصورة كبير جداً. الحد الأقصى ${MAX_SIZE_MB} ميجابايت.`)
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      setFileName(file.name)
      onImageReady?.(reader.result) // base64 data URL
    }
    reader.onerror = () => setError('تعذّرت قراءة الملف، حاول مرة أخرى.')
    reader.readAsDataURL(file)
  }

  function clear() {
    setPreview(null)
    setFileName(null)
    setError(null)
    if (inputRef.current) inputRef.current.value = ''
    onClear?.()
  }

  return (
    <div>
      {!preview ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragActive(false)
            handleFile(e.dataTransfer.files?.[0])
          }}
          onClick={() => inputRef.current?.click()}
          className={`cursor-pointer rounded-lg border-2 border-dashed px-4 py-8 text-center transition ${
            dragActive ? 'border-gold-400 bg-gold-500/5' : 'border-gold-500/25 hover:border-gold-500/45'
          }`}
        >
          <p className="text-sm text-bone/70 mb-1">اسحب صورة SketchUp هنا أو اضغط للاختيار</p>
          <p className="text-[11px] text-bone/40">PNG أو JPG — حتى {MAX_SIZE_MB} ميجابايت (مخطط علوي أو واجهة أمامية)</p>
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED.join(',')}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      ) : (
        <div className="rounded-lg border hairline overflow-hidden">
          <img src={preview} alt="معاينة الرفع من SketchUp" className="w-full max-h-64 object-contain bg-ink-950" />
          <div className="flex items-center justify-between px-3 py-2 bg-ink-900/80 text-xs">
            <span className="text-bone/60 truncate">{fileName}</span>
            <button onClick={clear} className="text-red-300/70 hover:text-red-300 focus-ring shrink-0 ms-2">
              إزالة
            </button>
          </div>
        </div>
      )}
      {error && <p className="text-xs text-red-300 mt-2">{error}</p>}
    </div>
  )
}
