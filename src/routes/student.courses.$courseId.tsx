import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, CheckCircle2, Circle, Clock, Play } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Screen, SectionTitle, Tabs } from "@/components/kit";
import { SaveButton } from "@/components/SaveButton";
import { moduleById, modules } from "@/lib/curriculum";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/courses/$courseId")({
  head: ({ params }) => {
    const m = moduleById(params.courseId);
    const title = m ? `${m.title} — PharmaTrain Libya` : "وحدة تعليمية — PharmaTrain Libya";
    const desc = m?.desc ?? "وحدة تعليمية في منهج طالب الصيدلة.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  loader: ({ params }) => {
    if (!moduleById(params.courseId)) throw notFound();
    return { courseId: params.courseId };
  },
  component: CourseDetails,
  errorComponent: ({ error }) => (
    <div role="alert" className="p-6 text-xs font-bold">
      {error.message}
    </div>
  ),
  notFoundComponent: () => (
    <div className="p-6 text-center text-xs font-bold">
      الوحدة غير موجودة.{" "}
      <Link to="/student/courses" className="text-primary">
        عودة للدورات
      </Link>
    </div>
  ),
});

const tabs = ["نظرة عامة", "الدروس"];

function CourseDetails() {
  const { courseId } = Route.useParams();
  const [tab, setTab] = useState("الدروس");
  const { state, toggleLesson } = useStore();

  const mod = moduleById(courseId)!;
  const doneIds = state.completedLessons;
  const done = mod.lessons.filter((l) => doneIds.includes(l.id)).length;
  const progress = Math.round((done / mod.lessons.length) * 100);
  const minutes = mod.lessons.reduce((s, l) => s + l.minutes, 0);
  const nextLesson = mod.lessons.find((l) => !doneIds.includes(l.id));
  const others = modules.filter((m) => m.id !== mod.id).slice(0, 2);

  return (
    <div>
      <AppBar title={mod.title} subtitle={mod.code} back="/student/courses" />
      <Screen className="space-y-5">
        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Chip tone={mod.tone}>{mod.level}</Chip>
              <Chip>
                <span className="latin">{mod.lessons.length}</span> درسًا
              </Chip>
            </div>
            <SaveButton
              itemType="lesson"
              itemId={mod.id}
              title={mod.title}
              subtitle={`وحدة تعليمية — ${mod.code}`}
              compact
            />
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">{mod.desc}</p>
          <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5" /> <span className="latin">{done}</span>/
              <span className="latin">{mod.lessons.length}</span> مكتمل
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> <span className="latin">{minutes}</span> دقيقة
            </span>
          </div>
          <Bar value={progress} tone={progress === 100 ? "secondary" : "primary"} />
        </div>

        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "نظرة عامة" ? (
          <div className="surface-card space-y-3 p-4 text-xs leading-relaxed text-muted-foreground">
            <p>{mod.desc}</p>
            <p>
              الوحدة منظمة وفق منطق تصنيف WHO ATC، ويُحفظ تقدمك في كل درس تلقائيًا حتى تعود لاحقًا من حيث توقفت.
            </p>
            {nextLesson ? (
              <ActionButton onClick={() => setTab("الدروس")}>
                <Play className="size-4" /> متابعة: {nextLesson.title}
              </ActionButton>
            ) : (
              <p className="font-bold text-secondary">أكملت جميع دروس هذه الوحدة 🎉</p>
            )}
          </div>
        ) : null}

        {tab === "الدروس" ? (
          <div className="surface-card divide-y divide-border overflow-hidden">
            {mod.lessons.map((l, i) => {
              const isDone = doneIds.includes(l.id);
              const isNext = nextLesson?.id === l.id;
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => toggleLesson(l.id)}
                  className="flex w-full items-center gap-3 p-3.5 text-start"
                >
                  <span
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl",
                      isDone
                        ? "bg-secondary-soft text-secondary"
                        : isNext
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {isDone ? <CheckCircle2 className="size-4" /> : isNext ? <Play className="size-4" /> : <Circle className="size-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={cn("truncate text-xs font-bold", isNext && "text-primary")}>
                      <span className="latin">{i + 1}.</span> {l.title}
                    </p>
                    <p className="latin text-[11px] text-muted-foreground">{l.minutes} دقيقة</p>
                  </div>
                  {isDone ? <Chip tone="secondary">مكتمل</Chip> : isNext ? <Chip tone="primary">التالي</Chip> : null}
                </button>
              );
            })}
          </div>
        ) : null}

        <section>
          <SectionTitle title="وحدات أخرى" href="/student/courses" />
          <div className="space-y-2.5">
            {others.map((m) => (
              <Link
                key={m.id}
                to="/student/courses/$courseId"
                params={{ courseId: m.id }}
                className="surface-card flex items-center gap-3 p-3.5"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl gradient-mint text-secondary-foreground">
                  <BookOpen className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{m.title}</p>
                  <p className="latin text-[11px] text-muted-foreground">{m.code}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </Screen>
    </div>
  );
}
