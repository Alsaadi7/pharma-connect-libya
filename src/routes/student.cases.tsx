import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, AlertTriangle, ChevronLeft } from "lucide-react";
import { ActionButton, AppBar, Chip, Screen, Tabs } from "@/components/kit";
import { DrugLink } from "@/components/DrugCard";
import { SaveButton } from "@/components/SaveButton";
import { clinicalCases } from "@/lib/cases";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/cases")({
  head: () => ({
    meta: [
      { title: "الحالات السريرية — PharmaTrain Libya" },
      {
        name: "description",
        content: "حالات سريرية تعليمية مبسطة: الأعراض، التاريخ الدوائي، السؤال التحليلي، والتفسير الدوائي.",
      },
      { property: "og:title", content: "الحالات السريرية — فارما ترين ليبيا" },
      { property: "og:description", content: "تدرّب على التفكير الصيدلاني في حالات واقعية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Cases,
});

const tabs = ["الكل", "مبتدئ", "متوسط", "متقدم"];

function Cases() {
  const [tab, setTab] = useState("الكل");
  const [open, setOpen] = useState<string | null>(null);
  const [picked, setPicked] = useState<number | null>(null);
  const { state, markCaseSolved } = useStore();

  const list = tab === "الكل" ? clinicalCases : clinicalCases.filter((c) => c.level === tab);
  const active = clinicalCases.find((c) => c.id === open);

  if (active) {
    const correct = picked !== null && picked === active.answer;
    return (
      <div>
        <AppBar title={active.topic} subtitle={active.level} back="/student/cases" />
        <Screen className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setOpen(null);
              setPicked(null);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary"
          >
            <ChevronLeft className="size-3.5 rtl:rotate-180" /> رجوع لقائمة الحالات
          </button>

          <div className="surface-card space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-base font-extrabold leading-snug">{active.title}</h2>
              <SaveButton
                itemType="clinical_case"
                itemId={active.id}
                title={active.title}
                subtitle={`حالة سريرية — ${active.topic}`}
                compact
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Chip tone="primary">{active.age}</Chip>
              {active.gender ? <Chip>{active.gender}</Chip> : null}
              <Chip tone="secondary">{active.topic}</Chip>
            </div>
          </div>

          <div className="surface-card space-y-2 p-4">
            <p className="text-xs font-bold">الأعراض</p>
            <ul className="space-y-1.5">
              {active.symptoms.map((s) => (
                <li key={s} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" /> {s}
                </li>
              ))}
            </ul>
          </div>

          {active.history?.length ? (
            <div className="surface-card space-y-2 p-4">
              <p className="text-xs font-bold">التاريخ المرضي</p>
              <ul className="space-y-1.5">
                {active.history.map((s) => (
                  <li key={s} className="text-[11px] leading-relaxed text-muted-foreground">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {active.currentDrugs?.length ? (
            <div className="surface-card space-y-2 p-4">
              <p className="text-xs font-bold">الأدوية الحالية</p>
              <div className="flex flex-wrap gap-2">
                {active.currentDrugs.map((d) =>
                  d.drugId ? (
                    <DrugLink key={d.text} drugId={d.drugId} label={d.text} />
                  ) : (
                    <span key={d.text} className="rounded-xl bg-muted px-2.5 py-1.5 text-[11px] font-semibold">
                      {d.text}
                    </span>
                  ),
                )}
              </div>
            </div>
          ) : null}

          {active.redFlags?.length ? (
            <div className="surface-card space-y-2 border-warning/40 p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-warning">
                <AlertTriangle className="size-4" /> علامات تستدعي الإحالة للطبيب
              </p>
              <ul className="space-y-1.5">
                {active.redFlags.map((s) => (
                  <li key={s} className="text-[11px] leading-relaxed text-muted-foreground">
                    • {s}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="surface-card space-y-3 p-4">
            <p className="text-xs font-bold leading-relaxed">{active.question}</p>
            <div className="space-y-2">
              {active.options.map((o, idx) => {
                const s =
                  picked === null ? "idle" : idx === active.answer ? "right" : idx === picked ? "wrong" : "idle";
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => {
                      setPicked(idx);
                      markCaseSolved(active.id);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start text-xs font-semibold",
                      s === "idle" && "border-border bg-card",
                      s === "right" && "border-secondary bg-secondary-soft text-secondary",
                      s === "wrong" && "border-destructive bg-destructive-soft text-destructive",
                    )}
                  >
                    <span className="flex-1">{o}</span>
                    {s === "right" ? <CheckCircle2 className="size-4" /> : null}
                    {s === "wrong" ? <XCircle className="size-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>

          {picked !== null ? (
            <div className="surface-card space-y-3 p-4">
              <p className={cn("text-xs font-bold", correct ? "text-secondary" : "text-destructive")}>
                {correct ? "إجابة صحيحة" : "راجع التفسير التالي"}
              </p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">{active.explanation}</p>
              <div className="rounded-2xl bg-primary-soft p-3.5">
                <p className="text-[11px] font-bold text-primary">التفسير الدوائي</p>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{active.pharmacology}</p>
              </div>
              {active.relatedDrugs.length ? (
                <div className="flex flex-wrap gap-2">
                  {active.relatedDrugs.map((d) => (
                    <DrugLink key={d} drugId={d} />
                  ))}
                </div>
              ) : null}
              <ActionButton
                variant="outline"
                onClick={() => {
                  setOpen(null);
                  setPicked(null);
                }}
              >
                حالة أخرى
              </ActionButton>
            </div>
          ) : null}

          <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
            هذه الحالات تعليمية ولا تُعد بديلًا عن التشخيص الطبي.
          </p>
        </Screen>
      </div>
    );
  }

  return (
    <div>
      <AppBar title="الحالات السريرية" subtitle={`${clinicalCases.length} حالة تعليمية`} back="/student" />
      <Screen className="space-y-4">
        <Tabs items={tabs} active={tab} onChange={setTab} />
        <div className="space-y-2.5">
          {list.map((c) => {
            const solved = state.solvedCases.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setOpen(c.id);
                  setPicked(null);
                }}
                className="surface-card flex w-full items-center gap-3 p-4 text-start"
              >
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-2xl text-[11px] font-bold",
                    solved ? "bg-secondary-soft text-secondary" : "bg-primary-soft text-primary",
                  )}
                >
                  {solved ? <CheckCircle2 className="size-4.5" /> : c.topic.slice(0, 2)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{c.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {c.topic} · {c.age}
                  </p>
                </div>
                <Chip tone={c.level === "متقدم" ? "warning" : c.level === "متوسط" ? "primary" : "secondary"}>
                  {c.level}
                </Chip>
              </button>
            );
          })}
        </div>
      </Screen>
    </div>
  );
}
