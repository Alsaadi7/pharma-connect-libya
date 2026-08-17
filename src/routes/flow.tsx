import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AppBar, Chip, Screen, SectionTitle } from "@/components/kit";

export const Route = createFileRoute("/flow")({
  head: () => ({
    meta: [
      { title: "خريطة المسارات — PharmaTrain Libya" },
      {
        name: "description",
        content: "خريطة تفاعلية لكل شاشات منصة فارما ترين: الترحيب، التسجيل، تطبيق الطالب، الصيدلية، المشرف، الشركة والمدير.",
      },
      { property: "og:title", content: "خريطة المسارات — فارما ترين ليبيا" },
      { property: "og:description", content: "تنقّل سريع بين جميع شاشات المنصة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FlowPage,
});

const groups = [
  {
    g: "الترحيب والدخول",
    items: [
      { t: "شاشة البداية", to: "/" as const },
      { t: "اختيار اللغة", to: "/language" as const },
      { t: "التعريف بالمنصة", to: "/onboarding" as const },
      { t: "نوع الحساب", to: "/auth/account-type" as const },
      { t: "تسجيل الدخول", to: "/auth/login" as const },
      { t: "إنشاء حساب", to: "/auth/register" as const },
      { t: "رمز التحقق", to: "/auth/otp" as const },
      { t: "استعادة كلمة المرور", to: "/auth/forgot" as const },
      { t: "كلمة مرور جديدة", to: "/auth/new-password" as const },
    ],
  },
  {
    g: "تطبيق الطالب",
    items: [
      { t: "لوحة الطالب", to: "/student" as const },
      { t: "الدورات", to: "/student/courses" as const },
      { t: "التدريب العملي", to: "/student/training" as const },
      { t: "الصيدليات", to: "/student/pharmacies" as const },
      { t: "الحالات السريرية", to: "/student/cases" as const },
      { t: "الشهادات", to: "/student/certificates" as const },
      { t: "الرسائل", to: "/student/messages" as const },
      { t: "الإشعارات", to: "/student/notifications" as const },
      { t: "الملف الشخصي", to: "/student/profile" as const },
    ],
  },
  {
    g: "لوحات الأدوار",
    items: [
      { t: "تطبيق الصيدلية", to: "/pharmacy" as const },
      { t: "تطبيق المشرف", to: "/supervisor" as const },
      { t: "شركة الأدوية", to: "/company" as const },
      { t: "مدير النظام", to: "/admin" as const },
    ],
  },
  {
    g: "المراجع",
    items: [{ t: "نظام التصميم", to: "/design-system" as const }],
  },
];

function FlowPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="خريطة المسارات" subtitle="كل شاشات المنصة في مكان واحد" back="/" />
      <Screen className="space-y-6">
        {groups.map((group) => (
          <section key={group.g}>
            <SectionTitle title={group.g} />
            <div className="surface-card divide-y divide-border overflow-hidden">
              {group.items.map((item, i) => (
                <Link key={item.t} to={item.to} className="flex items-center gap-3 p-3.5">
                  <span className="latin flex size-8 items-center justify-center rounded-xl bg-primary-soft text-[11px] font-bold text-primary">
                    {i + 1}
                  </span>
                  <p className="flex-1 text-xs font-bold">{item.t}</p>
                  <Chip>عرض</Chip>
                  <ArrowLeft className="size-4 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </Screen>
    </div>
  );
}
