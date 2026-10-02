import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, levelOptions, statusOptions } from "@/components/admin/CrudPage";
import { Pill } from "@/components/admin/ui";
import { seedCases, useCollection, type AdminCase } from "@/lib/adminData";

export const Route = createFileRoute("/admin/cases")({ component: CasesPage });

function CasesPage() {
  const api = useCollection<AdminCase>("cases:v1", seedCases);
  return (
    <CrudPage<AdminCase>
      title="الحالات السريرية"
      api={api}
      exportName="cases"
      labelOf={(r) => r.title}
      searchOf={(r) => `${r.title} ${r.diagnosis} ${r.symptoms}`}
      empty={() => ({
        title: "", age: "", gender: "ذكر", symptoms: "", history: "", currentMeds: "", diagnosis: "", labs: "",
        question: "", options: ["", "", "", ""], answer: 0, explanation: "", learningPoints: "", references: "",
        level: "مبتدئ", status: "draft",
      })}
      fields={[
        { key: "title", label: "العنوان" },
        { key: "age", label: "العمر" },
        { key: "gender", label: "الجنس", type: "select", options: [{ value: "ذكر", label: "ذكر" }, { value: "أنثى", label: "أنثى" }] },
        { key: "level", label: "المستوى", type: "select", options: levelOptions },
        { key: "status", label: "الحالة", type: "select", options: statusOptions },
        { key: "diagnosis", label: "التشخيص" },
        { key: "symptoms", label: "الأعراض", type: "textarea" },
        { key: "history", label: "التاريخ المرضي", type: "textarea" },
        { key: "currentMeds", label: "الأدوية الحالية", type: "textarea" },
        { key: "labs", label: "التحاليل", type: "textarea" },
        { key: "question", label: "السؤال", type: "textarea" },
        { key: "options", label: "الخيارات", type: "list" },
        { key: "answer", label: "رقم الإجابة الصحيحة (من 0)", type: "number" },
        { key: "explanation", label: "الشرح", type: "textarea" },
        { key: "learningPoints", label: "نقاط التعلم", type: "textarea" },
        { key: "references", label: "المراجع", type: "textarea" },
      ]}
      columns={[
        { key: "t", label: "الحالة", render: (r) => <b>{r.title}</b>, sort: (r) => r.title },
        { key: "l", label: "المستوى", render: (r) => r.level },
        { key: "s", label: "النشر", render: (r) => <Pill tone={r.status === "published" ? "ok" : "muted"}>{r.status === "published" ? "منشور" : "مسودة"}</Pill> },
      ]}
    />
  );
}
