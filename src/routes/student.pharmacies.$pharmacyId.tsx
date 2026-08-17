import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BadgeCheck, MapPin, Clock, Users, Phone, CheckCircle2, X } from "lucide-react";
import { ActionButton, AppBar, Chip, Rating, Screen, SectionTitle, Timeline } from "@/components/kit";
import { pharmacies } from "@/lib/mock";

export const Route = createFileRoute("/student/pharmacies/$pharmacyId")({
  head: () => ({
    meta: [
      { title: "تفاصيل الصيدلية والتقديم — PharmaTrain Libya" },
      { name: "description", content: "معلومات الصيدلية، المشرفون، المقاعد المتاحة، وتقديم طلب التدريب مباشرة." },
      { property: "og:title", content: "تفاصيل صيدلية التدريب — فارما ترين" },
      { property: "og:description", content: "قدّم طلب تدريب وتابع حالته خطوة بخطوة." },
    ],
  }),
  component: PharmacyDetails,
});

function PharmacyDetails() {
  const { pharmacyId } = Route.useParams();
  const p = pharmacies.find((x) => x.id === pharmacyId) ?? pharmacies[0]!;
  const [applied, setApplied] = useState(false);
  const [confirm, setConfirm] = useState(false);

  return (
    <div>
      <AppBar title={p.name} subtitle={p.city} back="/student/pharmacies" />

      <div className="relative h-36 gradient-mint">
        <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_70%_30%,white,transparent_55%)]" />
        <span className="absolute -bottom-6 flex size-16 items-center justify-center rounded-3xl bg-card text-2xl shadow-[var(--shadow-card)] start-4">
          ⚕
        </span>
      </div>

      <Screen className="space-y-5 pt-9">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5">
            <h2 className="text-lg font-extrabold">{p.name}</h2>
            {p.verified ? <BadgeCheck className="size-5 text-primary" /> : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Rating value={p.rating} count="42 تقييم" />
            <Chip tone="primary">{p.specialty}</Chip>
            <Chip tone={p.seats > 0 ? "secondary" : "error"}>{p.seats} مقاعد متاحة</Chip>
          </div>
          <p className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <MapPin className="size-3.5" /> {p.city} · <span className="latin">{p.distance}</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {[
            { icon: Clock, l: "الدوام", v: "08–14" },
            { icon: Users, l: "متدربون حاليًا", v: "6" },
            { icon: Phone, l: "تواصل", v: "متاح" },
          ].map(({ icon: Icon, l, v }) => (
            <div key={l} className="surface-card p-3 text-center">
              <Icon className="mx-auto size-4 text-primary" />
              <p className="latin mt-1.5 text-sm font-bold">{v}</p>
              <p className="text-[10px] text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>

        <div className="surface-card space-y-2 p-4">
          <p className="text-xs font-bold">عن جهة التدريب</p>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            صيدلية مجتمعية معتمدة توفّر تدريبًا عمليًا على صرف الدواء، الاستشارة الدوائية، وإدارة
            المخزون، بإشراف صيادلة مرخّصين ومتابعة أسبوعية للمهارات.
          </p>
        </div>

        <section>
          <SectionTitle title="المشرفون" />
          <div className="surface-card divide-y divide-border overflow-hidden">
            {[
              { n: "د. خالد بن عمران", r: "صيدلي سريري · 9 سنوات" },
              { n: "د. سلمى الفيتوري", r: "صيدلية مجتمعية · 5 سنوات" },
            ].map((s) => (
              <div key={s.n} className="flex items-center gap-3 p-3.5">
                <span className="flex size-10 items-center justify-center rounded-2xl bg-primary-soft text-xs font-bold text-primary">
                  {s.n.split(" ")[1]?.slice(0, 2)}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold">{s.n}</p>
                  <p className="text-[11px] text-muted-foreground">{s.r}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {applied ? (
          <div className="surface-card space-y-4 p-5">
            <div className="flex items-center gap-2 rounded-2xl bg-secondary-soft p-3 text-secondary">
              <CheckCircle2 className="size-4.5" />
              <p className="text-xs font-bold">تم إرسال طلب التدريب بنجاح</p>
            </div>
            <Timeline
              steps={["إرسال الطلب", "مراجعة الصيدلية", "الموافقة وتعيين المشرف", "بدء التدريب"]}
              current={1}
            />
            <ActionButton to="/student/training" variant="outline">
              متابعة حالة الطلب
            </ActionButton>
          </div>
        ) : (
          <ActionButton onClick={() => setConfirm(true)}>التقديم على التدريب</ActionButton>
        )}
      </Screen>

      {confirm ? (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-foreground/40 px-4 pb-6 backdrop-blur-sm">
          <div className="w-full max-w-[400px] space-y-4 rounded-3xl bg-card p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold">تأكيد التقديم</h3>
                <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                  سيتم إرسال ملفك الأكاديمي وساعاتك السابقة إلى {p.name} للمراجعة.
                </p>
              </div>
              <button onClick={() => setConfirm(false)} aria-label="إغلاق" className="text-muted-foreground">
                <X className="size-4.5" />
              </button>
            </div>
            <label className="block space-y-1.5">
              <span className="text-[11px] font-semibold">الفترة المطلوبة</span>
              <select className="h-11 w-full rounded-2xl border border-input bg-card px-3 text-xs outline-none focus:border-primary">
                <option>صباحية 08:00 — 14:00</option>
                <option>مسائية 15:00 — 21:00</option>
              </select>
            </label>
            <div className="flex gap-2">
              <ActionButton variant="ghost" onClick={() => setConfirm(false)}>
                إلغاء
              </ActionButton>
              <ActionButton
                onClick={() => {
                  setApplied(true);
                  setConfirm(false);
                }}
              >
                تأكيد الإرسال
              </ActionButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
