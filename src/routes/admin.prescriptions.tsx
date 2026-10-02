import { createFileRoute } from "@tanstack/react-router";
import { AdminRxManager } from "@/components/AdminRxManager";
import { PageHeader } from "@/components/admin/ui";

export const Route = createFileRoute("/admin/prescriptions")({ component: RxPage });

function RxPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="الروشتات التدريبية" subtitle="رفع صور الروشتات مع الحلول النموذجية وإدارة النشر" />
      <AdminRxManager />
    </div>
  );
}
