export const student = {
  name: "أمينة الزروق",
  university: "جامعة طرابلس — كلية الصيدلة",
  year: "السنة الرابعة",
  initials: "أ.ز",
  progress: 68,
  hoursDone: 214,
  hoursTotal: 320,
  rating: 4.6,
};

export const nextTraining = {
  pharmacy: "صيدلية النهضة",
  date: "الاثنين 17 أغسطس",
  time: "08:00 — 14:00",
  supervisor: "د. خالد بن عمران",
  address: "شارع جرابة، طرابلس",
};

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

export const courses: Course[] = [
  {
    id: "pharmacology-basics",
    title: "أساسيات علم الأدوية السريري",
    provider: "شركة ليبيا فارما",
    lessons: 24,
    hours: "6س 40د",
    rating: 4.8,
    learners: "1,240",
    progress: 72,
    tag: "علم الأدوية",
  },
  {
    id: "dispensing-skills",
    title: "مهارات صرف الدواء والاستشارة الدوائية",
    provider: "نقابة الصيادلة",
    lessons: 18,
    hours: "4س 10د",
    rating: 4.7,
    learners: "980",
    progress: 35,
    tag: "ممارسة",
  },
  {
    id: "antibiotics",
    title: "الاستخدام الرشيد للمضادات الحيوية",
    provider: "المركز الوطني للأدوية",
    lessons: 15,
    hours: "3س 25د",
    rating: 4.9,
    learners: "1,610",
    tag: "سريري",
  },
  {
    id: "pharmacy-management",
    title: "إدارة الصيدلية والمخزون الدوائي",
    provider: "أكاديمية فارما ترين",
    lessons: 21,
    hours: "5س 05د",
    rating: 4.5,
    learners: "740",
    tag: "إدارة",
  },
];

export const lessons = [
  { id: 1, title: "مقدمة: الحركية الدوائية", duration: "08:24", done: true },
  { id: 2, title: "الامتصاص والتوزيع", duration: "12:10", done: true },
  { id: 3, title: "الاستقلاب الكبدي والتفاعلات", duration: "15:42", done: true },
  { id: 4, title: "حسابات الجرعات العملية", duration: "11:05", done: false, current: true },
  { id: 5, title: "التفاعلات الدوائية الشائعة", duration: "09:38", done: false },
  { id: 6, title: "اختبار الوحدة الأولى", duration: "10 أسئلة", done: false, quiz: true },
];

export type Pharmacy = {
  id: string;
  name: string;
  city: string;
  distance: string;
  rating: number;
  seats: number;
  verified: boolean;
  specialty: string;
};

export const pharmacies: Pharmacy[] = [
  { id: "nahda", name: "صيدلية النهضة", city: "طرابلس — جرابة", distance: "1.2 كم", rating: 4.8, seats: 3, verified: true, specialty: "صيدلة مجتمعية" },
  { id: "shifa", name: "صيدلية الشفاء", city: "طرابلس — الأندلس", distance: "2.7 كم", rating: 4.6, seats: 1, verified: true, specialty: "صيدلة سريرية" },
  { id: "amal", name: "صيدلية الأمل", city: "بنغازي — الكيش", distance: "4.4 كم", rating: 4.4, seats: 5, verified: false, specialty: "مستحضرات" },
  { id: "hayat", name: "صيدلية الحياة", city: "مصراتة — المدينة", distance: "6.1 كم", rating: 4.7, seats: 2, verified: true, specialty: "صيدلة مستشفى" },
];

export const notifications = [
  { id: 1, title: "تم قبول طلب التدريب", body: "صيدلية النهضة قبلت طلبك — ابدأ الاثنين 08:00", time: "قبل 12 دقيقة", type: "success" as const },
  { id: 2, title: "تقييم جديد من المشرف", body: "د. خالد أضاف تقييم مهارات صرف الدواء", time: "قبل ساعتين", type: "info" as const },
  { id: 3, title: "تذكير: التقرير اليومي", body: "لم ترسل تقرير يوم الأحد بعد", time: "أمس", type: "warning" as const },
];

export const clinicalCases = [
  { id: "case-1", title: "مريض سكري من النوع الثاني مع اعتلال كلوي", level: "متوسط", supervisor: "د. خالد بن عمران", due: "متاح حتى 22 أغسطس", solved: false },
  { id: "case-2", title: "تفاعل دوائي: وارفارين ومضاد حيوي", level: "متقدم", supervisor: "د. سلمى الفيتوري", due: "تم التسليم", solved: true },
  { id: "case-3", title: "طفل بربو شعبي — تعليم استخدام البخاخ", level: "مبتدئ", supervisor: "د. خالد بن عمران", due: "متاح حتى 30 أغسطس", solved: false },
];

export const attendance = [
  { day: "الأحد 16", status: "حاضر", hours: "6.0", time: "07:58 — 14:02" },
  { day: "السبت 15", status: "حاضر", hours: "5.5", time: "08:12 — 13:45" },
  { day: "الخميس 13", status: "متأخر", hours: "5.0", time: "08:40 — 13:40" },
  { day: "الأربعاء 12", status: "غائب", hours: "0", time: "—" },
];

export const skills = [
  { name: "استقبال الوصفة والتحقق منها", value: 100 },
  { name: "الاستشارة الدوائية للمريض", value: 80 },
  { name: "حسابات الجرعات", value: 65 },
  { name: "إدارة المخزون والصلاحية", value: 45 },
  { name: "التحضير الصيدلاني", value: 20 },
];

export const messages = [
  { id: "khaled", name: "د. خالد بن عمران", role: "مشرف تدريب", last: "أراك غدًا في الصيدلية، لا تنسَ المعطف.", time: "09:12", unread: 2 },
  { id: "nahda", name: "صيدلية النهضة", role: "جهة تدريب", last: "تم تحديث جدول الأسبوع القادم.", time: "أمس", unread: 0 },
  { id: "support", name: "دعم فارما ترين", role: "الدعم الفني", last: "تم إصدار شهادتك بنجاح 🎉", time: "الأحد", unread: 0 },
];

export const chat = [
  { me: false, text: "صباح الخير أمينة، جاهزة لمناوبة اليوم؟", time: "08:41" },
  { me: true, text: "صباح النور دكتور، جاهزة. سأصل قبل الثامنة.", time: "08:44" },
  { me: false, text: "ممتاز. اليوم سنركز على الاستشارة الدوائية لمرضى الضغط.", time: "08:45" },
  { me: true, text: "تمام، حضّرت ملاحظات عن مثبطات الإنزيم المحول.", time: "08:47" },
];

export const certificates = [
  { id: "cert-1", title: "إتمام التدريب العملي — المستوى الأول", issuer: "صيدلية النهضة", date: "12 يوليو 2026", hours: "160 ساعة", code: "PTL-2026-0431" },
  { id: "cert-2", title: "الاستخدام الرشيد للمضادات الحيوية", issuer: "المركز الوطني للأدوية", date: "3 مايو 2026", hours: "12 ساعة", code: "PTL-2026-0188" },
];

export const roles = [
  { id: "student", label: "طالب صيدلة", desc: "تدريب عملي، دورات، شهادات", href: "/student" as const },
  { id: "pharmacy", label: "صيدلية", desc: "استقبال المتدربين وإدارة المقاعد", href: "/pharmacy" as const },
  { id: "supervisor", label: "مشرف تدريب", desc: "متابعة وتقييم الطلاب", href: "/supervisor" as const },
  { id: "company", label: "شركة أدوية", desc: "دورات، ورش، محتوى تعليمي", href: "/company" as const },
  { id: "admin", label: "مدير النظام", desc: "لوحة تحكم كاملة للمنصة", href: "/admin" as const },
];
