import { BookmarkIcon } from "lucide-react";
import { useStore, type SavedType } from "@/lib/store";
import { cn } from "@/lib/utils";

export function SaveButton({
  itemType,
  itemId,
  title,
  subtitle,
  compact,
}: {
  itemType: SavedType;
  itemId: string;
  title: string;
  subtitle: string;
  compact?: boolean;
}) {
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved(itemType, itemId);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleSaved({ itemType, itemId, title, subtitle });
      }}
      aria-label={saved ? "إزالة من المحفوظات" : "حفظ للمراجعة"}
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-xl px-2.5 py-2 text-[11px] font-bold transition-colors",
        saved ? "bg-secondary-soft text-secondary" : "bg-muted text-muted-foreground",
      )}
    >
      <BookmarkIcon className={cn("size-3.5", saved && "fill-current")} />
      {compact ? null : saved ? "محفوظ" : "حفظ"}
    </button>
  );
}
