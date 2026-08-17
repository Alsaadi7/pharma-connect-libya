import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";
import { ActionButton, AppBar, Bar, Chip, Field, Ring, Screen, SectionTitle, StatCard } from "@/components/kit";

export const Route = createFileRoute("/design-system")({
  head: () => ({
    meta: [
      { title: "نظام التصميم — PharmaTrain Libya" },
      {
        name: "description",
        content: "الألوان، الخطوط، الحواف، والمكونات الأساسية للهوية البصرية لمنصة فارما ترين ليبيا.",
      },
      { property: "og:title", content: "نظام التصميم — فارما ترين ليبيا" },
      { property: "og:description", content: "دليل الهوية البصرية والمكونات القابلة لإعادة الاستخدام." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DesignSystemPage,
});

const swatches = [
  { n: "Primary", c: "bg-primary", h: "#2563EB" },
  { n: "Secondary", c: "bg-secondary", h: "#10B981" },
  { n: "Warning", c: "bg-warning", h: "#F59E0B" },
  { n: "Background", c: "bg-background border border-border", h: "#F8FAFC" },
];

function DesignSystemPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="نظام التصميم" subtitle="الهوية البصرية والمكونات" back="/" />
      <Screen className="space-y-6">
        <section>
          <SectionTitle title="الألوان" />
          <div className="grid grid-cols-2 gap-3">
            {swatches.map((s) => (
              <div key={s.n} className="surface-card overflow-hidden">
                <div className={`h-16 w-full ${s.c}`} />
                <div className="p-3">
                  <p className="latin text-xs font-bold">{s.n}</p>
                  <p className="latin text-[11px] text-muted-foreground">{s.h}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="الخطوط" />
          <div className="surface-card space-y-2 p-4">
            <p className="text-lg font-extrabold">Cairo — عنوان رئيسي بالعربية</p>
            <p className="text-xs text-muted-foreground">Cairo — نص توضيحي بحجم صغير للواجهات العربية.</p>
            <p className="latin text-lg font-extrabold">Inter — Latin Heading</p>
            <p className="latin text-xs text-muted-foreground">Inter — numerals & English body text 0123456789</p>
          </div>
        </section>

        <section>
          <SectionTitle title="الحواف والظلال" />
          <div className="grid grid-cols-3 gap-3">
            {[
              { l: "16px", c: "rounded-2xl" },
              { l: "20px", c: "rounded-[20px]" },
              { l: "كامل", c: "rounded-full" },
            ].map((r) => (
              <div key={r.l} className={`surface-card flex h-20 items-center justify-center ${r.c}`}>
                <span className="latin text-xs font-bold">{r.l}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle title="الأزرار" />
          <div className="space-y-3">
            <ActionButton>زر أساسي</ActionButton>
            <ActionButton variant="mint">زر ثانوي</ActionButton>
            <ActionButton variant="outline">زر محدد</ActionButton>
          </div>
        </section>

        <section>
          <SectionTitle title="الشارات والمؤشرات" />
          <div className="surface-card space-y-4 p-4">
            <div className="flex flex-wrap gap-2">
              <Chip tone="primary">قيد التقدم</Chip>
              <Chip tone="secondary">مكتمل</Chip>
              <Chip tone="warning">بانتظار</Chip>
              <Chip>محايد</Chip>
            </div>
            <Bar value={68} />
            <Bar value={92} tone="secondary" />
            <div className="flex justify-center">
              <Ring value={74} />
            </div>
          </div>
        </section>

        <section>
          <SectionTitle title="البطاقات والحقول" />
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={Bell} label="إشعارات" value="12" />
              <StatCard icon={Bell} label="مهام" value="4" tone="secondary" />
            </div>
            <div className="surface-card p-4">
              <Field label="البريد الإلكتروني" placeholder="student@pharmatrain.ly" />
            </div>
          </div>
        </section>
      </Screen>
    </div>
  );
}
