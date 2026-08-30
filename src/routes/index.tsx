import { createFileRoute } from "@tanstack/react-router";
import {
  Pill,
  ArrowLeft,
  Building2,
  GraduationCap,
  Stethoscope,
  HelpCircle,
  ScanSearch,
} from "lucide-react";
import { ActionButton } from "@/components/kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PharmaTrain Libya — تدريب وتعليم طلاب الصيدلة" },
      {
        name: "description",
        content:
          "منصة واحدة تربط طلاب الصيدلة بالصيدليات — تدريب عملي، دورات، حالات سريرية، وأسئلة دوائية تفاعلية.",
      },
      { property: "og:title", content: "PharmaTrain Libya — تدريب طلاب الصيدلة" },
      {
        property: "og:description",
        content: "تدريب عملي في الصيدليات، دورات منظمة، حالات سريرية، وأسئلة دوائية.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Splash,
});

const highlights = [
  { icon: GraduationCap, label: "طلاب الصيدلة", desc: "مسار تعليمي متدرّج" },
  { icon: Building2, label: "الصيدليات", desc: "تدريب عملي معتمد" },
  { icon: Stethoscope, label: "حالات سريرية", desc: "حالات واقعية مبسّطة" },
  { icon: HelpCircle, label: "أسئلة دوائية", desc: "اختبر معرفتك بالأدوية" },
  { icon: ScanSearch, label: "الدواء بالصورة", desc: "تعرّف على الدواء" },
  { icon: Pill, label: "بطاقات الأدوية", desc: "معلومات مختصرة وسريعة" },
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
          <p className="mt-3 max-w-[300px] text-sm leading-relaxed opacity-90">
            منصة واحدة تربط طلاب الصيدلة بالصيدليات — تدريب عملي، دورات
          </p>
          <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold">
            {["دورات منظمة", "حالات سريرية", "اختبار معرفة الأدوية"].map((t) => (
              <span key={t} className="rounded-full bg-primary-foreground/15 px-3 py-1.5 backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="-mt-8 space-y-5 rounded-t-[28px] bg-background px-5 pb-10 pt-6">
        <div className="space-y-2.5">
          <ActionButton to="/onboarding">
            ابدأ الآن <ArrowLeft className="size-4" />
          </ActionButton>
          <ActionButton to="/auth/login" variant="outline">
            لدي حساب — تسجيل الدخول
          </ActionButton>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {highlights.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="surface-card space-y-1.5 p-3.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-4.5" />
              </span>
              <p className="text-xs font-bold">{label}</p>
              <p className="text-[10px] leading-relaxed text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>

        <p className="px-1 text-[10px] leading-relaxed text-muted-foreground">
          محتوى تعليمي لطلاب الصيدلة منظم وفق تصنيف WHO ATC، وليس أداة لتشخيص المرضى أو وصف الأدوية.
        </p>
      </div>
    </div>
  );
}
