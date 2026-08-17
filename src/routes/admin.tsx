import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, Building2, BookOpen, ShieldCheck, Award, AlertTriangle, BarChart3, Settings } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Screen, SectionTitle, StatCard, Tabs } from "@/components/kit";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة مدير النظام — PharmaTrain Libya" },
      {
        name: "description",
        content: "إدارة المستخدمين والصيدليات والدورات والشهادات ومراقبة أداء منصة التدريب الصيدلاني.",
      },
      { property: "og:title", content: "لوحة مدير النظام — فارما ترين ليبيا" },
      { property: "og:description", content: "تحكم كامل في المستخدمين، الاعتمادات، الشهادات والتقارير." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminApp,
});

const tabs = ["اللوحة", "المستخدمون", "الصيدليات", "المحتوى", "الشهادات", "التقارير", "الإعدادات"];

function AdminApp() {
  const [tab, setTab] = useState("اللوحة");

  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="مدير النظام" subtitle="PharmaTrain Libya · تحكم كامل" back="/" />
      <Screen className="space-y-5">
        <Tabs items={tabs} active={tab} onChange={setTab} />

        {tab === "اللوحة" ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Users} label="إجمالي المستخدمين" value="8,942" />
              <StatCard icon={Building2} label="صيدليات معتمدة" value="214" tone="secondary" />
              <StatCard icon={BookOpen} label="دورات منشورة" value="86" tone="primary" />
              <StatCard icon={AlertTriangle} label="طلبات بانتظار المراجعة" value="17" tone="warning" />
            </div>
            <section>
              <SectionTitle title="صحة المنصة" />
              <div className="surface-card space-y-3 p-4">
                {[
                  { l: "نشاط الطلاب الأسبوعي", v: 78 },
                  { l: "إشغال مقاعد التدريب", v: 64 },
                  { l: "معدل توثيق الحضور", v: 91 },
                ].map((s) => (
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
          </>
        ) : null}

        {tab === "المستخدمون" ? (
          <div className="surface-card divide-y divide-border overflow-hidden">
            {[
              { n: "أمينة الزروق", r: "طالبة", s: "نشط" },
              { n: "صيدلية النهضة", r: "صيدلية", s: "نشط" },
              { n: "د. سالم القريتلي", r: "مشرف", s: "نشط" },
              { n: "ليبيا فارما", r: "شركة أدوية", s: "بانتظار" },
            ].map((u) => (
              <div key={u.n} className="flex items-center gap-3 p-3.5">
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-[10px] font-bold text-primary">
                  {u.n.slice(0, 2)}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold">{u.n}</p>
                  <p className="text-[11px] text-muted-foreground">{u.r}</p>
                </div>
                <Chip tone={u.s === "نشط" ? "secondary" : "warning"}>{u.s}</Chip>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الصيدليات" ? (
          <div className="space-y-3">
            {[
              { t: "صيدلية النهضة — طرابلس", s: "معتمدة", m: "6 متدربين" },
              { t: "صيدلية الشفاء — بنغازي", s: "بانتظار الاعتماد", m: "طلب جديد" },
            ].map((p) => (
              <div key={p.t} className="surface-card space-y-2 p-4">
                <p className="text-xs font-bold">{p.t}</p>
                <div className="flex items-center gap-2">
                  <Chip tone={p.s === "معتمدة" ? "secondary" : "warning"}>{p.s}</Chip>
                  <Chip>{p.m}</Chip>
                </div>
                <ActionButton variant="outline">مراجعة الملف</ActionButton>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "المحتوى" ? (
          <div className="space-y-3">
            {["أساسيات علم الأدوية السريري", "الاستشارة الدوائية", "الحالات السريرية المتقدمة"].map((c) => (
              <div key={c} className="surface-card flex items-center gap-3 p-4">
                <BookOpen className="size-5 text-primary" />
                <p className="flex-1 text-xs font-bold leading-snug">{c}</p>
                <Chip tone="secondary">منشور</Chip>
              </div>
            ))}
          </div>
        ) : null}

        {tab === "الشهادات" ? (
          <div className="space-y-3">
            {[
              { t: "شهادات موثقة", v: "1,204" },
              { t: "بانتظار التوقيع", v: "23" },
            ].map((s) => (
              <div key={s.t} className="surface-card flex items-center gap-3 p-4">
                <Award className="size-5 text-warning" />
                <p className="flex-1 text-xs font-bold">{s.t}</p>
                <span className="latin text-lg font-extrabold">{s.v}</span>
              </div>
            ))}
            <div className="surface-card flex items-center gap-3 p-4">
              <ShieldCheck className="size-5 text-secondary" />
              <p className="flex-1 text-xs font-bold">التحقق عبر QR مفعّل</p>
              <Chip tone="secondary">يعمل</Chip>
            </div>
          </div>
        ) : null}

        {tab === "التقارير" ? (
          <div className="surface-card space-y-4 p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="size-4 text-primary" />
              <p className="text-xs font-bold">التسجيلات الشهرية</p>
            </div>
            <div className="flex h-40 items-end gap-2">
              {[38, 55, 47, 72, 84, 66, 90].map((h, i) => (
                <div key={i} className="flex-1 rounded-t-xl gradient-primary" style={{ height: `${h}%` }} />
              ))}
            </div>
            <ActionButton variant="outline">تصدير تقرير PDF</ActionButton>
          </div>
        ) : null}

        {tab === "الإعدادات" ? (
          <div className="surface-card divide-y divide-border overflow-hidden">
            {["إدارة الأدوار والصلاحيات", "سياسات التدريب والساعات", "إشعارات المنصة", "النسخ الاحتياطي"].map((s) => (
              <div key={s} className="flex items-center gap-3 p-3.5">
                <Settings className="size-4 text-muted-foreground" />
                <p className="flex-1 text-xs font-bold">{s}</p>
              </div>
            ))}
          </div>
        ) : null}
      </Screen>
    </div>
  );
}
