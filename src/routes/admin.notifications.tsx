import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { Pill } from "@/components/admin/ui";
import { seedNotifications, useCollection, type AdminNotification } from "@/lib/adminData";

export const Route = createFileRoute("/admin/notifications")({ component: NotifPage });

function NotifPage() {
  const api = useCollection<AdminNotification>("notifications:v1", seedNotifications);
  return (
    <CrudPage<AdminNotification>
      title="الإشعارات"
      api={api}
      exportName="notifications"
      labelOf={(r) => r.title}
      searchOf={(r) => `${r.title} ${r.message}`}
      empty={() => ({ title: "", message: "", link: "", target: "all", targetValue: "", status: "sent", at: Date.now() })}
      fields={[
        { key: "title", label: "العنوان" },
        { key: "link", label: "الرابط (اختياري)" },
        { key: "target", label: "المستهدف", type: "select", options: [{ value: "all", label: "جميع الطلاب" }, { value: "group", label: "مجموعة" }, { value: "one", label: "طالب محدد" }] },
        { key: "targetValue", label: "اسم المجموعة / البريد" },
        { key: "status", label: "الحالة", type: "select", options: [{ value: "sent", label: "إرسال الآن" }, { value: "draft", label: "مسودة" }] },
        { key: "message", label: "نص الإشعار", type: "textarea" },
      ]}
      columns={[
        { key: "t", label: "الإشعار", render: (r) => <b>{r.title}</b>, sort: (r) => r.title },
        { key: "g", label: "المستهدف", render: (r) => (r.target === "all" ? "الجميع" : r.targetValue || r.target) },
        { key: "d", label: "التاريخ", render: (r) => new Date(r.at).toLocaleDateString("ar-LY"), sort: (r) => r.at },
        { key: "s", label: "الحالة", render: (r) => <Pill tone={r.status === "sent" ? "ok" : "muted"}>{r.status === "sent" ? "مرسل" : "مسودة"}</Pill> },
      ]}
    />
  );
}
