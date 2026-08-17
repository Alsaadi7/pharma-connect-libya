import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import { ActionButton, AppBar } from "@/components/kit";

export const Route = createFileRoute("/auth/otp")({
  head: () => ({
    meta: [
      { title: "رمز التحقق — PharmaTrain Libya" },
      { name: "description", content: "أدخل رمز التحقق المرسل إلى رقم هاتفك لتأكيد حسابك." },
      { property: "og:title", content: "رمز التحقق — فارما ترين ليبيا" },
      { property: "og:description", content: "تحقق من الهاتف بأربعة أرقام لتأمين الحساب." },
    ],
  }),
  component: Otp,
});

function Otp() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="التحقق من الهاتف" back="/auth/register" subtitle="الخطوة 3 من 3" />
      <main className="space-y-6 px-5 py-6 text-center">
        <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-secondary-soft text-secondary">
          <ShieldCheck className="size-9" />
        </span>
        <div>
          <h2 className="text-lg font-extrabold">أدخل رمز التحقق</h2>
          <p className="mt-1.5 text-xs text-muted-foreground">
            أرسلنا رمزًا مكوّنًا من 4 أرقام إلى <span className="latin font-bold text-foreground">+218 91 000 0000</span>
          </p>
        </div>

        <div className="latin flex justify-center gap-3" dir="ltr">
          {["8", "4", "", ""].map((v, i) => (
            <input
              key={i}
              defaultValue={v}
              maxLength={1}
              inputMode="numeric"
              className="size-14 rounded-2xl border-2 border-input bg-card text-center text-xl font-bold outline-none focus:border-primary focus:ring-4 focus:ring-primary/12"
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          لم يصلك الرمز؟ إعادة الإرسال بعد <span className="latin font-bold text-primary">00:42</span>
        </p>

        <div className="space-y-2.5 text-start">
          <ActionButton to="/auth/new-password">تأكيد</ActionButton>
          <ActionButton to="/student" variant="ghost">
            تخطي إلى لوحة الطالب
          </ActionButton>
        </div>
      </main>
    </div>
  );
}
