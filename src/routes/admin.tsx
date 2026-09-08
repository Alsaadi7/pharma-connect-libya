import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  BookOpen,
  Bell,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  Menu,
  Pill,
  Settings,
  Stethoscope,
  Users,
  ClipboardList,
  Newspaper,
} from "lucide-react";
import { useAdminSession } from "@/lib/adminAuth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "لوحة الإدارة — Pharma Connect Libya" },
      {
        name: "description",
        content: "لوحة تحكم كاملة لإدارة الطلاب والدورات والتدريبات والأسئلة والحالات وقاعدة الأدوية والإشعارات.",
      },
      { property: "og:title", content: "لوحة الإدارة — Pharma Connect Libya" },
      { property: "og:description", content: "إدارة المنصة التعليمية من مكان واحد: محتوى، طلاب، تقارير وإعدادات." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminLayout,
});

export const adminNav = [
  { to: "/admin", label: "نظرة عامة", icon: LayoutDashboard },
  { to: "/admin/students", label: "الطلاب", icon: Users },
  { to: "/admin/courses", label: "الدورات والوحدات", icon: BookOpen },
  { to: "/admin/questions", label: "بنك الأسئلة", icon: HelpCircle },
  { to: "/admin/quizzes", label: "الاختبارات", icon: ClipboardList },
  { to: "/admin/medications", label: "قاعدة الأدوية", icon: Pill },
  { to: "/admin/cases", label: "الحالات السريرية", icon: Stethoscope },
  { to: "/admin/prescriptions", label: "الروشتات التدريبية", icon: FileText },
  { to: "/admin/notifications", label: "الإشعارات", icon: Bell },
  { to: "/admin/content", label: "المحتوى", icon: Newspaper },
  { to: "/admin/activity", label: "سجل العمليات", icon: Activity },
  { to: "/admin/settings", label: "الإعدادات", icon: Settings },
] as const;

function AdminLayout() {
  const { session, ready, logout } = useAdminSession();
  const navigate = useNavigate();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (ready && !session) navigate({ to: "/admin-login", replace: true });
  }, [ready, session, navigate]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  if (!ready) return <div className="p-10 text-center text-xs text-muted-foreground">جارٍ التحميل...</div>;
  if (!session)
    return (
      <div className="p-10 text-center text-xs text-muted-foreground">
        هذه المنطقة للإدارة فقط.{" "}
        <Link to="/admin-login" className="font-bold text-primary">
          تسجيل الدخول
        </Link>
      </div>
    );

  return (
    <div className="min-h-screen bg-background lg:flex">
      <aside
        className={cn(
          "fixed inset-y-0 z-40 w-64 overflow-y-auto border-border bg-card p-4 transition-transform end-0 border-s lg:static lg:translate-x-0",
          open ? "translate-x-0" : "translate-x-full lg:translate-x-0",
        )}
      >
        <div className="mb-5 px-2">
          <p className="text-sm font-extrabold">لوحة الإدارة</p>
          <p className="text-[10px] text-muted-foreground">Pharma Connect Libya</p>
        </div>
        <nav className="space-y-1">
          {adminNav.map((n) => {
            const active = n.to === "/admin" ? path === "/admin" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[11px] font-bold transition-colors",
                  active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted",
                )}
              >
                <n.icon className="size-4 shrink-0" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={() => {
            logout();
            navigate({ to: "/admin-login", replace: true });
          }}
          className="mt-5 flex w-full items-center gap-3 rounded-xl bg-muted px-3 py-2.5 text-[11px] font-bold text-destructive"
        >
          <LogOut className="size-4" /> تسجيل الخروج
        </button>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur">
          <button type="button" onClick={() => setOpen((v) => !v)} className="rounded-xl bg-muted p-2 lg:hidden">
            <Menu className="size-4" />
          </button>
          <div className="min-w-0">
            <p className="truncate text-xs font-extrabold">{session.name}</p>
            <p className="latin truncate text-[10px] text-muted-foreground">{session.email}</p>
          </div>
          <Link to="/" className="rounded-xl bg-muted px-3 py-2 text-[10px] font-bold">
            التطبيق
          </Link>
        </header>
        <main className="space-y-5 p-4 pb-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
