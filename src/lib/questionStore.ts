/**
 * أسئلة التدريب المضافة من لوحة الأدمن (تُخزن محليًا في هذه المرحلة).
 * تُدمج مع بنك الأسئلة المدمج في drugTopics.ts عند العرض للطالب.
 */
import { useCallback, useEffect, useState } from "react";
import { topicQuestions, type TopicId, type TopicQuestion } from "@/lib/drugTopics";

const KEY = "pharmatrain:custom-questions:v1";
const listeners = new Set<(v: TopicQuestion[]) => void>();

function read(): TopicQuestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as TopicQuestion[]) : [];
  } catch {
    return [];
  }
}

function write(items: TopicQuestion[]) {
  window.localStorage.setItem(KEY, JSON.stringify(items));
  listeners.forEach((l) => l(items));
}

export type QuestionDraft = Omit<TopicQuestion, "id" | "order">;

export function emptyQuestionDraft(topic: TopicId = "analgesics"): QuestionDraft {
  return {
    topic,
    kind: "الاستخدام",
    text: "",
    options: ["", "", "", ""],
    answer: 0,
    explanation: "",
    drugId: undefined,
    level: "سهل",
    published: true,
  };
}

export function useQuestionBank() {
  const [custom, setCustom] = useState<TopicQuestion[]>([]);

  useEffect(() => {
    setCustom(read());
    const l = (v: TopicQuestion[]) => setCustom(v);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const add = useCallback((draft: QuestionDraft) => {
    const list = read();
    write([...list, { ...draft, id: `cq-${Date.now()}`, order: 1000 + list.length }]);
  }, []);

  const update = useCallback((id: string, patch: Partial<QuestionDraft>) => {
    write(read().map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((x) => x.id !== id));
  }, []);

  const all = [...topicQuestions, ...custom];
  const byTopic = (topic: TopicId) =>
    all.filter((x) => x.topic === topic && x.published).sort((a, b) => a.order - b.order);

  return { custom, all, byTopic, add, update, remove };
}
