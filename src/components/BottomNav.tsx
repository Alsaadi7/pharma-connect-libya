import { Link, useRouterState } from "@tanstack/react-router";
import { Home, GraduationCap, TrendingUp, Bell, User } from "lucide-react";
import { platformNotifications } from "@/lib/notifications";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const items = [
  { to: "/student", label: "الرئيسية", icon: Home, exact: true },
  { to: "/student/courses", label: "الدورات", icon: GraduationCap },
  { to: "/student/training", label: "التدريب", icon: TrendingUp },
  { to: "/student/notifications", label: "الإشعارات", icon: Bell, notif: true },
  { to: "/student/profile", label: "حسابي", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useStore();
  const unread = platformNotifications.filter((n) => !state.readNotifications.includes(n.id)).length;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] md:hidden border-t border-border bg-card/95 px-2 pb-2 pt-1.5 backdrop-blur-md">
      <ul className="flex items-stretch justify-between">
        {items.map(({ to, label, icon: Icon, notif, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          const badge = notif && unread ? unread : 0;
          return (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-semibold",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span className="relative">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-xl transition-colors",
                      active && "bg-primary-soft",
                    )}
                  >
                    <Icon className="size-5" />
                  </span>
                  {badge ? (
                    <span className="latin absolute -top-0.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground end-0">
                      {badge}
                    </span>
                  ) : null}
                </span>
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state } = useStore();
  const unread = platformNotifications.filter((n) => !state.readNotifications.includes(n.id)).length;
  return (
    <aside className="sticky top-0 hidden h-screen w-56 shrink-0 flex-col gap-1 py-6 md:flex lg:w-64">
      <div className="mb-4 px-3">
        <p className="text-sm font-extrabold">Pharma Connect Libya</p>
        <p className="text-[11px] text-muted-foreground">منصة طلاب الصيدلة</p>
      </div>
      {items.map(({ to, label, icon: Icon, notif, exact }) => {
        const active = exact ? pathname === to : pathname.startsWith(to);
        const badge = notif && unread ? unread : 0;
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
              active ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted",
            )}
          >
            <Icon className="size-5 shrink-0" />
            <span className="min-w-0 flex-1 truncate">{label}</span>
            {badge ? (
              <span className="latin flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
                {badge}
              </span>
            ) : null}
          </Link>
        );
      })}
    </aside>
  );
}
