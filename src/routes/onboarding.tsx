import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search, CalendarCheck, Award, ArrowLeft, Globe } from "lucide-react";
import { ActionButton } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "تعرّف على المنصة — PharmaTrain Libya" },
      { name: "description", content: "ثلاث خطوات لفهم كيف تجد تدريبك، تتابع ساعاتك، وتحصل على شهادتك." },
      { property: "og:title", content: "تعرّف على منصة فارما ترين ليبيا" },
      { property: "og:description", content: "ابحث عن صيدلية، تابع تدريبك، واحصل على شهادة رقمية." },
    ],
  }),
  component: Onboarding,
});

const slides = [
  {
    icon: Search,
    title: "اعثر على تدريبك العملي",
    body: "ابحث بين صيدليات ليبيا المعتمدة حسب المدينة والتخصص والمقاعد المتاحة، وقدّم طلبك في دقيقة.",
  },
  {
    icon: CalendarCheck,
    title: "تابع الحضور والساعات",
    body: "سجّل حضورك بمسح رمز QR في الصيدلية، وارفع تقريرك اليومي، وشاهد ساعاتك تتراكم تلقائيًا.",
  },
  {
    icon: Award,
    title: "تعلّم واحصل على شهادتك",
    body: "دورات وفيديوهات وحالات سريرية واختبارات، وتقييم من مشرفك، ثم شهادة رقمية قابلة للتحقق.",
  },
];

function Onboarding() {
  const [i, setI] = useState(0);
  const slide = slides[i]!;
  const Icon = slide.icon;
  const last = i === slides.length - 1;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col px-6 pb-8 pt-6">
      <div className="flex items-center justify-between">
        <Link to="/language" className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
          <Globe className="size-4" /> العربية
        </Link>
        <Link to="/auth/login" className="text-xs font-bold text-primary">
          تخطي
        </Link>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <div className="relative flex size-44 items-center justify-center rounded-full bg-primary-soft">
          <div className="absolute inset-4 rounded-full border-2 border-dashed border-primary/30" />
          <Icon className="size-16 text-primary" />
          <span className="absolute bottom-4 end-3 flex size-10 items-center justify-center rounded-2xl gradient-mint text-secondary-foreground">
            ⚕
          </span>
        </div>
        <h2 className="mt-8 text-2xl font-extrabold leading-snug">{slide.title}</h2>
        <p className="mt-3 max-w-[300px] text-sm leading-relaxed text-muted-foreground">{slide.body}</p>

        <div className="mt-8 flex items-center gap-2">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={cn(
                "h-2 rounded-full transition-all",
                idx === i ? "w-7 bg-primary" : "w-2 bg-border",
              )}
            />
          ))}
        </div>
      </div>

      <div className="space-y-2.5">
        {last ? (
          <ActionButton to="/auth/register">
            إنشاء حساب <ArrowLeft className="size-4" />
          </ActionButton>
        ) : (
          <ActionButton onClick={() => setI(i + 1)}>
            التالي <ArrowLeft className="size-4" />
          </ActionButton>
        )}
        <ActionButton to="/auth/login" variant="ghost">
          تسجيل الدخول
        </ActionButton>
      </div>
    </div>
  );
}
