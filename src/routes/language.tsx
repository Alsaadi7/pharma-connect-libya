import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Globe } from "lucide-react";
import { ActionButton, AppBar } from "@/components/kit";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/language")({
  head: () => ({
    meta: [
      { title: "اختيار اللغة — PharmaTrain Libya" },
      { name: "description", content: "اختر لغة الواجهة: العربية (RTL) أو الإنجليزية." },
      { property: "og:title", content: "اختيار اللغة — فارما ترين" },
      { property: "og:description", content: "واجهة عربية RTL بالكامل مع دعم الإنجليزية." },
    ],
  }),
  component: Language,
});

const langs = [
  { id: "ar", label: "العربية", sub: "الاتجاه من اليمين لليسار · خط Cairo", ready: true },
  { id: "en", label: "English", sub: "Left to right · Inter typeface", ready: false },
];

function Language() {
  const [sel, setSel] = useState("ar");
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px]">
      <AppBar title="لغة التطبيق" back="/onboarding" />
      <main className="space-y-5 px-4 py-6">
        <div className="surface-card flex items-center gap-3 p-4">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            <Globe className="size-5" />
          </span>
          <p className="text-xs text-muted-foreground">
            يمكنك تغيير اللغة لاحقًا من الإعدادات. الواجهة مصممة أساسًا بالعربية RTL.
          </p>
        </div>

        <div className="space-y-3">
          {langs.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => setSel(l.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl border-2 bg-card p-4 text-start transition-colors",
                sel === l.id ? "border-primary" : "border-transparent",
              )}
            >
              <div className="flex-1">
                <p className={cn("text-sm font-bold", l.id === "en" && "latin")}>{l.label}</p>
                <p className={cn("mt-0.5 text-[11px] text-muted-foreground", l.id === "en" && "latin")}>
                  {l.sub}
                </p>
              </div>
              {!l.ready ? (
                <span className="rounded-full bg-warning-soft px-2.5 py-1 text-[10px] font-bold text-warning">
                  قريبًا
                </span>
              ) : null}
              <span
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border",
                  sel === l.id ? "border-primary bg-primary text-primary-foreground" : "border-border",
                )}
              >
                {sel === l.id ? <Check className="size-3.5" /> : null}
              </span>
            </button>
          ))}
        </div>

        <ActionButton to="/auth/login">متابعة</ActionButton>
      </main>
    </div>
  );
}
