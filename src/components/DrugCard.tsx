import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { ChevronDown, X, Pill, BookmarkIcon, Search } from "lucide-react";
import { drugById, drugs, suggestDrugs, type Drug } from "@/lib/drugs";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ------------ context: يفتح البطاقة فوق أي شاشة دون فقدان حالة الصفحة ------------ */

type Ctx = { open: (drugId: string) => void };
const DrugSheetContext = createContext<Ctx>({ open: () => {} });

export function useDrugSheet() {
  return useContext(DrugSheetContext);
}

export function DrugSheetProvider({ children }: { children: ReactNode }) {
  const [id, setId] = useState<string | null>(null);
  const value = useMemo<Ctx>(() => ({ open: setId }), []);
  const drug = id ? drugById(id) : undefined;

  return (
    <DrugSheetContext.Provider value={value}>
      {children}
      {drug ? <DrugSheet drug={drug} onClose={() => setId(null)} /> : null}
    </DrugSheetContext.Provider>
  );
}

/* ------------ رابط الدواء داخل النصوص والحالات والوصفات ------------ */

export function DrugLink({ drugId, label }: { drugId: string; label?: string }) {
  const { open } = useDrugSheet();
  const drug = drugById(drugId);
  if (!drug) return <span>{label ?? drugId}</span>;
  return (
    <button
      type="button"
      onClick={() => open(drugId)}
      className="inline-flex items-center gap-1 rounded-lg bg-primary-soft px-2 py-1 text-[11px] font-bold text-primary"
    >
      <Pill className="size-3" />
      {label ?? drug.name}
    </button>
  );
}

/* ------------ البطاقة نفسها ------------ */

function Section({ title, items, emoji }: { title: string; items: string[]; emoji: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 py-3 text-start"
      >
        <span className="text-xs font-bold">
          {emoji} {title}
        </span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open ? (
        <ul className="space-y-1.5 pb-3 ps-1">
          {items.map((i) => (
            <li key={i} className="flex gap-2 text-[11px] leading-relaxed text-muted-foreground">
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary/60" />
              {i}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

function DrugSheet({ drug, onClose }: { drug: Drug; onClose: () => void }) {
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved("drug", drug.id);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button aria-label="إغلاق" onClick={onClose} className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
      <div className="relative max-h-[88vh] w-full max-w-[430px] overflow-y-auto rounded-t-[28px] bg-card p-5 shadow-xl sm:rounded-[28px]">
        <div className="flex items-start gap-3">
          <div className="min-w-0 flex-1">
            <p className="latin truncate text-base font-extrabold">{drug.name}</p>
            <p className="latin text-[11px] font-semibold text-primary">{drug.className}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {drug.ar} · {drug.subtitle}
            </p>
          </div>
          <button
            onClick={() =>
              toggleSaved({ itemType: "drug", itemId: drug.id, title: drug.name, subtitle: drug.className })
            }
            aria-label="حفظ الدواء"
            className={cn(
              "flex size-9 items-center justify-center rounded-xl",
              saved ? "bg-secondary-soft text-secondary" : "bg-muted text-muted-foreground",
            )}
          >
            <BookmarkIcon className={cn("size-4", saved && "fill-current")} />
          </button>
          <button
            onClick={onClose}
            aria-label="إغلاق البطاقة"
            className="flex size-9 items-center justify-center rounded-xl bg-muted text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {[
            drug.legal,
            `Route: ${drug.route}`,
            `ATC: ${drug.atc}`,
            drug.ages,
            ...drug.strengths.slice(0, 2),
          ].map((t) => (
            <span key={t} className="latin rounded-full bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
        <p className="mt-2 rounded-2xl bg-warning-soft/60 p-2.5 text-[10px] leading-relaxed text-foreground">
          الحمل: {drug.pregnancy}
        </p>

        <div className="mt-3 rounded-2xl bg-secondary-soft/50 p-3">
          <p className="text-[11px] font-bold">🏷️ الأسماء التجارية</p>
          {drug.brands.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {drug.brands.map((b) => (
                <span
                  key={b}
                  className="latin rounded-full border border-secondary/30 bg-card px-2.5 py-1 text-[10px] font-bold text-secondary"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-1.5 text-[10px] leading-relaxed text-muted-foreground">
              لا تتوفر أسماء تجارية لهذا الدواء في قاعدة البيانات حاليًا.
            </p>
          )}
        </div>

        <div className="mt-3">
          <Section emoji="💊" title="Uses — الاستخدامات" items={drug.uses} />
          <Section
            emoji="📏"
            title="Doses — الجرعات"
            items={[
              `Adults: ${drug.doses.adult}`,
              `Pediatrics: ${drug.doses.pediatric}`,
              `Maximum: ${drug.doses.max}`,
              ...drug.doses.notes,
            ]}
          />
          <Section emoji="📦" title="Dosage Forms — الأشكال الصيدلانية" items={drug.forms} />
          <Section emoji="⚠️" title="Side Effects — الآثار الجانبية" items={drug.sideEffects} />
          <Section emoji="🚫" title="Contraindications — الموانع والتحذيرات" items={drug.contraindications} />
          <Section emoji="🔄" title="Drug Interactions — التداخلات" items={drug.interactions} />
          <Section emoji="🗣️" title="Patient Counselling — توعية المريض" items={drug.counselling} />
          <Section emoji="🏥" title="Referral — دواعي الإحالة" items={drug.referral} />
        </div>

        <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">
          المصدر: {drug.source} · محتوى تعليمي مختصر لطلاب الصيدلة، وليس بديلًا عن المراجع الدوائية الرسمية.
        </p>
      </div>
    </div>
  );
}

/* ------------ بحث سريع في قاعدة الأدوية ------------ */

export function DrugSearch({ placeholder = "ابحث عن دواء… مثال: para" }: { placeholder?: string }) {
  const [q, setQ] = useState("");
  const { open } = useDrugSheet();
  const results = q.trim().length >= 2 ? suggestDrugs(q, 8) : [];
  const seen = new Set<string>();
  const unique = results.filter((r) => (seen.has(r.drugId) ? false : (seen.add(r.drugId), true)));

  return (
    <div className="space-y-2">
      <label className="relative block">
        <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3.5" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="h-12 w-full rounded-2xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-primary"
        />
      </label>
      {unique.length ? (
        <div className="surface-card divide-y divide-border overflow-hidden">
          {unique.map((r) => {
            const d = drugById(r.drugId)!;
            return (
              <button
                key={r.drugId}
                onClick={() => open(r.drugId)}
                className="flex w-full items-center gap-3 p-3 text-start"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <Pill className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="latin block truncate text-xs font-bold">{d.name}</span>
                  <span className="latin block truncate text-[10px] text-muted-foreground">{d.className}</span>
                </span>
              </button>
            );
          })}
        </div>
      ) : null}
      {q.trim().length >= 2 && !unique.length ? (
        <p className="px-1 text-[11px] text-muted-foreground">لا نتائج مطابقة في قاعدة الأدوية.</p>
      ) : null}
    </div>
  );
}

export const drugCount = drugs.length;
