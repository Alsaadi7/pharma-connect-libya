import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Stethoscope, Pill, ChevronLeft, GraduationCap } from "lucide-react";
import { AppBar, Screen, SectionTitle } from "@/components/kit";
import { DrugSearch } from "@/components/DrugCard";
import { topics } from "@/lib/drugTopics";
import { useQuestionBank } from "@/lib/questionStore";
import { useRxTrainings } from "@/lib/rxTraining";
import { clinicalCases as cases } from "@/lib/cases";

export const Route = createFileRoute("/student/training-center")({
  head: () => ({
    meta: [
      { title: "مركز التدريب — PharmaTrain Libya" },
      {
        name: "description",
        content: "أدوات التدريب العملي: محاكي قراءة الوصفات، الحالات السريرية، بطاقة الدواء التفاعلية وأسئلة مصنفة حسب المجموعة الدوائية.",
      },
      { property: "og:title", content: "مركز التدريب — فارما ترين ليبيا" },
      { property: "og:description", content: "تدرّب على الوصفات والحالات والأدوية من مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrainingCenter,
});

function TrainingCenter() {
  const { published } = useRxTrainings();
  const { byTopic } = useQuestionBank();

  const tools = [
    {
      icon: FileText,
      title: "محاكي قراءة الوصفات",
      desc: `${published.length} روشتة تدريبية · تحليل وتصحيح تلقائي`,
      to: "/student/prescriptions",
      tone: "bg-primary-soft text-primary",
    },
    {
      icon: Stethoscope,
      title: "الحالات السريرية",
      desc: `${cases.length} حالة واقعية مع أسئلة تحليلية`,
      to: "/student/cases",
      tone: "bg-secondary-soft text-secondary",
    },
    {
      icon: Pill,
      title: "بطاقة الدواء التفاعلية",
      desc: "الأسماء التجارية، الجرعات، التداخلات والتوعية",
      to: "#drug-card",
      tone: "bg-warning-soft text-warning",
    },
  ];

  return (
    <div>
      <AppBar title="🎓 مركز التدريب" subtitle="أدوات تدريب عملية لطالب الصيدلة" back="/student" />
      <Screen className="space-y-6">
        <section>
          <SectionTitle title="أدوات التدريب" />
          <div className="space-y-2.5">
            {tools.map(({ icon: Icon, title, desc, to, tone }) =>
              to.startsWith("#") ? (
                <a key={title} href={to} className="surface-card flex items-center gap-3 p-4">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{title}</span>
                    <span className="block text-[11px] text-muted-foreground">{desc}</span>
                  </span>
                  <ChevronLeft className="size-4 text-muted-foreground rtl:rotate-180" />
                </a>
              ) : (
                <Link key={title} to={to as never} className="surface-card flex items-center gap-3 p-4">
                  <span className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold">{title}</span>
                    <span className="block text-[11px] text-muted-foreground">{desc}</span>
                  </span>
                  <ChevronLeft className="size-4 text-muted-foreground rtl:rotate-180" />
                </Link>
              ),
            )}
          </div>
        </section>

        <section>
          <SectionTitle title="أسئلة التدريب حسب التصنيف" />
          <div className="grid grid-cols-2 gap-2.5">
            {topics.map((t) => {
              const n = byTopic(t.id).length;
              return (
                <Link
                  key={t.id}
                  to="/student/drug-questions"
                  search={{ topic: t.id }}
                  className="surface-card space-y-2 p-3.5"
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <p className="text-xs font-bold leading-snug">{t.ar}</p>
                  <p className="latin text-[10px] text-muted-foreground">{t.en}</p>
                  <p className="text-[10px] font-bold text-primary">
                    <span className="latin">{n}</span> سؤال
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        <section id="drug-card" className="scroll-mt-20">
          <SectionTitle title="بطاقة الدواء التفاعلية" />
          <div className="surface-card space-y-3 p-4">
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              ابحث عن أي دواء لعرض بطاقته: الاسم العلمي، الأسماء التجارية، الجرعات، الآثار الجانبية والتداخلات.
            </p>
            <DrugSearch />
          </div>
        </section>

        <div className="surface-card flex items-center gap-3 p-4">
          <GraduationCap className="size-5 text-primary" />
          <p className="flex-1 text-[11px] leading-relaxed text-muted-foreground">
            جميع التدريبات تعليمية ومبنية على مراجع دوائية موثوقة، ولا تُستخدم لصرف دواء حقيقي.
          </p>
        </div>
      </Screen>
    </div>
  );
}
