import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminButton, PageHeader, Switch, TextArea, TextInput, useToast } from "@/components/admin/ui";
import { defaultSettings, useAdminSettings, type AdminSettings } from "@/lib/adminData";
import { changeAdminPassword, useAdminSession } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin/settings")({ component: SettingsPage });

function SettingsPage() {
  const { settings, save } = useAdminSettings();
  const { session } = useAdminSession();
  const [d, setD] = useState<AdminSettings>(defaultSettings);
  const [pw, setPw] = useState("");
  const toast = useToast();
  useEffect(() => setD(settings), [settings]);
  const set = <K extends keyof AdminSettings>(k: K, v: AdminSettings[K]) => setD((x) => ({ ...x, [k]: v }));

  return (
    <div className="space-y-4">
      <PageHeader title="الإعدادات" />
      <section className="surface-card grid gap-3 p-4 sm:grid-cols-2">
        <TextInput label="اسم المنصة" value={d.platformName} onChange={(v) => set("platformName", v)} />
        <TextInput label="رابط الشعار" value={d.logo} onChange={(v) => set("logo", v)} />
        <div className="sm:col-span-2">
          <TextArea label="وصف المنصة" value={d.description} onChange={(v) => set("description", v)} />
        </div>
        <TextInput label="درجة النجاح %" type="number" value={String(d.passScore)} onChange={(v) => set("passScore", Number(v))} />
        <TextInput label="مدة الاختبار الافتراضية (دقيقة)" type="number" value={String(d.quizMinutes)} onChange={(v) => set("quizMinutes", Number(v))} />
        <TextInput label="مدة الجلسة (ساعة)" type="number" value={String(d.sessionHours)} onChange={(v) => set("sessionHours", Number(v))} />
        <TextInput label="أقل طول لكلمة المرور" type="number" value={String(d.minPasswordLength)} onChange={(v) => set("minPasswordLength", Number(v))} />
        <Switch label="إشعارات داخل التطبيق" checked={d.notifyInApp} onChange={(v) => set("notifyInApp", v)} />
        <Switch label="إشعارات البريد" checked={d.notifyEmail} onChange={(v) => set("notifyEmail", v)} />
        <Switch label="إضافة المديرين بالدعوة فقط" checked={d.adminOnlyInvite} onChange={(v) => set("adminOnlyInvite", v)} />
        <div className="sm:col-span-2">
          <AdminButton
            onClick={() => {
              save(d);
              toast.show("تم حفظ الإعدادات");
            }}
          >
            حفظ الإعدادات
          </AdminButton>
        </div>
      </section>
      <section className="surface-card space-y-3 p-4">
        <p className="text-xs font-extrabold">تغيير كلمة مرور المدير</p>
        <TextInput label="كلمة المرور الجديدة" type="password" value={pw} onChange={setPw} />
        <AdminButton
          variant="outline"
          onClick={() => {
            if (pw.length < d.minPasswordLength) return toast.show(`كلمة المرور يجب ألا تقل عن ${d.minPasswordLength} أحرف`);
            if (session) changeAdminPassword(session.email, pw);
            setPw("");
            toast.show("تم تغيير كلمة المرور");
          }}
        >
          تحديث كلمة المرور
        </AdminButton>
      </section>
      {toast.node}
    </div>
  );
}
