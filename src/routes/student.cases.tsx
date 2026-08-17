import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Stethoscope, CheckCircle2, Clock } from "lucide-react";
import { ActionButton, AppBar, Chip, Screen, Tabs } from "@/components/kit";
import { clinicalCases } from "@/lib/mock";

export const Route = createFileRoute("/student/cases")({
  head: () => ({
    meta: [
      { title: "الحالات السريرية — PharmaTrain Libya" },
      { name: "description", content: "حالات سريرية واقعية بإشراف صيادلة، مع أسئلة تحليلية وتقييم." },
      { property: "og:title", content: "الحالات السريرية — فارما ترين" },
      { property: "og:description", content: "تدرّب على حالات حقيقية بإشراف مباشر." },
    ],
  }),
  component: Cases,
});

function Cases() {
  const [tab, setTab] = useState("الكل");
  const [open, setOpen] = useState<string | null>(null);
  const list =
    tab === "الكل" ? clinicalCases : clinicalCases.filter((c) => (tab === "مسلّمة" ? c.solved : !c.solved));
  const active = clinicalCases.find((c) => c.id === open);

  if (active) {
    return (
      <div>
        <AppBar title="تفاصيل الحالة" subtitle={active.supervisor} back="/student/cases" />
        <Screen className="space-y-4">
          <button onClick={() => setOpen(null)} className="text-xs font-bold text-primary">
            رجوع لقائمة الحالات
          </button>
          <div className="surface-card space-y-3 p-4">
            <Chip tone="primary">{active.level}</Chip>
            <h2 className="text-base font-extrabold leading-snug">{active.title}</h2>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              مريض عمره 58 عامًا، مصاب بالسكري من النوع الثاني منذ 12 سنة، يعاني من ارتفاع الكرياتينين
              ويستخدم ميتفورمين 1000 ملغ مرتين يوميًا. راجع الصيدلية بشكوى غثيان وإرهاق.
            </p>
          </div>
          <div className="surface-card space-y-3 p-4">
            <p className="text-xs font-bold">أسئلة التحليل</p>
            {[
              "هل يُعد الميتفورمين مناسبًا مع هذا المعدل من الترشيح الكلوي؟",
              "ما البديل الدوائي الذي تقترحه ولماذا؟",
              "ما نصائح التوعية الدوائية للمريض؟",
            ].map((q, i) => (
              <label key={q} className="block space-y-1.5">
                <span className="text-[11px] font-semibold">
                  <span className="latin">{i + 1}.</span> {q}
                </span>
                <textarea
                  rows={3}
                  placeholder="اكتب إجابتك…"
                  className="w-full rounded-2xl border border-input bg-card p-3 text-xs outline-none focus:border-primary"
                />
              </label>
            ))}
          </div>
          <ActionButton>إرسال الإجابات للمشرف</ActionButton>
        </Screen>
      </div>
    );
  }

  return (
    <div>
      <AppBar title="الحالات السريرية" subtitle={`${clinicalCases.length} حالة متاحة`} back="/student" />
      <Screen className="space-y-4">
        <Tabs items={["الكل", "معلّقة", "مسلّمة"]} active={tab} onChange={setTab} />
        <div className="space-y-3">
          {list.map((c) => (
            <button key={c.id} onClick={() => setOpen(c.id)} className="surface-card flex w-full gap-3 p-4 text-start">
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${
                  c.solved ? "bg-secondary-soft text-secondary" : "bg-primary-soft text-primary"
                }`}
              >
                {c.solved ? <CheckCircle2 className="size-5" /> : <Stethoscope className="size-5" />}
              </span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <p className="text-xs font-bold leading-snug">{c.title}</p>
                <p className="text-[11px] text-muted-foreground">{c.supervisor}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={c.level === "متقدم" ? "error" : c.level === "متوسط" ? "warning" : "secondary"}>
                    {c.level}
                  </Chip>
                  <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="size-3" /> {c.due}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Screen>
    </div>
  );
}
