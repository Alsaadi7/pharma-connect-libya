import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { GraduationCap, Building2, Stethoscope, Factory, Check } from "lucide-react";
import { ActionButton, AppBar } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/auth/account-type")({
  head: () => ({
    meta: [
      { title: "اختيار نوع الحساب — PharmaTrain Libya" },
      { name: "description", content: "أنشئ حسابك كطالب صيدلة أو صيدلية أو مشرف تدريب أو شركة أدوية." },
      { property: "og:title", content: "نوع الحساب — فارما ترين ليبيا" },
      { property: "og:description", content: "واجهة مخصصة لكل نوع مستخدم في المنصة." },
    ],
  }),
  component: AccountType,
});

const types = [
  { id: "student", icon: GraduationCap, label: "طالب صيدلة", desc: "ابحث عن تدريب، تابع ساعاتك، تعلّم واحصل على شهادات" },
  { id: "pharmacy", icon: Building2, label: "صيدلية", desc: "استقبل المتدربين، أدر المقاعد والجدول والتقييم" },
  { id: "supervisor", icon: Stethoscope, label: "مشرف تدريب", desc: "تابع الطلاب، قيّم المهارات، وأنشئ حالات سريرية" },
  { id: "company", icon: Factory, label: "شركة أدوية", desc: "انشر دورات وورش ومحتوى تعليمي معتمد" },
];

function AccountType() {
  const [sel, setSel] = useState("student");
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="نوع الحساب" back="/auth/login" subtitle="الخطوة 1 من 3" />
      <main className="space-y-5 px-4 py-5">
        <div className="flex gap-1.5 px-1">
          {[0, 1, 2].map((s) => (
            <span key={s} className={cn("h-1.5 flex-1 rounded-full", s === 0 ? "bg-primary" : "bg-border")} />
          ))}
        </div>
        <h2 className="px-1 text-lg font-extrabold">من أنت؟</h2>

        <div className="space-y-3">
          {types.map(({ id, icon: Icon, label, desc }) => (
            <button
              key={id}
              type="button"
              onClick={() => setSel(id)}
              className={cn(
                "flex w-full items-start gap-3 rounded-2xl border-2 bg-card p-4 text-start shadow-[var(--shadow-soft)] transition-colors",
                sel === id ? "border-primary" : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-2xl",
                  sel === id ? "gradient-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-bold">{label}</span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-muted-foreground">{desc}</span>
              </span>
              {sel === id ? (
                <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-3.5" />
                </span>
              ) : null}
            </button>
          ))}
        </div>

        <ActionButton to="/auth/register">متابعة</ActionButton>
        <p className="text-center text-xs text-muted-foreground">
          حسابات مديري النظام تُنشأ داخليًا —{" "}
          <Link to="/admin" className="font-bold text-primary">
            لوحة الإدارة
          </Link>
        </p>
      </main>
    </div>
  );
}
