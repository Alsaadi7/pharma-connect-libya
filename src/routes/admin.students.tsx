import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bar } from "@/components/kit";
import {
  AdminButton,
  ConfirmDelete,
  DataTable,
  Modal,
  PageHeader,
  Pill as Tag,
  SelectInput,
  TextInput,
  useToast,
} from "@/components/admin/ui";
import { seedStudents, useCollection, type AdminStudent } from "@/lib/adminData";

export const Route = createFileRoute("/admin/students")({ component: StudentsPage });

const emptyStudent = (): Omit<AdminStudent, "id"> => ({
  name: "",
  email: "",
  phone: "",
  university: "",
  year: "الأولى",
  joinedAt: Date.now(),
  status: "active",
  role: "student",
  progress: 0,
  lessonsDone: 0,
  quizzes: 0,
  avgScore: 0,
  casesDone: 0,
  lastActive: Date.now(),
  weakTopics: [],
});

function StudentsPage() {
  const { items, add, update, remove, removeMany } = useCollection("students:v1", seedStudents);
  const toast = useToast();
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<AdminStudent | null>(null);
  const [draft, setDraft] = useState<Omit<AdminStudent, "id"> | null>(null);
  const [view, setView] = useState<AdminStudent | null>(null);
  const [del, setDel] = useState<AdminStudent | null>(null);

  const rows = items.filter((s) => (status === "all" ? true : s.status === status));

  const save = () => {
    if (!draft?.name.trim()) return;
    if (editing) update(editing.id, draft, `الطالب ${draft.name}`);
    else add(draft, `الطالب ${draft.name}`);
    setDraft(null);
    setEditing(null);
    toast.show("تم الحفظ بنجاح");
  };

  return (
    <>
      <PageHeader title="الطلاب" subtitle={`${items.length} طالب مسجل`} />

      <DataTable
        rows={rows}
        search={(s) => `${s.name} ${s.email} ${s.university}`}
        filters={[
          {
            label: "الحالة",
            value: status,
            onChange: setStatus,
            options: [
              { value: "all", label: "كل الحالات" },
              { value: "active", label: "نشط" },
              { value: "inactive", label: "غير نشط" },
            ],
          },
        ]}
        onAdd={() => {
          setEditing(null);
          setDraft(emptyStudent());
        }}
        addLabel="إضافة طالب"
        onDeleteMany={(ids) => {
          removeMany(ids, "طلاب");
          toast.show("تم حذف المحدد");
        }}
        columns={[
          { key: "name", label: "الاسم", sort: (s) => s.name, render: (s) => <span className="font-bold">{s.name}</span> },
          { key: "email", label: "البريد", render: (s) => <span className="latin">{s.email}</span> },
          { key: "uni", label: "الجامعة/المدينة", render: (s) => s.university },
          { key: "year", label: "السنة", render: (s) => s.year },
          {
            key: "progress",
            label: "التقدم",
            sort: (s) => s.progress,
            render: (s) => (
              <span className="flex min-w-24 items-center gap-2">
                <Bar value={s.progress} />
                <span className="latin">{s.progress}%</span>
              </span>
            ),
          },
          { key: "avg", label: "المعدل", sort: (s) => s.avgScore, render: (s) => <span className="latin">{s.avgScore}%</span> },
          {
            key: "status",
            label: "الحالة",
            render: (s) => <Tag tone={s.status === "active" ? "ok" : "muted"}>{s.status === "active" ? "نشط" : "غير نشط"}</Tag>,
          },
        ]}
        actions={(s) => (
          <span className="flex gap-1.5">
            <AdminButton size="sm" variant="ghost" onClick={() => setView(s)}>
              الملف
            </AdminButton>
            <AdminButton
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(s);
                const { id: _id, ...rest } = s;
                setDraft(rest);
              }}
            >
              تعديل
            </AdminButton>
            <AdminButton
              size="sm"
              variant="ghost"
              onClick={() => {
                update(s.id, { status: s.status === "active" ? "inactive" : "active" }, `الطالب ${s.name}`);
                toast.show("تم تحديث الحالة");
              }}
            >
              {s.status === "active" ? "تعطيل" : "تنشيط"}
            </AdminButton>
            <AdminButton size="sm" variant="danger" onClick={() => setDel(s)}>
              حذف
            </AdminButton>
          </span>
        )}
      />

      {draft ? (
        <Modal title={editing ? "تعديل بيانات الطالب" : "إضافة طالب"} onClose={() => setDraft(null)}>
          <TextInput label="الاسم" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
          <TextInput label="البريد الإلكتروني" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
          <TextInput label="الهاتف" value={draft.phone} onChange={(v) => setDraft({ ...draft, phone: v })} />
          <TextInput label="الجامعة / المدينة" value={draft.university} onChange={(v) => setDraft({ ...draft, university: v })} />
          <SelectInput
            label="سنة الدراسة"
            value={draft.year}
            onChange={(v) => setDraft({ ...draft, year: v })}
            options={["الأولى", "الثانية", "الثالثة", "الرابعة", "الخامسة"].map((y) => ({ value: y, label: y }))}
          />
          <SelectInput
            label="الحالة"
            value={draft.status}
            onChange={(v) => setDraft({ ...draft, status: v as AdminStudent["status"] })}
            options={[
              { value: "active", label: "نشط" },
              { value: "inactive", label: "غير نشط" },
            ]}
          />
          <AdminButton onClick={save}>حفظ</AdminButton>
        </Modal>
      ) : null}

      {view ? (
        <Modal title={`ملف الطالب — ${view.name}`} onClose={() => setView(null)} wide>
          <div className="grid gap-3 sm:grid-cols-2">
            <Info label="البريد" value={view.email} />
            <Info label="الهاتف" value={view.phone} />
            <Info label="الجامعة" value={view.university} />
            <Info label="السنة" value={view.year} />
            <Info label="الدروس المكتملة" value={String(view.lessonsDone)} />
            <Info label="الاختبارات" value={String(view.quizzes)} />
            <Info label="متوسط الدرجات" value={`${view.avgScore}%`} />
            <Info label="الحالات المحلولة" value={String(view.casesDone)} />
            <Info label="تاريخ التسجيل" value={new Date(view.joinedAt).toLocaleDateString("ar-LY")} />
            <Info label="آخر نشاط" value={new Date(view.lastActive).toLocaleDateString("ar-LY")} />
          </div>
          <div className="space-y-1.5">
            <p className="text-[11px] font-bold">نسبة إكمال المنهج</p>
            <Bar value={view.progress} tone="secondary" />
          </div>
          <div>
            <p className="mb-1.5 text-[11px] font-bold">نقاط الضعف</p>
            <div className="flex flex-wrap gap-1.5">
              {view.weakTopics.length ? (
                view.weakTopics.map((t) => <Tag key={t} tone="warn">{t}</Tag>)
              ) : (
                <span className="text-[11px] text-muted-foreground">لا توجد نقاط ضعف مسجلة.</span>
              )}
            </div>
          </div>
        </Modal>
      ) : null}

      {del ? (
        <ConfirmDelete
          label={`الطالب ${del.name}`}
          onCancel={() => setDel(null)}
          onConfirm={() => {
            remove(del.id, `الطالب ${del.name}`);
            setDel(null);
            toast.show("تم الحذف");
          }}
        />
      ) : null}
      {toast.node}
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted p-3">
      <p className="text-[10px] text-muted-foreground">{label}</p>
      <p className="text-[11px] font-bold">{value || "—"}</p>
    </div>
  );
}
