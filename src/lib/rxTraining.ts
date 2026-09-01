/**
 * الروشتات التدريبية: تدريبات مدمجة + تدريبات يضيفها الأدمن (تُخزن محليًا في هذه المرحلة).
 * البنية مطابقة لما ستحتاجه قاعدة البيانات لاحقًا (prescriptions + prescription_images + prescription_answers).
 */
import { useCallback, useEffect, useState } from "react";
import { prescriptions } from "@/lib/prescriptions";

export type RxLevel = "مبتدئ" | "متوسط" | "متقدم";

export type RxTraining = {
  id: string;
  title: string;
  description: string;
  image: string; // رابط الصورة أو Data URL
  level: RxLevel;
  drugName: string;
  generic: string;
  strength: string;
  form: string;
  dose: string;
  frequency: string;
  duration: string;
  quantity: string;
  instructions: string;
  modelAnswer: string;
  explanation: string;
  notes: string;
  published: boolean;
  featured: boolean;
  order: number;
  builtin?: boolean;
  createdAt: number;
};

const levelMap: Record<string, RxLevel> = { Beginner: "مبتدئ", Intermediate: "متوسط", Advanced: "متقدم" };

/** تدريبات مدمجة مستخرجة من حالات الوصفات الحالية (لا تُحذف ولا تُعدّل). */
export const builtinTrainings: RxTraining[] = prescriptions.map((p, i) => {
  const first = p.lines[0]!;
  return {
    id: p.id,
    title: p.code,
    description: p.context,
    image: p.image,
    level: levelMap[p.level] ?? "مبتدئ",
    drugName: first.drug,
    generic: first.drug,
    strength: first.strength,
    form: "حسب الوصفة",
    dose: first.dose,
    frequency: first.frequency,
    duration: first.duration,
    quantity: `${p.lines.length} دواء في الوصفة`,
    instructions: first.note ?? "حسب تعليمات الطبيب",
    modelAnswer: p.lines
      .map((l) => `${l.drug} ${l.strength} — ${l.dose} ${l.frequency} لمدة ${l.duration}`)
      .join(" | "),
    explanation: p.reviewNote,
    notes: p.hint,
    published: true,
    featured: i === 0,
    order: i + 1,
    builtin: true,
    createdAt: 0,
  };
});

/* ------------------------------ التخزين المحلي ------------------------------ */

const KEY = "pharmatrain:rx-training:v1";
const listeners = new Set<(v: RxTraining[]) => void>();

function read(): RxTraining[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as RxTraining[]) : [];
  } catch {
    return [];
  }
}

function write(items: RxTraining[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l(items));
}

export type RxDraft = Omit<RxTraining, "id" | "createdAt" | "builtin">;

export function emptyDraft(order = 1): RxDraft {
  return {
    title: "",
    description: "",
    image: "",
    level: "مبتدئ",
    drugName: "",
    generic: "",
    strength: "",
    form: "",
    dose: "",
    frequency: "",
    duration: "",
    quantity: "",
    instructions: "",
    modelAnswer: "",
    explanation: "",
    notes: "",
    published: false,
    featured: false,
    order,
  };
}

export function useRxTrainings() {
  const [custom, setCustom] = useState<RxTraining[]>([]);

  useEffect(() => {
    setCustom(read());
    const l = (v: RxTraining[]) => setCustom(v);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const add = useCallback((draft: RxDraft) => {
    const item: RxTraining = { ...draft, id: `rx-${Date.now()}`, createdAt: Date.now() };
    write([...read(), item]);
    return item.id;
  }, []);

  const update = useCallback((id: string, patch: Partial<RxDraft>) => {
    write(read().map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x.id !== id));
  }, []);

  const move = useCallback((id: string, dir: -1 | 1) => {
    const list = [...read()].sort((a, b) => a.order - b.order);
    const i = list.findIndex((x) => x.id === id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= list.length) return;
    const a = list[i]!;
    const b = list[j]!;
    const ao = a.order;
    a.order = b.order;
    b.order = ao;
    write(list);
  }, []);

  const all = [...builtinTrainings, ...custom].sort((a, b) => a.order - b.order);
  const published = all.filter((x) => x.published);

  return { custom, all, published, add, update, remove, move };
}

/* ------------------------------ التحقق من الصور ------------------------------ */

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png"];
export const MAX_IMAGE_MB = 5;

export function validateImageFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const okExt = ["jpg", "jpeg", "png"].includes(ext);
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase()) && !okExt) {
    return "صيغة غير مدعومة. الصيغ المسموحة: JPG، JPEG، PNG فقط.";
  }
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    return `حجم الصورة كبير (${(file.size / 1024 / 1024).toFixed(1)} ميغابايت). الحد الأقصى ${MAX_IMAGE_MB} ميغابايت.`;
  }
  if (file.size === 0) return "الملف فارغ أو تالف. اختر صورة أخرى.";
  return null;
}

/** يقرأ الصورة ويعيد Data URL مع تصغير أبعادها للحفاظ على الأداء على الهاتف. */
export function readImageAsDataUrl(file: File, maxSide = 1400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("فشل قراءة الصورة. حاول مرة أخرى."));
    reader.onload = () => {
      const src = String(reader.result);
      const img = new Image();
      img.onerror = () => reject(new Error("تعذّر فتح الصورة. تأكد أنها صورة سليمة."));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        if (scale === 1 && src.length < 900_000) return resolve(src);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(src);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

/* ------------------------------ تقييم إجابة الطالب ------------------------------ */

export const rxFields = [
  { key: "drugName", label: "اسم الدواء" },
  { key: "generic", label: "الاسم العلمي" },
  { key: "strength", label: "التركيز" },
  { key: "form", label: "الشكل الصيدلاني" },
  { key: "dose", label: "الجرعة" },
  { key: "frequency", label: "عدد مرات الاستخدام" },
  { key: "duration", label: "مدة العلاج" },
  { key: "quantity", label: "الكمية" },
  { key: "instructions", label: "تعليمات الاستخدام" },
] as const;

export type RxFieldKey = (typeof rxFields)[number]["key"];
export type RxAnswers = Record<RxFieldKey, string>;

export const emptyAnswers: RxAnswers = {
  drugName: "",
  generic: "",
  strength: "",
  form: "",
  dose: "",
  frequency: "",
  duration: "",
  quantity: "",
  instructions: "",
};

const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/[ىي]/g, "ي")
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, " ")
    .trim();

export function checkRxField(student: string, expected: string): boolean {
  const a = norm(student);
  const b = norm(expected);
  if (!a || !b) return false;
  if (a === b) return true;
  const aw = a.split(" ").filter((w) => w.length > 1);
  const bw = b.split(" ").filter((w) => w.length > 1);
  if (!bw.length) return false;
  const hit = bw.filter((w) => aw.some((x) => x.includes(w) || w.includes(x))).length;
  return hit / bw.length >= 0.6;
}
