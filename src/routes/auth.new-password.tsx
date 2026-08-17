import { createFileRoute } from "@tanstack/react-router";
import { Lock, CheckCircle2 } from "lucide-react";
import { ActionButton, AppBar, Field } from "@/components/kit";

export const Route = createFileRoute("/auth/new-password")({
  head: () => ({
    meta: [
      { title: "كلمة مرور جديدة — PharmaTrain Libya" },
      { name: "description", content: "أنشئ كلمة مرور جديدة قوية لحسابك في المنصة." },
      { property: "og:title", content: "كلمة مرور جديدة — فارما ترين" },
      { property: "og:description", content: "تأمين الحساب بكلمة مرور قوية." },
    ],
  }),
  component: NewPassword,
});

const rules = ["8 أحرف على الأقل", "حرف كبير وحرف صغير", "رقم واحد على الأقل"];

function NewPassword() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="كلمة مرور جديدة" back="/auth/otp" />
      <main className="space-y-6 px-5 py-6">
        <Field label="كلمة المرور الجديدة" placeholder="••••••••" type="password" icon={Lock} />
        <Field label="تأكيد كلمة المرور" placeholder="••••••••" type="password" icon={Lock} />

        <ul className="surface-card space-y-2 p-4">
          {rules.map((r) => (
            <li key={r} className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="size-4 text-secondary" />
              {r}
            </li>
          ))}
        </ul>

        <ActionButton to="/student">حفظ والدخول</ActionButton>
      </main>
    </div>
  );
}
