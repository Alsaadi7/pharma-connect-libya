import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { QrCode, Clock, CheckCircle2, AlertTriangle, XCircle, FileText, Timer } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Screen, Tabs, Timeline } from "@/components/kit";
import { attendance, nextTraining, skills, student } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/training")({
  head: () => ({
    meta: [
      { title: "التدريب العملي — PharmaTrain Libya" },
      { name: "description", content: "الجدول، الحضور بمسح QR، ساعات التدريب، قائمة المهارات، والتقرير اليومي." },
      { property: "og:title", content: "التدريب العملي — فارما ترين" },
      { property: "og:description", content: "متابعة كاملة للحضور والساعات والمهارات." },
    ],
  }),
  component: Training,
});

const tabs = ["الجدول", "الحضور", "الساعات", "المهارات", "التقرير", "حالة الطلب"];
const week = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"];

function Training() {
  const [tab, setTab] = useState("الجدول");

  return (
    <div>
      <AppBar title="التدريب" subtitle={`${nextTraining.pharmacy} · ${nextTraining.supervisor}`} />
      <Screen className="space-y-5">
        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "الجدول" ? (
          <div className="space-y-3">
            <div className="surface-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold">أغسطس 2026</p>
                <Chip tone="primary">5 مناوبات</Chip>
              </div>
              <div className="grid grid-cols-5 gap-2 text-center">
                {week.map((d, i) => (
                  <div
                    key={d}
                    className={cn(
                      "rounded-2xl px-1 py-3",
                      i === 1 ? "gradient-primary text-primary-foreground" : "bg-muted",
                    )}
                  >
                    <p className="text-[10px] font-bold">{d}</p>
                    <p className="latin mt-1 text-base font-extrabold">{16 + i}</p>
                    <p className="text-[9px] opacity-80">{i === 3 ? "راحة" : "08-14"}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-card space-y-2 p-4">
              <p className="text-xs font-bold">مناوبة الاثنين 17 أغسطس</p>
              <p className="text-[11px] text-muted-foreground">
                {nextTraining.address} · <span className="latin">{nextTraining.time}</span>
              </p>
              <ActionButton onClick={() => setTab("الحضور")} variant="mint">
                <QrCode className="size-4" /> تسجيل الحضور بمسح QR
              </ActionButton>
            </div>
          </div>
        ) : null}

        {tab === "الحضور" ? (
          <div className="space-y-4">
            <div className="surface-card flex flex-col items-center gap-3 p-6">
              <div className="relative flex size-48 items-center justify-center rounded-3xl bg-muted">
                <div className="absolute inset-4 rounded-2xl border-2 border-primary" />
                <QrCode className="size-24 text-foreground" />
                <span className="absolute inset-x-8 h-0.5 animate-pulse bg-primary" />
              </div>
              <p className="text-xs font-bold">وجّه الكاميرا إلى رمز الصيدلية</p>
              <p className="text-center text-[11px] text-muted-foreground">
                يتم تسجيل وقت الدخول والخروج تلقائيًا مع تحديد الموقع للتأكيد.
              </p>
              <ActionButton variant="primary">تأكيد الدخول 07:58</ActionButton>
            </div>

            <div className="surface-card divide-y divide-border overflow-hidden">
              {attendance.map((a) => {
                const tone =
                  a.status === "حاضر" ? "secondary" : a.status === "متأخر" ? "warning" : "error";
                const Icon =
                  a.status === "حاضر" ? CheckCircle2 : a.status === "متأخر" ? AlertTriangle : XCircle;
                return (
                  <div key={a.day} className="flex items-center gap-3 p-3.5">
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-xl",
                        tone === "secondary" && "bg-secondary-soft text-secondary",
                        tone === "warning" && "bg-warning-soft text-warning",
                        tone === "error" && "bg-destructive-soft text-destructive",
                      )}
                    >
                      <Icon className="size-4" />
                    </span>
                    <div className="flex-1">
                      <p className="text-xs font-bold">{a.day}</p>
                      <p className="latin text-[11px] text-muted-foreground">{a.time}</p>
                    </div>
                    <Chip tone={tone}>
                      <span className="latin">{a.hours}</span> ساعة
                    </Chip>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === "الساعات" ? (
          <div className="space-y-3">
            <div className="surface-card p-4">
              <div className="flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
                  <Timer className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="latin text-xl font-extrabold">
                    {student.hoursDone} / {student.hoursTotal}
                  </p>
                  <p className="text-[11px] text-muted-foreground">إجمالي ساعات التدريب المعتمدة</p>
                </div>
              </div>
              <div className="mt-3">
                <Bar value={student.progress} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "هذا الأسبوع", v: "22.5" },
                { l: "هذا الشهر", v: "86.0" },
                { l: "أعلى يوم", v: "7.5" },
                { l: "متوسط اليوم", v: "5.8" },
              ].map((s) => (
                <div key={s.l} className="surface-card p-4">
                  <p className="latin text-lg font-extrabold">{s.v}</p>
                  <p className="text-[11px] text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {tab === "المهارات" ? (
          <div className="surface-card space-y-4 p-4">
            <p className="text-xs font-bold">قائمة المهارات المطلوبة</p>
            {skills.map((s) => (
              <div key={s.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span>{s.name}</span>
                  <span className="latin text-muted-foreground">{s.value}%</span>
                </div>
                <Bar value={s.value} tone={s.value >= 80 ? "secondary" : s.value >= 50 ? "primary" : "warning"} />
              </div>
            ))}
          </div>
        ) : null}

        {tab === "التقرير" ? (
          <div className="surface-card space-y-4 p-4">
            <div className="flex items-center gap-2">
              <FileText className="size-4 text-primary" />
              <p className="text-xs font-bold">التقرير اليومي — الأحد 16 أغسطس</p>
            </div>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold">عدد الوصفات التي تعاملت معها</span>
              <input
                defaultValue="14"
                className="latin h-11 w-full rounded-2xl border border-input bg-card px-4 text-sm outline-none focus:border-primary"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold">أهم ما تعلمته اليوم</span>
              <textarea
                rows={4}
                defaultValue="تدريب على الاستشارة الدوائية لمرضى ارتفاع الضغط وشرح طريقة استخدام البخاخ."
                className="w-full rounded-2xl border border-input bg-card p-3.5 text-xs leading-relaxed outline-none focus:border-primary"
              />
            </label>
            <div className="flex gap-2">
              <ActionButton variant="outline">حفظ كمسودة</ActionButton>
              <ActionButton>إرسال للمشرف</ActionButton>
            </div>
          </div>
        ) : null}

        {tab === "حالة الطلب" ? (
          <div className="surface-card space-y-4 p-5">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              <p className="text-xs font-bold">طلب التدريب — صيدلية النهضة</p>
            </div>
            <Timeline
              steps={[
                "إرسال الطلب",
                "مراجعة الصيدلية",
                "الموافقة وتعيين المشرف",
                "بدء التدريب والحضور",
                "تقييم المشرف النهائي",
                "إصدار الشهادة الرقمية",
              ]}
              current={3}
            />
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
