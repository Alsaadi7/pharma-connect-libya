import { Link } from "@tanstack/react-router";
import {
  Star,
  MapPin,
  BadgeCheck,
  PlayCircle,
  Users,
  Clock,
  ChevronLeft,
  Inbox,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Course, Pharmacy } from "@/lib/mock";

/* ---------------- layout ---------------- */

export function PhoneShell({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] bg-background pb-24">{children}</div>
  );
}

export function AppBar({
  title,
  subtitle,
  back,
  action,
}: {
  title: string;
  subtitle?: string;
  back?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur-md">
      {back ? (
        <Link
          to={back as never}
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-foreground"
          aria-label="رجوع"
        >
          <ChevronLeft className="size-5 rtl:rotate-180" />
        </Link>
      ) : null}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-bold">{title}</h1>
        {subtitle ? <p className="truncate text-xs text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function SectionTitle({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between px-1">
      <h2 className="text-[15px] font-bold">{title}</h2>
      {href ? (
        <Link to={href as never} className="text-xs font-semibold text-primary">
          عرض الكل
        </Link>
      ) : null}
    </div>
  );
}

export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn("space-y-6 px-4 py-5", className)}>{children}</main>;
}

/* ---------------- primitives ---------------- */

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "secondary" | "warning" | "error";
  className?: string;
}) {
  const tones = {
    muted: "bg-muted text-muted-foreground",
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary",
    warning: "bg-warning-soft text-warning",
    error: "bg-destructive-soft text-destructive",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Bar({ value, tone = "primary" }: { value: number; tone?: "primary" | "secondary" | "warning" }) {
  const tones = { primary: "bg-primary", secondary: "bg-secondary", warning: "bg-warning" } as const;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className={cn("h-full rounded-full transition-all", tones[tone])} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Ring({ value, size = 84 }: { value: number; size?: number }) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} className="fill-none stroke-primary-foreground/25" strokeWidth={6} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="fill-none stroke-primary-foreground"
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <span className="latin absolute inset-0 flex items-center justify-center text-sm font-bold">{value}%</span>
    </div>
  );
}

export function Rating({ value, count }: { value: number; count?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground">
      <Star className="size-3.5 fill-warning text-warning" />
      <span className="latin text-foreground">{value}</span>
      {count ? <span className="latin">({count})</span> : null}
    </span>
  );
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "secondary" | "warning" | "error";
}) {
  const tones = {
    primary: "bg-primary-soft text-primary",
    secondary: "bg-secondary-soft text-secondary",
    warning: "bg-warning-soft text-warning",
    error: "bg-destructive-soft text-destructive",
  } as const;
  return (
    <div className="surface-card p-4">
      <div className={cn("mb-3 flex size-9 items-center justify-center rounded-xl", tones[tone])}>
        <Icon className="size-4.5" />
      </div>
      <p className="latin text-xl font-bold leading-none">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
      {hint ? <p className="mt-1 text-[11px] font-semibold text-secondary">{hint}</p> : null}
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="surface-card flex flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="size-6" />
      </div>
      <h3 className="text-sm font-bold">{title}</h3>
      <p className="text-xs text-muted-foreground">{body}</p>
      {action}
    </div>
  );
}

export function LoadingCard() {
  return (
    <div className="surface-card space-y-3 p-4">
      <div className="h-3 w-1/3 animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-2/3 animate-pulse rounded-full bg-muted" />
      <div className="h-3 w-1/2 animate-pulse rounded-full bg-muted" />
    </div>
  );
}

export function Avatar({ initials, size = "md" }: { initials: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "size-9 text-xs", md: "size-11 text-sm", lg: "size-16 text-lg" } as const;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-2xl gradient-primary font-bold text-primary-foreground",
        sizes[size],
      )}
    >
      {initials}
    </div>
  );
}

/* ---------------- domain cards ---------------- */

export function CourseCard({ course, wide }: { course: Course; wide?: boolean }) {
  return (
    <Link
      to={"/student/courses/$courseId" as never}
      params={{ courseId: course.id } as never}
      className={cn("surface-card block overflow-hidden", wide ? "w-full" : "w-[248px] shrink-0")}
    >
      <div className="relative h-28 gradient-primary">
        <div className="absolute inset-0 opacity-30 [background:radial-gradient(circle_at_80%_20%,white,transparent_55%)]" />
        <PlayCircle className="absolute bottom-3 start-3 size-8 text-primary-foreground/90" />
        <Chip tone="secondary" className="absolute top-3 end-3 bg-card">
          {course.tag}
        </Chip>
      </div>
      <div className="space-y-2 p-3.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug">{course.title}</h3>
        <p className="text-[11px] text-muted-foreground">{course.provider}</p>
        <div className="flex items-center justify-between">
          <Rating value={course.rating} count={course.learners} />
          <span className="latin inline-flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3.5" />
            {course.hours}
          </span>
        </div>
        {course.progress !== undefined ? (
          <div className="space-y-1.5 pt-1">
            <Bar value={course.progress} />
            <p className="latin text-[11px] font-semibold text-primary">{course.progress}% مكتمل</p>
          </div>
        ) : null}
      </div>
    </Link>
  );
}

export function PharmacyCard({ pharmacy }: { pharmacy: Pharmacy }) {
  return (
    <Link
      to={"/student/pharmacies/$pharmacyId" as never}
      params={{ pharmacyId: pharmacy.id } as never}
      className="surface-card flex items-center gap-3 p-3.5"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-secondary-soft text-lg font-bold text-secondary">
        ⚕
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-sm font-bold">{pharmacy.name}</h3>
          {pharmacy.verified ? <BadgeCheck className="size-4 shrink-0 text-primary" /> : null}
        </div>
        <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
          <MapPin className="size-3.5" />
          {pharmacy.city} · <span className="latin">{pharmacy.distance}</span>
        </p>
        <div className="mt-1.5 flex items-center gap-2">
          <Rating value={pharmacy.rating} />
          <Chip tone={pharmacy.seats > 0 ? "secondary" : "error"}>
            {pharmacy.seats > 0 ? `${pharmacy.seats} مقاعد متاحة` : "لا مقاعد"}
          </Chip>
        </div>
      </div>
    </Link>
  );
}

export function StudentRow({
  name,
  initials,
  meta,
  value,
  tone = "primary",
  to,
}: {
  name: string;
  initials: string;
  meta: string;
  value: string;
  tone?: "primary" | "secondary" | "warning" | "error";
  to?: string;
}) {
  const inner = (
    <>
      <Avatar initials={initials} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold">{name}</p>
        <p className="truncate text-[11px] text-muted-foreground">{meta}</p>
      </div>
      <Chip tone={tone}>{value}</Chip>
    </>
  );
  return to ? (
    <Link to={to as never} className="surface-card flex items-center gap-3 p-3.5">
      {inner}
    </Link>
  ) : (
    <div className="surface-card flex items-center gap-3 p-3.5">{inner}</div>
  );
}

export function ListTile({
  icon: Icon,
  title,
  subtitle,
  to,
  trailing,
}: {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  to?: string;
  trailing?: ReactNode;
}) {
  const inner = (
    <>
      <div className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
        <Icon className="size-4.5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        {subtitle ? <p className="truncate text-[11px] text-muted-foreground">{subtitle}</p> : null}
      </div>
      {trailing ?? <ChevronLeft className="size-4 text-muted-foreground rtl:rotate-180" />}
    </>
  );
  return to ? (
    <Link to={to as never} className="flex items-center gap-3 bg-card px-4 py-3">
      {inner}
    </Link>
  ) : (
    <div className="flex items-center gap-3 bg-card px-4 py-3">{inner}</div>
  );
}

export function ActionButton({
  children,
  to,
  variant = "primary",
  onClick,
  full = true,
}: {
  children: ReactNode;
  to?: string;
  variant?: "primary" | "mint" | "outline" | "ghost";
  onClick?: () => void;
  full?: boolean;
}) {
  const styles = {
    primary: "gradient-primary text-primary-foreground shadow-[var(--shadow-glow)]",
    mint: "gradient-mint text-secondary-foreground",
    outline: "border border-border bg-card text-foreground",
    ghost: "bg-muted text-foreground",
  } as const;
  const cls = cn(
    "inline-flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold transition-transform active:scale-[0.98]",
    full && "w-full",
    styles[variant],
  );
  return to ? (
    <Link to={to as never} className={cls}>
      {children}
    </Link>
  ) : (
    <button type="button" onClick={onClick} className={cls}>
      {children}
    </button>
  );
}

export function Field({
  label,
  placeholder,
  type = "text",
  icon: Icon,
  hint,
}: {
  label: string;
  placeholder?: string;
  type?: string;
  icon?: LucideIcon;
  hint?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold text-foreground">{label}</span>
      <span className="relative block">
        {Icon ? (
          <Icon className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3.5" />
        ) : null}
        <input
          type={type}
          placeholder={placeholder}
          className={cn(
            "h-12 w-full rounded-2xl border border-input bg-card px-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/12",
            Icon && "ps-10",
          )}
        />
      </span>
      {hint ? <span className="block text-[11px] text-muted-foreground">{hint}</span> : null}
    </label>
  );
}

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: string[];
  active: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
      {items.map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-colors",
            i === active ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
          )}
        >
          {i}
        </button>
      ))}
    </div>
  );
}

export function Timeline({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="relative space-y-4 ps-6">
      <span className="absolute bottom-2 top-2 w-px bg-border start-[7px]" />
      {steps.map((s, i) => {
        const done = i < current;
        const now = i === current;
        return (
          <li key={s} className="relative">
            <span
              className={cn(
                "absolute top-1 size-3.5 rounded-full border-2 -start-6",
                done && "border-secondary bg-secondary",
                now && "border-primary bg-card",
                !done && !now && "border-border bg-card",
              )}
            />
            <p className={cn("text-sm", now ? "font-bold text-primary" : done ? "font-semibold" : "text-muted-foreground")}>
              {s}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

export function PeopleStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
      <Users className="size-3.5" />
      <span className="latin font-bold text-foreground">{value}</span>
      {label}
    </div>
  );
}
