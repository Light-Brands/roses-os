'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function AdminPinManager() {
  const [editorPin, setEditorPin] = useState('');
  const [teacherPin, setTeacherPin] = useState('');
  const [saving, setSaving] = useState<'editor' | 'teacher' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async (type: 'editor' | 'teacher') => {
    const pin = type === 'editor' ? editorPin : teacherPin;
    if (!/^\d{4}$/.test(pin)) {
      setMessage({ type: 'error', text: 'PIN must be exactly 4 digits.' });
      return;
    }

    setSaving(type);
    setMessage(null);

    try {
      const res = await fetch('/api/manuals/pin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, pin }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: `${type === 'editor' ? 'Editor' : 'Teacher'} PIN updated.` });
        if (type === 'editor') setEditorPin('');
        else setTeacherPin('');
      } else {
        const json = await res.json();
        setMessage({ type: 'error', text: json.error || 'Failed to update PIN.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to update PIN.' });
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-[var(--color-foreground)] mb-1">Manual Access PINs</h3>
        <p className="text-sm text-[var(--color-foreground-muted)]">
          Manage the 4-digit PINs for accessing the teaching manuals editor.
        </p>
      </div>

      {message && (
        <div className={cn(
          'text-sm px-4 py-2 rounded-lg',
          message.type === 'success'
            ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
            : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
        )}>
          {message.text}
        </div>
      )}

      {/* Editor PIN */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            Editor PIN
          </label>
          <p className="text-xs text-[var(--color-foreground-faint)] mb-2">
            Editors can create, edit, and delete manual content.
          </p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={editorPin}
            onChange={(e) => setEditorPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="New 4-digit PIN"
            className={cn(
              'w-full max-w-[160px] px-3 py-2 rounded-lg',
              'text-sm font-mono tracking-widest',
              'bg-[var(--color-background-subtle)] border border-[var(--color-border)]',
              'text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-faint)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)]'
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => handleSave('editor')}
          disabled={editorPin.length !== 4 || saving === 'editor'}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium',
            'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
            'hover:bg-[var(--color-accent-hover)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200'
          )}
        >
          {saving === 'editor' ? 'Saving...' : 'Update'}
        </button>
      </div>

      {/* Teacher PIN */}
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label className="block text-sm font-medium text-[var(--color-foreground)] mb-1">
            Teacher PIN
          </label>
          <p className="text-xs text-[var(--color-foreground-faint)] mb-2">
            Teachers can view and download manuals but cannot edit.
          </p>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={4}
            value={teacherPin}
            onChange={(e) => setTeacherPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
            placeholder="New 4-digit PIN"
            className={cn(
              'w-full max-w-[160px] px-3 py-2 rounded-lg',
              'text-sm font-mono tracking-widest',
              'bg-[var(--color-background-subtle)] border border-[var(--color-border)]',
              'text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-faint)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--color-rose-clay)]'
            )}
          />
        </div>
        <button
          type="button"
          onClick={() => handleSave('teacher')}
          disabled={teacherPin.length !== 4 || saving === 'teacher'}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium',
            'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]',
            'hover:bg-[var(--color-accent-hover)]',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'transition-colors duration-200'
          )}
        >
          {saving === 'teacher' ? 'Saving...' : 'Update'}
        </button>
      </div>
    </div>
  );
}
