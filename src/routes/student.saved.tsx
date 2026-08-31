import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bookmark, Trash2, Pill, Stethoscope, HelpCircle, FileText, BookOpen } from "lucide-react";
import { AppBar, EmptyState, Screen, Tabs } from "@/components/kit";
import { useDrugSheet } from "@/components/DrugCard";
import { useStore, type SavedType } from "@/lib/store";

export const Route = createFileRoute("/student/saved")({
  head: () => ({
    meta: [
      { title: "المحفوظات — PharmaTrain Libya" },
      {
        name: "description",
        content: "كل ما حفظته للمراجعة: بطاقات أدوية، حالات سريرية، أسئلة، دروس، ووصفات تدريبية.",
      },
      { property: "og:title", content: "المحفوظات — فارما ترين ليبيا" },
      { property: "og:description", content: "مراجعة سريعة لكل ما حفظته أثناء التعلم." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Saved,
});

const tabs = ["الكل", "أدوية", "حالات", "أسئلة", "دروس", "وصفات"];
const tabType: Record<string, SavedType | undefined> = {
  أدوية: "drug",
  حالات: "clinical_case",
  أسئلة: "question",
  دروس: "lesson",
  وصفات: "prescription",
};

const icons: Record<SavedType, typeof Pill> = {
  drug: Pill,
  clinical_case: Stethoscope,
  question: HelpCircle,
  lesson: BookOpen,
  prescription: FileText,
};

function Saved() {
  const [tab, setTab] = useState("الكل");
  const { state, removeSaved } = useStore();
  const { open } = useDrugSheet();

  const filter = tabType[tab];
  const list = filter ? state.saved.filter((s) => s.itemType === filter) : state.saved;

  return (
    <div>
      <AppBar title="المحفوظات" subtitle={`${state.saved.length} عنصر محفوظ`} back="/student" />
      <Screen className="space-y-4">
        <Tabs items={tabs} active={tab} onChange={setTab} />

        {list.length ? (
          <div className="space-y-2.5">
            {list.map((s) => {
              const Icon = icons[s.itemType];
              return (
                <div key={`${s.itemType}-${s.itemId}`} className="surface-card flex items-center gap-3 p-3.5">
                  <button
                    type="button"
                    onClick={() => (s.itemType === "drug" ? open(s.itemId) : undefined)}
                    className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"
                    aria-label={s.title}
                  >
                    <Icon className="size-4.5" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-bold">{s.title}</p>
                    <p className="truncate text-[11px] text-muted-foreground">{s.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSaved(s.itemType, s.itemId)}
                    aria-label="إزالة من المحفوظات"
                    className="flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            title="لا محفوظات بعد"
            body="اضغط زر الحفظ في بطاقات الأدوية أو الحالات أو الأسئلة لتجدها هنا للمراجعة."
            action={
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-primary">
                <Bookmark className="size-3.5" /> ابدأ من الحالات السريرية
              </span>
            }
          />
        )}
      </Screen>
    </div>
  );
}
