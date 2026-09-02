import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Screen, SectionTitle } from "@/components/kit";
import { DrugLink } from "@/components/DrugCard";
import { SaveButton } from "@/components/SaveButton";
import { topicById, topics, type TopicId, type TopicQuestion } from "@/lib/drugTopics";
import { useQuestionBank } from "@/lib/questionStore";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const topicIds = topics.map((t) => t.id);

export const Route = createFileRoute("/student/drug-questions")({
  validateSearch: (s: Record<string, unknown>): { topic?: TopicId } => {
    const t = typeof s.topic === "string" && topicIds.includes(s.topic as TopicId) ? (s.topic as TopicId) : undefined;
    return t ? { topic: t } : {};
  },
  head: () => ({
    meta: [
      { title: "أسئلة التدريب عن الأدوية — PharmaTrain Libya" },
      {
        name: "description",
        content: "أسئلة مصنفة حسب المجموعة الدوائية: المسكنات، الجهاز الهضمي، الضغط، السكري، الدهون والمستحضرات الموضعية مع تفسير فوري.",
      },
      { property: "og:title", content: "أسئلة التدريب عن الأدوية — فارما ترين ليبيا" },
      { property: "og:description", content: "اختبر معرفتك الدوائية حسب التصنيف مع تفسير فوري." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugQuestions,
});

function DrugQuestions() {
  const { topic } = Route.useSearch();
  const { byTopic } = useQuestionBank();

  if (!topic) {
    return (
      <div>
        <AppBar title="أسئلة التدريب" subtitle="اختر التصنيف" back="/student/training-center" />
        <Screen>
          <section>
            <SectionTitle title="التصنيفات" />
            <div className="grid grid-cols-2 gap-2.5">
              {topics.map((t) => (
                <Link key={t.id} to="/student/drug-questions" search={{ topic: t.id }} className="surface-card space-y-2 p-3.5">
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="text-xs font-bold leading-snug">{t.ar}</p>
                  <p className="text-[10px] text-muted-foreground">{t.desc}</p>
                  <p className="text-[10px] font-bold text-primary">
                    <span className="latin">{byTopic(t.id).length}</span> سؤال
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </Screen>
      </div>
    );
  }

  return <Quiz key={topic} topic={topic} questions={byTopic(topic)} />;
}

function Quiz({ topic, questions }: { topic: TopicId; questions: TopicQuestion[] }) {
  const t = topicById(topic)!;
  const { saveQuiz } = useStore();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [wrong, setWrong] = useState<{ q: TopicQuestion; picked: number }[]>([]);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = questions.length;
  const q = questions[i];

  const restart = () => {
    setI(0);
    setPicked(null);
    setWrong([]);
    setScore(0);
    setFinished(false);
  };

  if (!q) {
    return (
      <div>
        <AppBar title={t.ar} back="/student/drug-questions" />
        <Screen>
          <p className="surface-card p-4 text-center text-[11px] text-muted-foreground">لا توجد أسئلة منشورة في هذا التصنيف بعد.</p>
        </Screen>
      </div>
    );
  }

  const next = () => {
    if (i + 1 >= total) {
      saveQuiz({ id: `topic-${topic}`, title: `أسئلة — ${t.ar}`, score, total });
      setFinished(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  if (finished) {
    const pct = Math.round((score / total) * 100);
    return (
      <div>
        <AppBar title="نتيجة الاختبار" subtitle={t.ar} back="/student/drug-questions" />
        <Screen className="space-y-4">
          <div className="surface-card space-y-3 p-6 text-center">
            <span
              className={cn(
                "latin mx-auto flex size-20 items-center justify-center rounded-3xl text-2xl font-extrabold",
                pct >= 60 ? "bg-secondary-soft text-secondary" : "bg-warning-soft text-warning",
              )}
            >
              {pct}%
            </span>
            <p className="text-sm font-bold">
              <span className="latin">{score}</span> من <span className="latin">{total}</span> إجابة صحيحة
            </p>
            <p className="text-[11px] text-muted-foreground">تم حفظ النتيجة في تقدم التدريب.</p>
            <ActionButton onClick={restart}>
              <RotateCcw className="size-4" /> إعادة الاختبار
            </ActionButton>
            <ActionButton to="/student/training-center" variant="outline">
              العودة لمركز التدريب
            </ActionButton>
          </div>

          {wrong.length ? (
            <section>
              <SectionTitle title="مراجعة الأخطاء" />
              <div className="space-y-2.5">
                {wrong.map(({ q: wq, picked: p }) => (
                  <div key={wq.id} className="surface-card space-y-2 p-4">
                    <p className="text-xs font-bold leading-relaxed">{wq.text}</p>
                    <p className="text-[11px] text-destructive">إجابتك: {wq.options[p]}</p>
                    <p className="text-[11px] text-secondary">الصحيح: {wq.options[wq.answer]}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{wq.explanation}</p>
                    {wq.drugId ? <DrugLink drugId={wq.drugId} /> : null}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </Screen>
      </div>
    );
  }

  const correct = picked !== null && picked === q.answer;

  return (
    <div>
      <AppBar title={`${t.emoji} ${t.ar}`} subtitle={q.kind} back="/student/drug-questions" />
      <Screen className="space-y-4">
        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="text-muted-foreground">
              السؤال <span className="latin">{i + 1}</span> من <span className="latin">{total}</span>
            </span>
            <Chip tone="primary">{q.level}</Chip>
          </div>
          <Bar value={Math.round((i / total) * 100)} />
          <h2 className="text-sm font-bold leading-relaxed">{q.text}</h2>

          <div className="space-y-2">
            {q.options.map((o, idx) => {
              const state =
                picked === null ? "idle" : idx === q.answer ? "right" : idx === picked ? "wrong" : "idle";
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={picked !== null}
                  onClick={() => {
                    setPicked(idx);
                    if (idx === q.answer) setScore((s) => s + 1);
                    else setWrong((w) => [...w, { q, picked: idx }]);
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
                {correct ? "✅ إجابة صحيحة" : "❌ إجابة غير صحيحة"}
              </p>
              <SaveButton itemType="question" itemId={q.id} title={q.text} subtitle={`سؤال — ${t.ar}`} compact />
            </div>
            <p className="text-[11px] leading-relaxed text-muted-foreground">{q.explanation}</p>
            {q.drugId ? <DrugLink drugId={q.drugId} /> : null}
            <ActionButton onClick={next}>{i + 1 >= total ? "عرض النتيجة" : "السؤال التالي"}</ActionButton>
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
