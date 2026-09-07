/**
 * بيانات لوحة الإدارة — مجموعات قابلة للتعديل تُخزن محليًا وتُزرع من محتوى المنصة الحالي.
 * كل مجموعة لها نفس شكل جداول قاعدة البيانات المستقبلية (id + حقول + حالة نشر).
 */
import { useCallback, useEffect, useState } from "react";
import { drugs } from "@/lib/drugs";
import { clinicalCases } from "@/lib/cases";
import { modules } from "@/lib/curriculum";
import { platformNotifications } from "@/lib/notifications";
import { logActivity } from "@/lib/adminAuth";

const PREFIX = "pcl:admin:";

type Row = { id: string };

const listeners = new Map<string, Set<(rows: unknown[]) => void>>();

function readRaw<T extends Row>(key: string, seed: () => T[]): T[] {
  if (typeof window === "undefined") return seed();
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (raw) return JSON.parse(raw) as T[];
  } catch {
    /* ignore */
  }
  const seeded = seed();
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(seeded));
  } catch {
    /* ignore */
  }
  return seeded;
}

function writeRaw<T extends Row>(key: string, rows: T[]) {
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
  listeners.get(key)?.forEach((l) => l(rows));
}

export function useCollection<T extends Row>(key: string, seed: () => T[]) {
  const [items, setItems] = useState<T[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setItems(readRaw<T>(key, seed));
    setReady(true);
    const set = listeners.get(key) ?? new Set();
    const l = (rows: unknown[]) => setItems(rows as T[]);
    set.add(l);
    listeners.set(key, set);
    return () => {
      set.delete(l);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const add = useCallback(
    (row: Omit<T, "id"> & { id?: string }, label = "عنصر") => {
      const id = row.id ?? `${key}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const next = [{ ...(row as T), id }, ...readRaw<T>(key, seed)];
      writeRaw(key, next);
      logActivity("إضافة", label);
      return id;
    },
    [key, seed],
  );

  const update = useCallback(
    (id: string, patch: Partial<T>, label = "عنصر") => {
      writeRaw(
        key,
        readRaw<T>(key, seed).map((x) => (x.id === id ? { ...x, ...patch } : x)),
      );
      logActivity("تعديل", label);
    },
    [key, seed],
  );

  const remove = useCallback(
    (id: string, label = "عنصر") => {
      writeRaw(
        key,
        readRaw<T>(key, seed).filter((x) => x.id !== id),
      );
      logActivity("حذف", label);
    },
    [key, seed],
  );

  const removeMany = useCallback(
    (ids: string[], label = "عناصر") => {
      writeRaw(
        key,
        readRaw<T>(key, seed).filter((x) => !ids.includes(x.id)),
      );
      logActivity("حذف متعدد", `${label} (${ids.length})`);
    },
    [key, seed],
  );

  const replaceAll = useCallback(
    (rows: T[], label = "استيراد") => {
      writeRaw(key, rows);
      logActivity("استيراد", label);
    },
    [key],
  );

  const reset = useCallback(() => {
    writeRaw(key, seed());
    logActivity("استعادة البيانات الأصلية", key);
  }, [key, seed]);

  return { items, ready, add, update, remove, removeMany, replaceAll, reset };
}

/* ------------------------- الأنواع ------------------------- */

export type AdminStudent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  university: string;
  year: string;
  joinedAt: number;
  status: "active" | "inactive";
  role: "student" | "admin";
  progress: number;
  lessonsDone: number;
  quizzes: number;
  avgScore: number;
  casesDone: number;
  lastActive: number;
  weakTopics: string[];
};

export type AdminLesson = { id: string; title: string; minutes: number; order: number; status: "published" | "draft" };
export type AdminModule = { id: string; title: string; desc: string; order: number; lessons: AdminLesson[] };
export type AdminCourse = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  instructor: string;
  duration: string;
  status: "published" | "draft";
  order: number;
  modules: AdminModule[];
};

export type AdminMedication = {
  id: string;
  brand: string;
  generic: string;
  ingredient: string;
  therapeuticClass: string;
  pharmClass: string;
  form: string;
  strength: string;
  route: string;
  indications: string;
  contraindications: string;
  sideEffects: string;
  seriousSideEffects: string;
  interactions: string;
  warnings: string;
  storage: string;
  pregnancy: string;
  counseling: string;
  notes: string;
  reference: string;
  category: string;
  image: string;
  active: boolean;
};

export type AdminCategory = { id: string; name: string; en: string; order: number; active: boolean };

export type AdminCase = {
  id: string;
  title: string;
  age: string;
  gender: string;
  symptoms: string;
  history: string;
  currentMeds: string;
  diagnosis: string;
  labs: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  learningPoints: string;
  references: string;
  level: "مبتدئ" | "متوسط" | "متقدم";
  status: "published" | "draft";
};

export type AdminQuiz = {
  id: string;
  title: string;
  topic: string;
  questionCount: number;
  minutes: number;
  passScore: number;
  randomize: boolean;
  status: "published" | "draft";
  createdAt: number;
};

export type AdminNotification = {
  id: string;
  title: string;
  message: string;
  link: string;
  target: "all" | "group" | "one";
  targetValue: string;
  status: "sent" | "draft";
  at: number;
};

export type AdminContentPage = { id: string; key: string; title: string; body: string; updatedAt: number };

export type AdminSettings = {
  platformName: string;
  logo: string;
  description: string;
  passScore: number;
  quizMinutes: number;
  lessonsPerModule: number;
  notifyEmail: boolean;
  notifyInApp: boolean;
  sessionHours: number;
  minPasswordLength: number;
  adminOnlyInvite: boolean;
};

/* ------------------------- الزرع ------------------------- */

const day = 86_400_000;

const seedNames = [
  ["أحمد المبروك", "ahmed@student.ly", "طرابلس", "الرابعة"],
  ["فاطمة الزهراء", "fatima@student.ly", "بنغازي", "الثالثة"],
  ["محمد الورفلي", "mohamed@student.ly", "مصراتة", "الخامسة"],
  ["سلمى القذافي", "salma@student.ly", "طرابلس", "الثانية"],
  ["يوسف بن علي", "youssef@student.ly", "الزاوية", "الرابعة"],
  ["مريم الشريف", "mariam@student.ly", "سبها", "الثالثة"],
  ["علي المصراتي", "ali@student.ly", "مصراتة", "الخامسة"],
  ["هدى العبيدي", "huda@student.ly", "بنغازي", "الأولى"],
];

export const seedStudents = (): AdminStudent[] =>
  seedNames.map((row, i) => {
    const progress = [82, 64, 91, 35, 58, 47, 76, 12][i] ?? 40;
    return {
      id: `stu-${i + 1}`,
      name: row[0] ?? "طالب",
      email: row[1] ?? "",
      phone: `+2189${(1000000 + i * 13571).toString().slice(0, 7)}`,
      university: `كلية الصيدلة — ${row[2] ?? ""}`,
      year: `السنة ${row[3] ?? "الأولى"}`,
      joinedAt: Date.now() - (i + 2) * 9 * day,
      status: i === 7 ? "inactive" : "active",
      role: "student",
      progress,
      lessonsDone: Math.round((progress / 100) * 120),
      quizzes: 2 + i,
      avgScore: 55 + ((i * 7) % 40),
      casesDone: i % 5,
      lastActive: Date.now() - i * day,
      weakTopics: [["الضغط"], ["السكري"], [], ["المسكنات", "الدهون"], ["الهضمي"], ["الموضعية"], [], ["المسكنات"]][i] ?? [],
    };
  });

export const seedCourses = (): AdminCourse[] => [
  {
    id: "course-core",
    title: "منهج الصيدلة السريرية — WHO ATC",
    description: "منهج متكامل من 16 وحدة يغطي المجموعات الدوائية وفق تصنيف WHO ATC مع دروس تطبيقية للصيدلي.",
    thumbnail: "",
    category: "صيدلة سريرية",
    level: "متوسط",
    instructor: "هيئة التدريب — Pharma Connect Libya",
    duration: "24 ساعة",
    status: "published",
    order: 1,
    modules: modules.map((m, i) => ({
      id: m.id,
      title: `${m.code} — ${m.title}`,
      desc: m.desc,
      order: i + 1,
      lessons: m.lessons.map((l, j) => ({ id: l.id, title: l.title, minutes: l.minutes, order: j + 1, status: "published" as const })),
    })),
  },
];

export const seedMedications = (): AdminMedication[] =>
  drugs.map((d) => ({
    id: d.id,
    brand: d.brands.join(", "),
    generic: d.name,
    ingredient: d.name,
    therapeuticClass: d.className,
    pharmClass: d.className,
    form: d.forms.join(", "),
    strength: d.strengths.join(", "),
    route: d.route,
    indications: d.uses.join(" • "),
    contraindications: d.contraindications.join(" • "),
    sideEffects: d.sideEffects.join(" • "),
    seriousSideEffects: d.referral.join(" • "),
    interactions: d.interactions.join(" • "),
    warnings: d.doses.notes.join(" • "),
    storage: "يُحفظ في مكان جاف بعيدًا عن الحرارة والضوء وبعيدًا عن متناول الأطفال.",
    pregnancy: d.pregnancy,
    counseling: d.counselling.join(" • "),
    notes: d.subtitle,
    reference: d.source,
    category: d.className.split("•")[0]?.trim() ?? "عام",
    image: "",
    active: true,
  }));

export const seedCategories = (): AdminCategory[] =>
  [
    ["أمراض القلب والأوعية", "Cardiovascular"],
    ["الجهاز الهضمي", "Gastrointestinal"],
    ["السكري", "Diabetes"],
    ["الجهاز التنفسي", "Respiratory"],
    ["المضادات الحيوية", "Antibiotics"],
    ["الجهاز العصبي", "CNS"],
    ["الأمراض الجلدية", "Dermatology"],
    ["الفيتامينات والمكملات", "Vitamins & Supplements"],
    ["المسكنات", "Analgesics"],
    ["مضادات الهيستامين", "Antihistamines"],
    ["اضطرابات الدهون", "Lipids"],
  ].map(([name, en], i) => ({ id: `cat-${i + 1}`, name: name ?? "", en: en ?? "", order: i + 1, active: true }));

export const seedCases = (): AdminCase[] =>
  clinicalCases.map((c) => ({
    id: c.id,
    title: c.title,
    age: c.age,
    gender: c.gender ?? "غير محدد",
    symptoms: c.symptoms.join(" • "),
    history: (c.history ?? []).join(" • "),
    currentMeds: (c.currentDrugs ?? []).map((d) => d.text).join(" • "),
    diagnosis: c.topic,
    labs: "",
    question: c.question,
    options: c.options,
    answer: c.answer,
    explanation: c.explanation,
    learningPoints: c.pharmacology,
    references: "WHO ATC / مراجع الصيدلة السريرية",
    level: c.level,
    status: "published",
  }));

export const seedQuizzes = (): AdminQuiz[] => [
  {
    id: "quiz-analgesics",
    title: "اختبار المسكنات",
    topic: "analgesics",
    questionCount: 10,
    minutes: 15,
    passScore: 60,
    randomize: true,
    status: "published",
    createdAt: Date.now() - 12 * day,
  },
  {
    id: "quiz-diabetes",
    title: "اختبار أدوية السكري",
    topic: "diabetes",
    questionCount: 10,
    minutes: 15,
    passScore: 70,
    randomize: true,
    status: "draft",
    createdAt: Date.now() - 4 * day,
  },
];

export const seedNotifications = (): AdminNotification[] =>
  platformNotifications.map((n, i) => ({
    id: n.id,
    title: n.title,
    message: n.body,
    link: "",
    target: "all",
    targetValue: "",
    status: "sent",
    at: Date.now() - i * day,
  }));

export const seedContent = (): AdminContentPage[] =>
  [
    ["about", "عن المنصة", "منصة Pharma Connect Libya تربط طلاب الصيدلة في ليبيا بالتدريب العملي والمحتوى التعليمي الموثوق."],
    ["faq", "الأسئلة الشائعة", "كيف أبدأ؟ سجّل حسابك ثم ابدأ من مركز التدريب.\nهل المحتوى مجاني؟ نعم، المحتوى التعليمي متاح لطلاب الصيدلة."],
    ["tips", "نصائح تعليمية", "راجع بطاقة الدواء قبل حل الأسئلة، ثم طبّق ما تعلمته في محاكي الوصفات."],
    ["announcements", "الإعلانات", "تابع الإشعارات لمعرفة الوحدات والحالات الجديدة."],
    ["terms", "الشروط والأحكام", "المحتوى تعليمي فقط وليس بديلًا عن وصف الطبيب أو المراجع الدوائية الرسمية."],
    ["privacy", "سياسة الخصوصية", "نحتفظ ببيانات التقدم لأغراض تعليمية فقط ولا نشاركها مع أطراف خارجية."],
  ].map(([key, title, body], i) => ({ id: `content-${i + 1}`, key: key ?? "", title: title ?? "", body: body ?? "", updatedAt: Date.now() }));

export const defaultSettings: AdminSettings = {
  platformName: "Pharma Connect Libya",
  logo: "",
  description: "منصة تعليم وتدريب طلاب الصيدلة في ليبيا",
  passScore: 60,
  quizMinutes: 15,
  lessonsPerModule: 8,
  notifyEmail: false,
  notifyInApp: true,
  sessionHours: 12,
  minPasswordLength: 8,
  adminOnlyInvite: true,
};

const SETTINGS_KEY = PREFIX + "settings:v1";
const settingsListeners = new Set<(s: AdminSettings) => void>();

export function useAdminSettings() {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SETTINGS_KEY);
      if (raw) setSettings({ ...defaultSettings, ...(JSON.parse(raw) as Partial<AdminSettings>) });
    } catch {
      /* ignore */
    }
    const l = (s: AdminSettings) => setSettings(s);
    settingsListeners.add(l);
    return () => {
      settingsListeners.delete(l);
    };
  }, []);

  const save = useCallback((patch: Partial<AdminSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
      } catch {
        /* ignore */
      }
      settingsListeners.forEach((l) => l(next));
      return next;
    });
    logActivity("تعديل الإعدادات", "إعدادات النظام");
  }, []);

  return { settings, save };
}
