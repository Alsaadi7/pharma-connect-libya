import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, AlertTriangle, Info, BellOff } from "lucide-react";
import { AppBar, Screen } from "@/components/kit";
import { notifications } from "@/lib/mock";

export const Route = createFileRoute("/student/notifications")({
  head: () => ({
    meta: [
      { title: "الإشعارات — PharmaTrain Libya" },
      { name: "description", content: "تحديثات الطلبات، التقييمات، التذكيرات، والشهادات الصادرة." },
      { property: "og:title", content: "الإشعارات — فارما ترين" },
      { property: "og:description", content: "لا تفوّت موعد تدريب أو تقرير." },
    ],
  }),
  component: Notifications,
});

const icons = { success: CheckCircle2, warning: AlertTriangle, info: Info } as const;
const tones = {
  success: "bg-secondary-soft text-secondary",
  warning: "bg-warning-soft text-warning",
  info: "bg-primary-soft text-primary",
} as const;

function Notifications() {
  return (
    <div>
      <AppBar
        title="الإشعارات"
        back="/student"
        action={
          <button className="flex size-9 items-center justify-center rounded-full bg-muted" aria-label="كتم">
            <BellOff className="size-4" />
          </button>
        }
      />
      <Screen className="space-y-3">
        {[...notifications, ...notifications].map((n, i) => {
          const Icon = icons[n.type];
          return (
            <div key={i} className="surface-card flex gap-3 p-4">
              <span className={`flex size-10 shrink-0 items-center justify-center rounded-2xl ${tones[n.type]}`}>
                <Icon className="size-4.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold">{n.title}</p>
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{n.body}</p>
                <p className="mt-1.5 text-[10px] text-muted-foreground">{n.time}</p>
              </div>
              {i < 2 ? <span className="mt-1 size-2 shrink-0 rounded-full bg-primary" /> : null}
            </div>
          );
        })}
      </Screen>
    </div>
  );
}
