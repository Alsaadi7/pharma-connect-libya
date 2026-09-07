/**
 * جلسة مدير النظام (المرحلة الحالية: تخزين محلي على الجهاز).
 * البنية جاهزة للاستبدال بمصادقة قاعدة البيانات لاحقًا دون تغيير الواجهات.
 */
import { useCallback, useEffect, useState } from "react";

const SESSION_KEY = "pcl:admin:session:v1";
const ADMINS_KEY = "pcl:admin:accounts:v1";
const LOG_KEY = "pcl:admin:activity:v1";

export type AdminAccount = { id: string; name: string; email: string; password: string; role: "admin" };
export type AdminSession = { id: string; name: string; email: string; role: "admin"; at: number };
export type ActivityEntry = {
  id: string;
  admin: string;
  action: string;
  item: string;
  at: number;
};

const defaultAdmin: AdminAccount = {
  id: "admin-1",
  name: "مدير النظام",
  email: "admin@pharmaconnect.ly",
  password: "admin1234",
  role: "admin",
};

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export function adminAccounts(): AdminAccount[] {
  const list = readJSON<AdminAccount[]>(ADMINS_KEY, []);
  if (list.length === 0) {
    writeJSON(ADMINS_KEY, [defaultAdmin]);
    return [defaultAdmin];
  }
  return list;
}

export function defaultAdminCredentials() {
  return { email: defaultAdmin.email, password: defaultAdmin.password };
}

export function changeAdminPassword(email: string, password: string) {
  writeJSON(
    ADMINS_KEY,
    adminAccounts().map((a) => (a.email === email ? { ...a, password } : a)),
  );
}

const sessionListeners = new Set<(s: AdminSession | null) => void>();
const logListeners = new Set<(l: ActivityEntry[]) => void>();

export function currentAdmin(): AdminSession | null {
  return readJSON<AdminSession | null>(SESSION_KEY, null);
}

export function adminLogin(email: string, password: string, remember: boolean): { ok: boolean; error?: string } {
  const found = adminAccounts().find((a) => a.email.trim().toLowerCase() === email.trim().toLowerCase());
  if (!found) return { ok: false, error: "لا يوجد حساب إدارة بهذا البريد الإلكتروني." };
  if (found.password !== password) return { ok: false, error: "كلمة المرور غير صحيحة." };
  const session: AdminSession = { id: found.id, name: found.name, email: found.email, role: "admin", at: Date.now() };
  writeJSON(SESSION_KEY, session);
  if (!remember) {
    try {
      window.sessionStorage.setItem("pcl:admin:volatile", "1");
    } catch {
      /* ignore */
    }
  }
  logActivity("تسجيل دخول", "لوحة الإدارة", found.email);
  sessionListeners.forEach((l) => l(session));
  return { ok: true };
}

export function adminLogout() {
  const me = currentAdmin();
  logActivity("تسجيل خروج", "لوحة الإدارة", me?.email ?? "");
  try {
    window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  sessionListeners.forEach((l) => l(null));
}

export function activityLog(): ActivityEntry[] {
  return readJSON<ActivityEntry[]>(LOG_KEY, []);
}

export function logActivity(action: string, item: string, admin?: string) {
  const who = admin ?? currentAdmin()?.email ?? "نظام";
  const entry: ActivityEntry = { id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, admin: who, action, item, at: Date.now() };
  const next = [entry, ...activityLog()].slice(0, 500);
  writeJSON(LOG_KEY, next);
  logListeners.forEach((l) => l(next));
}

export function clearActivityLog() {
  writeJSON(LOG_KEY, []);
  logListeners.forEach((l) => l([]));
}

export function useAdminSession() {
  const [session, setSession] = useState<AdminSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSession(currentAdmin());
    setReady(true);
    const l = (s: AdminSession | null) => setSession(s);
    sessionListeners.add(l);
    return () => {
      sessionListeners.delete(l);
    };
  }, []);

  const logout = useCallback(() => adminLogout(), []);
  return { session, ready, logout };
}

export function useActivityLog() {
  const [log, setLog] = useState<ActivityEntry[]>([]);
  useEffect(() => {
    setLog(activityLog());
    const l = (v: ActivityEntry[]) => setLog(v);
    logListeners.add(l);
    return () => {
      logListeners.delete(l);
    };
  }, []);
  return log;
}
