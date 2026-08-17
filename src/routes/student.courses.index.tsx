import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, ArrowDownUp } from "lucide-react";
import { AppBar, CourseCard, EmptyState, Screen, Tabs, Chip } from "@/components/kit";
import { courses } from "@/lib/mock";

export const Route = createFileRoute("/student/courses/")({
  head: () => ({
    meta: [
      { title: "الدورات التعليمية — PharmaTrain Libya" },
      { name: "description", content: "دورات وفيديوهات صيدلانية معتمدة مع اختبارات وشهادات إتمام." },
      { property: "og:title", content: "الدورات التعليمية — فارما ترين" },
      { property: "og:description", content: "علم أدوية، ممارسة سريرية، وإدارة صيدلية." },
    ],
  }),
  component: Courses,
});

const tabs = ["الكل", "قيد التقدم", "علم الأدوية", "سريري", "إدارة", "مكتملة"];

function Courses() {
  const [tab, setTab] = useState("الكل");

  const list =
    tab === "الكل"
      ? courses
      : tab === "قيد التقدم"
        ? courses.filter((c) => c.progress !== undefined)
        : tab === "مكتملة"
          ? []
          : courses.filter((c) => c.tag === tab);

  return (
    <div>
      <AppBar
        title="الدورات"
        subtitle="محتوى معتمد من شركات ومراكز ليبية"
        action={
          <button className="flex size-9 items-center justify-center rounded-full bg-muted" aria-label="ترتيب">
            <ArrowDownUp className="size-4" />
          </button>
        }
      />
      <Screen className="space-y-4">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3.5" />
            <input
              placeholder="ابحث عن دورة أو موضوع…"
              className="h-12 w-full rounded-2xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
            aria-label="تصفية"
          >
            <SlidersHorizontal className="size-4.5" />
          </button>
        </div>

        <Tabs items={tabs} active={tab} onChange={setTab} />

        <div className="flex items-center gap-2">
          <Chip tone="primary">{list.length} دورة</Chip>
          <Chip>الأعلى تقييمًا</Chip>
        </div>

        {list.length === 0 ? (
          <EmptyState
            title="لا توجد دورات مكتملة بعد"
            body="أكمل دورة واحدة على الأقل لتظهر هنا مع شهادتها الرقمية."
          />
        ) : (
          <div className="space-y-3.5">
            {list.map((c) => (
              <CourseCard key={c.id} course={c} wide />
            ))}
          </div>
        )}
      </Screen>
    </div>
  );
}
