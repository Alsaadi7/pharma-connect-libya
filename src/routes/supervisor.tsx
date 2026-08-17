import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, ClipboardCheck, Clock, Stethoscope, Plus, MessageCircle, Star } from "lucide-react";
import {
  ActionButton,
  AppBar,
  Bar,
  Chip,
  Screen,
  SectionTitle,
  StatCard,
  StudentRow,
  Tabs,
} from "@/components/kit";
import { clinicalCases, skills } from "@/lib/mock";

export const Route = createFileRoute("/supervisor")({
  head: () => ({
    meta: [
      { title: "لوحة المشرف — PharmaTrain Libya" },
      { name: "description", content: "تابع طلابك، سجّل الحضور، قيّم المهارات، وأنشئ حالات سريرية." },
      { property: "og:title", content: "لوحة المشرف — فارما ترين" },
      { property: "og:description", content: "إشراف وتقييم دقيق لمتدربي الصيدلة." },
    ],
  }),
  component: SupervisorApp,
});

const tabs = ["اللوحة", "طلابي", "التقييم", "المهارات", "الحالات", "الرسائل"];

const students = [
  { name: "أمينة الزروق", initials: "أ.ز", meta: "214 ساعة · حضور 96%", value: "يحتاج تقييم", tone: "warning" as const },
  { name: "يوسف بن سعيد", initials: "ي.س", meta: "132 ساعة · حضور 88%", value: "مكتمل", tone: "secondary" as const },
  { name: "هدى العابد", initials: "ه.ع", meta: "88 ساعة · حضور 74%", value: "متابعة", tone: "primary" as const },
];

function SupervisorApp() {
  const [tab, setTab] = useState("اللوحة");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="د. خالد بن عمران" subtitle="مشرف تدريب · صيدلية النهضة" back="/" />
      <Screen className="space-y-5">
        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "اللوحة" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Users} label="طلاب تحت الإشراف" value="9" />
              <StatCard icon={ClipboardCheck} label="بحاجة إلى تقييم" value="3" tone="warning" />
              <StatCard icon={Clock} label="ساعات أُقرت اليوم" value="28.5" tone="secondary" />
              <StatCard icon={Stethoscope} label="حالات سريرية نشطة" value="4" tone="error" />
            </div>

            <section>
              <SectionTitle title="مناوبة اليوم" />
              <div className="surface-card space-y-3 p-4">
                {students.map((s) => (
                  <div key={s.name} className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-[10px] font-bold text-primary">
                      {s.initials}
                    </span>
                    <span className="flex-1 text-xs font-semibold">{s.name}</span>
                    <Chip tone="secondary">حاضر 08:02</Chip>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle title="طلاب يحتاجون تقييمًا" />
              <div className="space-y-3">
                {students
                  .filter((s) => s.tone === "warning")
                  .map((s) => (
                    <div key={s.name} className="surface-card space-y-3 p-4">
                      <StudentRow {...s} />
                      <ActionButton variant="primary">
                        <Star className="size-4" /> بدء التقييم
                      </ActionButton>
                    </div>
                  ))}
              </div>
            </section>
          </>
        ) : null}

        {tab === "طلابي" ? (
          <div className="space-y-3">
            {students.map((s) => (
              <StudentRow key={s.name} {...s} />
            ))}
          </div>
        ) : null}

        {tab === "التقييم" ? (
          <div className="surface-card space-y-4 p-4">
            <p className="text-xs font-bold">تقييم الأداء — أمينة الزروق</p>
            {["الالتزام والحضور", "المعرفة الدوائية", "التعامل مع المرضى", "العمل الجماعي"].map((c) => (
              <div key={c} className="space-y-2">
                <p className="text-[11px] font-semibold">{c}</p>
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      className={`latin size-9 rounded-xl text-xs font-bold ${
                        n <= 4 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <textarea
              rows={3}
              placeholder="أضف ملاحظات ونقاط تحسين…"
              className="w-full rounded-2xl border border-input bg-card p-3 text-xs outline-none focus:border-primary"
            />
            <ActionButton>حفظ وإرسال للطالب</ActionButton>
          </div>
        ) : null}

        {tab === "المهارات" ? (
          <div className="surface-card space-y-4 p-4">
            <p className="text-xs font-bold">تقييم قائمة المهارات</p>
            {skills.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span>{s.name}</span>
                  <span className="latin text-muted-foreground">{s.value}%</span>
                </div>
                <Bar value={s.value} tone={s.value >= 70 ? "secondary" : "warning"} />
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الحالات" ? (
          <div className="space-y-3">
            <ActionButton variant="mint">
              <Plus className="size-4" /> إنشاء حالة سريرية جديدة
            </ActionButton>
            {clinicalCases.map((c) => (
              <div key={c.id} className="surface-card space-y-2 p-4">
                <p className="text-xs font-bold leading-snug">{c.title}</p>
                <div className="flex items-center gap-2">
                  <Chip tone={c.solved ? "secondary" : "warning"}>{c.solved ? "تم التصحيح" : "بانتظار الإجابات"}</Chip>
                  <Chip>{c.level}</Chip>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الرسائل" ? (
          <div className="surface-card divide-y divide-border overflow-hidden">
            {students.map((s) => (
              <div key={s.name} className="flex items-center gap-3 p-3.5">
                <MessageCircle className="size-4 text-primary" />
                <div className="flex-1">
                  <p className="text-xs font-bold">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">آخر رسالة: تم إرسال التقرير اليومي</p>
                </div>
                <Chip tone="primary">رد</Chip>
              </div>
            ))}
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
