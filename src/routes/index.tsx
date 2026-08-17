import { createFileRoute, Link } from "@tanstack/react-router";
import { Pill, ArrowLeft, Sparkles, Building2, Stethoscope, Factory, ShieldCheck, GraduationCap } from "lucide-react";
import { ActionButton } from "@/components/kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PharmaTrain Libya — منصة تدريب وتعليم طلاب الصيدلة" },
      {
        name: "description",
        content:
          "ابدأ تدريبك العملي في صيدليات ليبيا، تابع ساعاتك وتقييمك، واحصل على دورات وشهادات رقمية معتمدة.",
      },
      { property: "og:title", content: "PharmaTrain Libya — تدريب طلاب الصيدلة" },
      { property: "og:description", content: "تدريب عملي، دورات، اختبارات، وشهادات رقمية لطلاب الصيدلة في ليبيا." },
    ],
  }),
  component: Splash,
});

const entries = [
  { icon: GraduationCap, label: "طالب صيدلة", to: "/student" },
  { icon: Building2, label: "صيدلية", to: "/pharmacy" },
  { icon: Stethoscope, label: "مشرف تدريب", to: "/supervisor" },
  { icon: Factory, label: "شركة أدوية", to: "/company" },
  { icon: ShieldCheck, label: "مدير النظام", to: "/admin" },
];

function Splash() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] overflow-hidden">
      <div className="relative gradient-primary px-6 pb-16 pt-14 text-primary-foreground">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_85%_10%,white,transparent_50%),radial-gradient(circle_at_10%_80%,white,transparent_45%)]" />
        <div className="relative">
          <div className="flex size-16 items-center justify-center rounded-3xl bg-primary-foreground/15 backdrop-blur">
            <Pill className="size-8" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold leading-tight">
            فارما ترين ليبيا
            <span className="latin mt-1 block text-sm font-semibold opacity-80">PharmaTrain Libya</span>
          </h1>
          <p className="mt-3 max-w-[290px] text-sm leading-relaxed opacity-90">
            منصة واحدة تربط طلاب الصيدلة بالصيدليات والمشرفين وشركات الأدوية — تدريب عملي، دورات،
            وشهادات رقمية.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold">
            {["تدريب معتمد", "حضور QR", "شهادات رقمية"].map((t) => (
              <span key={t} className="rounded-full bg-primary-foreground/15 px-3 py-1.5 backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="-mt-8 space-y-4 rounded-t-[28px] bg-background px-5 pb-10 pt-6">
        <div className="space-y-2.5">
          <ActionButton to="/onboarding">
            ابدأ الآن <ArrowLeft className="size-4" />
          </ActionButton>
          <ActionButton to="/auth/login" variant="outline">
            لدي حساب — تسجيل الدخول
          </ActionButton>
        </div>

        <div className="pt-2">
          <p className="mb-3 flex items-center gap-1.5 px-1 text-xs font-bold text-muted-foreground">
            <Sparkles className="size-3.5 text-warning" />
            استعراض سريع لواجهات النظام
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {entries.map(({ icon: Icon, label, to }) => (
              <Link
                key={to}
                to={to as never}
                className="surface-card flex items-center gap-2.5 p-3.5 text-xs font-bold"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Icon className="size-4.5" />
                </span>
                {label}
              </Link>
            ))}
            <Link to="/design-system" className="surface-card flex items-center gap-2.5 p-3.5 text-xs font-bold">
              <span className="flex size-9 items-center justify-center rounded-xl bg-secondary-soft text-secondary">
                <Sparkles className="size-4.5" />
              </span>
              نظام التصميم
            </Link>
          </div>
          <Link
            to="/flow"
            className="mt-3 block rounded-2xl border border-dashed border-primary/40 bg-primary-soft/60 p-3.5 text-center text-xs font-bold text-primary"
          >
            خريطة النموذج التفاعلي ومسارات الانتقال
          </Link>
        </div>
      </div>
    </div>
  );
}
