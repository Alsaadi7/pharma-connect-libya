import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Screen } from "@/components/kit";
import { DrugLink } from "@/components/DrugCard";
import { SaveButton } from "@/components/SaveButton";
import { drugQuestions } from "@/lib/quiz";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/drug-questions")({
  head: () => ({
    meta: [
      { title: "أسئلة عن الأدوية — PharmaTrain Libya" },
      {
        name: "description",
        content: "بنك أسئلة تفاعلي عن الاستخدام والمجموعة الدوائية والآثار الجانبية والتداخلات مع تفسير لكل إجابة.",
      },
      { property: "og:title", content: "أسئلة عن الأدوية — فارما ترين ليبيا" },
      { property: "og:description", content: "اختبر معرفتك الدوائية مع تفسير فوري ومصدر تعليمي." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugQuestions,
});

function DrugQuestions() {
  const { saveQuiz } = useStore();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = drugQuestions.length;
  const q = useMemo(() => drugQuestions[i]!, [i]);
  const progress = Math.round((i / total) * 100);

  const next = () => {
    if (i + 1 >= total) {
      saveQuiz({ id: "drug-questions", title: "بنك أسئلة الأدوية", score, total });
      setFinished(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  const restart = () => {
    setI(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div>
        <AppBar title="نتيجة الاختبار" back="/student" />
        <Screen className="space-y-4">
          <div className="surface-card space-y-3 p-6 text-center">
            <span
              className={cn(
                "mx-auto flex size-20 items-center justify-center rounded-3xl text-2xl font-extrabold",
                pct >= 60 ? "bg-secondary-soft text-secondary" : "bg-warning-soft text-warning",
              )}
            >
              <span className="latin">{pct}%</span>
            </span>
            <p className="text-sm font-bold">
              <span className="latin">{score}</span> من <span className="latin">{total}</span> إجابة صحيحة
            </p>
            <p className="text-[11px] text-muted-foreground">تم حفظ النتيجة في تقدم التدريب.</p>
            <ActionButton onClick={restart} variant="primary">
              <RotateCcw className="size-4" /> إعادة الاختبار
            </ActionButton>
            <ActionButton to="/student/training" variant="outline">
              عرض تقدم التدريب
            </ActionButton>
          </div>
        </Screen>
      </div>
    );
  }

  const correct = picked !== null && picked === q.answer;

  return (
    <div>
      <AppBar title="أسئلة عن الأدوية" subtitle={q.category} back="/student" />
      <Screen className="space-y-4">
        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">
              السؤال <span className="latin">{i + 1}</span> من <span className="latin">{total}</span>
            </span>
            <Chip tone="primary">{q.kind === "tf" ? "صح / خطأ" : "اختيار متعدد"}</Chip>
          </div>
          <Bar value={progress} />
          <h2 className="text-sm font-bold leading-relaxed">{q.text}</h2>

          <div className="space-y-2">
            {q.options.map((o, idx) => {
              const isAnswer = idx === q.answer;
              const state =
                picked === null
                  ? "idle"
                  : isAnswer
                    ? "right"
                    : idx === picked
                      ? "wrong"
                      : "idle";
              return (
                <button
                  key={o}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(idx);
                    if (idx === q.answer) setScore((s) => s + 1);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start text-xs font-semibold",
                    state === "idle" && "border-border bg-card",
                    state === "right" && "border-secondary bg-secondary-soft text-secondary",
                    state === "wrong" && "border-destructive bg-destructive-soft text-destructive",
                  )}
                >
                  <span className="latin flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1">{o}</span>
                  {state === "right" ? <CheckCircle2 className="size-4" /> : null}
                  {state === "wrong" ? <XCircle className="size-4" /> : null}
                </button>
              );
            })}
          </div>
        </div>

        {picked !== null ? (
          <div className="surface-card space-y-2.5 p-4">
            <div className="flex items-center justify-between">
              <p className={cn("text-xs font-bold", correct ? "text-secondary" : "text-destructive")}>
                {correct ? "إجابة صحيحة" : "إجابة غير صحيحة"}
              </p>
              <SaveButton
                itemType="question"
                itemId={q.id}
                title={q.text}
                subtitle={`سؤال — ${q.category}`}
                compact
              />
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">{q.explanation}</p>
            {q.drugId ? <DrugLink drugId={q.drugId} /> : null}
            <p className="text-[10px] text-muted-foreground">{q.source}</p>
            <ActionButton onClick={next}>{i + 1 >= total ? "عرض النتيجة" : "السؤال التالي"}</ActionButton>
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
