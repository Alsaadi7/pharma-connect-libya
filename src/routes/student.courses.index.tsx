import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Search } from "lucide-react";
import { AppBar, Bar, Chip, Screen, Tabs } from "@/components/kit";
import { modules, totalLessons } from "@/lib/curriculum";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/student/courses/")({
  head: () => ({
    meta: [
      { title: "الدورات — منهج طالب الصيدلة | PharmaTrain Libya" },
      {
        name: "description",
        content: "16 وحدة تعليمية من أساسيات العمل الصيدلي إلى المجموعات الدوائية والحالات السريرية.",
      },
      { property: "og:title", content: "الدورات — فارما ترين ليبيا" },
      { property: "og:description", content: "منهج متدرّج منظم وفق تصنيف WHO ATC مع تتبع تقدمك." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Courses,
});

const levels = ["الكل", "مبتدئ", "متوسط", "متقدم"];

const toneClass = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary-soft text-secondary",
  warning: "bg-warning-soft text-warning",
} as const;

function Courses() {
  const [level, setLevel] = useState("الكل");
  const [q, setQ] = useState("");
  const { state } = useStore();

  const list = modules.filter(
    (m) =>
      (level === "الكل" || m.level === level) &&
      (q.trim() === "" || m.title.includes(q.trim()) || m.code.toLowerCase().includes(q.trim().toLowerCase())),
  );
  const doneAll = state.completedLessons.length;

  return (
    <div>
      <AppBar title="الدورات" subtitle={`${modules.length} وحدة · ${totalLessons} درسًا`} />
      <Screen className="space-y-4">
        <div className="surface-card space-y-2.5 p-4">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>تقدمك في المنهج</span>
            <span className="latin text-primary">{Math.round((doneAll / totalLessons) * 100)}%</span>
          </div>
          <Bar value={Math.round((doneAll / totalLessons) * 100)} />
          <p className="text-[11px] text-muted-foreground">
            <span className="latin">{doneAll}</span> من <span className="latin">{totalLessons}</span> درسًا مكتملًا
          </p>
        </div>

        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3.5" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ابحث في الوحدات…"
            className="h-12 w-full rounded-2xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-primary"
          />
        </label>

        <Tabs items={levels} active={level} onChange={setLevel} />

        <div className="space-y-3">
          {list.map((m) => {
            const done = m.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
            const pct = Math.round((done / m.lessons.length) * 100);
            return (
              <Link
                key={m.id}
                to="/student/courses/$courseId"
                params={{ courseId: m.id }}
                className="surface-card block space-y-3 p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${toneClass[m.tone]}`}
                  >
                    <BookOpen className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="latin block text-[10px] font-bold text-muted-foreground">{m.code}</span>
                    <p className="text-sm font-bold leading-snug">{m.title}</p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">{m.desc}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone={m.level === "متقدم" ? "error" : m.level === "متوسط" ? "warning" : "secondary"}>
                    {m.level}
                  </Chip>
                  <span className="latin text-[10px] text-muted-foreground">{m.lessons.length} دروس</span>
                </div>
                <Bar value={pct} tone={pct === 100 ? "secondary" : "primary"} />
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-primary">{pct === 0 ? "ابدأ الدورة" : pct === 100 ? "مكتملة ✓" : "متابعة التعلم"}</span>
                  <span className="latin text-muted-foreground">
                    {done}/{m.lessons.length}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Screen>
    </div>
  );
}
