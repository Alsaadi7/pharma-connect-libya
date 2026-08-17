import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BookOpen, Users, CalendarClock, Award, Upload, Plus, Megaphone, BarChart3 } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Field, Screen, SectionTitle, StatCard, Tabs } from "@/components/kit";
import { courses } from "@/lib/mock";

export const Route = createFileRoute("/company")({
  head: () => ({
    meta: [
      { title: "لوحة شركة الأدوية — PharmaTrain Libya" },
      { name: "description", content: "أنشئ دورات وورشًا، ارفع فيديوهات، وتابع المشاركين والشهادات والإحصاءات." },
      { property: "og:title", content: "لوحة شركة الأدوية — فارما ترين" },
      { property: "og:description", content: "محتوى تعليمي معتمد لطلاب الصيدلة." },
    ],
  }),
  component: CompanyApp,
});

const tabs = ["اللوحة", "الدورات", "إنشاء دورة", "الورش", "المشاركون", "الشهادات", "الإعلانات", "التحليلات"];

function CompanyApp() {
  const [tab, setTab] = useState("اللوحة");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="ليبيا فارما" subtitle="شركة أدوية · شريك تعليمي" back="/" />
      <Screen className="space-y-5">
        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "اللوحة" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={BookOpen} label="الدورات المنشورة" value="12" />
              <StatCard icon={Users} label="المشاركون" value="3,480" tone="secondary" />
              <StatCard icon={CalendarClock} label="ورش قادمة" value="3" tone="warning" />
              <StatCard icon={Award} label="شهادات صادرة" value="1,204" tone="primary" />
            </div>
            <section>
              <SectionTitle title="إحصائيات المحتوى" />
              <div className="surface-card space-y-3 p-4">
                {[
                  { l: "معدل إتمام الدورات", v: 74 },
                  { l: "معدل مشاهدة الفيديو", v: 61 },
                  { l: "نجاح الاختبارات", v: 88 },
                ].map((s) => (
                  <div key={s.l} className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span>{s.l}</span>
                      <span className="latin text-muted-foreground">{s.v}%</span>
                    </div>
                    <Bar value={s.v} tone={s.v > 70 ? "secondary" : "primary"} />
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {tab === "الدورات" ? (
          <div className="space-y-3">
            {courses.map((c) => (
              <div key={c.id} className="surface-card space-y-2 p-4">
                <p className="text-xs font-bold leading-snug">{c.title}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="primary">
                    <span className="latin">{c.lessons}</span> درسًا
                  </Chip>
                  <Chip tone="secondary">
                    <span className="latin">{c.learners}</span> مشارك
                  </Chip>
                  <Chip>{c.tag}</Chip>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "إنشاء دورة" ? (
          <div className="surface-card space-y-4 p-4">
            <Field label="عنوان الدورة" placeholder="الاستخدام الرشيد للمضادات الحيوية" />
            <Field label="التصنيف" placeholder="سريري / علم الأدوية / إدارة" />
            <Field label="عدد الساعات المعتمدة" placeholder="12" />
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold">وصف الدورة</span>
              <textarea
                rows={4}
                className="w-full rounded-2xl border border-input bg-card p-3 text-xs outline-none focus:border-primary"
              />
            </label>
            <div className="flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-border p-6 text-center">
              <Upload className="size-6 text-primary" />
              <p className="text-xs font-bold">ارفع فيديوهات الدروس</p>
              <p className="text-[11px] text-muted-foreground">MP4 حتى 2GB لكل درس</p>
            </div>
            <ActionButton>نشر الدورة</ActionButton>
          </div>
        ) : null}

        {tab === "الورش" ? (
          <div className="space-y-3">
            <ActionButton variant="mint">
              <Plus className="size-4" /> إنشاء ورشة جديدة
            </ActionButton>
            {[
              { t: "ورشة الاستشارة الدوائية العملية", d: "24 أغسطس · طرابلس", s: "42/60 مقعد" },
              { t: "ورشة قراءة التحاليل للصيادلة", d: "2 سبتمبر · بنغازي", s: "18/40 مقعد" },
            ].map((w) => (
              <div key={w.t} className="surface-card space-y-2 p-4">
                <p className="text-xs font-bold">{w.t}</p>
                <p className="text-[11px] text-muted-foreground">{w.d}</p>
                <Chip tone="warning">{w.s}</Chip>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "المشاركون" ? (
          <div className="surface-card divide-y divide-border overflow-hidden">
            {["أمينة الزروق", "محمد الشريف", "رنا القذافي", "يوسف بن سعيد"].map((n, i) => (
              <div key={n} className="flex items-center gap-3 p-3.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-[10px] font-bold text-primary">
                  {n.slice(0, 2)}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold">{n}</p>
                  <p className="text-[11px] text-muted-foreground">أساسيات علم الأدوية السريري</p>
                </div>
                <Chip tone={i % 2 ? "secondary" : "primary"}>{i % 2 ? "مكتمل" : "72%"}</Chip>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الشهادات" ? (
          <div className="space-y-3">
            {[
              { t: "شهادات صادرة هذا الشهر", v: "148" },
              { t: "بانتظار الاعتماد", v: "12" },
            ].map((s) => (
              <div key={s.t} className="surface-card flex items-center gap-3 p-4">
                <Award className="size-5 text-warning" />
                <p className="flex-1 text-xs font-bold">{s.t}</p>
                <span className="latin text-lg font-extrabold">{s.v}</span>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الإعلانات" ? (
          <div className="space-y-3">
            <div className="surface-card space-y-2 p-4">
              <span className="flex size-10 items-center justify-center rounded-xl bg-warning-soft text-warning">
                <Megaphone className="size-4.5" />
              </span>
              <p className="text-xs font-bold">حملة تعريفية بالمنتج التعليمي</p>
              <p className="text-[11px] text-muted-foreground">ظهور داخل تطبيق الطالب · 12,400 مشاهدة</p>
              <Bar value={62} tone="warning" />
            </div>
            <ActionButton variant="outline">إنشاء إعلان جديد</ActionButton>
          </div>
        ) : null}

        {tab === "التحليلات" ? (
          <div className="surface-card space-y-4 p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              <p className="text-xs font-bold">المشاركة الشهرية</p>
            </div>
            <div className="flex h-40 items-end gap-2">
              {[45, 62, 38, 80, 70, 95, 58].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-xl gradient-primary" style={{ height: `${h}%` }} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">أعلى تفاعل في الأسبوع السادس — بعد نشر ورشة طرابلس.</p>
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
