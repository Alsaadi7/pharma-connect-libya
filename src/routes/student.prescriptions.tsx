import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, Lightbulb, ChevronLeft, RotateCcw, Star } from "lucide-react";
import { ActionButton, AppBar, Chip, Screen, SectionTitle } from "@/components/kit";
import { SaveButton } from "@/components/SaveButton";
import { ImageUpload, ZoomableImage } from "@/components/ImageTools";
import { checkRxField, emptyAnswers, rxFields, useRxTrainings, type RxAnswers, type RxTraining } from "@/lib/rxTraining";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/prescriptions")({
  head: () => ({
    meta: [
      { title: "محاكي قراءة الوصفات — PharmaTrain Libya" },
      {
        name: "description",
        content: "تدرّب على قراءة الروشتات الطبية: كبّر الصورة، حلّلها، وقارن إجابتك بالحل النموذجي مع تفسير تعليمي.",
      },
      { property: "og:title", content: "محاكي قراءة الوصفات — فارما ترين ليبيا" },
      { property: "og:description", content: "مهارة أساسية لكل طالب صيدلة: قراءة الوصفة بدقة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Prescriptions,
});

const levelTone = { مبتدئ: "secondary", متوسط: "primary", متقدم: "warning" } as const;

function Prescriptions() {
  const { published } = useRxTrainings();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [ownImage, setOwnImage] = useState("");

  const idx = published.findIndex((p) => p.id === activeId);
  const active = idx >= 0 ? published[idx] : undefined;

  if (active) {
    return (
      <Trainer
        key={active.id}
        rx={active}
        onBack={() => setActiveId(null)}
        onNext={idx + 1 < published.length ? () => setActiveId(published[idx + 1]!.id) : undefined}
      />
    );
  }

  return (
    <div>
      <AppBar title="محاكي قراءة الوصفات" subtitle={`${published.length} روشتة تدريبية`} back="/student/training-center" />
      <Screen className="space-y-6">
        <section>
          <SectionTitle title="الروشتات التدريبية" />
          <div className="space-y-2.5">
            {published.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setActiveId(p.id)}
                className="surface-card flex w-full items-center gap-3 p-3 text-start"
              >
                <span className="size-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {p.image ? <img src={p.image} alt={p.title} className="size-full object-cover" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="truncate text-xs font-bold">{p.title}</span>
                    {p.featured ? <Star className="size-3.5 shrink-0 fill-warning text-warning" /> : null}
                  </span>
                  <span className="mt-0.5 line-clamp-2 block text-[11px] text-muted-foreground">{p.description}</span>
                  <span className="mt-1.5 block">
                    <Chip tone={levelTone[p.level]}>{p.level}</Chip>
                  </span>
                </span>
                <ChevronLeft className="size-4 text-muted-foreground rtl:rotate-180" />
              </button>
            ))}
            {!published.length ? (
              <p className="surface-card p-4 text-center text-[11px] text-muted-foreground">لا توجد روشتات منشورة حاليًا.</p>
            ) : null}
          </div>
        </section>

        <section>
          <SectionTitle title="تدرّب على صورة من جهازك" />
          <div className="surface-card space-y-3 p-4">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              ارفع صورة روشتة (JPG/PNG حتى 5MB) للتدرب على قراءتها بالتكبير والتحريك. لا يتم تحليل الصورة تلقائيًا.
            </p>
            <ImageUpload value={ownImage} onChange={setOwnImage} label="صورة الروشتة الخاصة بك" />
          </div>
        </section>

        <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
          الوصفات تدريبية تعليمية فقط ولا تُستخدم لصرف دواء حقيقي.
        </p>
      </Screen>
    </div>
  );
}

function Trainer({ rx, onBack, onNext }: { rx: RxTraining; onBack: () => void; onNext?: () => void }) {
  const { saveQuiz } = useStore();
  const [answers, setAnswers] = useState<RxAnswers>(emptyAnswers);
  const [checked, setChecked] = useState(false);
  const [hint, setHint] = useState(false);

  const results = rxFields.map((f) => checkRxField(answers[f.key], rx[f.key]));
  const score = results.filter(Boolean).length;
  const pct = Math.round((score / rxFields.length) * 100);
  const filled = rxFields.filter((f) => answers[f.key].trim()).length;

  const check = () => {
    setChecked(true);
    saveQuiz({ id: `rx-${rx.id}`, title: `روشتة — ${rx.title}`, score, total: rxFields.length });
  };
  const reset = () => {
    setAnswers(emptyAnswers);
    setChecked(false);
    setHint(false);
  };

  return (
    <div>
      <AppBar
        title={rx.title}
        subtitle={rx.level}
        action={
          <button type="button" onClick={onBack} className="rounded-xl bg-muted px-3 py-1.5 text-[11px] font-bold">
            القائمة
          </button>
        }
      />
      <Screen className="space-y-4">
        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <Chip tone={levelTone[rx.level]}>{rx.level}</Chip>
            <SaveButton itemType="prescription" itemId={rx.id} title={rx.title} subtitle={`روشتة تدريبية — ${rx.level}`} compact />
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{rx.description}</p>
          {rx.image ? <ZoomableImage src={rx.image} alt={rx.title} /> : null}
        </div>

        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold">حلّل الروشتة واملأ الحقول</p>
            <span className="latin text-[10px] text-muted-foreground">
              {filled}/{rxFields.length}
            </span>
          </div>
          {rxFields.map((f, i) => (
            <label key={f.key} className="block space-y-1.5">
              <span className="text-[11px] font-semibold">{f.label}</span>
              <input
                value={answers[f.key]}
                disabled={checked}
                onChange={(e) => setAnswers((a) => ({ ...a, [f.key]: e.target.value }))}
                className={cn(
                  "h-11 w-full rounded-2xl border bg-card px-4 text-sm outline-none focus:border-primary",
                  checked ? (results[i] ? "border-secondary" : "border-destructive") : "border-input",
                )}
              />
              {checked ? (
                <span
                  className={cn(
                    "flex items-start gap-1.5 text-[11px] font-bold",
                    results[i] ? "text-secondary" : "text-destructive",
                  )}
                >
                  {results[i] ? <CheckCircle2 className="size-3.5 shrink-0" /> : <XCircle className="size-3.5 shrink-0" />}
                  <span>
                    {results[i] ? "صحيح" : "غير صحيح"} — الإجابة النموذجية: <span className="font-semibold">{rx[f.key]}</span>
                  </span>
                </span>
              ) : null}
            </label>
          ))}

          {!checked ? (
            <div className="flex gap-2">
              <ActionButton variant="outline" onClick={() => setHint((v) => !v)}>
                <Lightbulb className="size-4" /> تلميح
              </ActionButton>
              <ActionButton onClick={check}>تحقق من الإجابة</ActionButton>
            </div>
          ) : null}
          {hint && !checked ? <p className="text-[11px] leading-relaxed text-muted-foreground">{rx.notes}</p> : null}
        </div>

        {checked ? (
          <div className="surface-card space-y-3 p-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  "latin flex size-14 items-center justify-center rounded-2xl text-lg font-extrabold",
                  pct >= 60 ? "bg-secondary-soft text-secondary" : "bg-warning-soft text-warning",
                )}
              >
                {pct}%
              </span>
              <div>
                <p className="text-xs font-bold">
                  <span className="latin">{score}</span> من <span className="latin">{rxFields.length}</span> حقول صحيحة
                </p>
                <p className="text-[10px] text-muted-foreground">تم حفظ النتيجة في تقدم التدريب.</p>
              </div>
            </div>
            <div className="rounded-2xl bg-muted p-3.5">
              <p className="text-[11px] font-bold">الحل النموذجي</p>
              <p className="mt-1 text-[11px] leading-relaxed">{rx.modelAnswer}</p>
              <p className="mt-2 text-[11px] font-bold">التفسير</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{rx.explanation}</p>
            </div>
            <div className="flex gap-2">
              <ActionButton variant="outline" onClick={reset}>
                <RotateCcw className="size-4" /> إعادة المحاولة
              </ActionButton>
              {onNext ? <ActionButton onClick={onNext}>الروشتة التالية</ActionButton> : <ActionButton onClick={onBack}>القائمة</ActionButton>}
            </div>
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
