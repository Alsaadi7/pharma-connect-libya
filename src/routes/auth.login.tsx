import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, Lock, Fingerprint } from "lucide-react";
import { ActionButton, AppBar, Field } from "@/components/kit";

export const Route = createFileRoute("/auth/login")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول — PharmaTrain Libya" },
      { name: "description", content: "سجّل الدخول لمتابعة تدريبك العملي ودوراتك وشهاداتك." },
      { property: "og:title", content: "تسجيل الدخول — فارما ترين ليبيا" },
      { property: "og:description", content: "دخول الطلاب والصيدليات والمشرفين وشركات الأدوية." },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="تسجيل الدخول" back="/" />
      <main className="space-y-6 px-5 py-6">
        <div>
          <h2 className="text-xl font-extrabold">مرحبًا بعودتك 👋</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            أدخل بيانات حسابك للمتابعة إلى لوحتك.
          </p>
        </div>

        <div className="space-y-4">
          <Field label="البريد الإلكتروني أو رقم الهاتف" placeholder="student@uot.edu.ly" icon={Mail} />
          <Field label="كلمة المرور" placeholder="••••••••" type="password" icon={Lock} />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <input type="checkbox" className="size-4 rounded border-input accent-primary" />
              تذكّرني
            </label>
            <Link to="/auth/forgot" className="text-xs font-bold text-primary">
              نسيت كلمة المرور؟
            </Link>
          </div>
        </div>

        <div className="space-y-2.5">
          <ActionButton to="/student">دخول كطالب</ActionButton>
          <ActionButton to="/admin" variant="outline">
            مدير النظام
          </ActionButton>
        </div>

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-secondary-soft py-3 text-xs font-bold text-secondary"
        >
          <Fingerprint className="size-4" /> الدخول بالبصمة
        </button>

        <p className="text-center text-xs text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link to="/auth/register" className="font-bold text-primary">
            إنشاء حساب جديد
          </Link>
        </p>

      </main>
    </div>
  );
}
