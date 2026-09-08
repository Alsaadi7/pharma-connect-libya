import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AdminButton, Switch, TextInput } from "@/components/admin/ui";
import { adminLogin, defaultAdminCredentials, useAdminSession } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin-login")({
  head: () => ({
    meta: [
      { title: "دخول الإدارة — Pharma Connect Libya" },
      { name: "description", content: "تسجيل دخول مخصص لمديري منصة Pharma Connect Libya لإدارة المحتوى والطلاب." },
      { property: "og:title", content: "دخول الإدارة — Pharma Connect Libya" },
      { property: "og:description", content: "صفحة دخول آمنة للوحة إدارة المنصة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLoginPage,
});

function AdminLoginPage() {
  const navigate = useNavigate();
  const { session, ready } = useAdminSession();
  const creds = defaultAdminCredentials();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready && session) navigate({ to: "/admin", replace: true });
  }, [ready, session, navigate]);

  const submit = () => {
    const res = adminLogin(email, password, remember);
    if (!res.ok) {
      setError(res.error ?? "تعذّر تسجيل الدخول.");
      return;
    }
    navigate({ to: "/admin", replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-5">
      <div className="surface-card w-full max-w-md space-y-4 p-6">
        <div className="flex items-center gap-3">
          <span className="gradient-primary rounded-2xl p-3 text-primary-foreground">
            <ShieldCheck className="size-5" />
          </span>
          <div>
            <h1 className="text-base font-extrabold">دخول الإدارة</h1>
            <p className="text-[11px] text-muted-foreground">Pharma Connect Libya · منطقة محمية</p>
          </div>
        </div>

        <TextInput label="البريد الإلكتروني" value={email} onChange={setEmail} placeholder={creds.email} type="email" />
        <TextInput label="كلمة المرور" value={password} onChange={setPassword} type="password" />
        <Switch label="تذكرني على هذا الجهاز" checked={remember} onChange={setRemember} />

        {error ? <p className="rounded-xl bg-destructive/10 p-3 text-[11px] font-bold text-destructive">{error}</p> : null}

        <AdminButton onClick={submit}>تسجيل الدخول</AdminButton>

        <p className="rounded-xl bg-muted p-3 text-[10px] leading-relaxed text-muted-foreground">
          حساب المدير الافتراضي: <span className="latin font-bold">{creds.email}</span> / كلمة المرور{" "}
          <span className="latin font-bold">{creds.password}</span> — يمكنك تغييرها من الإعدادات بعد الدخول.
        </p>
      </div>
    </div>
  );
}
