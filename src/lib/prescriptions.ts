/** محاكي قراءة الوصفات الطبية — الطالب يقرأ الوصفة ويدخل محتواها. */
import rxBeginner from "@/assets/rx-beginner.jpg";
import rxIntermediate from "@/assets/rx-intermediate.jpg";
import rxAdvanced from "@/assets/rx-advanced.jpg";

export type RxLine = {
  drug: string; // الاسم العلمي الصحيح
  strength: string;
  dose: string;
  frequency: string;
  duration: string;
  note?: string;
};

export type PrescriptionCase = {
  id: string;
  code: string;
  image: string;
  width: number;
  height: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  context: string;
  question: string;
  lines: RxLine[];
  hint: string;
  reviewNote: string;
};

export const prescriptions: PrescriptionCase[] = [
  {
    id: "rx-01",
    code: "Prescription Case #1",
    image: rxBeginner,
    width: 896,
    height: 1152,
    level: "Beginner",
    context: "مريض بالغ حضر إلى الصيدلية بوصفة واضحة الخط تحتوي دواءين.",
    question: "اقرأ الوصفة وأدخل أسماء الأدوية مع الجرعة وعدد المرات والمدة.",
    lines: [
      { drug: "Paracetamol", strength: "500 mg", dose: "1 قرص", frequency: "3 مرات يوميًا", duration: "5 أيام" },
      { drug: "Cetirizine", strength: "10 mg", dose: "1 قرص", frequency: "مرة يوميًا", duration: "7 أيام" },
    ],
    hint: "ابدأ بكتابة أول 3 أحرف من اسم الدواء لتظهر الاقتراحات.",
    reviewNote: "الجرعات هنا قياسية للبالغين ولا تحتوي أي تعارض.",
  },
  {
    id: "rx-02",
    code: "Prescription Case #2",
    image: rxIntermediate,
    width: 896,
    height: 1152,
    level: "Intermediate",
    context: "وصفة بخط أصعب مع اختصارات طبية شائعة (TDS = ثلاث مرات يوميًا).",
    question: "استخرج الأدوية الثلاثة مع جرعاتها وترجم الاختصارات إلى تعليمات واضحة للمريض.",
    lines: [
      { drug: "Amoxicillin", strength: "500 mg", dose: "1 كبسولة", frequency: "3 مرات يوميًا", duration: "7 أيام" },
      { drug: "Ibuprofen", strength: "400 mg", dose: "1 قرص", frequency: "3 مرات يوميًا", duration: "5 أيام", note: "بعد الطعام" },
      { drug: "Omeprazole", strength: "20 mg", dose: "1 كبسولة", frequency: "مرة يوميًا", duration: "14 يومًا", note: "قبل الفطور" },
    ],
    hint: "TDS = ثلاث مرات يوميًا، OD = مرة يوميًا، PC = بعد الطعام.",
    reviewNote: "الأوميبرازول هنا وقاية معدية مع الـ NSAID — نقطة توعية مهمة للمريض.",
  },
  {
    id: "rx-03",
    code: "Prescription Case #3",
    image: rxAdvanced,
    width: 896,
    height: 1152,
    level: "Advanced",
    context: "وصفة بخط يد صعب لمريض مزمن، وتحتاج تدقيقًا للجرعات.",
    question: "استخرج جميع الأدوية والجرعات، ولاحظ أي نقطة تحتاج تدقيقًا قبل الصرف.",
    lines: [
      { drug: "Metformin", strength: "1000 mg", dose: "1 قرص", frequency: "مرتين يوميًا", duration: "30 يومًا", note: "مع الطعام" },
      { drug: "Amlodipine", strength: "5 mg", dose: "1 قرص", frequency: "مرة يوميًا", duration: "30 يومًا" },
      { drug: "Aspirin", strength: "75 mg", dose: "1 قرص", frequency: "مرة يوميًا", duration: "30 يومًا" },
      { drug: "Diclofenac", strength: "50 mg", dose: "1 قرص", frequency: "مرتين يوميًا", duration: "5 أيام" },
    ],
    hint: "دقّق في اجتماع مضاد صفيحات مع NSAID.",
    reviewNote:
      "اجتماع الأسبرين مع الديكلوفيناك يرفع خطر النزيف الهضمي — يُراجع الطبيب أو يُقترح بديل موضعي/باراسيتامول.",
  },
];

export const prescriptionById = (id: string) => prescriptions.find((p) => p.id === id);
