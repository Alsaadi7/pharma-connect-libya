/**
 * مكوّنات لوحة الإدارة المشتركة: حقول متحكمة، جدول ببحث/ترتيب/صفحات/إجراءات جماعية،
 * نوافذ منبثقة، تأكيد الحذف، ورسائل نجاح.
 */
import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Plus, Search, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* --------------------------------- الحقول --------------------------------- */

export function TextInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/12"
      />
      {hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold">{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-input bg-card p-3 text-sm outline-none focus:border-primary focus:ring-4 focus:ring-primary/12"
      />
    </label>
  );
}

export function SelectInput({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function Switch({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-3 py-2.5 text-xs font-semibold"
    >
      <span>{label}</span>
      <span className={cn("relative h-5 w-9 rounded-full transition-colors", checked ? "bg-secondary" : "bg-muted")}>
        <span
          className={cn(
            "absolute top-0.5 size-4 rounded-full bg-card shadow transition-all",
            checked ? "start-4.5" : "start-0.5",
          )}
        />
      </span>
    </button>
  );
}

/* --------------------------------- عناصر --------------------------------- */

export function Pill({ tone = "muted", children }: { tone?: "ok" | "warn" | "muted" | "info"; children: ReactNode }) {
  const tones = {
    ok: "bg-secondary/12 text-secondary",
    warn: "bg-warning/15 text-warning",
    info: "bg-primary/12 text-primary",
    muted: "bg-muted text-muted-foreground",
  } as const;
  return <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold", tones[tone])}>{children}</span>;
}

export function AdminButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md";
}) {
  const styles = {
    primary: "bg-primary text-primary-foreground",
    outline: "border border-border bg-card",
    danger: "bg-destructive text-destructive-foreground",
    ghost: "bg-muted",
  } as const;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-xl font-bold transition-transform active:scale-[0.98]",
        size === "sm" ? "h-9 px-3 text-[11px]" : "h-11 px-4 text-xs",
        styles[variant],
      )}
    >
      {children}
    </button>
  );
}

export function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: ReactNode; wide?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 p-0 sm:items-center sm:p-6">
      <div
        className={cn(
          "max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-background p-5 sm:rounded-3xl",
          wide ? "sm:max-w-3xl" : "sm:max-w-lg",
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-extrabold">{title}</h3>
          <button type="button" onClick={onClose} className="rounded-full bg-muted p-2">
            <X className="size-4" />
          </button>
        </div>
        <div className="space-y-3">{children}</div>
      </div>
    </div>
  );
}

export function ConfirmDelete({ label, onCancel, onConfirm }: { label: string; onCancel: () => void; onConfirm: () => void }) {
  return (
    <Modal title="تأكيد الحذف" onClose={onCancel}>
      <p className="text-xs leading-relaxed text-muted-foreground">
        سيتم حذف <span className="font-bold text-foreground">{label}</span> نهائيًا. لا يمكن التراجع عن هذه العملية.
      </p>
      <div className="flex gap-2 pt-2">
        <AdminButton variant="danger" onClick={onConfirm}>
          <Trash2 className="size-4" /> حذف
        </AdminButton>
        <AdminButton variant="outline" onClick={onCancel}>
          إلغاء
        </AdminButton>
      </div>
    </Modal>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 left-1/2 z-[60] -translate-x-1/2 rounded-2xl bg-secondary px-4 py-2.5 text-xs font-bold text-secondary-foreground shadow-lg">
      {message}
    </div>
  );
}

export function useToast() {
  const [message, setMessage] = useState("");
  const show = (m: string) => {
    setMessage(m);
    window.setTimeout(() => setMessage(""), 2200);
  };
  return { message, show, node: <Toast message={message} /> };
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-lg font-extrabold">{title}</h1>
        {subtitle ? <p className="text-[11px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

/* --------------------------------- الجدول --------------------------------- */

export type Column<T> = {
  key: string;
  label: string;
  render: (row: T) => ReactNode;
  sort?: (row: T) => string | number;
  className?: string;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  search,
  filters,
  onAdd,
  addLabel = "إضافة",
  onDeleteMany,
  actions,
  pageSize = 10,
  empty = "لا توجد بيانات",
}: {
  rows: T[];
  columns: Column<T>[];
  search?: (row: T) => string;
  filters?: { label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[] }[];
  onAdd?: () => void;
  addLabel?: string;
  onDeleteMany?: (ids: string[]) => void;
  actions?: (row: T) => ReactNode;
  pageSize?: number;
  empty?: string;
}) {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState("");
  const [dir, setDir] = useState<1 | -1>(1);
  const [selected, setSelected] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    let list = term && search ? rows.filter((r) => search(r).toLowerCase().includes(term)) : [...rows];
    const col = columns.find((c) => c.key === sortKey);
    if (col?.sort) {
      list = list.sort((a, b) => {
        const av = col.sort!(a);
        const bv = col.sort!(b);
        return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
      });
    }
    return list;
  }, [rows, q, search, sortKey, dir, columns]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const current = Math.min(page, pages - 1);
  const view = filtered.slice(current * pageSize, current * pageSize + pageSize);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {search ? (
          <span className="relative min-w-[180px] flex-1">
            <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3" />
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              placeholder="بحث..."
              className="h-10 w-full rounded-xl border border-input bg-card ps-9 pe-3 text-xs outline-none focus:border-primary"
            />
          </span>
        ) : null}
        {filters?.map((f) => (
          <select
            key={f.label}
            value={f.value}
            onChange={(e) => {
              f.onChange(e.target.value);
              setPage(0);
            }}
            className="h-10 rounded-xl border border-input bg-card px-2 text-xs outline-none focus:border-primary"
          >
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}
        {onAdd ? (
          <AdminButton size="sm" onClick={onAdd}>
            <Plus className="size-4" /> {addLabel}
          </AdminButton>
        ) : null}
      </div>

      {selected.length > 0 && onDeleteMany ? (
        <div className="flex items-center justify-between rounded-xl bg-destructive/10 px-3 py-2 text-[11px] font-bold text-destructive">
          <span>محدد: {selected.length}</span>
          <button
            type="button"
            onClick={() => {
              onDeleteMany(selected);
              setSelected([]);
            }}
          >
            حذف المحدد
          </button>
        </div>
      ) : null}

      <div className="surface-card overflow-x-auto">
        <table className="w-full text-start text-[11px]">
          <thead className="bg-muted/60 text-muted-foreground">
            <tr>
              {onDeleteMany ? (
                <th className="p-3">
                  <input
                    type="checkbox"
                    checked={view.length > 0 && view.every((r) => selected.includes(r.id))}
                    onChange={(e) => setSelected(e.target.checked ? view.map((r) => r.id) : [])}
                  />
                </th>
              ) : null}
              {columns.map((c) => (
                <th key={c.key} className={cn("whitespace-nowrap p-3 text-start font-bold", c.className)}>
                  {c.sort ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1"
                      onClick={() => {
                        if (sortKey === c.key) setDir(dir === 1 ? -1 : 1);
                        else {
                          setSortKey(c.key);
                          setDir(1);
                        }
                      }}
                    >
                      {c.label}
                      {sortKey === c.key ? (
                        dir === 1 ? (
                          <ChevronUp className="size-3" />
                        ) : (
                          <ChevronDown className="size-3" />
                        )
                      ) : null}
                    </button>
                  ) : (
                    c.label
                  )}
                </th>
              ))}
              {actions ? <th className="p-3 text-start font-bold">إجراءات</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {view.map((r) => (
              <tr key={r.id} className="align-middle">
                {onDeleteMany ? (
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(r.id)}
                      onChange={(e) =>
                        setSelected((s) => (e.target.checked ? [...s, r.id] : s.filter((x) => x !== r.id)))
                      }
                    />
                  </td>
                ) : null}
                {columns.map((c) => (
                  <td key={c.key} className={cn("p-3", c.className)}>
                    {c.render(r)}
                  </td>
                ))}
                {actions ? <td className="p-3">{actions(r)}</td> : null}
              </tr>
            ))}
            {view.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="p-6 text-center text-muted-foreground">
                  {empty}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {pages > 1 ? (
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <AdminButton size="sm" variant="outline" onClick={() => setPage(Math.max(0, current - 1))}>
            السابق
          </AdminButton>
          <span className="latin text-muted-foreground">
            {current + 1} / {pages}
          </span>
          <AdminButton size="sm" variant="outline" onClick={() => setPage(Math.min(pages - 1, current + 1))}>
            التالي
          </AdminButton>
        </div>
      ) : null}
    </div>
  );
}
