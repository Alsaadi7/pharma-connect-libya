/** منهج طالب الصيدلة — 16 وحدة، منظمة وفق منطق WHO ATC مبسّطًا للتعلم. */

export type Lesson = { id: string; title: string; minutes: number };
export type Module = {
  id: string;
  code: string;
  title: string;
  desc: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  tone: "primary" | "secondary" | "warning";
  lessons: Lesson[];
};

const L = (moduleId: string, titles: string[]): Lesson[] =>
  titles.map((title, i) => ({
    id: `${moduleId}-l${i + 1}`,
    title,
    minutes: 6 + ((i * 3) % 12),
  }));

const raw: Array<Omit<Module, "lessons"> & { titles: string[] }> = [
  {
    id: "m01",
    code: "MODULE 01",
    title: "أساسيات التدريب الصيدلي",
    desc: "المهارات الأساسية للتعامل مع الأدوية والوصفة داخل الصيدلية.",
    level: "مبتدئ",
    tone: "primary",
    titles: [
      "مقدمة في العمل الصيدلي",
      "قراءة الوصفة الطبية",
      "الاسم العلمي والاسم التجاري",
      "الأشكال الصيدلانية",
      "طرق إعطاء الدواء",
      "الجرعات ووحدات القياس",
      "حساب الجرعات الأساسية",
      "تخزين الأدوية",
      "صرف الدواء بطريقة آمنة",
      "أخطاء صرف الأدوية",
    ],
  },
  {
    id: "m02",
    code: "MODULE 02",
    title: "المسكنات ومضادات الالتهاب",
    desc: "المسكنات البسيطة، مضادات الالتهاب غير الستيرويدية، والمسكنات الأفيونية.",
    level: "مبتدئ",
    tone: "secondary",
    titles: [
      "Introduction to Analgesics",
      "Paracetamol",
      "NSAIDs",
      "Ibuprofen",
      "Diclofenac",
      "Naproxen",
      "Aspirin",
      "Opioid analgesics",
      "الآثار الجانبية والتحذيرات",
      "حالات سريرية للمسكنات",
    ],
  },
  {
    id: "m03",
    code: "MODULE 03",
    title: "أدوية الجهاز الهضمي",
    desc: "الحموضة، القرحة، الغثيان، الإمساك والإسهال.",
    level: "مبتدئ",
    tone: "primary",
    titles: [
      "Antacids",
      "H2 blockers",
      "Proton Pump Inhibitors",
      "أدوية GERD",
      "Anti-emetics",
      "Laxatives",
      "Antidiarrheals",
      "أدوية القولون",
      "حالات سريرية للجهاز الهضمي",
    ],
  },
  {
    id: "m04",
    code: "MODULE 04",
    title: "أدوية القلب والضغط",
    desc: "مجموعات أدوية الضغط والذبحة وآليات عملها.",
    level: "متوسط",
    tone: "warning",
    titles: [
      "Introduction to cardiovascular drugs",
      "ACE inhibitors",
      "ARBs",
      "Beta blockers",
      "Calcium channel blockers",
      "Diuretics",
      "Alpha blockers",
      "أدوية الذبحة",
      "حالات ارتفاع ضغط الدم",
    ],
  },
  {
    id: "m05",
    code: "MODULE 05",
    title: "أدوية السكري",
    desc: "من الميتفورمين إلى الأنسولين وإدارة نقص السكر.",
    level: "متوسط",
    tone: "secondary",
    titles: [
      "Introduction to Diabetes",
      "Metformin",
      "Sulfonylureas",
      "DPP-4 inhibitors",
      "SGLT2 inhibitors",
      "GLP-1 receptor agonists",
      "Insulins",
      "Hypoglycemia",
      "حالات سريرية للسكري",
    ],
  },
  {
    id: "m06",
    code: "MODULE 06",
    title: "أدوية الجهاز التنفسي",
    desc: "موسعات القصبات، الكورتيزون الاستنشاقي، والسعال.",
    level: "متوسط",
    tone: "primary",
    titles: [
      "Bronchodilators",
      "Beta-2 agonists",
      "Anticholinergics",
      "Inhaled corticosteroids",
      "Leukotriene modifiers",
      "أدوية السعال",
      "أدوية الحساسية المرتبطة بالجهاز التنفسي",
      "Asthma cases",
    ],
  },
  {
    id: "m07",
    code: "MODULE 07",
    title: "مضادات العدوى",
    desc: "المضادات الحيوية والفطرية والفيروسية والاستخدام الرشيد.",
    level: "متقدم",
    tone: "warning",
    titles: [
      "Introduction to Antimicrobials",
      "Penicillins",
      "Cephalosporins",
      "Macrolides",
      "Tetracyclines",
      "Fluoroquinolones",
      "Sulfonamides",
      "Antifungals",
      "Antivirals",
      "الاستخدام الرشيد للمضادات الحيوية",
      "مقاومة المضادات الحيوية",
      "حالات سريرية",
    ],
  },
  {
    id: "m08",
    code: "MODULE 08",
    title: "أدوية الحساسية",
    desc: "مضادات الهيستامين وأنواع الحساسية الشائعة.",
    level: "مبتدئ",
    tone: "secondary",
    titles: [
      "Antihistamines",
      "First-generation antihistamines",
      "Second-generation antihistamines",
      "Allergic rhinitis",
      "Urticaria",
      "حالات سريرية",
    ],
  },
  {
    id: "m09",
    code: "MODULE 09",
    title: "أدوية الجلد",
    desc: "المستحضرات الموضعية والحالات الجلدية الشائعة.",
    level: "مبتدئ",
    tone: "primary",
    titles: [
      "Topical preparations",
      "Corticosteroids",
      "Antifungals",
      "Antibiotic creams",
      "Acne medications",
      "Antiseptics",
      "Common dermatological cases",
    ],
  },
  {
    id: "m10",
    code: "MODULE 10",
    title: "أدوية الجهاز العصبي",
    desc: "مضادات الاكتئاب والقلق والصرع والذهان.",
    level: "متقدم",
    tone: "warning",
    titles: [
      "Introduction to CNS drugs",
      "Antidepressants",
      "Anxiolytics",
      "Hypnotics",
      "Antipsychotics",
      "Antiepileptics",
      "Common neurological medications",
    ],
  },
  {
    id: "m11",
    code: "MODULE 11",
    title: "أدوية الجهاز العضلي الهيكلي",
    desc: "مرخيات العضلات، النقرس، وهشاشة العظام.",
    level: "متوسط",
    tone: "secondary",
    titles: [
      "Muscle relaxants",
      "Drugs for gout",
      "Osteoporosis medications",
      "Anti-inflammatory drugs",
      "Common musculoskeletal cases",
    ],
  },
  {
    id: "m12",
    code: "MODULE 12",
    title: "أدوية الهرمونات والغدد",
    desc: "الغدة الدرقية والكورتيكوستيرويدات والمستحضرات الهرمونية.",
    level: "متوسط",
    tone: "primary",
    titles: [
      "Thyroid medications",
      "Corticosteroids",
      "Hormonal preparations",
      "Common endocrine medications",
    ],
  },
  {
    id: "m13",
    code: "MODULE 13",
    title: "أدوية الدم",
    desc: "مضادات التخثر والصفيحات ومستحضرات الحديد.",
    level: "متقدم",
    tone: "warning",
    titles: [
      "Anticoagulants",
      "Antiplatelets",
      "Thrombolytics",
      "Iron preparations",
      "Vitamins related to blood disorders",
    ],
  },
  {
    id: "m14",
    code: "MODULE 14",
    title: "أدوية العين والأذن",
    desc: "القطرات والمراهم العينية والأذنية.",
    level: "مبتدئ",
    tone: "secondary",
    titles: [
      "Ophthalmic preparations",
      "Antibiotic eye drops",
      "Anti-inflammatory eye drops",
      "Glaucoma medications",
      "Ear preparations",
    ],
  },
  {
    id: "m15",
    code: "MODULE 15",
    title: "أدوية الجهاز البولي والتناسلي",
    desc: "التهابات المسالك وتضخم البروستاتا وصحة الإنجاب الأساسية.",
    level: "متوسط",
    tone: "primary",
    titles: [
      "Urinary tract medications",
      "Drugs for BPH",
      "Common urinary conditions",
      "Basic reproductive health medications",
    ],
  },
  {
    id: "m16",
    code: "MODULE 16",
    title: "مراجعة شاملة",
    desc: "ربط المجموعات الدوائية بالحالات والتقييم النهائي.",
    level: "متقدم",
    tone: "warning",
    titles: [
      "Drug classification",
      "اختيار الدواء المناسب للحالة",
      "Drug interactions",
      "Contraindications",
      "Side effects",
      "Patient counselling",
      "Clinical cases",
      "Final assessment",
    ],
  },
];

export const modules: Module[] = raw.map(({ titles, ...m }) => ({ ...m, lessons: L(m.id, titles) }));

export const moduleById = (id: string) => modules.find((m) => m.id === id);

export const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);

export const lessonById = (lessonId: string) => {
  for (const m of modules) {
    const l = m.lessons.find((x) => x.id === lessonId);
    if (l) return { module: m, lesson: l };
  }
  return undefined;
};
