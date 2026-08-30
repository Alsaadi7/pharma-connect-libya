import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Building2,
  Stethoscope,
  HelpCircle,
  ScanSearch,
  GraduationCap,
  TrendingUp,
  Bookmark,
  ChevronLeft,
} from "lucide-react";
import { Avatar, Bar, Screen, SectionTitle } from "@/components/kit";
import { DrugSearch } from "@/components/DrugCard";
import { modules, totalLessons } from "@/lib/curriculum";
import { platformNotifications } from "@/lib/notifications";
import { student } from "@/lib/mock";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "لوحة الطالب — PharmaTrain Libya" },
      {
        name: "description",
        content: "الصيدليات، الحالات السريرية، أسئلة الأدوية، الدواء بالصورة، الدورات وتقدم التدريب في مكان واحد.",
      },
      { property: "og:title", content: "لوحة الطالب — فارما ترين ليبيا" },
      { property: "og:description", content: "كل أدوات التعلم والتدريب لطالب الصيدلة في شاشة واحدة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: StudentHome,
});

const cards = [
  { icon: Building2, label: "الصيدليات", desc: "تدريب عملي", to: "/student/pharmacies", tone: "primary" },
  { icon: Stethoscope, label: "الحالات السريرية", desc: "حالات واقعية", to: "/student/cases", tone: "secondary" },
  { icon: HelpCircle, label: "أسئلة عن الأدوية", desc: "اختبار تفاعلي", to: "/student/drug-questions", tone: "primary" },
  { icon: ScanSearch, label: "تعرف على الدواء بالصورة", desc: "3 مستويات", to: "/student/drug-images", tone: "warning" },
  { icon: GraduationCap, label: "الدورات", desc: "16 وحدة", to: "/student/courses", tone: "secondary" },
  { icon: TrendingUp, label: "تقدم التدريب", desc: "تقدمك التعليمي", to: "/student/training", tone: "primary" },
  { icon: Bell, label: "مركز الإشعارات", desc: "تحديثات المنصة", to: "/student/notifications", tone: "warning" },
  { icon: Bookmark, label: "المحفوظات", desc: "مراجعة سريعة", to: "/student/saved", tone: "secondary" },
];

const toneClass = {
  primary: "bg-primary-soft text-primary",
  secondary: "bg-secondary-soft text-secondary",
  warning: "bg-warning-soft text-warning",
} as const;

function StudentHome() {
  const { state } = useStore();
  const done = state.completedLessons.length;
  const progress = Math.round((done / totalLessons) * 100);
  const unread = platformNotifications.filter((n) => !state.readNotifications.includes(n.id)).length;
  const current = modules.find((m) => m.lessons.some((l) => !state.completedLessons.includes(l.id))) ?? modules[0]!;

  return (
    <div>
      <header className="gradient-primary rounded-b-[28px] px-4 pb-8 pt-5 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar initials={student.initials} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] opacity-80">أهلًا بك 👋</p>
            <p className="truncate text-base font-bold">{student.name}</p>
            <p className="truncate text-[11px] opacity-80">
              {student.university} · {student.year}
            </p>
          </div>
          <Link
            to="/student/notifications"
            className="relative flex size-10 items-center justify-center rounded-2xl bg-primary-foreground/15 backdrop-blur"
            aria-label="الإشعارات"
          >
            <Bell className="size-5" />
            {unread ? (
              <span className="latin absolute -top-1 flex size-4.5 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground end-0">
                {unread}
              </span>
            ) : null}
          </Link>
        </div>

        <Link to="/student/training" className="mt-5 block rounded-3xl bg-primary-foreground/12 p-4 backdrop-blur">
          <div className="flex items-center justify-between text-xs font-bold">
            <span>تقدمك التعليمي</span>
            <span className="latin">{progress}%</span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full rounded-full bg-primary-foreground" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-2 text-[11px] opacity-85">
            <span className="latin">{done}</span> من <span className="latin">{totalLessons}</span> درسًا مكتملًا
          </p>
        </Link>
      </header>

      <Screen>
        <DrugSearch />

        <section>
          <SectionTitle title="ابدأ من هنا" />
          <div className="grid grid-cols-2 gap-2.5">
            {cards.map(({ icon: Icon, label, desc, to, tone }) => (
              <Link key={to} to={to as never} className="surface-card space-y-2 p-3.5">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl ${toneClass[tone as keyof typeof toneClass]}`}
                >
                  <Icon className="size-5" />
                </span>
                <p className="text-xs font-bold leading-snug">{label}</p>
                <p className="text-[10px] text-muted-foreground">{desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="أكمل ما بدأته" href="/student/courses" />
          <Link
            to="/student/courses/$courseId"
            params={{ courseId: current.id }}
            className="surface-card block space-y-3 p-4"
          >
            <div className="flex items-center justify-between">
              <span className="latin text-[10px] font-bold text-primary">{current.code}</span>
              <span className="latin text-[10px] text-muted-foreground">
                {current.lessons.filter((l) => state.completedLessons.includes(l.id)).length}/{current.lessons.length}
              </span>
            </div>
            <p className="text-sm font-bold">{current.title}</p>
            <Bar
              value={Math.round(
                (current.lessons.filter((l) => state.completedLessons.includes(l.id)).length / current.lessons.length) *
                  100,
              )}
            />
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
              متابعة التعلم <ChevronLeft className="size-3.5 rtl:rotate-180" />
            </span>
          </Link>
        </section>

        <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
          المحتوى الدوائي تعليمي ومنظم وفق تصنيف WHO ATC، وقابل للمراجعة والتحديث.
        </p>
      </Screen>
    </div>
  );
}
