import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/PageHeader";
import {
  TrendingDown, Wallet, Receipt, AlertTriangle, CheckCircle2, Activity, Plug, BookOpen,
  ShieldCheck, Bot, Sparkles, Lock, EyeOff, Bell, Clock, ChevronRight, Send,
} from "lucide-react";
import { Link } from "react-router-dom";
import { financialKPIs, journalEntries, integrations, fmtPct } from "@/lib/mockData";
import { useRole, roleLabel, type Permission } from "@/lib/roleStore";
import { useJournals } from "@/lib/journalStore";
import { useMask } from "@/lib/mask";
import { toast } from "sonner";

const PERM_LABELS: Record<Permission, string> = {
  approve_journal: "Approve journals",
  reverse_journal: "Reverse journals",
  edit_journal: "Edit journals",
  post_journal: "Post journals",
  resolve_ap_exception: "Resolve AP exceptions",
  approve_ap_payment: "Approve AP payments",
  manage_ar_collections: "Manage AR collections",
  close_period: "Close period",
};
const ALL_PERMS = Object.keys(PERM_LABELS) as Permission[];

const Dashboard = () => {
  const { user, can } = useRole();

  const kpis = [
    { label: "Markdowns MTD", value: fmtCurrency(financialKPIs.totalMarkdowns), icon: TrendingDown, tone: "warning" as const },
    { label: "Waste Avoided", value: fmtCurrency(financialKPIs.wasteAvoided), icon: CheckCircle2, tone: "success" as const },
    { label: "Net Revenue Recovered", value: fmtCurrency(financialKPIs.netRevenueRecovered), icon: Wallet },
    { label: "Gross Margin (post-MD)", value: fmtPct(financialKPIs.grossMarginAfterMarkdown), icon: Receipt },
    { label: "Inventory GL Balance", value: fmtCurrency(financialKPIs.inventoryGL), icon: BookOpen },
    { label: "Markdown Reserve", value: fmtCurrency(financialKPIs.reserveGL), icon: AlertTriangle, tone: "warning" as const },
  ];

  const recent = journalEntries.slice(0, 5);

  return (
    <>
      <PageHeader
        title="Finance Dashboard"
        description="Real-time financial position fed by CoreERP, ExpirySmart, PriceAI and SmartPOS."
      />

      {/* Role banner */}
      <Card className="p-4 mb-6 flex flex-col md:flex-row md:items-center gap-4 border-l-4 border-l-primary">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
          style={{ background: "var(--gradient-primary)" }}
        >
          <ShieldCheck className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Signed in as</span>
            <span className="font-semibold">{user.name}</span>
            <Badge className="text-[10px]" style={{ background: "var(--gradient-primary)" }}>{roleLabel[user.role]}</Badge>
          </div>
          <div className="text-xs text-muted-foreground mt-1">{user.email}</div>
        </div>
        <div className="flex flex-wrap gap-1.5 md:max-w-xl">
          {ALL_PERMS.map((p) => {
            const ok = can(p);
            return (
              <span
                key={p}
                className={`pill ${ok ? "border-success/30 bg-success/5 text-success" : "border-border bg-muted/40 text-muted-foreground"}`}
                title={ok ? "Permission granted" : "Not permitted for this role"}
              >
                {ok ? <CheckCircle2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                {PERM_LABELS[p]}
              </span>
            );
          })}
        </div>
      </Card>

      {/* AI shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Link to="/ai-assistant" className="stat-card flex items-center gap-4 hover:border-primary/40">
          <div className="h-11 w-11 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: "var(--gradient-primary)" }}>
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">AI Insights Assistant</div>
            <div className="text-xs text-muted-foreground">Ask questions, drill into journals & markdowns.</div>
          </div>
        </Link>
        <Link to="/close-copilot" className="stat-card flex items-center gap-4 hover:border-primary/40">
          <div className="h-11 w-11 rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: "var(--gradient-primary)" }}>
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="font-semibold">AI Period-Close Copilot</div>
            <div className="text-xs text-muted-foreground">Draft checklist + suggested journals — review & post.</div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="stat-card">
            <div className="flex items-start justify-between">
              <div>
                <div className="stat-label">{label}</div>
                <div
                  className={`mt-2 text-3xl font-bold tabular-nums ${
                    tone === "warning" ? "text-warning" : tone === "success" ? "text-success" : ""
                  }`}
                >
                  {value}
                </div>
              </div>
              <div
                className={`h-11 w-11 rounded-lg flex items-center justify-center ${
                  tone === "warning"
                    ? "bg-warning/10 text-warning"
                    : tone === "success"
                    ? "bg-success/10 text-success"
                    : "bg-primary/10 text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="p-6 lg:col-span-2">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Recent journal entries
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Auto-posted from integrated subsystems. Every entry is fully drillable.
          </p>
          <div className="space-y-2">
            {recent.map((j) => (
              <Link
                key={j.id}
                to="/journal-entries"
                className="flex items-center justify-between text-sm py-2.5 px-2 -mx-2 rounded-lg hover:bg-muted/50 border-b border-border last:border-0 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Badge variant="outline" className="text-[10px] uppercase shrink-0">{j.source}</Badge>
                  <span className="font-medium truncate">{j.description}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs text-muted-foreground">{j.id}</span>
                  <Badge
                    variant={j.status === "POSTED" ? "default" : "secondary"}
                    className="text-[10px]"
                  >
                    {j.status}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-1 flex items-center gap-2">
            <Plug className="h-4 w-4 text-primary" />
            Integration health
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Live event ingestion status.</p>
          <div className="space-y-2.5">
            {integrations.slice(0, 6).map((i) => (
              <div key={i.name} className="flex items-center gap-2 text-sm">
                <span
                  className={`h-2 w-2 rounded-full ${
                    i.status === "HEALTHY" ? "bg-success animate-pulse-dot" : "bg-warning"
                  }`}
                />
                <span className="text-foreground/80 truncate">{i.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{i.lastSync}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
};

export default Dashboard;
