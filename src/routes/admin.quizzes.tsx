import { createFileRoute } from "@tanstack/react-router";
import { CrudPage, statusOptions } from "@/components/admin/CrudPage";
import { Pill } from "@/components/admin/ui";
import { seedQuizzes, useCollection, type AdminQuiz } from "@/lib/adminData";

export const Route = createFileRoute("/admin/quizzes")({ component: QuizzesPage });

function QuizzesPage() {
  const api = useCollection<AdminQuiz>("quizzes:v1", seedQuizzes);
  return (
    <CrudPage<AdminQuiz>
      title="الاختبارات"
      api={api}
      exportName="quizzes"
      labelOf={(r) => r.title}
      searchOf={(r) => `${r.title} ${r.topic}`}
      empty={() => ({ title: "", topic: "", questionCount: 10, minutes: 15, passScore: 60, randomize: true, status: "draft", createdAt: Date.now() })}
      fields={[
        { key: "title", label: "العنوان" },
        { key: "topic", label: "الموضوع" },
        { key: "questionCount", label: "عدد الأسئلة", type: "number" },
        { key: "minutes", label: "المدة (دقيقة)", type: "number" },
        { key: "passScore", label: "درجة النجاح %", type: "number" },
        { key: "status", label: "الحالة", type: "select", options: statusOptions },
        { key: "randomize", label: "ترتيب عشوائي", type: "switch" },
      ]}
      columns={[
        { key: "title", label: "الاختبار", render: (r) => <b>{r.title}</b>, sort: (r) => r.title },
        { key: "q", label: "الأسئلة", render: (r) => r.questionCount, sort: (r) => r.questionCount },
        { key: "m", label: "المدة", render: (r) => `${r.minutes} د` },
        { key: "s", label: "الحالة", render: (r) => <Pill tone={r.status === "published" ? "ok" : "muted"}>{r.status === "published" ? "منشور" : "مسودة"}</Pill> },
      ]}
    />
  );
}
