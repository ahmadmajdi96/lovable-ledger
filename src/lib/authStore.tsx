import { createContext, useContext, useEffect, useState, ReactNode } from "react";

const STORAGE_KEY = "corta.auth.email";

interface AuthCtx {
  authedEmail: string | null;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

export const DEMO_ACCOUNTS = [
  { email: "cfo@retailco.com", password: "demo1234", name: "Sarah Chen", role: "CFO" },
  { email: "controller@retailco.com", password: "demo1234", name: "Marcus Webb", role: "Controller" },
  { email: "ap.manager@retailco.com", password: "demo1234", name: "Lin Park", role: "AP Manager" },
  { email: "ap.clerk@retailco.com", password: "demo1234", name: "Diego Ruiz", role: "AP Clerk" },
  { email: "ar.manager@retailco.com", password: "demo1234", name: "Maya Tan", role: "AR Manager" },
  { email: "accountant@retailco.com", password: "demo1234", name: "Priya Singh", role: "Accountant" },
  { email: "viewer@retailco.com", password: "demo1234", name: "Audit Viewer", role: "Viewer" },
];

const Ctx = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authedEmail, setAuthedEmail] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null,
  );

  useEffect(() => {
    if (authedEmail) localStorage.setItem(STORAGE_KEY, authedEmail);
    else localStorage.removeItem(STORAGE_KEY);
  }, [authedEmail]);

  const login: AuthCtx["login"] = (email, password) => {
    const acct = DEMO_ACCOUNTS.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!acct) return { ok: false, error: "Account not found" };
    if (acct.password !== password) return { ok: false, error: "Invalid password" };
    setAuthedEmail(acct.email);
    return { ok: true };
  };

  const logout = () => setAuthedEmail(null);

  return <Ctx.Provider value={{ authedEmail, login, logout }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAuth must be used within AuthProvider");
  return c;
};
