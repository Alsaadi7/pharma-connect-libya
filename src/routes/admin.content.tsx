import { createFileRoute } from "@tanstack/react-router";
import { CrudPage } from "@/components/admin/CrudPage";
import { seedContent, useCollection, type AdminContentPage } from "@/lib/adminData";

export const Route = createFileRoute("/admin/content")({ component: ContentPage });

function ContentPage() {
  const raw = useCollection<AdminContentPage>("content:v1", seedContent);
  const api = { ...raw, update: (id: string, p: Partial<AdminContentPage>, l?: string) => raw.update(id, { ...p, updatedAt: Date.now() }, l) };
  return (
    <CrudPage<AdminContentPage>
      title="إدارة المحتوى"
      api={api}
      exportName="content"
      labelOf={(r) => r.title}
      searchOf={(r) => `${r.title} ${r.body}`}
      empty={() => ({ key: "", title: "", body: "", updatedAt: Date.now() })}
      fields={[
        { key: "title", label: "العنوان" },
        { key: "key", label: "المعرّف" },
        { key: "body", label: "المحتوى", type: "textarea" },
      ]}
      columns={[
        { key: "t", label: "الصفحة", render: (r) => <b>{r.title}</b>, sort: (r) => r.title },
        { key: "b", label: "المحتوى", render: (r) => <span className="line-clamp-1">{r.body}</span> },
        { key: "u", label: "آخر تحديث", render: (r) => new Date(r.updatedAt).toLocaleDateString("ar-LY"), sort: (r) => r.updatedAt },
      ]}
    />
  );
}
