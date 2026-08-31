import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, CheckCircle2, HelpCircle, ScanSearch, Stethoscope, Timer } from "lucide-react";
import { AppBar, Bar, Chip, Ring, Screen, Tabs } from "@/components/kit";
import { modules, totalLessons } from "@/lib/curriculum";
import { clinicalCases } from "@/lib/cases";
import { drugQuestions } from "@/lib/quiz";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/student/training")({
  head: () => ({
    meta: [
      { title: "تقدم التدريب — PharmaTrain Libya" },
      {
        name: "description",
        content: "تابع تقدمك التعليمي: الدروس المكتملة لكل وحدة، نتائج الاختبارات، الحالات المحلولة، ودقائق التعلم.",
      },
      { property: "og:title", content: "تقدم التدريب — فارما ترين ليبيا" },
      { property: "og:description", content: "لوحة تقدم تعليمي كاملة لطالب الصيدلة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Training,
});

const tabs = ["نظرة عامة", "الوحدات", "الاختبارات"];

function Training() {
  const [tab, setTab] = useState("نظرة عامة");
  const { state } = useStore();

  const done = state.completedLessons.length;
  const progress = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  const minutes = modules
    .flatMap((m) => m.lessons)
    .filter((l) => state.completedLessons.includes(l.id))
    .reduce((s, l) => s + l.minutes, 0);
  const solved = state.solvedCases.length;
  const quizAvg = state.quizResults.length
    ? Math.round(
        (state.quizResults.reduce((s, r) => s + r.score / (r.total || 1), 0) / state.quizResults.length) * 100,
      )
    : 0;

  return (
    <div>
      <AppBar title="تقدم التدريب" subtitle="تعلّمك محفوظ تلقائيًا على جهازك" back="/student" />
      <Screen className="space-y-5">
        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "نظرة عامة" ? (
          <div className="space-y-3">
            <div className="surface-card flex items-center gap-4 p-4">
              <Ring value={progress} />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-bold">التقدم العام في المنهج</p>
                <p className="text-[11px] text-muted-foreground">
                  <span className="latin font-bold text-primary">{done}</span> من{" "}
                  <span className="latin">{totalLessons}</span> درسًا في{" "}
                  <span className="latin">{modules.length}</span> وحدة
                </p>
                <Bar value={progress} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Timer, l: "دقائق تعلم", v: String(minutes) },
                { icon: HelpCircle, l: "متوسط الاختبارات", v: `${quizAvg}%` },
                { icon: Stethoscope, l: "حالات محلولة", v: `${solved}/${clinicalCases.length}` },
                { icon: CheckCircle2, l: "بنك الأسئلة", v: String(drugQuestions.length) },
              ].map(({ icon: Icon, l, v }) => (
                <div key={l} className="surface-card p-4">
                  <Icon className="size-4 text-primary" />
                  <p className="latin mt-1.5 text-lg font-extrabold">{v}</p>
                  <p className="text-[11px] text-muted-foreground">{l}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link to="/student/drug-questions" className="surface-card flex items-center gap-2 p-3.5 text-xs font-bold">
                <HelpCircle className="size-4 text-primary" /> أسئلة الأدوية
              </Link>
              <Link to="/student/drug-images" className="surface-card flex items-center gap-2 p-3.5 text-xs font-bold">
                <ScanSearch className="size-4 text-warning" /> الدواء بالصورة
              </Link>
            </div>
          </div>
        ) : null}

        {tab === "الوحدات" ? (
          <div className="space-y-2.5">
            {modules.map((m) => {
              const d = m.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
              const p = Math.round((d / m.lessons.length) * 100);
              return (
                <Link
                  key={m.id}
                  to="/student/courses/$courseId"
                  params={{ courseId: m.id }}
                  className="surface-card block space-y-2 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="latin text-[10px] font-bold text-primary">{m.code}</span>
                    <span className="latin text-[10px] text-muted-foreground">
                      {d}/{m.lessons.length}
                    </span>
                  </div>
                  <p className="text-xs font-bold leading-snug">{m.title}</p>
                  <Bar value={p} tone={p === 100 ? "secondary" : "primary"} />
                </Link>
              );
            })}
          </div>
        ) : null}

        {tab === "الاختبارات" ? (
          <div className="space-y-2.5">
            {state.quizResults.length ? (
              state.quizResults.map((r, i) => (
                <div key={`${r.id}-${i}`} className="surface-card flex items-center gap-3 p-4">
                  <span className="flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                    <GraduationCap className="size-4.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{r.title}</p>
                    <p className="latin text-[11px] text-muted-foreground">
                      {r.score}/{r.total}
                    </p>
                  </div>
                  <Chip tone={r.score / (r.total || 1) >= 0.6 ? "secondary" : "warning"}>
                    <span className="latin">{Math.round((r.score / (r.total || 1)) * 100)}%</span>
                  </Chip>
                </div>
              ))
            ) : (
              <div className="surface-card p-6 text-center">
                <p className="text-xs font-bold">لا نتائج بعد</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  ابدأ من قسم أسئلة الأدوية لتظهر نتائجك هنا.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
