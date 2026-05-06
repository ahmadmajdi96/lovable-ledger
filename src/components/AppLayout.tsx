import { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import {
  Calculator, LayoutDashboard, BookOpen, FileText, Receipt, CreditCard,
  Boxes, Tag, Building2, Percent, BarChart3, Plug, ShieldCheck, FileBarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { to: string; label: string; icon: any };
type NavSection = { label: string; items: NavItem[] };

const sections: NavSection[] = [
  {
    label: "Overview",
    items: [
      { to: "/", label: "Finance Dashboard", icon: LayoutDashboard },
      { to: "/cfo-markdowns", label: "CFO Markdown View", icon: BarChart3 },
    ],
  },
  {
    label: "General Ledger",
    items: [
      { to: "/chart-of-accounts", label: "Chart of Accounts", icon: BookOpen },
      { to: "/journal-entries", label: "Journal Entries", icon: FileText },
      { to: "/period-close", label: "Period Close", icon: ShieldCheck },
    ],
  },
  {
    label: "Subledgers",
    items: [
      { to: "/accounts-payable", label: "Accounts Payable", icon: Receipt },
      { to: "/three-way-match", label: "3-Way Match", icon: CreditCard },
      { to: "/accounts-receivable", label: "Accounts Receivable", icon: FileBarChart2 },
      { to: "/inventory-accounting", label: "Inventory Accounting", icon: Boxes },
      { to: "/markdown-lifecycle", label: "Markdown Lifecycle", icon: Tag },
      { to: "/fixed-assets", label: "Fixed Assets", icon: Building2 },
      { to: "/tax", label: "Tax Management", icon: Percent },
    ],
  },
  {
    label: "Connectivity",
    items: [
      { to: "/integrations", label: "Integrations", icon: Plug },
    ],
  },
];

const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 shrink-0 bg-sidebar border-r border-sidebar-border flex flex-col">
        <div className="px-5 py-5 flex items-center gap-3 border-b border-sidebar-border">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Calculator className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="font-bold tracking-tight text-sidebar-foreground">CoreAccounting</div>
            <div className="text-[10px] text-sidebar-muted uppercase tracking-wider font-medium">
              Financial Engine · v1.0
            </div>
          </div>
        </div>

        <nav className="flex-1 py-3 px-3 overflow-y-auto">
          {sections.map((sec) => (
            <div key={sec.label}>
              <div className="nav-section-label">{sec.label}</div>
              <div className="space-y-0.5">
                {sec.items.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) => cn("nav-link group", isActive && "nav-link-active")}
                  >
                    <Icon className="nav-icon h-4 w-4 shrink-0 text-sidebar-muted transition-colors group-hover:text-sidebar-accent-foreground" />
                    <span className="truncate">{label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-sidebar-accent/60 border border-sidebar-border/50">
            <div
              className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0 shadow-sm"
              style={{ background: "var(--gradient-primary)" }}
            >
              C
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold truncate text-sidebar-foreground">cfo@retailco.com</div>
              <div className="text-[10px] text-sidebar-muted truncate">Chief Financial Officer</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0 overflow-auto" style={{ background: "var(--gradient-hero)" }}>
        <div className="px-8 py-6 max-w-[1600px] mx-auto animate-fade-in">{children}</div>
      </main>
    </div>
  );
};

export default AppLayout;
