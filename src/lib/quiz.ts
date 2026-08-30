/** أسئلة عن الأدوية + اختبار التعرف على الدواء بالصورة. */
import tabletsImg from "@/assets/drug-tablets-white.jpg";
import capsulesImg from "@/assets/drug-capsules-antibiotic.jpg";
import inhalerImg from "@/assets/drug-inhaler.jpg";
import syrupImg from "@/assets/drug-syrup.jpg";

export type DrugQuestion = {
  id: string;
  kind: "mc" | "tf";
  category:
    | "الاستخدام"
    | "المجموعة الدوائية"
    | "آلية العمل"
    | "الآثار الجانبية"
    | "التحذيرات"
    | "التداخلات"
    | "الشكل الصيدلاني"
    | "الفرق بين دواءين"
    | "الاستخدام الصحيح";
  text: string;
  options: string[];
  answer: number;
  explanation: string;
  drugId?: string;
  source: string;
};

const S = "WHO ATC — محتوى تعليمي قابل للمراجعة";

export const drugQuestions: DrugQuestion[] = [
  {
    id: "q1",
    kind: "mc",
    category: "الاستخدام",
    text: "ما الاستخدام الأساسي للباراسيتامول؟",
    options: ["مضاد حيوي", "مسكن وخافض للحرارة", "مدر للبول", "مضاد للحساسية"],
    answer: 1,
    explanation: "الباراسيتامول مسكن للألم الخفيف–المتوسط وخافض للحرارة، وليس مضادًا للالتهاب بشكل مهم.",
    drugId: "paracetamol",
    source: S,
  },
  {
    id: "q2",
    kind: "mc",
    category: "المجموعة الدوائية",
    text: "إلى أي مجموعة ينتمي Amlodipine؟",
    options: ["ACE inhibitors", "Beta blockers", "Calcium channel blockers", "Diuretics"],
    answer: 2,
    explanation: "الأملوديبين من حاصرات قنوات الكالسيوم من نوع dihydropyridine (ATC: C08CA01).",
    drugId: "amlodipine",
    source: S,
  },
  {
    id: "q3",
    kind: "mc",
    category: "آلية العمل",
    text: "ما آلية عمل الأوميبرازول؟",
    options: [
      "حصار مستقبلات H2",
      "تثبيط مضخة H+/K+-ATPase في الخلايا الجدارية",
      "معادلة الحمض كيميائيًا",
      "تثبيط COX-2",
    ],
    answer: 1,
    explanation: "الأوميبرازول مثبط لمضخة البروتون، ويعطي تثبيطًا طويل الأمد لإفراز الحمض.",
    drugId: "omeprazole",
    source: S,
  },
  {
    id: "q4",
    kind: "mc",
    category: "الآثار الجانبية",
    text: "أي أثر جانبي يُعد الأكثر ارتباطًا بمثبطات ACE؟",
    options: ["سعال جاف", "إمساك", "زيادة وزن", "فطريات فموية"],
    answer: 0,
    explanation: "تراكم البراديكينين يسبب سعالًا جافًا مزمنًا؛ البديل عادة ARB.",
    drugId: "lisinopril",
    source: S,
  },
  {
    id: "q5",
    kind: "tf",
    category: "التحذيرات",
    text: "الأسبرين ممنوع عادة في الأطفال والمراهقين المصابين بعدوى فيروسية.",
    options: ["صحيح", "خطأ"],
    answer: 0,
    explanation: "خطر متلازمة راي (Reye's syndrome) يمنع استخدام الأسبرين في هذه الفئة.",
    drugId: "aspirin",
    source: S,
  },
  {
    id: "q6",
    kind: "mc",
    category: "التداخلات",
    text: "ما التداخل المهم سريريًا مع Ciprofloxacin؟",
    options: [
      "مكملات الكالسيوم والحديد تقلل امتصاصه",
      "الباراسيتامول يمنع تأثيره",
      "الماء يقلل فعاليته",
      "لا تداخلات مهمة",
    ],
    answer: 0,
    explanation: "الكاتيونات ثنائية/ثلاثية التكافؤ تشكل معقدات تمنع الامتصاص — يُفصل بساعتين على الأقل.",
    drugId: "ciprofloxacin",
    source: S,
  },
  {
    id: "q7",
    kind: "mc",
    category: "الشكل الصيدلاني",
    text: "ما الشكل الصيدلاني الأنسب لعلاج نوبة ربو حادة؟",
    options: ["أقراص فموية", "بخاخ استنشاقي (MDI)", "تحاميل", "كريم موضعي"],
    answer: 1,
    explanation: "الاستنشاق يوصل الدواء مباشرة للقصبات ببداية تأثير سريعة وآثار جهازية أقل.",
    drugId: "salbutamol",
    source: S,
  },
  {
    id: "q8",
    kind: "mc",
    category: "الفرق بين دواءين",
    text: "ما الفرق الأساسي بين Salbutamol و Budesonide في الربو؟",
    options: [
      "كلاهما دواء إنقاذ",
      "السالبوتامول موسّع قصبات للإنقاذ والبوديزونيد كورتيزون وقائي",
      "البوديزونيد يُستخدم في النوبة الحادة فقط",
      "كلاهما مضاد حيوي",
    ],
    answer: 1,
    explanation: "السالبوتامول يخفف التشنج فورًا؛ البوديزونيد يعالج الالتهاب المزمن ويُستخدم يوميًا.",
    drugId: "budesonide",
    source: S,
  },
  {
    id: "q9",
    kind: "mc",
    category: "الاستخدام الصحيح",
    text: "ما التوقيت الصحيح لأخذ الأوميبرازول؟",
    options: ["مع الطعام", "قبل الفطور بـ 30–60 دقيقة", "بعد العشاء مباشرة", "لا يهم التوقيت"],
    answer: 1,
    explanation: "أخذه على معدة فارغة قبل أول وجبة يعطي أعلى تثبيط للمضخات النشطة.",
    drugId: "omeprazole",
    source: S,
  },
  {
    id: "q10",
    kind: "tf",
    category: "الاستخدام الصحيح",
    text: "يجب شطف الفم بعد استخدام الكورتيزون الاستنشاقي.",
    options: ["صحيح", "خطأ"],
    answer: 0,
    explanation: "الشطف يقلل خطر الكانديدا الفموية وبحة الصوت.",
    drugId: "budesonide",
    source: S,
  },
  {
    id: "q11",
    kind: "mc",
    category: "المجموعة الدوائية",
    text: "Azithromycin ينتمي إلى:",
    options: ["Penicillins", "Macrolides", "Fluoroquinolones", "Tetracyclines"],
    answer: 1,
    explanation: "أزيثرومايسين ماكروليد (ATC: J01FA10) ويُستخدم كبديل عند حساسية البنسلين.",
    drugId: "azithromycin",
    source: S,
  },
  {
    id: "q12",
    kind: "mc",
    category: "التحذيرات",
    text: "أي دواء يجب إيقافه قبل تصوير بالصبغة اليودية؟",
    options: ["Paracetamol", "Metformin", "Cetirizine", "Lactulose"],
    answer: 1,
    explanation: "الميتفورمين يُوقف مؤقتًا لخطر تدهور وظيفة الكلى والحماض اللبني.",
    drugId: "metformin",
    source: S,
  },
  {
    id: "q13",
    kind: "mc",
    category: "الآثار الجانبية",
    text: "أشهر أثر جانبي يبدأ به مرضى الميتفورمين:",
    options: ["نقص سكر شديد", "اضطراب هضمي وإسهال", "سعال جاف", "وذمة كاحلين"],
    answer: 1,
    explanation: "الأعراض الهضمية شائعة وتقل بالرفع التدريجي للجرعة وأخذه مع الطعام.",
    drugId: "metformin",
    source: S,
  },
  {
    id: "q14",
    kind: "tf",
    category: "التحذيرات",
    text: "مثبطات ACE و ARBs ممنوعة في الحمل.",
    options: ["صحيح", "خطأ"],
    answer: 0,
    explanation: "لها سمية جنينية معروفة على الكلى والنمو، وتُستبدل بخيارات أخرى.",
    drugId: "lisinopril",
    source: S,
  },
  {
    id: "q15",
    kind: "mc",
    category: "الفرق بين دواءين",
    text: "ما الفرق بين Cetirizine و Chlorpheniramine؟",
    options: [
      "لا فرق",
      "السيتريزين جيل ثانٍ أقل تسكينًا، والكلورفينيرامين جيل أول يسبب نعاسًا",
      "الكلورفينيرامين جيل ثانٍ",
      "كلاهما مضاد حيوي",
    ],
    answer: 1,
    explanation: "الجيل الأول يعبر الحاجز الدماغي ويسبب نعاسًا وتأثيرات مضادة كولينية.",
    drugId: "cetirizine",
    source: S,
  },
  {
    id: "q16",
    kind: "mc",
    category: "الاستخدام",
    text: "ما الاستخدام الأساسي لأملاح الإماهة الفموية؟",
    options: ["وقف الإسهال", "تعويض السوائل والأملاح", "قتل البكتيريا", "تسكين الألم"],
    answer: 1,
    explanation: "ORS يعالج الجفاف ولا يوقف الإسهال، وهو حجر الأساس خصوصًا عند الأطفال.",
    drugId: "ors",
    source: S,
  },
  {
    id: "q17",
    kind: "mc",
    category: "التداخلات",
    text: "أي تركيبة تزيد خطر النزيف بشكل واضح؟",
    options: ["Paracetamol + ORS", "Warfarin + NSAID", "Cetirizine + Loratadine", "Metformin + ORS"],
    answer: 1,
    explanation: "الـ NSAIDs تؤثر على الصفيحات والغشاء المعدي مع مضادات التخثر فيزيد خطر النزيف الهضمي.",
    drugId: "ibuprofen",
    source: S,
  },
  {
    id: "q18",
    kind: "mc",
    category: "آلية العمل",
    text: "آلية عمل الكلوتريمازول:",
    options: [
      "تثبيط تصنيع الإرغوستيرول في غشاء الفطر",
      "تثبيط جدار الخلية البكتيرية",
      "حصار مستقبلات H1",
      "تثبيط مضخة البروتون",
    ],
    answer: 0,
    explanation: "الأزولات تثبط 14-α-demethylase فيتضرر غشاء الفطر.",
    drugId: "clotrimazole",
    source: S,
  },
  {
    id: "q19",
    kind: "mc",
    category: "الاستخدام الصحيح",
    text: "الحد الأقصى اليومي للباراسيتامول عند البالغ السليم:",
    options: ["2 غ", "4 غ", "6 غ", "8 غ"],
    answer: 1,
    explanation: "4 غ يوميًا كحد أقصى، ويُخفَّض في أمراض الكبد وسوء التغذية والكحول.",
    drugId: "paracetamol",
    source: S,
  },
  {
    id: "q20",
    kind: "tf",
    category: "التحذيرات",
    text: "يمكن صرف مضاد حيوي لنزلة برد فيروسية لتسريع الشفاء.",
    options: ["صحيح", "خطأ"],
    answer: 1,
    explanation: "لا فائدة للمضاد الحيوي في العدوى الفيروسية، ويزيد المقاومة والآثار الجانبية.",
    source: S,
  },
];

export type ImageQuizItem = {
  id: string;
  image: string;
  width: number;
  height: number;
  level: "مبتدئ" | "متوسط" | "متقدم";
  question: string;
  options: string[];
  answer: number;
  className: string;
  explanation: string;
  drugId?: string;
};

export const imageQuiz: ImageQuizItem[] = [
  {
    id: "img1",
    image: tabletsImg,
    width: 768,
    height: 768,
    level: "مبتدئ",
    question: "شريط أقراص بيضاء 500 مغ تُصرف للحمى والألم — ما نوع هذا الدواء؟",
    options: ["مسكن وخافض حرارة", "مضاد حيوي", "مضاد حساسية", "دواء ضغط"],
    answer: 0,
    className: "Analgesic • Antipyretic (N02BE01)",
    explanation: "الشكل الأكثر شيوعًا للباراسيتامول: أقراص 500 مغ للألم والحمى.",
    drugId: "paracetamol",
  },
  {
    id: "img2",
    image: capsulesImg,
    width: 768,
    height: 768,
    level: "مبتدئ",
    question: "كبسولات ملونة تُصرف بوصفة لعلاج عدوى بكتيرية — ما نوع هذا الدواء؟",
    options: ["مضاد حساسية", "مضاد حيوي", "مسكن", "ملين"],
    answer: 1,
    className: "Penicillin antibiotic (J01CA04)",
    explanation: "كبسولات الأموكسيسيلين مثال نموذجي للمضادات الحيوية الفموية.",
    drugId: "amoxicillin",
  },
  {
    id: "img3",
    image: inhalerImg,
    width: 768,
    height: 768,
    level: "متوسط",
    question: "بخاخ أزرق يُستخدم عند الأزيز وضيق النفس — ما نوعه؟",
    options: ["كورتيزون وقائي", "موسّع قصبات سريع المفعول", "مضاد حيوي استنشاقي", "مضاد هيستامين"],
    answer: 1,
    className: "Short-acting beta-2 agonist (R03AC02)",
    explanation: "البخاخ الأزرق تقليديًا هو السالبوتامول، وهو دواء الإنقاذ في نوبة الربو.",
    drugId: "salbutamol",
  },
  {
    id: "img4",
    image: syrupImg,
    width: 768,
    height: 768,
    level: "متقدم",
    question: "معلق فموي للأطفال مع ملعقة قياس — ما أهم ميزة هذا الشكل الصيدلاني؟",
    options: [
      "تحرر ممتد",
      "إمكانية تعديل الجرعة حسب وزن الطفل",
      "يُستخدم موضعيًا",
      "لا يحتاج رجّ قبل الاستخدام",
    ],
    answer: 1,
    className: "Oral suspension — pediatric dosage form",
    explanation: "المعلق يسمح بجرعة موزونة بالوزن (مغ/كغ) ويجب رجّه جيدًا قبل كل استخدام.",
    drugId: "paracetamol",
  },
];
