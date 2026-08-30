export const student = {
  name: "أمينة الزروق",
  university: "جامعة طرابلس — كلية الصيدلة",
  year: "السنة الرابعة",
  initials: "أ.ز",
};

/** يُستخدم في مكوّن CourseCard داخل kit */
export type Course = {
  id: string;
  title: string;
  provider: string;
  lessons: number;
  hours: string;
  rating: number;
  learners: string;
  progress?: number;
  tag: string;
};

export type Pharmacy = {
  id: string;
  name: string;
  city: string;
  distance: string;
  rating: number;
  seats: number;
  verified: boolean;
  specialty: string;
  trainingTypes: string[];
  hours: string;
  about: string;
};

export const pharmacies: Pharmacy[] = [
  {
    id: "nahda",
    name: "صيدلية النهضة",
    city: "طرابلس — جرابة",
    distance: "1.2 كم",
    rating: 4.8,
    seats: 3,
    verified: true,
    specialty: "صيدلة مجتمعية",
    trainingTypes: ["صرف الوصفات", "الاستشارة الدوائية", "إدارة المخزون"],
    hours: "السبت–الخميس · 08:00 — 14:00",
    about: "صيدلية مجتمعية بحركة عالية، مناسبة للتدرّب على صرف الوصفات والتعامل مع المرضى.",
  },
  {
    id: "shifa",
    name: "صيدلية الشفاء",
    city: "طرابلس — الأندلس",
    distance: "2.7 كم",
    rating: 4.6,
    seats: 1,
    verified: true,
    specialty: "صيدلة سريرية",
    trainingTypes: ["مراجعة الأدوية", "التداخلات الدوائية", "متابعة الأمراض المزمنة"],
    hours: "السبت–الخميس · 09:00 — 15:00",
    about: "تركيز على الحالات المزمنة (ضغط، سكري) ومراجعة خطط العلاج الدوائي.",
  },
  {
    id: "amal",
    name: "صيدلية الأمل",
    city: "بنغازي — الكيش",
    distance: "4.4 كم",
    rating: 4.4,
    seats: 5,
    verified: false,
    specialty: "مستحضرات صيدلانية",
    trainingTypes: ["التحضير الصيدلاني", "المستحضرات الموضعية"],
    hours: "السبت–الأربعاء · 10:00 — 16:00",
    about: "خبرة في تحضير المستحضرات الموضعية والأشكال الصيدلانية البسيطة.",
  },
  {
    id: "hayat",
    name: "صيدلية الحياة",
    city: "مصراتة — المدينة",
    distance: "6.1 كم",
    rating: 4.7,
    seats: 2,
    verified: true,
    specialty: "صيدلة مستشفى",
    trainingTypes: ["أدوية المستشفى", "حساب الجرعات", "الأدوية الوريدية"],
    hours: "طوال الأسبوع · نوبات صباحية",
    about: "تدريب داخل صيدلية مستشفى مع تركيز على حساب الجرعات والأدوية الوريدية.",
  },
];

export const pharmacyById = (id: string) => pharmacies.find((p) => p.id === id);
