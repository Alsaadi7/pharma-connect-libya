import { createFileRoute } from "@tanstack/react-router";
import { AdminButton, DataTable, PageHeader } from "@/components/admin/ui";
import { clearActivityLog, useActivityLog } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin/activity")({ component: ActivityPage });

function ActivityPage() {
  const log = useActivityLog();
  return (
    <div className="space-y-4">
      <PageHeader
        title="سجل العمليات"
        subtitle={`${log.length} عملية`}
        action={
          <AdminButton size="sm" variant="danger" onClick={() => window.confirm("مسح السجل بالكامل؟") && clearActivityLog()}>
            مسح السجل
          </AdminButton>
        }
      />
      <DataTable
        rows={log}
        pageSize={20}
        search={(r) => `${r.admin} ${r.action} ${r.item}`}
        columns={[
          { key: "a", label: "العملية", render: (r) => <b>{r.action}</b>, sort: (r) => r.action },
          { key: "i", label: "العنصر", render: (r) => r.item },
          { key: "u", label: "المدير", render: (r) => <span className="latin">{r.admin}</span> },
          { key: "t", label: "الوقت", render: (r) => new Date(r.at).toLocaleString("ar-LY"), sort: (r) => r.at },
        ]}
      />
    </div>
  );
}
