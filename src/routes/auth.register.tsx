import { createFileRoute } from "@tanstack/react-router";
import { User, Mail, Phone, Lock, GraduationCap } from "lucide-react";
import { ActionButton, AppBar, Field } from "@/components/kit";

export const Route = createFileRoute("/auth/register")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب — PharmaTrain Libya" },
      { name: "description", content: "أنشئ حساب طالب صيدلة وابدأ رحلة التدريب العملي والدورات." },
      { property: "og:title", content: "إنشاء حساب — فارما ترين ليبيا" },
      { property: "og:description", content: "تسجيل سريع ببيانات الجامعة ورقم الهاتف." },
    ],
  }),
  component: Register,
});

function Register() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="إنشاء حساب" back="/auth/login" subtitle="الخطوة 2 من 3" />
      <main className="space-y-5 px-5 py-5">
        <div className="surface-card flex items-center gap-3 p-3.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
            <GraduationCap className="size-5" />
          </span>
          <p className="text-xs font-semibold">حساب طالب صيدلة</p>
        </div>

        <div className="space-y-4">
          <Field label="الاسم الكامل" placeholder="أمينة الزروق" icon={User} />
          <Field label="البريد الجامعي" placeholder="student@uot.edu.ly" icon={Mail} />
          <Field label="رقم الهاتف" placeholder="+218 91 000 0000" icon={Phone} hint="سنرسل رمز تحقق إلى هذا الرقم" />
          <Field label="الجامعة / الكلية" placeholder="جامعة طرابلس — كلية الصيدلة" icon={GraduationCap} />
          <Field label="كلمة المرور" placeholder="8 أحرف على الأقل" type="password" icon={Lock} />
        </div>

        <label className="flex items-start gap-2 text-[11px] leading-relaxed text-muted-foreground">
          <input type="checkbox" className="mt-0.5 size-4 rounded border-input accent-primary" />
          أوافق على شروط الاستخدام وسياسة الخصوصية الخاصة بمنصة فارما ترين ليبيا.
        </label>

        <ActionButton to="/auth/otp">إرسال رمز التحقق</ActionButton>
      </main>
    </div>
  );
}
