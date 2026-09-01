/** أدوات الصور: عارض بتكبير وتحريك + مكوّن رفع صورة مع تحقق ومؤشر تحميل وإعادة محاولة. */
import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, Maximize2, Minus, Plus, RefreshCw, RotateCcw, Trash2, X } from "lucide-react";
import { MAX_IMAGE_MB, readImageAsDataUrl, validateImageFile } from "@/lib/rxTraining";
import { cn } from "@/lib/utils";

/* ------------------------------ عارض الصورة ------------------------------ */

export function ImageViewer({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  const [scale, setScale] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);

  const clamp = (v: number) => Math.min(4, Math.max(1, v));

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-foreground/90 backdrop-blur-sm">
      <div className="flex items-center justify-between p-3">
        <p className="text-xs font-bold text-background">تكبير الصورة</p>
        <button
          onClick={onClose}
          aria-label="إغلاق الصورة"
          className="flex size-10 items-center justify-center rounded-2xl bg-background/15 text-background"
        >
          <X className="size-5" />
        </button>
      </div>

      <div
        className="flex-1 touch-none overflow-hidden"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY, ox: pos.x, oy: pos.y };
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current || scale === 1) return;
          setPos({ x: drag.current.ox + (e.clientX - drag.current.x), y: drag.current.oy + (e.clientY - drag.current.y) });
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onDoubleClick={() => setScale((s) => (s > 1 ? 1 : 2))}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="mx-auto h-full w-full object-contain transition-transform"
          style={{ transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})` }}
        />
      </div>

      <div className="flex items-center justify-center gap-2 p-4">
        <button
          onClick={() => setScale((s) => clamp(s - 0.5))}
          aria-label="تصغير"
          className="flex size-11 items-center justify-center rounded-2xl bg-background/15 text-background"
        >
          <Minus className="size-5" />
        </button>
        <span className="latin min-w-14 rounded-2xl bg-background/15 px-3 py-2.5 text-center text-xs font-bold text-background">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale((s) => clamp(s + 0.5))}
          aria-label="تكبير"
          className="flex size-11 items-center justify-center rounded-2xl bg-background/15 text-background"
        >
          <Plus className="size-5" />
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPos({ x: 0, y: 0 });
          }}
          aria-label="إعادة الضبط"
          className="flex size-11 items-center justify-center rounded-2xl bg-background/15 text-background"
        >
          <RotateCcw className="size-5" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ صورة قابلة للتكبير ------------------------------ */

export function ZoomableImage({
  src,
  alt,
  className,
  ratio = "aspect-[3/4]",
}: {
  src: string;
  alt: string;
  className?: string;
  ratio?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn("relative block w-full overflow-hidden rounded-2xl bg-muted", ratio, className)}
      >
        <img src={src} alt={alt} loading="lazy" className="size-full object-cover" />
        <span className="absolute bottom-2 flex items-center gap-1 rounded-xl bg-foreground/60 px-2 py-1 text-[10px] font-bold text-background end-2">
          <Maximize2 className="size-3" /> تكبير
        </span>
      </button>
      {open ? <ImageViewer src={src} alt={alt} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/* ------------------------------ رفع صورة ------------------------------ */

export function ImageUpload({
  value,
  onChange,
  label = "صورة الروشتة",
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastFile = useRef<File | null>(null);

  const process = useCallback(
    async (file: File) => {
      const invalid = validateImageFile(file);
      if (invalid) {
        setError(invalid);
        return;
      }
      lastFile.current = file;
      setError(null);
      setBusy(true);
      try {
        const url = await readImageAsDataUrl(file);
        onChange(url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "فشل رفع الصورة. أعد المحاولة.");
      } finally {
        setBusy(false);
      }
    },
    [onChange],
  );

  return (
    <div className="space-y-2">
      <p className="text-[11px] font-bold">{label}</p>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = "";
          if (f) void process(f);
        }}
      />

      {value ? (
        <div className="space-y-2">
          <ZoomableImage src={value} alt={label} />
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex h-11 items-center justify-center gap-1.5 rounded-2xl border border-input bg-card text-[11px] font-bold"
            >
              <RefreshCw className="size-4" /> استبدال الصورة
            </button>
            <button
              type="button"
              onClick={() => {
                onChange("");
                setError(null);
              }}
              className="flex h-11 items-center justify-center gap-1.5 rounded-2xl bg-destructive/10 text-[11px] font-bold text-destructive"
            >
              <Trash2 className="size-4" /> حذف الصورة
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-input bg-card text-[11px] font-bold text-muted-foreground"
        >
          {busy ? (
            <>
              <Loader2 className="size-6 animate-spin text-primary" /> جارٍ رفع الصورة…
            </>
          ) : (
            <>
              <ImagePlus className="size-6 text-primary" /> اختر صورة من الجهاز
              <span className="text-[10px] font-semibold">JPG · JPEG · PNG — حتى {MAX_IMAGE_MB}MB</span>
            </>
          )}
        </button>
      )}

      {busy && value ? (
        <p className="flex items-center gap-1.5 text-[11px] font-bold text-primary">
          <Loader2 className="size-3.5 animate-spin" /> جارٍ المعالجة…
        </p>
      ) : null}

      {error ? (
        <div className="rounded-2xl bg-destructive/10 p-3 text-[11px] font-semibold text-destructive">
          <p>{error}</p>
          <div className="mt-2 flex gap-2">
            {lastFile.current ? (
              <button
                type="button"
                onClick={() => lastFile.current && void process(lastFile.current)}
                className="rounded-xl bg-destructive px-3 py-1.5 text-[10px] font-bold text-destructive-foreground"
              >
                إعادة المحاولة
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-xl bg-card px-3 py-1.5 text-[10px] font-bold text-foreground"
            >
              اختيار صورة أخرى
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
