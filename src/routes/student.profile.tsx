import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Bookmark,
  ChevronLeft,
  FileText,
  Globe,
  GraduationCap,
  LogOut,
  Moon,
  Pencil,
  Shield,
  Stethoscope,
  Timer,
} from "lucide-react";
import { ActionButton, AppBar, Avatar, Bar, Chip, Screen, SectionTitle } from "@/components/kit";
import { student } from "@/lib/mock";
import { modules, totalLessons } from "@/lib/curriculum";
import { clinicalCases } from "@/lib/cases";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/student/profile")({
  head: () => ({
    meta: [
      { title: "ملفي الشخصي — PharmaTrain Libya" },
      {
        name: "description",
        content: "بياناتك الأكاديمية، تقدمك التعليمي، دقائق التعلم، محفوظاتك، وإعدادات الحساب.",
      },
      { property: "og:title", content: "ملف الطالب — فارما ترين ليبيا" },
      { property: "og:description", content: "تقدمك التعليمي ومحفوظاتك في صفحة واحدة." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const settings = [
  { icon: Pencil, label: "تعديل الملف الشخصي" },
  { icon: Bell, label: "الإشعارات" },
  { icon: Globe, label: "اللغة — العربية", to: "/language" },
  { icon: Moon, label: "المظهر" },
  { icon: Shield, label: "الخصوصية والأمان" },
];

function Profile() {
  const { state } = useStore();
  const done = state.completedLessons.length;
  const progress = totalLessons ? Math.round((done / totalLessons) * 100) : 0;
  const minutes = modules
    .flatMap((m) => m.lessons)
    .filter((l) => state.completedLessons.includes(l.id))
    .reduce((s, l) => s + l.minutes, 0);

  return (
    <div>
      <AppBar title="حسابي" />
      <div className="gradient-primary px-4 pb-8 pt-5 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar initials={student.initials} size="lg" />
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold">{student.name}</p>
            <p className="text-[11px] opacity-85">{student.university}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="rounded-full bg-primary-foreground/18 px-2.5 py-1 text-[10px] font-bold">
                {student.year}
              </span>
              <span className="latin rounded-full bg-primary-foreground/18 px-2.5 py-1 text-[10px] font-bold">
                PTL-2026-0431
              </span>
            </div>
          </div>
        </div>
      </div>

      <Screen className="-mt-4 space-y-5 rounded-t-3xl bg-background pt-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: GraduationCap, l: "درسًا مكتملًا", v: String(done) },
            { icon: Timer, l: "دقيقة تعلم", v: String(minutes) },
            { icon: Stethoscope, l: "حالة محلولة", v: String(state.solvedCases.length) },
          ].map(({ icon: Icon, l, v }) => (
            <div key={l} className="surface-card p-3 text-center">
              <Icon className="mx-auto size-4 text-primary" />
              <p className="latin mt-1.5 text-base font-extrabold">{v}</p>
              <p className="text-[10px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <div className="surface-card space-y-3 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold">التقدم في المنهج</p>
            <span className="latin text-xs font-extrabold text-primary">{progress}%</span>
          </div>
          <Bar value={progress} />
          <p className="text-[11px] text-muted-foreground">
            <span className="latin font-bold text-primary">{done}</span> من{" "}
            <span className="latin">{totalLessons}</span> درسًا في{" "}
            <span className="latin">{modules.length}</span> وحدة تعليمية، و{" "}
            <span className="latin">{state.solvedCases.length}</span> من{" "}
            <span className="latin">{clinicalCases.length}</span> حالة سريرية.
          </p>
        </div>

        <section>
          <SectionTitle title="سجلاتي" />
          <div className="surface-card divide-y divide-border overflow-hidden">
            {[
              { icon: Bookmark, label: "المحفوظات", to: "/student/saved" },
              { icon: Stethoscope, label: "الحالات السريرية", to: "/student/cases" },
              { icon: FileText, label: "محاكي قراءة الوصفات", to: "/student/prescriptions" },
              { icon: GraduationCap, label: "تقدم التدريب", to: "/student/training" },
            ].map(({ icon: Icon, label, to }) => (
              <Link key={label} to={to as never} className="flex items-center gap-3 px-4 py-3.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-4" />
                </span>
                <span className="flex-1 text-xs font-semibold">{label}</span>
                <ChevronLeft className="size-4 text-muted-foreground rtl:rotate-180" />
              </Link>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="الإعدادات" />
          <div className="surface-card divide-y divide-border overflow-hidden">
            {settings.map(({ icon: Icon, label, to }) => {
              const body = (
                <>
                  <span className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Icon className="size-4" />
                  </span>
                  <span className="flex-1 text-xs font-semibold">{label}</span>
                  <ChevronLeft className="size-4 text-muted-foreground rtl:rotate-180" />
                </>
              );
              return to ? (
                <Link key={label} to={to as never} className="flex items-center gap-3 px-4 py-3.5">
                  {body}
                </Link>
              ) : (
                <div key={label} className="flex items-center gap-3 px-4 py-3.5">
                  {body}
                </div>
              );
            })}
          </div>
        </section>

        <Chip tone="secondary">الحساب موثّق من كلية الصيدلة</Chip>

        <ActionButton to="/auth/login" variant="ghost">
          <LogOut className="size-4" /> تسجيل الخروج
        </ActionButton>
      </Screen>
    </div>
  );
}
