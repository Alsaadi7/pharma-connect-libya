import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, FileText, HelpCircle, Pill, Stethoscope, Users } from "lucide-react";
import { AppBar, Bar, Chip, Screen, SectionTitle, StatCard, Tabs } from "@/components/kit";
import { AdminQuestionManager, AdminRxManager } from "@/components/AdminRxManager";
import { drugs } from "@/lib/drugs";
import { clinicalCases } from "@/lib/cases";
import { modules, totalLessons } from "@/lib/curriculum";
import { topics } from "@/lib/drugTopics";
import { useQuestionBank } from "@/lib/questionStore";
import { useRxTrainings } from "@/lib/rxTraining";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — PharmaTrain Libya" },
      {
        name: "description",
        content: "إدارة محتوى التدريب: روشتات المحاكي، أسئلة الأدوية، الدورات، الحالات السريرية وقاعدة الأدوية.",
      },
      { property: "og:title", content: "لوحة الإدارة — فارما ترين ليبيا" },
      { property: "og:description", content: "إضافة وتعديل ونشر محتوى التدريب الصيدلاني من مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminApp,
});

const tabs = ["نظرة عامة", "الروشتات", "الأسئلة", "المحتوى"];

function AdminApp() {
  const [tab, setTab] = useState("نظرة عامة");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="لوحة الإدارة" subtitle="PharmaTrain Libya · إدارة المحتوى" back="/" />
      <Screen className="space-y-5">
        <Tabs items={tabs} active={tab} onChange={setTab} />
        {tab === "نظرة عامة" ? <Overview /> : null}
        {tab === "الروشتات" ? <AdminRxManager /> : null}
        {tab === "الأسئلة" ? <AdminQuestionManager /> : null}
        {tab === "المحتوى" ? <ContentTab /> : null}
      </Screen>
    </div>
  );
}

function Overview() {
  const { all: rx } = useRxTrainings();
  const { all: questions, custom } = useQuestionBank();

  const published = rx.filter((x) => x.published).length;
  const publishedQ = questions.filter((q) => q.published).length;
  const coverage = topics.map((t) => ({
    l: `${t.emoji} ${t.ar}`,
    v: Math.min(100, Math.round((questions.filter((q) => q.topic === t.id).length / 12) * 100)),
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <StatCard icon={FileText} label="روشتات تدريبية" value={String(rx.length)} />
        <StatCard icon={HelpCircle} label="أسئلة الأدوية" value={String(questions.length)} tone="secondary" />
        <StatCard icon={Pill} label="أدوية في القاعدة" value={String(drugs.length)} tone="primary" />
        <StatCard icon={Stethoscope} label="حالات سريرية" value={String(clinicalCases.length)} tone="warning" />
      </div>

      <section>
        <SectionTitle title="حالة النشر" />
        <div className="surface-card space-y-3 p-4">
          <Row label="روشتات منشورة للطلاب" value={`${published} / ${rx.length}`} />
          <Row label="أسئلة منشورة" value={`${publishedQ} / ${questions.length}`} />
          <Row label="أسئلة مضافة يدويًا" value={String(custom.length)} />
          <Row label="وحدات المنهج / الدروس" value={`${modules.length} / ${totalLessons}`} />
        </div>
      </section>

      <section>
        <SectionTitle title="تغطية الأسئلة حسب التصنيف" />
        <div className="surface-card space-y-3 p-4">
          {coverage.map((s) => (
            <div key={s.l} className="space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-semibold">
                <span>{s.l}</span>
                <span className="latin text-muted-foreground">{s.v}%</span>
              </div>
              <Bar value={s.v} tone={s.v > 75 ? "secondary" : "primary"} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title="ملاحظة" />
        <div className="surface-card p-4 text-[11px] leading-relaxed text-muted-foreground">
          <Users className="mb-2 size-4 text-primary" />
          كل ما تضيفه هنا يُحفظ على جهاز الإدارة ويظهر مباشرة للطالب في مركز التدريب. إدارة حسابات الطلاب تحتاج قاعدة
          بيانات، وتُضاف في مرحلة لاحقة.
        </div>
      </section>
    </>
  );
}

function ContentTab() {
  return (
    <div className="space-y-4">
      <section>
        <SectionTitle title={`وحدات المنهج (${modules.length})`} />
        <div className="surface-card divide-y divide-border overflow-hidden">
          {modules.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3.5">
              <BookOpen className="size-4 shrink-0 text-primary" />
              <p className="min-w-0 flex-1 truncate text-[11px] font-bold">{m.title}</p>
              <Chip>{m.lessons.length} دروس</Chip>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title={`الحالات السريرية (${clinicalCases.length})`} />
        <div className="surface-card divide-y divide-border overflow-hidden">
          {clinicalCases.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3.5">
              <Stethoscope className="size-4 shrink-0 text-secondary" />
              <p className="min-w-0 flex-1 truncate text-[11px] font-bold">{c.title}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle title={`قاعدة الأدوية (${drugs.length})`} />
        <div className="surface-card divide-y divide-border overflow-hidden">
          {drugs.map((d) => (
            <div key={d.id} className="flex items-center gap-3 p-3.5">
              <Pill className="size-4 shrink-0 text-warning" />
              <div className="min-w-0 flex-1">
                <p className="latin truncate text-[11px] font-bold">{d.name}</p>
                <p className="truncate text-[10px] text-muted-foreground">{d.brands?.join(" · ") || "لا أسماء تجارية"}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <p className="px-1 text-[10px] text-muted-foreground">هذه المحتويات مدمجة في التطبيق للعرض والمراجعة.</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-semibold">
      <span>{label}</span>
      <span className="latin font-extrabold">{value}</span>
    </div>
  );
}
