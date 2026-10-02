import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CrudPage, levelOptions } from "@/components/admin/CrudPage";
import { Pill } from "@/components/admin/ui";
import { emptyQuestionDraft, useQuestionBank, type QuestionDraft } from "@/lib/questionStore";
import { topics, type TopicQuestion } from "@/lib/drugTopics";
import { logActivity } from "@/lib/adminAuth";

export const Route = createFileRoute("/admin/questions")({ component: QuestionsPage });

function QuestionsPage() {
  const bank = useQuestionBank();
  const [topic, setTopic] = useState("all");
  const api = {
    items: bank.custom,
    add: (row: Omit<TopicQuestion, "id">) => {
      const { order: _o, ...draft } = row;
      bank.add(draft as QuestionDraft);
      logActivity("إضافة", "سؤال");
    },
    update: (id: string, patch: Partial<TopicQuestion>) => {
      bank.update(id, patch);
      logActivity("تعديل", "سؤال");
    },
    remove: (id: string) => {
      bank.remove(id);
      logActivity("حذف", "سؤال");
    },
    removeMany: (ids: string[]) => {
      ids.forEach((id) => bank.remove(id));
      logActivity("حذف متعدد", `أسئلة (${ids.length})`);
    },
  };
  const topicOpts = topics.map((t) => ({ value: t.id, label: t.name }));

  return (
    <CrudPage<TopicQuestion>
      title="بنك الأسئلة"
      subtitle={`${bank.custom.length} سؤال مضاف + ${bank.all.length - bank.custom.length} سؤال مدمج`}
      api={api}
      exportName="questions"
      labelOf={(r) => r.text}
      searchOf={(r) => `${r.text} ${r.kind}`}
      filters={[{ label: "التصنيف", value: topic, onChange: setTopic, options: [{ value: "all", label: "كل التصنيفات" }, ...topicOpts] }]}
      filterFn={(r) => topic === "all" || r.topic === topic}
      empty={() => ({ ...emptyQuestionDraft(), order: 0 })}
      fields={[
        { key: "text", label: "نص السؤال", type: "textarea" },
        { key: "topic", label: "التصنيف", type: "select", options: topicOpts },
        { key: "level", label: "الصعوبة", type: "select", options: [{ value: "سهل", label: "سهل" }, { value: "متوسط", label: "متوسط" }, { value: "صعب", label: "صعب" }] },
        { key: "options", label: "الخيارات", type: "list" },
        { key: "answer", label: "رقم الإجابة الصحيحة (يبدأ من 0)", type: "number" },
        { key: "published", label: "منشور", type: "switch" },
        { key: "explanation", label: "الشرح", type: "textarea" },
      ]}
      columns={[
        { key: "text", label: "السؤال", render: (r) => <span className="line-clamp-2">{r.text}</span>, sort: (r) => r.text },
        { key: "topic", label: "التصنيف", render: (r) => topics.find((t) => t.id === r.topic)?.name ?? r.topic },
        { key: "level", label: "الصعوبة", render: (r) => r.level },
        { key: "pub", label: "الحالة", render: (r) => <Pill tone={r.published ? "ok" : "muted"}>{r.published ? "منشور" : "مخفي"}</Pill> },
      ]}
    />
  );
}
void levelOptions;
