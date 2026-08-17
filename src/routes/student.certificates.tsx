import { createFileRoute } from "@tanstack/react-router";
import { Award, Download, QrCode, Share2, ShieldCheck } from "lucide-react";
import { ActionButton, AppBar, Chip, EmptyState, Screen } from "@/components/kit";
import { certificates } from "@/lib/mock";

export const Route = createFileRoute("/student/certificates")({
  head: () => ({
    meta: [
      { title: "الشهادات الرقمية — PharmaTrain Libya" },
      { name: "description", content: "شهادات إتمام التدريب والدورات مع رمز تحقق QR قابل للمشاركة." },
      { property: "og:title", content: "الشهادات الرقمية — فارما ترين" },
      { property: "og:description", content: "شهادات قابلة للتحقق إلكترونيًا." },
    ],
  }),
  component: Certificates,
});

function Certificates() {
  return (
    <div>
      <AppBar title="الشهادات الرقمية" subtitle="قابلة للتحقق عبر رمز QR" back="/student" />
      <Screen className="space-y-4">
        {certificates.map((c) => (
          <article key={c.id} className="surface-card overflow-hidden">
            <div className="relative gradient-primary p-4 text-primary-foreground">
              <div className="absolute inset-0 opacity-25 [background:radial-gradient(circle_at_85%_20%,white,transparent_55%)]" />
              <div className="relative flex items-start gap-3">
                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-foreground/18 backdrop-blur">
                  <Award className="size-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold leading-snug">{c.title}</p>
                  <p className="mt-1 text-[11px] opacity-85">{c.issuer}</p>
                </div>
                <span className="flex size-12 items-center justify-center rounded-xl bg-card text-foreground">
                  <QrCode className="size-7" />
                </span>
              </div>
            </div>
            <div className="space-y-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Chip tone="secondary">
                  <ShieldCheck className="size-3" /> موثّقة
                </Chip>
                <Chip>{c.hours}</Chip>
                <Chip>{c.date}</Chip>
              </div>
              <p className="latin text-[11px] text-muted-foreground">رمز التحقق: {c.code}</p>
              <div className="flex gap-2">
                <ActionButton variant="outline">
                  <Download className="size-4" /> تحميل PDF
                </ActionButton>
                <ActionButton variant="mint">
                  <Share2 className="size-4" /> مشاركة
                </ActionButton>
              </div>
            </div>
          </article>
        ))}

        <EmptyState
          title="شهادة التدريب النهائية قيد الإنجاز"
          body="أكمل 320 ساعة تدريب وتقييم المشرف النهائي لإصدار شهادة التدريب العملي الكاملة."
          action={<Chip tone="warning">متبقٍ 106 ساعة</Chip>}
        />
      </Screen>
    </div>
  );
}
