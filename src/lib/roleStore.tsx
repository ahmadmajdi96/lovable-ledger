import { createContext, useContext, useMemo, useState, ReactNode } from "react";

export type Role = "CFO" | "Controller" | "AP_Manager" | "AP_Clerk" | "AR_Manager" | "Accountant" | "Viewer";

export interface User { email: string; name: string; role: Role }

const USERS: User[] = [
  { email: "cfo@retailco.com", name: "Sarah Chen (CFO)", role: "CFO" },
  { email: "controller@retailco.com", name: "Marcus Webb (Controller)", role: "Controller" },
  { email: "ap.manager@retailco.com", name: "Lin Park (AP Manager)", role: "AP_Manager" },
  { email: "ap.clerk@retailco.com", name: "Diego Ruiz (AP Clerk)", role: "AP_Clerk" },
  { email: "ar.manager@retailco.com", name: "Maya Tan (AR Manager)", role: "AR_Manager" },
  { email: "accountant@retailco.com", name: "Priya Singh (Accountant)", role: "Accountant" },
  { email: "viewer@retailco.com", name: "Audit Viewer", role: "Viewer" },
];

interface Ctx {
  user: User;
  users: User[];
  setUser: (email: string) => void;
  can: (perm: Permission) => boolean;
}

export type Permission =
  | "approve_journal"
  | "reverse_journal"
  | "edit_journal"
  | "post_journal"
  | "resolve_ap_exception"
  | "approve_ap_payment"
  | "manage_ar_collections"
  | "close_period";

const ROLE_PERMS: Record<Role, Permission[]> = {
  CFO: ["approve_journal", "reverse_journal", "edit_journal", "post_journal", "approve_ap_payment", "manage_ar_collections", "close_period"],
  Controller: ["approve_journal", "reverse_journal", "edit_journal", "post_journal", "approve_ap_payment", "manage_ar_collections", "close_period"],
  AP_Manager: ["resolve_ap_exception", "approve_ap_payment"],
  AP_Clerk: ["resolve_ap_exception"],
  AR_Manager: ["manage_ar_collections"],
  Accountant: ["edit_journal", "post_journal"],
  Viewer: [],
};

const RoleCtx = createContext<Ctx | null>(null);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>(USERS[0]);
  const setUser = (email: string) => {
    const u = USERS.find((x) => x.email === email);
    if (u) setUserState(u);
  };
  const can = (perm: Permission) => ROLE_PERMS[user.role].includes(perm);
  const value = useMemo(() => ({ user, users: USERS, setUser, can }), [user]);
  return <RoleCtx.Provider value={value}>{children}</RoleCtx.Provider>;
};

export const useRole = () => {
  const ctx = useContext(RoleCtx);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
};

export const roleLabel: Record<Role, string> = {
  CFO: "CFO",
  Controller: "Controller",
  AP_Manager: "AP Manager",
  AP_Clerk: "AP Clerk",
  AR_Manager: "AR Manager",
  Accountant: "Accountant",
  Viewer: "Viewer",
};
