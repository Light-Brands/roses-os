/**
 * Telemetry helper (T-048 + AC17).
 *
 * Single entry point for all manual-editor telemetry. Routes events to a
 * pluggable backend (PostHog by default; swappable for AC17). Direct
 * `posthog.*` calls in `src/components/manuals/` are forbidden per AC17 grep.
 *
 * Backends register at module init; in production a `register('posthog', ...)`
 * call from the app boot wires PostHog. The helper is a no-op if no backend
 * is registered (safe to call from anywhere).
 */

export type TelemetryEvent =
  | { type: 'block.add'; manual_id: string; language: string; block_type: string; schema_version: 1 | 2 }
  | { type: 'block.delete'; manual_id: string; language: string; block_type: string }
  | { type: 'block.edit-then-undo'; manual_id: string; language: string; block_type: string; ms_to_undo: number }
  | { type: 'block.save'; manual_id: string; language: string; block_type: string; schema_version: 1 | 2 }
  | { type: 'block.save-conflict'; manual_id: string; language: string; block_type: string; remote_updated_at: string }
  | { type: 'block.validation-failed'; manual_id: string; language: string; block_type: string; issue_count: number };

export interface TelemetryBackend {
  name: string;
  capture(event: TelemetryEvent): void;
}

const backends: TelemetryBackend[] = [];

export function register(backend: TelemetryBackend): void {
  if (!backends.some((b) => b.name === backend.name)) {
    backends.push(backend);
  }
}

export function unregister(name: string): void {
  const i = backends.findIndex((b) => b.name === name);
  if (i >= 0) backends.splice(i, 1);
}

export function track(event: TelemetryEvent): void {
  for (const b of backends) {
    try {
      b.capture(event);
    } catch {
      // Telemetry never throws; failures are swallowed.
    }
  }
}

/** Console-only backend useful for local dev / testing. */
export const consoleBackend: TelemetryBackend = {
  name: 'console',
  capture(event) {
    if (typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.log('[telemetry]', event);
    }
  },
};

/** Convenience: tag a block-add event from BlockEditor.tsx call sites. */
export function emitBlockAdd(input: {
  manual_id: string;
  language: string;
  block_type: string;
  schema_version: 1 | 2;
}): void {
  track({ type: 'block.add', ...input });
}

export function emitBlockDelete(input: { manual_id: string; language: string; block_type: string }): void {
  track({ type: 'block.delete', ...input });
}
