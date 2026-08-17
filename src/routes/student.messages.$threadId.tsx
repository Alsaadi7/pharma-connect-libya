import { createFileRoute } from "@tanstack/react-router";
import { Paperclip, Send } from "lucide-react";
import { AppBar, Avatar } from "@/components/kit";
import { chat, messages } from "@/lib/mock";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/student/messages/$threadId")({
  head: () => ({
    meta: [
      { title: "محادثة المشرف — PharmaTrain Libya" },
      { name: "description", content: "نقاش يومي حول التدريب والمهام والحالات السريرية." },
      { property: "og:title", content: "محادثة — فارما ترين" },
      { property: "og:description", content: "تواصل فوري مع مشرف التدريب." },
    ],
  }),
  component: Chat,
});

function Chat() {
  const { threadId } = Route.useParams();
  const thread = messages.find((m) => m.id === threadId) ?? messages[0]!;

  return (
    <div className="flex min-h-screen flex-col">
      <AppBar
        title={thread.name}
        subtitle={`${thread.role} · متصل الآن`}
        back="/student/messages"
        action={<Avatar initials={thread.name.slice(0, 2)} size="sm" />}
      />
      <div className="flex-1 space-y-3 px-4 py-5">
        <p className="text-center text-[10px] font-semibold text-muted-foreground">اليوم</p>
        {chat.map((c, i) => (
          <div key={i} className={cn("flex", c.me ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[76%] rounded-3xl px-4 py-2.5 text-xs leading-relaxed shadow-[var(--shadow-soft)]",
                c.me
                  ? "gradient-primary text-primary-foreground rounded-ee-md"
                  : "bg-card text-foreground rounded-ss-md",
              )}
            >
              {c.text}
              <span className={cn("latin mt-1 block text-[10px]", c.me ? "opacity-75" : "text-muted-foreground")}>
                {c.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-20 mx-4 mb-2 flex items-center gap-2 rounded-3xl bg-card p-2 shadow-[var(--shadow-card)]">
        <button className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground" aria-label="مرفق">
          <Paperclip className="size-4" />
        </button>
        <input
          placeholder="اكتب رسالة…"
          className="h-10 flex-1 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
        />
        <button className="flex size-10 items-center justify-center rounded-full gradient-primary text-primary-foreground" aria-label="إرسال">
          <Send className="size-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}
