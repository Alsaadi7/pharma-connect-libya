import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Users,
  Inbox,
  Armchair,
  Star,
  CalendarDays,
  CheckCircle2,
  X,
  Building2,
  FileText,
  Settings,
} from "lucide-react";
import {
  ActionButton,
  AppBar,
  Bar,
  Chip,
  Rating,
  Screen,
  SectionTitle,
  StatCard,
  StudentRow,
  Tabs,
} from "@/components/kit";
import { attendance, skills } from "@/lib/mock";

export const Route = createFileRoute("/pharmacy")({
  head: () => ({
    meta: [
      { title: "لوحة الصيدلية — PharmaTrain Libya" },
      { name: "description", content: "أدر طلبات التدريب، المقاعد، الحضور، وتقييم المتدربين في صيدليتك." },
      { property: "og:title", content: "لوحة الصيدلية — فارما ترين" },
      { property: "og:description", content: "إدارة كاملة للتدريب داخل الصيدلية." },
    ],
  }),
  component: PharmacyApp,
});

const tabs = ["اللوحة", "الطلبات", "الطلاب", "الحضور", "التقييم", "التقارير", "الملف"];

const requests = [
  { name: "محمد الشريف", initials: "م.ش", meta: "جامعة طرابلس · السنة الرابعة · 96 ساعة سابقة" },
  { name: "رنا القذافي", initials: "ر.ق", meta: "جامعة مصراتة · السنة الخامسة · 140 ساعة سابقة" },
];

const current = [
  { name: "أمينة الزروق", initials: "أ.ز", meta: "المشرف: د. خالد · 214 ساعة", value: "68%" },
  { name: "يوسف بن سعيد", initials: "ي.س", meta: "المشرف: د. سلمى · 132 ساعة", value: "41%" },
  { name: "هدى العابد", initials: "ه.ع", meta: "المشرف: د. خالد · 88 ساعة", value: "27%" },
];

function PharmacyApp() {
  const [tab, setTab] = useState("اللوحة");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="صيدلية النهضة" subtitle="طرابلس — جرابة · جهة تدريب معتمدة" back="/" />
      <Screen className="space-y-5">
        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "اللوحة" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Users} label="إجمالي المتدربين" value="18" hint="+3 هذا الشهر" />
              <StatCard icon={Inbox} label="طلبات جديدة" value="2" tone="warning" />
              <StatCard icon={Armchair} label="مقاعد متاحة" value="3" tone="secondary" />
              <StatCard icon={Star} label="متوسط تقييم الطلاب" value="4.6" tone="primary" />
            </div>

            <section>
              <SectionTitle title="جدول التدريب هذا الأسبوع" />
              <div className="surface-card space-y-3 p-4">
                {["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"].map((d, i) => (
                  <div key={d} className="flex items-center gap-3">
                    <span className="w-16 text-[11px] font-bold">{d}</span>
                    <div className="flex-1">
                      <Bar value={[80, 100, 60, 40, 90][i]!} tone={i === 1 ? "secondary" : "primary"} />
                    </div>
                    <span className="latin w-10 text-end text-[11px] text-muted-foreground">
                      {[4, 5, 3, 2, 4][i]} طلاب
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <SectionTitle title="طلبات تحتاج قرارًا" />
              <div className="space-y-3">
                {requests.map((r) => (
                  <div key={r.name} className="surface-card space-y-3 p-4">
                    <StudentRow {...r} value="جديد" tone="warning" />
                    <div className="flex gap-2">
                      <ActionButton variant="mint">
                        <CheckCircle2 className="size-4" /> قبول
                      </ActionButton>
                      <ActionButton variant="ghost">
                        <X className="size-4" /> رفض
                      </ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {tab === "الطلبات" ? (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.name} className="surface-card space-y-3 p-4">
                <StudentRow {...r} value="بانتظار المراجعة" tone="warning" />
                <div className="rounded-2xl bg-muted p-3 text-[11px] leading-relaxed text-muted-foreground">
                  الفترة المطلوبة: صباحية 08:00 — 14:00 · تخصص مهتم به: صرف الدواء والاستشارة الدوائية
                </div>
                <div className="flex gap-2">
                  <ActionButton variant="mint">قبول وتعيين مشرف</ActionButton>
                  <ActionButton variant="ghost">رفض</ActionButton>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الطلاب" ? (
          <div className="space-y-3">
            {current.map((s) => (
              <StudentRow key={s.name} {...s} tone="primary" />
            ))}
          </div>
        ) : null}

        {tab === "الحضور" ? (
          <div className="surface-card divide-y divide-border overflow-hidden">
            {attendance.map((a) => (
              <div key={a.day} className="flex items-center gap-3 p-3.5">
                <CalendarDays className="size-4 text-primary" />
                <div className="flex-1">
                  <p className="text-xs font-bold">{a.day} · أمينة الزروق</p>
                  <p className="latin text-[11px] text-muted-foreground">{a.time}</p>
                </div>
                <Chip tone={a.status === "حاضر" ? "secondary" : a.status === "متأخر" ? "warning" : "error"}>
                  {a.status}
                </Chip>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "التقييم" ? (
          <div className="surface-card space-y-4 p-4">
            <p className="text-xs font-bold">تقييم أمينة الزروق</p>
            {skills.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span>{s.name}</span>
                  <Rating value={Math.round((s.value / 20) * 10) / 10} />
                </div>
                <Bar value={s.value} tone={s.value >= 70 ? "secondary" : "warning"} />
              </div>
            ))}
            <textarea
              rows={3}
              placeholder="ملاحظات المشرف…"
              className="w-full rounded-2xl border border-input bg-card p-3 text-xs outline-none focus:border-primary"
            />
            <ActionButton>حفظ التقييم</ActionButton>
          </div>
        ) : null}

        {tab === "التقارير" ? (
          <div className="space-y-3">
            {["تقرير الحضور الشهري", "تقرير ساعات المتدربين", "تقرير التقييمات"].map((r) => (
              <div key={r} className="surface-card flex items-center gap-3 p-4">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <FileText className="size-4.5" />
                </span>
                <p className="flex-1 text-xs font-bold">{r}</p>
                <Chip tone="primary">PDF</Chip>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الملف" ? (
          <div className="space-y-3">
            <div className="surface-card flex items-center gap-3 p-4">
              <span className="flex size-12 items-center justify-center rounded-2xl gradient-mint text-secondary-foreground">
                <Building2 className="size-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-bold">صيدلية النهضة</p>
                <p className="text-[11px] text-muted-foreground">ترخيص رقم <span className="latin">LY-PH-2211</span></p>
              </div>
              <Rating value={4.6} />
            </div>
            <div className="surface-card divide-y divide-border overflow-hidden">
              {["تعديل بيانات الصيدلية", "المقاعد وفترات التدريب", "المشرفون المعتمدون", "الإعدادات والإشعارات"].map(
                (i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3.5">
                    <Settings className="size-4 text-muted-foreground" />
                    <span className="flex-1 text-xs font-semibold">{i}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
