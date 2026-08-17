import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppBar, Avatar, Screen } from "@/components/kit";
import { messages } from "@/lib/mock";

export const Route = createFileRoute("/student/messages/")({
  head: () => ({
    meta: [
      { title: "الرسائل — PharmaTrain Libya" },
      { name: "description", content: "تواصل مباشر مع المشرف والصيدلية وفريق الدعم." },
      { property: "og:title", content: "الرسائل — فارما ترين" },
      { property: "og:description", content: "محادثات التدريب في مكان واحد." },
    ],
  }),
  component: Messages,
});

function Messages() {
  return (
    <div>
      <AppBar title="الرسائل" subtitle="محادثاتك مع المشرف والصيدلية" />
      <Screen className="space-y-4">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground start-3.5" />
          <input
            placeholder="ابحث في المحادثات…"
            className="h-12 w-full rounded-2xl border border-input bg-card ps-10 pe-4 text-sm outline-none focus:border-primary"
          />
        </label>

        <div className="surface-card divide-y divide-border overflow-hidden">
          {messages.map((m) => (
            <Link
              key={m.id}
              to="/student/messages/$threadId"
              params={{ threadId: m.id }}
              className="flex items-center gap-3 p-3.5"
            >
              <Avatar initials={m.name.slice(0, 2)} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold">{m.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{m.last}</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="latin text-[10px] text-muted-foreground">{m.time}</span>
                {m.unread ? (
                  <span className="latin flex size-4.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {m.unread}
                  </span>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </Screen>
    </div>
  );
}
