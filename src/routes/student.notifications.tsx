import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Info, Megaphone, AlertTriangle, RefreshCw, CheckCheck } from "lucide-react";
import { AppBar, Screen } from "@/components/kit";
import { platformNotifications, type PlatformNotification } from "@/lib/notifications";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [
      { title: "مركز الإشعارات — PharmaTrain Libya" },
      {
        name: "description",
        content: "إشعارات المنصة: دورات جديدة، دروس مضافة، تحديثات المحتوى الدوائي، وإعلانات إدارة النظام.",
      },
      { property: "og:title", content: "مركز الإشعارات — فارما ترين ليبيا" },
      { property: "og:description", content: "كل تحديثات المنصة في مكان واحد." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Notifications,
});

const meta: Record<PlatformNotification["type"], { icon: typeof Info; tone: string }> = {
  "دورة جديدة": { icon: GraduationCap, tone: "bg-primary-soft text-primary" },
  "درس جديد": { icon: BookOpen, tone: "bg-secondary-soft text-secondary" },
  تحديث: { icon: RefreshCw, tone: "bg-primary-soft text-primary" },
  إعلان: { icon: Megaphone, tone: "bg-warning-soft text-warning" },
  تنبيه: { icon: AlertTriangle, tone: "bg-warning-soft text-warning" },
  "محتوى تعليمي": { icon: Info, tone: "bg-secondary-soft text-secondary" },
};

function Notifications() {
  const { state, markRead, markAllRead } = useStore();
  const unread = platformNotifications.filter((n) => !state.readNotifications.includes(n.id)).length;

  return (
    <div>
      <AppBar
        title="مركز الإشعارات"
        subtitle={unread ? `${unread} إشعار غير مقروء` : "كل الإشعارات مقروءة"}
        back="/student"
        action={
          <button
            type="button"
            onClick={() => markAllRead(platformNotifications.map((n) => n.id))}
            className="flex size-9 items-center justify-center rounded-full bg-muted"
            aria-label="تعليم الكل كمقروء"
          >
            <CheckCheck className="size-4" />
          </button>
        }
      />
      <Screen className="space-y-3">
        {platformNotifications.map((n) => {
          const { icon: Icon, tone } = meta[n.type];
          const isUnread = !state.readNotifications.includes(n.id);
          return (
            <button
              key={n.id}
              type="button"
              onClick={() => markRead(n.id)}
              className={cn("surface-card flex w-full gap-3 p-4 text-start", isUnread && "border-primary/35")}
            >
              <span className={cn("flex size-10 shrink-0 items-center justify-center rounded-2xl", tone)}>
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-bold">{n.title}</p>
                  {isUnread ? <span className="size-2 shrink-0 rounded-full bg-primary" /> : null}
                </div>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{n.body}</p>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  {n.type} · {n.date}
                </p>
              </div>
            </button>
          );
        })}
      </Screen>
    </div>
  );
}
