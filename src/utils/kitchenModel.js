// نموذج بيانات المطبخ + قيم افتراضية مبنية على نفس منطق الصور المرفقة
// كل وحدة (section) تمثل خزانة أو جهاز ضمن الواجهة الأمامية للمطبخ

export const SECTION_TYPES = {
  cabinet: { label: 'خزانة سفلية وعلوية', color: '#e9e2d0', hasUpper: true },
  tall: { label: 'وحدة عالية (ثلاجة)', color: '#d8cfb8', hasUpper: false },
  oven: { label: 'برج أفران', color: '#3a3f47', hasUpper: false },
  sink: { label: 'حوض + خلاطات', color: '#eee7d6', hasUpper: true },
  cooktop: { label: 'موقد وشفاط', color: '#2c2f36', hasUpper: true },
  washer: { label: 'غسالة', color: '#20242b', hasUpper: false },
  microwave: { label: 'ميكروويف مدمج', color: '#2c2f36', hasUpper: false }
}

export const MATERIALS = [
  { id: 'natural-wood', name: 'خشب طبيعي', hex: '#8a6a45' },
  { id: 'high-gloss', name: 'رخام فخم عالي الجودة', hex: '#efe8da' },
  { id: 'matte-luxury', name: 'أسطح مطفية فاخرة', hex: '#2b2f36' }
]

export const DEFAULT_SPECS = [
  'رسم مخطط للمطبخ بمقاسات دقيقة',
  'أدراج وأبواب بتقنيات مبتكرة وسهولة استخدام',
  'أسطح سهلة التنظيف ومقاومة للخدش',
  'إضاءة LED مخفية أسفل الوحدات العلوية',
  'استخدام أمثل لكل الأبعاد والمساحات'
]

export function defaultLayout() {
  return {
    totalWidth: 4.4,
    height: 2.76,
    depth: 0.6,
    sections: [
      { id: 's1', type: 'tall', width: 0.6 },
      { id: 's2', type: 'cabinet', width: 0.95 },
      { id: 's3', type: 'sink', width: 1.03 },
      { id: 's4', type: 'cooktop', width: 1.15 },
      { id: 's5', type: 'cabinet', width: 1.03 },
      { id: 's6', type: 'oven', width: 0.6 }
    ]
  }
}

export function m(n) {
  return `${Number(n).toFixed(2)} m`
}

export function sumWidths(sections) {
  return sections.reduce((acc, s) => acc + Number(s.width || 0), 0)
}
