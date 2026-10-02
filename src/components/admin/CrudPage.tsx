/**
 * صفحة إدارة عامة (CRUD) تعتمد على وصف الحقول: جدول + نافذة إضافة/تعديل + نسخ + حذف + تصدير.
 */
import { useState } from "react";
import { Copy, Download, Pencil, Trash2 } from "lucide-react";
import {
  AdminButton,
  ConfirmDelete,
  DataTable,
  Modal,
  PageHeader,
  SelectInput,
  Switch,
  TextArea,
  TextInput,
  useToast,
  type Column,
} from "@/components/admin/ui";

export type Field<T> = {
  key: keyof T & string;
  label: string;
  type?: "text" | "textarea" | "number" | "select" | "switch" | "list";
  options?: { value: string; label: string }[];
};

type Api<T> = {
  items: T[];
  add: (row: Omit<T, "id">, label?: string) => unknown;
  update: (id: string, patch: Partial<T>, label?: string) => void;
  remove: (id: string, label?: string) => void;
  removeMany: (ids: string[], label?: string) => void;
};

export function CrudPage<T extends { id: string }>({
  title,
  subtitle,
  api,
  fields,
  columns,
  empty,
  labelOf,
  searchOf,
  filters,
  filterFn,
  exportName,
}: {
  title: string;
  subtitle?: string;
  api: Api<T>;
  fields: Field<T>[];
  columns: Column<T>[];
  empty: () => Omit<T, "id">;
  labelOf: (r: T) => string;
  searchOf: (r: T) => string;
  filters?: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }[];
  filterFn?: (r: T) => boolean;
  exportName?: string;
}) {
  const toast = useToast();
  const [editing, setEditing] = useState<{ id?: string; draft: Record<string, unknown> } | null>(null);
  const [deleting, setDeleting] = useState<T | null>(null);
  const rows = filterFn ? api.items.filter(filterFn) : api.items;

  const set = (k: string, v: unknown) => setEditing((e) => (e ? { ...e, draft: { ...e.draft, [k]: v } } : e));

  const save = () => {
    if (!editing) return;
    const draft = editing.draft as Omit<T, "id">;
    const label = labelOf({ ...(draft as T), id: "" });
    if (!label.trim()) return toast.show("الرجاء تعبئة الحقل الأساسي");
    if (editing.id) {
      api.update(editing.id, draft as Partial<T>, label);
      toast.show("تم الحفظ بنجاح");
    } else {
      api.add(draft, label);
      toast.show("تمت الإضافة بنجاح");
    }
    setEditing(null);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(api.items, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${exportName ?? "export"}.json`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={title}
        subtitle={subtitle ?? `${api.items.length} عنصر`}
        action={
          <AdminButton size="sm" variant="outline" onClick={exportJson}>
            <Download className="size-4" /> تصدير
          </AdminButton>
        }
      />
      <DataTable
        rows={rows}
        columns={columns}
        search={searchOf}
        {...(filters ? { filters } : {})}
        onAdd={() => setEditing({ draft: empty() as Record<string, unknown> })}
        onDeleteMany={(ids) => {
          api.removeMany(ids, title);
          toast.show("تم الحذف");
        }}
        actions={(r) => (
          <div className="flex gap-1">
            <button type="button" title="تعديل" className="rounded-lg bg-muted p-1.5" onClick={() => setEditing({ id: r.id, draft: { ...r } })}>
              <Pencil className="size-3.5" />
            </button>
            <button
              type="button"
              title="نسخ"
              className="rounded-lg bg-muted p-1.5"
              onClick={() => {
                const { id: _id, ...rest } = r;
                api.add(rest as Omit<T, "id">, `نسخة من ${labelOf(r)}`);
                toast.show("تم النسخ");
              }}
            >
              <Copy className="size-3.5" />
            </button>
            <button type="button" title="حذف" className="rounded-lg bg-destructive/10 p-1.5 text-destructive" onClick={() => setDeleting(r)}>
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      />

      {editing ? (
        <Modal title={editing.id ? "تعديل" : "إضافة جديد"} onClose={() => setEditing(null)} wide>
          <div className="grid gap-3 sm:grid-cols-2">
            {fields.map((f) => {
              const v = editing.draft[f.key];
              const wide = f.type === "textarea" || f.type === "list";
              return (
                <div key={f.key} className={wide ? "sm:col-span-2" : ""}>
                  {f.type === "textarea" ? (
                    <TextArea label={f.label} value={String(v ?? "")} onChange={(x) => set(f.key, x)} />
                  ) : f.type === "list" ? (
                    <TextArea
                      label={`${f.label} (سطر لكل عنصر)`}
                      value={Array.isArray(v) ? (v as string[]).join("\n") : ""}
                      onChange={(x) => set(f.key, x.split("\n"))}
                      rows={4}
                    />
                  ) : f.type === "select" ? (
                    <SelectInput label={f.label} value={String(v ?? "")} onChange={(x) => set(f.key, x)} options={f.options ?? []} />
                  ) : f.type === "switch" ? (
                    <Switch label={f.label} checked={Boolean(v)} onChange={(x) => set(f.key, x)} />
                  ) : f.type === "number" ? (
                    <TextInput label={f.label} type="number" value={String(v ?? 0)} onChange={(x) => set(f.key, Number(x))} />
                  ) : (
                    <TextInput label={f.label} value={String(v ?? "")} onChange={(x) => set(f.key, x)} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex gap-2 pt-2">
            <AdminButton onClick={save}>حفظ</AdminButton>
            <AdminButton variant="outline" onClick={() => setEditing(null)}>
              إلغاء
            </AdminButton>
          </div>
        </Modal>
      ) : null}

      {deleting ? (
        <ConfirmDelete
          label={labelOf(deleting)}
          onCancel={() => setDeleting(null)}
          onConfirm={() => {
            api.remove(deleting.id, labelOf(deleting));
            setDeleting(null);
            toast.show("تم الحذف");
          }}
        />
      ) : null}
      {toast.node}
    </div>
  );
}

export const statusOptions = [
  { value: "published", label: "منشور" },
  { value: "draft", label: "مسودة" },
];
export const levelOptions = ["مبتدئ", "متوسط", "متقدم"].map((v) => ({ value: v, label: v }));
