import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { CrudPage, levelOptions, statusOptions } from "@/components/admin/CrudPage";
import { AdminButton, Pill, SelectInput } from "@/components/admin/ui";
import { seedCourses, useCollection, type AdminCourse, type AdminModule } from "@/lib/adminData";

export const Route = createFileRoute("/admin/courses")({ component: CoursesPage });

function CoursesPage() {
  const api = useCollection<AdminCourse>("courses:v1", seedCourses);
  const [sel, setSel] = useState("");
  const course = api.items.find((c) => c.id === sel) ?? api.items[0];

  const setModules = (mods: AdminModule[]) => course && api.update(course.id, { modules: mods }, `وحدات ${course.title}`);

  return (
    <div className="space-y-6">
      <CrudPage<AdminCourse>
        title="الدورات"
        api={api}
        exportName="courses"
        labelOf={(r) => r.title}
        searchOf={(r) => `${r.title} ${r.category} ${r.instructor}`}
        empty={() => ({
          title: "",
          description: "",
          thumbnail: "",
          category: "",
          level: "مبتدئ",
          instructor: "",
          duration: "",
          status: "draft",
          order: api.items.length + 1,
          modules: [],
        })}
        fields={[
          { key: "title", label: "العنوان" },
          { key: "category", label: "التصنيف" },
          { key: "instructor", label: "المدرّس" },
          { key: "duration", label: "المدة" },
          { key: "level", label: "المستوى", type: "select", options: levelOptions },
          { key: "status", label: "الحالة", type: "select", options: statusOptions },
          { key: "order", label: "الترتيب", type: "number" },
          { key: "thumbnail", label: "رابط الصورة" },
          { key: "description", label: "الوصف", type: "textarea" },
        ]}
        columns={[
          { key: "title", label: "الدورة", render: (r) => <b>{r.title}</b>, sort: (r) => r.title },
          { key: "level", label: "المستوى", render: (r) => r.level },
          { key: "mods", label: "الوحدات", render: (r) => r.modules.length, sort: (r) => r.modules.length },
          { key: "status", label: "الحالة", render: (r) => <Pill tone={r.status === "published" ? "ok" : "muted"}>{r.status === "published" ? "منشور" : "مسودة"}</Pill> },
        ]}
      />

      {course ? (
        <section className="surface-card space-y-3 p-4">
          <div className="flex flex-wrap items-end gap-2">
            <div className="min-w-[200px] flex-1">
              <SelectInput label="إدارة وحدات الدورة" value={course.id} onChange={setSel} options={api.items.map((c) => ({ value: c.id, label: c.title }))} />
            </div>
            <AdminButton
              size="sm"
              onClick={() =>
                setModules([...course.modules, { id: `m-${Date.now()}`, title: "وحدة جديدة", desc: "", order: course.modules.length + 1, lessons: [] }])
              }
            >
              <Plus className="size-4" /> وحدة
            </AdminButton>
          </div>
          {course.modules.map((m, i) => (
            <div key={m.id} className="space-y-2 rounded-xl border border-border p-3">
              <div className="flex items-center gap-2">
                <span className="latin text-[10px] text-muted-foreground">{i + 1}</span>
                <input
                  defaultValue={m.title}
                  onBlur={(e) => setModules(course.modules.map((x) => (x.id === m.id ? { ...x, title: e.target.value } : x)))}
                  className="h-9 flex-1 rounded-lg border border-input bg-card px-2 text-xs font-bold"
                />
                <button type="button" className="rounded-lg bg-destructive/10 p-1.5 text-destructive" onClick={() => setModules(course.modules.filter((x) => x.id !== m.id))}>
                  <Trash2 className="size-3.5" />
                </button>
              </div>
              <div className="space-y-1 ps-5">
                {m.lessons.map((l) => (
                  <div key={l.id} className="flex items-center gap-2 text-[11px]">
                    <input
                      defaultValue={l.title}
                      onBlur={(e) =>
                        setModules(course.modules.map((x) => (x.id === m.id ? { ...x, lessons: x.lessons.map((y) => (y.id === l.id ? { ...y, title: e.target.value } : y)) } : x)))
                      }
                      className="h-8 flex-1 rounded-lg border border-input bg-card px-2"
                    />
                    <button
                      type="button"
                      className="text-destructive"
                      onClick={() => setModules(course.modules.map((x) => (x.id === m.id ? { ...x, lessons: x.lessons.filter((y) => y.id !== l.id) } : x)))}
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-[11px] font-bold text-primary"
                  onClick={() =>
                    setModules(
                      course.modules.map((x) =>
                        x.id === m.id
                          ? { ...x, lessons: [...x.lessons, { id: `l-${Date.now()}`, title: "درس جديد", minutes: 10, order: x.lessons.length + 1, status: "draft" }] }
                          : x,
                      ),
                    )
                  }
                >
                  + درس
                </button>
              </div>
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}
