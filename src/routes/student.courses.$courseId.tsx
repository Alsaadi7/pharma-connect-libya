import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Play,
  CheckCircle2,
  Lock,
  FileQuestion,
  Award,
  Users,
  Clock,
  BookOpen,
} from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Rating, Screen, SectionTitle, Tabs } from "@/components/kit";
import { courses, lessons } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/courses/$courseId")({
  head: () => ({
    meta: [
      { title: "تفاصيل الدورة — PharmaTrain Libya" },
      { name: "description", content: "دروس فيديو، ملفات، اختبار نهائي، وشهادة إتمام رقمية." },
      { property: "og:title", content: "تفاصيل الدورة — فارما ترين" },
      { property: "og:description", content: "تعلّم بالفيديو مع اختبارات وتقييم فوري." },
    ],
  }),
  component: CourseDetails,
});

const tabs = ["نظرة عامة", "الدروس", "الاختبار", "الشهادة"];

function CourseDetails() {
  const { courseId } = Route.useParams();
  const course = courses.find((c) => c.id === courseId) ?? courses[0]!;
  const [tab, setTab] = useState("نظرة عامة");

  return (
    <div>
      <AppBar title={course.title} subtitle={course.provider} back="/student/courses" />

      <div className="relative aspect-video gradient-primary">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_75%_25%,white,transparent_55%)]" />
        <button className="absolute inset-0 m-auto flex size-16 items-center justify-center rounded-full bg-card/90 text-primary shadow-[var(--shadow-glow)]">
          <Play className="size-7" />
        </button>
        <span className="latin absolute bottom-3 rounded-lg bg-foreground/70 px-2 py-1 text-[11px] font-bold text-primary-foreground end-3">
          02:14 / 11:05
        </span>
        <div className="absolute inset-x-0 bottom-0 h-1 bg-primary-foreground/30">
          <div className="h-full w-[20%] bg-warning" />
        </div>
      </div>

      <Screen className="space-y-5">
        <div className="space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <Chip tone="primary">{course.tag}</Chip>
            <Rating value={course.rating} count={course.learners} />
          </div>
          <h2 className="text-lg font-extrabold leading-snug">{course.title}</h2>
          <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <BookOpen className="size-3.5" /> <span className="latin">{course.lessons}</span> درسًا
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" /> <span className="latin">{course.hours}</span>
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5" /> <span className="latin">{course.learners}</span> متدرب
            </span>
          </div>
          {course.progress !== undefined ? (
            <div className="space-y-1.5 pt-1">
              <Bar value={course.progress} />
              <p className="latin text-[11px] font-bold text-primary">{course.progress}% مكتمل</p>
            </div>
          ) : null}
        </div>

        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "نظرة عامة" ? (
          <div className="surface-card space-y-3 p-4 text-xs leading-relaxed text-muted-foreground">
            <p>
              دورة عملية تغطي أساسيات الحركية والديناميكية الدوائية مع تطبيقات مباشرة على حالات
              الصيدلية المجتمعية في ليبيا، وتنتهي باختبار وشهادة رقمية.
            </p>
            <ul className="space-y-2 text-foreground">
              {["حسابات الجرعات للأطفال والكبار", "التعرّف على التفاعلات الدوائية الخطيرة", "مهارات الاستشارة الدوائية"].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2 text-[12px] font-semibold">
                    <CheckCircle2 className="size-4 text-secondary" /> {t}
                  </li>
                ),
              )}
            </ul>
          </div>
        ) : null}

        {tab === "الدروس" ? (
          <div className="surface-card divide-y divide-border overflow-hidden">
            {lessons.map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3.5">
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-xl",
                    l.done
                      ? "bg-secondary-soft text-secondary"
                      : l.current
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground",
                  )}
                >
                  {l.quiz ? (
                    <FileQuestion className="size-4" />
                  ) : l.done ? (
                    <CheckCircle2 className="size-4" />
                  ) : l.current ? (
                    <Play className="size-4" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p className={cn("truncate text-xs font-bold", l.current && "text-primary")}>{l.title}</p>
                  <p className="latin text-[11px] text-muted-foreground">{l.duration}</p>
                </div>
                {l.current ? <Chip tone="primary">جارٍ</Chip> : null}
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الاختبار" ? (
          <div className="space-y-4">
            <div className="surface-card p-4">
              <div className="flex items-center justify-between text-[11px] font-bold">
                <span className="text-muted-foreground">السؤال 3 من 10</span>
                <span className="latin text-primary">04:32</span>
              </div>
              <div className="mt-2">
                <Bar value={30} />
              </div>
              <h3 className="mt-4 text-sm font-bold leading-relaxed">
                أي مما يلي يُعد تفاعلًا خطيرًا مع الوارفارين؟
              </h3>
              <div className="mt-3 space-y-2">
                {["باراسيتامول بجرعة علاجية", "ميترونيدازول", "لوراتادين", "فيتامين ب12"].map((a, i) => (
                  <button
                    key={a}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-start text-xs font-semibold",
                      i === 1 ? "border-secondary bg-secondary-soft text-secondary" : "border-border bg-card",
                    )}
                  >
                    <span className="latin flex size-6 items-center justify-center rounded-full bg-muted text-[11px] font-bold">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="surface-card space-y-3 p-5 text-center">
              <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-secondary-soft text-2xl font-extrabold text-secondary">
                90%
              </span>
              <p className="text-sm font-bold">نتيجة الاختبار: ناجح</p>
              <p className="text-[11px] text-muted-foreground">9 من 10 إجابات صحيحة · تم فتح الشهادة</p>
              <ActionButton to="/student/certificates" variant="mint">
                عرض الشهادة
              </ActionButton>
            </div>
          </div>
        ) : null}

        {tab === "الشهادة" ? (
          <div className="surface-card space-y-3 p-5 text-center">
            <span className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-warning-soft text-warning">
              <Award className="size-7" />
            </span>
            <p className="text-sm font-bold">شهادة إتمام رقمية</p>
            <p className="text-[11px] text-muted-foreground">
              تُصدر تلقائيًا بعد إكمال جميع الدروس والنجاح في الاختبار، مع رمز تحقق QR.
            </p>
            <ActionButton to="/student/certificates">فتح مركز الشهادات</ActionButton>
          </div>
        ) : null}

        <SectionTitle title="دورات ذات صلة" href="/student/courses" />
        <div className="space-y-2.5">
          {courses
            .filter((c) => c.id !== course.id)
            .slice(0, 2)
            .map((c) => (
              <Link
                key={c.id}
                to="/student/courses/$courseId"
                params={{ courseId: c.id }}
                className="surface-card flex items-center gap-3 p-3.5"
              >
                <span className="flex size-11 items-center justify-center rounded-2xl gradient-mint text-secondary-foreground">
                  <Play className="size-4.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground">{c.provider}</p>
                </div>
                <Rating value={c.rating} />
              </Link>
            ))}
        </div>

        <ActionButton to="/student/courses">
          {course.progress !== undefined ? "متابعة الدرس الحالي" : "التسجيل في الدورة"}
        </ActionButton>
      </Screen>
    </div>
  );
}
