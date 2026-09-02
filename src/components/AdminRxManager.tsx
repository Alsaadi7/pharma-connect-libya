/** لوحة الأدمن: إدارة صور الروشتات التدريبية + إضافة أسئلة التدريب. */
import { useState } from "react";
import { ArrowDown, ArrowUp, Eye, EyeOff, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { ActionButton, Chip } from "@/components/kit";
import { ImageUpload } from "@/components/ImageTools";
import { emptyDraft, useRxTrainings, type RxDraft, type RxLevel } from "@/lib/rxTraining";
import { topics, type TopicId, type TopicQuestionKind } from "@/lib/drugTopics";
import { emptyQuestionDraft, useQuestionBank, type QuestionDraft } from "@/lib/questionStore";
import { drugs } from "@/lib/drugs";
import { cn } from "@/lib/utils";

const inputCls = "h-11 w-full rounded-2xl border border-input bg-card px-4 text-sm outline-none focus:border-primary";
const areaCls = "min-h-20 w-full rounded-2xl border border-input bg-card p-3 text-sm outline-none focus:border-primary";
const levels: RxLevel[] = ["مبتدئ", "متوسط", "متقدم"];

const rxTextFields: { key: keyof RxDraft; label: string; area?: boolean }[] = [
  { key: "title", label: "عنوان الروشتة" },
  { key: "description", label: "وصف مختصر", area: true },
  { key: "drugName", label: "اسم الدواء" },
  { key: "generic", label: "الاسم العلمي" },
  { key: "strength", label: "التركيز" },
  { key: "form", label: "الشكل الصيدلاني" },
  { key: "dose", label: "الجرعة" },
  { key: "frequency", label: "عدد مرات الاستخدام" },
  { key: "duration", label: "مدة العلاج" },
  { key: "quantity", label: "الكمية" },
  { key: "instructions", label: "تعليمات الاستخدام" },
  { key: "modelAnswer", label: "الحل النموذجي الكامل", area: true },
  { key: "explanation", label: "التفسير التعليمي", area: true },
  { key: "notes", label: "ملاحظات / تلميح", area: true },
];

export function AdminRxManager() {
  const { all, custom, add, update, remove, move } = useRxTrainings();
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<RxDraft>(emptyDraft());
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "hidden">("all");
  const [err, setErr] = useState<string | null>(null);

  const list = all.filter((x) => {
    if (filter === "published" && !x.published) return false;
    if (filter === "hidden" && x.published) return false;
    const s = q.trim().toLowerCase();
    return !s || [x.title, x.drugName, x.generic, x.level].some((v) => v.toLowerCase().includes(s));
  });

  const startNew = () => {
    setDraft(emptyDraft(custom.length + all.length + 1));
    setEditing("new");
    setErr(null);
  };
  const startEdit = (id: string) => {
    const x = all.find((y) => y.id === id);
    if (!x) return;
    const { id: _i, createdAt: _c, builtin: _b, ...rest } = x;
    setDraft(rest);
    setEditing(id);
    setErr(null);
  };
  const save = () => {
    if (!draft.image) return setErr("صورة الروشتة مطلوبة.");
    if (!draft.title.trim() || !draft.drugName.trim() || !draft.generic.trim()) {
      return setErr("العنوان واسم الدواء والاسم العلمي حقول مطلوبة.");
    }
    if (editing === "new") add(draft);
    else if (editing) update(editing, draft);
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="surface-card space-y-3 p-4">
        <p className="text-xs font-bold">{editing === "new" ? "إضافة روشتة تدريبية" : "تعديل الروشتة"}</p>
        <ImageUpload value={draft.image} onChange={(v) => setDraft((d) => ({ ...d, image: v }))} />
        <label className="block space-y-1.5">
          <span className="text-[11px] font-semibold">مستوى الصعوبة</span>
          <div className="flex gap-2">
            {levels.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setDraft((d) => ({ ...d, level: l }))}
                className={cn(
                  "flex-1 rounded-2xl py-2.5 text-[11px] font-bold",
                  draft.level === l ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </label>
        {rxTextFields.map((f) => (
          <label key={f.key} className="block space-y-1.5">
            <span className="text-[11px] font-semibold">{f.label}</span>
            {f.area ? (
              <textarea
                value={String(draft[f.key])}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                className={areaCls}
              />
            ) : (
              <input
                value={String(draft[f.key])}
                onChange={(e) => setDraft((d) => ({ ...d, [f.key]: e.target.value }))}
                className={inputCls}
              />
            )}
          </label>
        ))}
        <div className="grid grid-cols-2 gap-2">
          <label className="flex items-center gap-2 rounded-2xl bg-muted p-3 text-[11px] font-bold">
            <input type="checkbox" checked={draft.published} onChange={(e) => setDraft((d) => ({ ...d, published: e.target.checked }))} />
            منشور للطلاب
          </label>
          <label className="flex items-center gap-2 rounded-2xl bg-muted p-3 text-[11px] font-bold">
            <input type="checkbox" checked={draft.featured} onChange={(e) => setDraft((d) => ({ ...d, featured: e.target.checked }))} />
            مميّز
          </label>
        </div>
        {err ? <p className="rounded-2xl bg-destructive/10 p-3 text-[11px] font-bold text-destructive">{err}</p> : null}
        <div className="flex gap-2">
          <ActionButton variant="outline" onClick={() => setEditing(null)}>
            إلغاء
          </ActionButton>
          <ActionButton onClick={save}>حفظ</ActionButton>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ActionButton onClick={startNew}>
        <Plus className="size-4" /> إضافة روشتة تدريبية
      </ActionButton>
      <label className="relative block">
        <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3.5" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="بحث بالعنوان أو الدواء…" className={cn(inputCls, "ps-10")} />
      </label>
      <div className="flex gap-2">
        {(
          [
            ["all", "الكل"],
            ["published", "منشور"],
            ["hidden", "مخفي"],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold",
              filter === k ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
            )}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {list.map((x) => (
          <div key={x.id} className="surface-card space-y-2.5 p-3">
            <div className="flex items-center gap-3">
              <span className="size-14 shrink-0 overflow-hidden rounded-xl bg-muted">
                {x.image ? <img src={x.image} alt={x.title} className="size-full object-cover" /> : null}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1 truncate text-xs font-bold">
                  {x.title} {x.featured ? <Star className="size-3.5 fill-warning text-warning" /> : null}
                </p>
                <p className="latin truncate text-[10px] text-muted-foreground">{x.generic}</p>
                <div className="mt-1 flex gap-1.5">
                  <Chip>{x.level}</Chip>
                  <Chip tone={x.published ? "secondary" : "warning"}>{x.published ? "منشور" : "مخفي"}</Chip>
                  {x.builtin ? <Chip tone="primary">مدمج</Chip> : null}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <IconBtn onClick={() => startEdit(x.id)} label="تعديل" icon={Pencil} disabled={!!x.builtin} />
              <IconBtn
                onClick={() => update(x.id, { published: !x.published })}
                label={x.published ? "إخفاء" : "نشر"}
                icon={x.published ? EyeOff : Eye}
                disabled={!!x.builtin}
              />
              <IconBtn onClick={() => update(x.id, { featured: !x.featured })} label="تمييز" icon={Star} disabled={!!x.builtin} />
              <IconBtn onClick={() => move(x.id, -1)} label="أعلى" icon={ArrowUp} disabled={!!x.builtin} />
              <IconBtn onClick={() => move(x.id, 1)} label="أسفل" icon={ArrowDown} disabled={!!x.builtin} />
              <IconBtn
                onClick={() => window.confirm("حذف هذه الروشتة نهائيًا؟") && remove(x.id)}
                label="حذف"
                icon={Trash2}
                disabled={!!x.builtin}
                danger
              />
            </div>
          </div>
        ))}
        {!list.length ? <p className="surface-card p-4 text-center text-[11px] text-muted-foreground">لا توجد نتائج.</p> : null}
      </div>
      <p className="px-1 text-[10px] text-muted-foreground">الروشتات المدمجة للعرض فقط؛ الروشتات المضافة قابلة للتعديل والنشر والحذف.</p>
    </div>
  );
}

function IconBtn({
  onClick,
  label,
  icon: Icon,
  disabled,
  danger,
}: {
  onClick: () => void;
  label: string;
  icon: typeof Pencil;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "inline-flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-[10px] font-bold disabled:opacity-40",
        danger ? "bg-destructive/10 text-destructive" : "bg-muted text-foreground",
      )}
    >
      <Icon className="size-3.5" /> {label}
    </button>
  );
}

/* ------------------------------ أسئلة التدريب ------------------------------ */

const kinds: TopicQuestionKind[] = [
  "الاسم العلمي",
  "التصنيف الدوائي",
  "الاستخدام",
  "آلية العمل",
  "الشكل الصيدلاني",
  "الجرعة",
  "الآثار الجانبية",
  "التحذيرات",
  "التداخلات الدوائية",
  "الأسماء التجارية",
  "قرار دوائي",
];

export function AdminQuestionManager() {
  const { custom, byTopic, add, update, remove } = useQuestionBank();
  const [open, setOpen] = useState(false);
  const [d, setD] = useState<QuestionDraft>(emptyQuestionDraft());
  const [err, setErr] = useState<string | null>(null);

  const save = () => {
    if (!d.text.trim()) return setErr("نص السؤال مطلوب.");
    if (d.options.filter((o) => o.trim()).length < 2) return setErr("أدخل خيارين على الأقل.");
    if (!d.options[d.answer]?.trim()) return setErr("حدد الإجابة الصحيحة من الخيارات المعبأة.");
    add({ ...d, options: d.options.filter((o) => o.trim()) });
    setD(emptyQuestionDraft(d.topic));
    setOpen(false);
    setErr(null);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2">
        {topics.map((t) => (
          <div key={t.id} className="surface-card p-2.5 text-center">
            <p className="text-lg">{t.emoji}</p>
            <p className="latin text-sm font-extrabold">{byTopic(t.id).length}</p>
            <p className="text-[9px] text-muted-foreground">{t.ar}</p>
          </div>
        ))}
      </div>

      {!open ? (
        <ActionButton onClick={() => setOpen(true)}>
          <Plus className="size-4" /> إضافة سؤال جديد
        </ActionButton>
      ) : (
        <div className="surface-card space-y-3 p-4">
          <p className="text-xs font-bold">سؤال جديد</p>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold">التصنيف</span>
            <select value={d.topic} onChange={(e) => setD((x) => ({ ...x, topic: e.target.value as TopicId }))} className={inputCls}>
              {topics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.emoji} {t.ar}
                </option>
              ))}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold">نوع السؤال</span>
              <select value={d.kind} onChange={(e) => setD((x) => ({ ...x, kind: e.target.value as TopicQuestionKind }))} className={inputCls}>
                {kinds.map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold">المستوى</span>
              <select value={d.level} onChange={(e) => setD((x) => ({ ...x, level: e.target.value as QuestionDraft["level"] }))} className={inputCls}>
                {["سهل", "متوسط", "متقدم"].map((k) => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold">الدواء المرتبط (اختياري)</span>
            <select value={d.drugId ?? ""} onChange={(e) => setD((x) => ({ ...x, drugId: e.target.value || undefined }))} className={cn(inputCls, "latin")}>
              <option value="">—</option>
              {drugs.map((dr) => (
                <option key={dr.id} value={dr.id}>
                  {dr.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold">نص السؤال</span>
            <textarea value={d.text} onChange={(e) => setD((x) => ({ ...x, text: e.target.value }))} className={areaCls} />
          </label>
          <div className="space-y-2">
            <span className="text-[11px] font-semibold">الخيارات (حدد الصحيح)</span>
            {d.options.map((o, i) => (
              <div key={i} className="flex items-center gap-2">
                <input type="radio" name="ans" checked={d.answer === i} onChange={() => setD((x) => ({ ...x, answer: i }))} />
                <input
                  value={o}
                  onChange={(e) =>
                    setD((x) => {
                      const options = [...x.options];
                      options[i] = e.target.value;
                      return { ...x, options };
                    })
                  }
                  placeholder={`الخيار ${String.fromCharCode(65 + i)}`}
                  className={inputCls}
                />
              </div>
            ))}
          </div>
          <label className="block space-y-1.5">
            <span className="text-[11px] font-semibold">التفسير</span>
            <textarea value={d.explanation} onChange={(e) => setD((x) => ({ ...x, explanation: e.target.value }))} className={areaCls} />
          </label>
          <label className="flex items-center gap-2 rounded-2xl bg-muted p-3 text-[11px] font-bold">
            <input type="checkbox" checked={d.published} onChange={(e) => setD((x) => ({ ...x, published: e.target.checked }))} />
            منشور للطلاب
          </label>
          {err ? <p className="rounded-2xl bg-destructive/10 p-3 text-[11px] font-bold text-destructive">{err}</p> : null}
          <div className="flex gap-2">
            <ActionButton variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </ActionButton>
            <ActionButton onClick={save}>حفظ السؤال</ActionButton>
          </div>
        </div>
      )}

      {custom.length ? (
        <div className="surface-card divide-y divide-border overflow-hidden">
          {custom.map((x) => (
            <div key={x.id} className="flex items-center gap-2 p-3">
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[11px] font-bold">{x.text}</p>
                <p className="text-[10px] text-muted-foreground">
                  {topics.find((t) => t.id === x.topic)?.ar} · {x.kind}
                </p>
              </div>
              <IconBtn onClick={() => update(x.id, { published: !x.published })} label={x.published ? "إخفاء" : "نشر"} icon={x.published ? EyeOff : Eye} />
              <IconBtn onClick={() => remove(x.id)} label="حذف" icon={Trash2} danger />
            </div>
          ))}
        </div>
      ) : (
        <p className="px-1 text-[10px] text-muted-foreground">لم تُضف أسئلة مخصصة بعد؛ الأسئلة المدمجة تظهر تلقائيًا للطلاب.</p>
      )}
    </div>
  );
}
