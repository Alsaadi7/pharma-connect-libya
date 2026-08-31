import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import { ActionButton, AppBar, Chip, Screen } from "@/components/kit";
import { SaveButton } from "@/components/SaveButton";
import { prescriptions } from "@/lib/prescriptions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/prescriptions")({
  head: () => ({
    meta: [
      { title: "محاكي قراءة الوصفات — PharmaTrain Libya" },
      {
        name: "description",
        content: "تدرّب على قراءة الوصفات الطبية بثلاث مستويات: استخرج اسم الدواء والجرعة وعدد المرات والمدة.",
      },
      { property: "og:title", content: "محاكي قراءة الوصفات — فارما ترين ليبيا" },
      { property: "og:description", content: "مهارة أساسية لكل طالب صيدلة: قراءة الوصفة بدقة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Prescriptions,
});

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, " ");

function Prescriptions() {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const rx = prescriptions[idx]!;
  const results = rx.lines.map((l, i) => norm(answers[i] ?? "") === norm(l.drug));
  const score = results.filter(Boolean).length;

  const pick = (i: number) => {
    setIdx(i);
    setAnswers([]);
    setChecked(false);
    setShowHint(false);
  };

  return (
    <div>
      <AppBar title="محاكي قراءة الوصفات" subtitle={rx.code} back="/student" />
      <Screen className="space-y-4">
        <div className="flex gap-2">
          {prescriptions.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => pick(i)}
              className={cn(
                "flex-1 rounded-2xl px-2 py-2.5 text-[11px] font-bold",
                i === idx ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              <span className="latin">{p.level}</span>
            </button>
          ))}
        </div>

        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <Chip tone="primary">
              <span className="latin">{rx.level}</span>
            </Chip>
            <SaveButton
              itemType="prescription"
              itemId={rx.id}
              title={rx.code}
              subtitle={`وصفة تدريبية — ${rx.level}`}
              compact
            />
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{rx.context}</p>
        </div>

        <div className="surface-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-border bg-muted/60 px-4 py-3">
            <FileText className="size-4 text-primary" />
            <p className="text-xs font-bold">Prescription</p>
          </div>
          <div dir="ltr" className="latin space-y-3 p-5 text-[13px] leading-relaxed">
            <p className="font-bold">Rx</p>
            {rx.lines.map((l, i) => (
              <p key={i} className="border-b border-dashed border-border pb-2 italic">
                {i + 1}. {l.drug} {l.strength} — {l.dose} / {l.frequency} × {l.duration}
                {l.note ? ` (${l.note})` : ""}
              </p>
            ))}
          </div>
        </div>

        <div className="surface-card space-y-3 p-4">
          <p className="text-xs font-bold">{rx.question}</p>
          {rx.lines.map((l, i) => (
            <label key={i} className="block space-y-1.5">
              <span className="text-[11px] font-semibold">
                الدواء <span className="latin">{i + 1}</span> — الاسم العلمي
              </span>
              <input
                value={answers[i] ?? ""}
                onChange={(e) =>
                  setAnswers((prev) => {
                    const next = [...prev];
                    next[i] = e.target.value;
                    return next;
                  })
                }
                placeholder="مثال: Paracetamol"
                className={cn(
                  "latin h-11 w-full rounded-2xl border bg-card px-4 text-sm outline-none focus:border-primary",
                  checked
                    ? results[i]
                      ? "border-secondary"
                      : "border-destructive"
                    : "border-input",
                )}
              />
              {checked ? (
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 text-[11px] font-bold",
                    results[i] ? "text-secondary" : "text-destructive",
                  )}
                >
                  {results[i] ? <CheckCircle2 className="size-3.5" /> : <XCircle className="size-3.5" />}
                  <span className="latin">
                    {l.drug} {l.strength}
                  </span>{" "}
                  — {l.dose} · {l.frequency} · {l.duration}
                </span>
              ) : null}
            </label>
          ))}

          <div className="flex gap-2">
            <ActionButton variant="outline" onClick={() => setShowHint((v) => !v)}>
              <Lightbulb className="size-4" /> تلميح
            </ActionButton>
            <ActionButton onClick={() => setChecked(true)}>تحقق من الإجابة</ActionButton>
          </div>

          {showHint ? <p className="text-[11px] leading-relaxed text-muted-foreground">{rx.hint}</p> : null}

          {checked ? (
            <div className="rounded-2xl bg-muted p-3.5">
              <p className="text-xs font-bold">
                النتيجة: <span className="latin">{score}</span> من{" "}
                <span className="latin">{rx.lines.length}</span>
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{rx.reviewNote}</p>
            </div>
          ) : null}
        </div>

        <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
          الوصفات تدريبية تعليمية فقط ولا تُستخدم لصرف دواء حقيقي.
        </p>
      </Screen>
    </div>
  );
}
