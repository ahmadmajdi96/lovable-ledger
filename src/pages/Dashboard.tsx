import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/PageHeader";
import {
  TrendingDown, Wallet, Receipt, AlertTriangle, CheckCircle2, Activity, Plug, BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import { financialKPIs, journalEntries, integrations, fmtCurrency, fmtPct } from "@/lib/mockData";

const Dashboard = () => {
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
