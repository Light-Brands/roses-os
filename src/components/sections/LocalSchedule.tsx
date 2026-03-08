import { cn } from '@/lib/utils';

interface LocalScheduleSession {
  day: string;
  duration: string;
  time: string;
}

interface LocalScheduleStage {
  title: string;
  dateRange: string;
  sessions: LocalScheduleSession[];
}

interface LocalScheduleProps {
  stages: LocalScheduleStage[];
  timezoneLabel: string;
  className?: string;
}

export default function LocalSchedule({ stages, timezoneLabel, className }: LocalScheduleProps) {
  if (stages.length === 0) return null;

  return (
    <div className={cn('space-y-8', className)}>
      <div className="text-center">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-rose-500/70 mb-3">
          Schedule
        </p>
        <p className="text-sm text-[var(--color-foreground-muted)]">
          All times shown in {timezoneLabel}
        </p>
      </div>

      {stages.map((stage) => (
        <div key={stage.title} className="overflow-hidden rounded-xl border border-rose-200/50 dark:border-rose-800/20">
          <div className="bg-rose-50/80 dark:bg-rose-950/30 px-5 py-3 border-b border-rose-200/50 dark:border-rose-800/20">
            <h4 className="font-serif text-base font-medium text-[var(--color-foreground)]">
              {stage.title}
            </h4>
            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
              {stage.dateRange}
            </p>
          </div>
          <div className="divide-y divide-rose-100 dark:divide-rose-900/20">
            {stage.sessions.map((session, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-5 py-3 text-sm"
              >
                <div>
                  <span className="text-[var(--color-foreground)]">{session.day}</span>
                  <span className="text-[var(--color-foreground-muted)] ml-2">
                    ({session.duration})
                  </span>
                </div>
                <span className="text-rose-600 dark:text-rose-400 font-medium whitespace-nowrap ml-4">
                  {session.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
