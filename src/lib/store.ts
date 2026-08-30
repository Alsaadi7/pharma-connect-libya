/**
 * تخزين محلي لتقدم الطالب (دروس، اختبارات، محفوظات، إشعارات مقروءة).
 * يعمل لكل مستخدم على جهازه، وجاهز للاستبدال بقاعدة بيانات لاحقًا.
 */
import { useCallback, useEffect, useState } from "react";

const KEY = "pharmatrain:v1";

export type SavedType = "clinical_case" | "question" | "drug" | "prescription" | "lesson";
export type SavedItem = { itemType: SavedType; itemId: string; title: string; subtitle: string; createdAt: number };

export type QuizResult = { id: string; title: string; score: number; total: number; at: number };

export type StoreState = {
  completedLessons: string[];
  quizResults: QuizResult[];
  imageQuizScore: { correct: number; total: number };
  saved: SavedItem[];
  readNotifications: string[];
  solvedCases: string[];
};

const empty: StoreState = {
  completedLessons: [],
  quizResults: [],
  imageQuizScore: { correct: 0, total: 0 },
  saved: [],
  readNotifications: [],
  solvedCases: [],
};

function read(): StoreState {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...empty, ...(JSON.parse(raw) as Partial<StoreState>) } : empty;
  } catch {
    return empty;
  }
}

function write(state: StoreState) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l(state));
}

const listeners = new Set<(s: StoreState) => void>();

export function useStore() {
  const [state, setState] = useState<StoreState>(empty);

  useEffect(() => {
    setState(read());
    const l = (s: StoreState) => setState(s);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  const update = useCallback((fn: (s: StoreState) => StoreState) => {
    write(fn(read()));
  }, []);

  const toggleLesson = useCallback(
    (lessonId: string) =>
      update((s) => ({
        ...s,
        completedLessons: s.completedLessons.includes(lessonId)
          ? s.completedLessons.filter((x) => x !== lessonId)
          : [...s.completedLessons, lessonId],
      })),
    [update],
  );

  const completeLesson = useCallback(
    (lessonId: string) =>
      update((s) =>
        s.completedLessons.includes(lessonId)
          ? s
          : { ...s, completedLessons: [...s.completedLessons, lessonId] },
      ),
    [update],
  );

  const saveQuiz = useCallback(
    (result: Omit<QuizResult, "at">) =>
      update((s) => ({ ...s, quizResults: [{ ...result, at: Date.now() }, ...s.quizResults].slice(0, 50) })),
    [update],
  );

  const addImageScore = useCallback(
    (correct: number) =>
      update((s) => ({
        ...s,
        imageQuizScore: { correct: s.imageQuizScore.correct + correct, total: s.imageQuizScore.total + 1 },
      })),
    [update],
  );

  const markCaseSolved = useCallback(
    (caseId: string) =>
      update((s) => (s.solvedCases.includes(caseId) ? s : { ...s, solvedCases: [...s.solvedCases, caseId] })),
    [update],
  );

  const toggleSaved = useCallback(
    (item: Omit<SavedItem, "createdAt">) =>
      update((s) => {
        const exists = s.saved.some((x) => x.itemType === item.itemType && x.itemId === item.itemId);
        return {
          ...s,
          saved: exists
            ? s.saved.filter((x) => !(x.itemType === item.itemType && x.itemId === item.itemId))
            : [{ ...item, createdAt: Date.now() }, ...s.saved],
        };
      }),
    [update],
  );

  const removeSaved = useCallback(
    (itemType: SavedType, itemId: string) =>
      update((s) => ({ ...s, saved: s.saved.filter((x) => !(x.itemType === itemType && x.itemId === itemId)) })),
    [update],
  );

  const markRead = useCallback(
    (id: string) =>
      update((s) =>
        s.readNotifications.includes(id) ? s : { ...s, readNotifications: [...s.readNotifications, id] },
      ),
    [update],
  );

  const markAllRead = useCallback(
    (ids: string[]) => update((s) => ({ ...s, readNotifications: Array.from(new Set([...s.readNotifications, ...ids])) })),
    [update],
  );

  const isSaved = useCallback(
    (itemType: SavedType, itemId: string) =>
      state.saved.some((x) => x.itemType === itemType && x.itemId === itemId),
    [state.saved],
  );

  return {
    state,
    toggleLesson,
    completeLesson,
    saveQuiz,
    addImageScore,
    markCaseSolved,
    toggleSaved,
    removeSaved,
    isSaved,
    markRead,
    markAllRead,
  };
}
