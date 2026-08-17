import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, SlidersHorizontal, Map, List } from "lucide-react";
import { AppBar, Chip, PharmacyCard, Screen, Tabs } from "@/components/kit";
import { pharmacies } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/pharmacies/")({
  head: () => ({
    meta: [
      { title: "البحث عن صيدلية تدريب — PharmaTrain Libya" },
      { name: "description", content: "ابحث في الصيدليات المعتمدة حسب المدينة والتخصص والمقاعد المتاحة، بالقائمة أو الخريطة." },
      { property: "og:title", content: "صيدليات التدريب — فارما ترين" },
      { property: "og:description", content: "صيدليات معتمدة في طرابلس وبنغازي ومصراتة." },
    ],
  }),
  component: PharmacySearch,
});

const cities = ["كل المدن", "طرابلس", "بنغازي", "مصراتة", "سبها"];

function PharmacySearch() {
  const [view, setView] = useState<"list" | "map">("list");
  const [city, setCity] = useState("كل المدن");
  const list = city === "كل المدن" ? pharmacies : pharmacies.filter((p) => p.city.includes(city));

  return (
    <div>
      <AppBar
        title="صيدليات التدريب"
        subtitle={`${list.length} صيدلية معتمدة`}
        action={
          <div className="flex rounded-full bg-muted p-1">
            {(["list", "map"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={v === "list" ? "قائمة" : "خريطة"}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full",
                  view === v && "bg-card text-primary shadow-[var(--shadow-soft)]",
                )}
              >
                {v === "list" ? <List className="size-4" /> : <Map className="size-4" />}
              </button>
            ))}
          </div>
        }
      />
      <Screen className="space-y-4">
        <div className="flex gap-2">
          <label className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3.5" />
            <input
              placeholder="اسم الصيدلية أو المنطقة…"
              className="h-12 w-full rounded-2xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-primary"
            />
          </label>
          <button
            className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground"
            aria-label="تصفية"
          >
            <SlidersHorizontal className="size-4.5" />
          </button>
        </div>

        <Tabs items={cities} active={city} onChange={setCity} />

        {view === "map" ? (
          <div className="relative h-[320px] overflow-hidden rounded-3xl bg-secondary-soft">
            <div className="absolute inset-0 opacity-60 [background:repeating-linear-gradient(90deg,transparent,transparent_38px,var(--color-border)_39px),repeating-linear-gradient(0deg,transparent,transparent_38px,var(--color-border)_39px)]" />
            {list.map((p, i) => (
              <span
                key={p.id}
                className="absolute flex flex-col items-center"
                style={{ top: `${20 + i * 18}%`, left: `${18 + ((i * 23) % 60)}%` }}
              >
                <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold text-primary-foreground shadow-[var(--shadow-glow)]">
                  {p.name}
                </span>
                <span className="size-2.5 rounded-full bg-primary" />
              </span>
            ))}
            <div className="absolute inset-x-3 bottom-3">
              <PharmacyCard pharmacy={list[0] ?? pharmacies[0]!} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2">
              <Chip tone="secondary">مقاعد متاحة</Chip>
              <Chip tone="primary">الأقرب إليك</Chip>
              <Chip>معتمدة</Chip>
            </div>
            <div className="space-y-3">
              {list.map((p) => (
                <PharmacyCard key={p.id} pharmacy={p} />
              ))}
            </div>
          </>
        )}
      </Screen>
    </div>
  );
}
