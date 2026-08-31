import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Screen } from "@/components/kit";
import { DrugLink } from "@/components/DrugCard";
import { imageQuiz } from "@/lib/quiz";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/drug-images")({
  head: () => ({
    meta: [
      { title: "تعرّف على الدواء بالصورة — PharmaTrain Libya" },
      {
        name: "description",
        content: "اختبار بصري: شاهد شكل الدواء وحدد مجموعته الدوائية واستخدامه مع تفسير تعليمي وبطاقة الدواء.",
      },
      { property: "og:title", content: "تعرّف على الدواء بالصورة — فارما ترين ليبيا" },
      { property: "og:description", content: "تدرّب على تمييز الأشكال الصيدلانية من الصور." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: DrugImages,
});

function DrugImages() {
  const { addImageScore } = useStore();
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = imageQuiz.length;
  const item = imageQuiz[i]!;

  const next = () => {
    if (i + 1 >= total) {
      setFinished(true);
      return;
    }
    setI(i + 1);
    setPicked(null);
  };

  if (finished) {
    return (
      <div>
        <AppBar title="النتيجة" back="/student" />
        <Screen className="space-y-4">
          <div className="surface-card space-y-3 p-6 text-center">
            <p className="latin text-3xl font-extrabold text-primary">
              {score}/{total}
            </p>
            <p className="text-xs font-bold">أحسنت! تم حفظ نتيجتك في تقدم التدريب.</p>
            <ActionButton
              onClick={() => {
                setI(0);
                setPicked(null);
                setScore(0);
                setFinished(false);
              }}
            >
              <RotateCcw className="size-4" /> إعادة المحاولة
            </ActionButton>
            <ActionButton to="/student/training" variant="outline">
              تقدم التدريب
            </ActionButton>
          </div>
        </Screen>
      </div>
    );
  }

  return (
    <div>
      <AppBar title="الدواء بالصورة" subtitle={item.level} back="/student" />
      <Screen className="space-y-4">
        <div className="surface-card overflow-hidden">
          <img
            src={item.image}
            width={item.width}
            height={item.height}
            alt={`صورة دواء للتعرف عليه — ${item.level}`}
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-muted-foreground">
                <span className="latin">{i + 1}</span> / <span className="latin">{total}</span>
              </span>
              <Chip tone="warning">{item.level}</Chip>
            </div>
            <Bar value={Math.round((i / total) * 100)} tone="warning" />
            <h2 className="text-sm font-bold leading-relaxed">{item.question}</h2>
            <div className="space-y-2">
              {item.options.map((o, idx) => {
                const state =
                  picked === null ? "idle" : idx === item.answer ? "right" : idx === picked ? "wrong" : "idle";
                return (
                  <button
                    key={o}
                    type="button"
                    disabled={picked !== null}
                    onClick={() => {
                      setPicked(idx);
                      const ok = idx === item.answer;
                      if (ok) setScore((s) => s + 1);
                      addImageScore(ok ? 1 : 0);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start text-xs font-semibold",
                      state === "idle" && "border-border bg-card",
                      state === "right" && "border-secondary bg-secondary-soft text-secondary",
                      state === "wrong" && "border-destructive bg-destructive-soft text-destructive",
                    )}
                  >
                    <span className="flex-1">{o}</span>
                    {state === "right" ? <CheckCircle2 className="size-4" /> : null}
                    {state === "wrong" ? <XCircle className="size-4" /> : null}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {picked !== null ? (
          <div className="surface-card space-y-2.5 p-4">
            <p className="latin text-[11px] font-bold text-primary">{item.className}</p>
            <p className="text-[11px] leading-relaxed text-muted-foreground">{item.explanation}</p>
            {item.drugId ? <DrugLink drugId={item.drugId} /> : null}
            <ActionButton onClick={next}>{i + 1 >= total ? "عرض النتيجة" : "الصورة التالية"}</ActionButton>
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
