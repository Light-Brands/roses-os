import type { ManualRole } from './types';

const STORAGE_KEY = 'roses-manual-auth';

interface StoredAuth {
  role: ManualRole;
  timestamp: number;
}

/** Store authenticated role in sessionStorage */
export function setManualAuth(role: ManualRole): void {
  try {
    const auth: StoredAuth = { role, timestamp: Date.now() };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
  } catch {
    // sessionStorage unavailable
  }
}

/** Get the stored manual role, or null if not authenticated */
export function getManualAuth(): ManualRole | null {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const auth: StoredAuth = JSON.parse(stored);
    return auth.role;
  } catch {
    return null;
  }
}

/** Clear manual authentication */
export function clearManualAuth(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // sessionStorage unavailable
  }
}

/** Verify a PIN against the API and store the result */
export async function verifyPin(pin: string): Promise<{ success: boolean; role?: ManualRole }> {
  try {
    const res = await fetch('/api/manuals/pin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin }),
    });

    const data = await res.json();

    if (data.success && data.role) {
      setManualAuth(data.role);
      return { success: true, role: data.role };
    }

    return { success: false };
  } catch {
    return { success: false };
  }
}
