import { Link, useRouterState } from "@tanstack/react-router";
import { Home, GraduationCap, CalendarCheck, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/student", label: "الرئيسية", icon: Home, exact: true },
  { to: "/student/courses", label: "الدورات", icon: GraduationCap },
  { to: "/student/training", label: "التدريب", icon: CalendarCheck },
  { to: "/student/messages", label: "الرسائل", icon: MessageCircle, badge: 2 },
  { to: "/student/profile", label: "حسابي", icon: User },
];

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-[430px] border-t border-border bg-card/95 px-2 pb-2 pt-1.5 backdrop-blur-md">
      <ul className="flex items-stretch justify-between">
        {items.map(({ to, label, icon: Icon, badge, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
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
