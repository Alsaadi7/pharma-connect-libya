import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Bell,
  Clock,
  CalendarCheck,
  Award,
  QrCode,
  MapPin,
  Stethoscope,
  FileText,
  ChevronLeft,
} from "lucide-react";
import {
  Avatar,
  Bar,
  Chip,
  CourseCard,
  PharmacyCard,
  Ring,
  Screen,
  SectionTitle,
  StatCard,
} from "@/components/kit";
import { courses, nextTraining, notifications, pharmacies, student } from "@/lib/mock";

export const Route = createFileRoute("/student/")({
  head: () => ({
    meta: [
      { title: "لوحة الطالب — PharmaTrain Libya" },
      { name: "description", content: "تقدم التدريب، الساعات المنجزة، التدريب القادم، والدورات المقترحة في مكان واحد." },
      { property: "og:title", content: "لوحة الطالب — فارما ترين ليبيا" },
      { property: "og:description", content: "متابعة يومية لتدريبك ودوراتك وإشعاراتك." },
    ],
  }),
  component: StudentHome,
});

const quick = [
  { icon: QrCode, label: "حضور QR", to: "/student/training" },
  { icon: MapPin, label: "صيدليات", to: "/student/pharmacies" },
  { icon: Stethoscope, label: "حالات سريرية", to: "/student/cases" },
  { icon: Award, label: "شهاداتي", to: "/student/certificates" },
];

function StudentHome() {
  return (
    <div>
      <header className="gradient-primary rounded-b-[28px] px-4 pb-8 pt-5 text-primary-foreground">
        <div className="flex items-center gap-3">
          <Avatar initials={student.initials} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] opacity-80">صباح الخير 👋</p>
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
            <span className="latin absolute -top-1 flex size-4.5 items-center justify-center rounded-full bg-warning text-[10px] font-bold text-warning-foreground end-0">
              3
            </span>
          </Link>
        </div>

        <div className="mt-5 flex items-center gap-4 rounded-3xl bg-primary-foreground/12 p-4 backdrop-blur">
          <Ring value={student.progress} />
          <div className="flex-1">
            <p className="text-xs font-bold">تقدم التدريب العملي</p>
            <p className="latin mt-1 text-lg font-extrabold">
              {student.hoursDone} / {student.hoursTotal} ساعة
            </p>
            <p className="mt-1 text-[11px] opacity-85">متبقٍ {student.hoursTotal - student.hoursDone} ساعة لإصدار الشهادة</p>
          </div>
        </div>
      </header>

      <Screen>
        <div className="grid grid-cols-4 gap-2">
          {quick.map(({ icon: Icon, label, to }) => (
            <Link key={label} to={to as never} className="surface-card flex flex-col items-center gap-1.5 px-1 py-3">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-4.5" />
              </span>
              <span className="text-center text-[10px] font-bold leading-tight">{label}</span>
            </Link>
          ))}
        </div>

        <section>
          <SectionTitle title="التدريب القادم" href="/student/training" />
          <Link to="/student/training" className="surface-card block overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border p-4">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-secondary-soft text-secondary">
                <CalendarCheck className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">{nextTraining.pharmacy}</p>
                <p className="text-[11px] text-muted-foreground">
                  {nextTraining.date} · <span className="latin">{nextTraining.time}</span>
                </p>
              </div>
              <Chip tone="secondary">مؤكد</Chip>
            </div>
            <div className="flex items-center justify-between px-4 py-3 text-[11px] text-muted-foreground">
              <span>المشرف: {nextTraining.supervisor}</span>
              <span className="inline-flex items-center gap-1 font-bold text-primary">
                سجّل الحضور <ChevronLeft className="size-3.5 rtl:rotate-180" />
              </span>
            </div>
          </Link>
        </section>

        <section className="grid grid-cols-2 gap-3">
          <StatCard icon={Clock} label="ساعات هذا الأسبوع" value="22.5" hint="+3.5 عن الأسبوع الماضي" />
          <StatCard icon={FileText} label="تقارير يومية مسلّمة" value="18" tone="secondary" />
          <StatCard icon={Award} label="شهادات مكتسبة" value="2" tone="warning" />
          <StatCard icon={Stethoscope} label="حالات سريرية معلّقة" value="2" tone="error" />
        </section>

        <section>
          <SectionTitle title="أكمل ما بدأته" href="/student/courses" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {courses
              .filter((c) => c.progress !== undefined)
              .map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
          </div>
        </section>

        <section>
          <SectionTitle title="دورات مقترحة لك" href="/student/courses" />
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
            {courses
              .filter((c) => c.progress === undefined)
              .map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
          </div>
        </section>

        <section>
          <SectionTitle title="صيدليات قريبة منك" href="/student/pharmacies" />
          <div className="space-y-3">
            {pharmacies.slice(0, 2).map((p) => (
              <PharmacyCard key={p.id} pharmacy={p} />
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="آخر الإشعارات" href="/student/notifications" />
          <div className="surface-card divide-y divide-border overflow-hidden">
            {notifications.map((n) => (
              <div key={n.id} className="flex gap-3 p-3.5">
                <span
                  className={`mt-1 size-2 shrink-0 rounded-full ${
                    n.type === "success" ? "bg-secondary" : n.type === "warning" ? "bg-warning" : "bg-primary"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">{n.title}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">{n.body}</p>
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">{n.time}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="مسار التدريب الكامل" />
          <div className="surface-card p-4">
            <div className="mb-3 flex items-center justify-between text-[11px] font-bold">
              <span className="text-primary">المرحلة 3 من 6: الحضور والتقارير</span>
              <span className="latin text-muted-foreground">{student.progress}%</span>
            </div>
            <Bar value={student.progress} />
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              الطلب ✓ · الموافقة ✓ · الجدول ✓ · الحضور والساعات (جارٍ) · تقييم المشرف · الشهادة
            </p>
          </div>
        </section>
      </Screen>
    </div>
  );
}
