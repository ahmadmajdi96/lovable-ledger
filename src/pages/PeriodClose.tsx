import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertTriangle, Clock } from "lucide-react";

const checklist = [
  { task: "AP subledger reconciles to GL 2300", done: true },
  { task: "AR subledger reconciles to GL 1100", done: true },
  { task: "Inventory subledger reconciles to GL 1200", done: true },
  { task: "Markdown reserve reconciles to GL 1210", done: true },
  { task: "Auto-post recurring entries (rent, depreciation)", done: true },
  { task: "Calculate & post monthly depreciation", done: false },
  { task: "Review unposted draft journal entries", done: false, warning: true },
  { task: "Reconcile bank feed to GL 1000", done: false },
  { task: "Tax payable reconciliation per jurisdiction", done: false },
  { task: "CFO sign-off on financial statements", done: false },
];

const PeriodClose = () => {
  const completed = checklist.filter((c) => c.done).length;
  const pct = Math.round((completed / checklist.length) * 100);

  return (
    <>
      <PageHeader
        title="Period Close"
        description="May 2026 month-end close · 13-period calendar supported · target close: 3 business days."
        actions={
          <>
            <Button variant="outline">View Prior Periods</Button>
            <Button disabled={pct < 100}>Close Period</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-label">Period</div>
          <div className="mt-2 text-2xl font-bold">May 2026</div>
          <div className="text-xs text-muted-foreground mt-1">Period 5 of 12</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Progress</div>
          <div className="mt-2 text-2xl font-bold tabular-nums">{pct}%</div>
          <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
            <div className="h-full" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Status</div>
          <div className="mt-2 flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            <span className="text-2xl font-bold text-warning">In Progress</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">2 unreconciled subledgers · cannot close</div>
        </div>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Close Checklist</h3>
        <div className="space-y-2">
          {checklist.map((c, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                c.done ? "border-success/20 bg-success/5" : c.warning ? "border-warning/20 bg-warning/5" : "border-border"
              }`}
            >
              {c.done ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : c.warning ? (
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm flex-1 ${c.done ? "text-muted-foreground line-through" : "font-medium"}`}>
                {c.task}
              </span>
              {!c.done && (
                <Badge variant="outline" className="text-[10px]">
                  {c.warning ? "Action required" : "Pending"}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default PeriodClose;
