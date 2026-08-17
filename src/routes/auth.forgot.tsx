import { createFileRoute } from "@tanstack/react-router";
import { Mail, KeyRound } from "lucide-react";
import { ActionButton, AppBar, Field } from "@/components/kit";

export const Route = createFileRoute("/auth/forgot")({
  head: () => ({
    meta: [
      { title: "استعادة كلمة المرور — PharmaTrain Libya" },
      { name: "description", content: "أدخل بريدك أو رقم هاتفك لاستلام رمز إعادة تعيين كلمة المرور." },
      { property: "og:title", content: "استعادة كلمة المرور — فارما ترين" },
      { property: "og:description", content: "إعادة تعيين آمنة عبر رمز تحقق." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="نسيت كلمة المرور" back="/auth/login" />
      <main className="space-y-6 px-5 py-6">
        <span className="flex size-16 items-center justify-center rounded-3xl bg-warning-soft text-warning">
          <KeyRound className="size-7" />
        </span>
        <div>
          <h2 className="text-lg font-extrabold">لا مشكلة</h2>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
            أدخل البريد الإلكتروني أو رقم الهاتف المسجّل وسنرسل لك رمزًا لإعادة تعيين كلمة المرور.
          </p>
        </div>
        <Field label="البريد الإلكتروني أو رقم الهاتف" placeholder="student@uot.edu.ly" icon={Mail} />
        <ActionButton to="/auth/otp">إرسال الرمز</ActionButton>
      </main>
    </div>
  );
}
