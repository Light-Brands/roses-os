'use client';

export default function PageBreakBlock() {
  return (
    <div className="py-3 flex items-center gap-3">
      <div className="flex-1 border-t border-dashed border-[var(--color-border)]" />
      <span className="text-xs text-[var(--color-foreground-faint)] font-medium uppercase tracking-wider">
        Page Break
      </span>
      <div className="flex-1 border-t border-dashed border-[var(--color-border)]" />
    </div>
  );
}
