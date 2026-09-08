import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, HelpCircle, Pill, Stethoscope, Users } from "lucide-react";
import { Bar, SectionTitle, StatCard } from "@/components/kit";
import { PageHeader, Pill as Tag } from "@/components/admin/ui";
import { useCollection, seedStudents, seedCourses, seedMedications, seedCases, seedQuizzes } from "@/lib/adminData";
import { useActivityLog } from "@/lib/adminAuth";
import { useQuestionBank } from "@/lib/questionStore";

export const Route = createFileRoute("/admin/")({ component: AdminOverview });

function AdminOverview() {
  const { items: students } = useCollection("students:v1", seedStudents);
  const { items: courses } = useCollection("courses:v1", seedCourses);
  const { items: meds } = useCollection("medications:v1", seedMedications);
  const { items: cases } = useCollection("cases:v1", seedCases);
  const { items: quizzes } = useCollection("quizzes:v1", seedQuizzes);
  const { all: questions } = useQuestionBank();
  const log = useActivityLog();

  const active = students.filter((s) => s.status === "active").length;
  const avg = students.length ? Math.round(students.reduce((a, s) => a + s.avgScore, 0) / students.length) : 0;
  const progress = students.length ? Math.round(students.reduce((a, s) => a + s.progress, 0) / students.length) : 0;
  const lessons = courses.reduce((a, c) => a + c.modules.reduce((b, m) => b + m.lessons.length, 0), 0);

  const topStudents = [...students].sort((a, b) => b.progress - a.progress).slice(0, 5);

  return (
    <>
      <PageHeader title="نظرة عامة" subtitle="ملخص حالة المنصة والمحتوى والطلاب" />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon={Users} label="الطلاب" value={String(students.length)} />
        <StatCard icon={BookOpen} label="الدورات" value={String(courses.length)} tone="secondary" />
        <StatCard icon={HelpCircle} label="الأسئلة" value={String(questions.length)} tone="primary" />
        <StatCard icon={Pill} label="الأدوية" value={String(meds.length)} tone="warning" />
        <StatCard icon={Stethoscope} label="الحالات السريرية" value={String(cases.length)} tone="secondary" />
        <StatCard icon={BookOpen} label="الدروس" value={String(lessons)} />
        <StatCard icon={HelpCircle} label="الاختبارات" value={String(quizzes.length)} tone="primary" />
        <StatCard icon={Users} label="طلاب نشطون" value={String(active)} tone="secondary" />
      </div>

      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <SectionTitle title="مؤشرات التعلّم" />
          <div className="surface-card space-y-3 p-4">
            <Metric label="متوسط تقدم الطلاب" value={progress} />
            <Metric label="متوسط درجات الاختبارات" value={avg} />
            <Metric
              label="نسبة المحتوى المنشور"
              value={Math.round((courses.filter((c) => c.status === "published").length / Math.max(1, courses.length)) * 100)}
            />
          </div>
        </div>

        <div>
          <SectionTitle title="الأكثر تقدّمًا" />
          <div className="surface-card divide-y divide-border overflow-hidden">
            {topStudents.map((s) => (
              <div key={s.id} className="flex items-center gap-3 p-3.5">
                <p className="min-w-0 flex-1 truncate text-[11px] font-bold">{s.name}</p>
                <Tag tone={s.status === "active" ? "ok" : "muted"}>{s.status === "active" ? "نشط" : "غير نشط"}</Tag>
                <span className="latin text-[11px] font-extrabold">{s.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <SectionTitle title="آخر العمليات" />
        <div className="surface-card divide-y divide-border overflow-hidden">
          {log.slice(0, 8).map((l) => (
            <div key={l.id} className="flex items-center gap-3 p-3.5 text-[11px]">
              <Tag tone="info">{l.action}</Tag>
              <span className="min-w-0 flex-1 truncate font-semibold">{l.item}</span>
              <span className="latin text-[10px] text-muted-foreground">
                {new Date(l.at).toLocaleString("ar-LY", { dateStyle: "short", timeStyle: "short" })}
              </span>
            </div>
          ))}
          {log.length === 0 ? <p className="p-5 text-center text-[11px] text-muted-foreground">لا عمليات بعد.</p> : null}
        </div>
      </section>
    </>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] font-semibold">
        <span>{label}</span>
        <span className="latin text-muted-foreground">{value}%</span>
      </div>
      <Bar value={value} tone={value > 70 ? "secondary" : "primary"} />
    </div>
  );
}
