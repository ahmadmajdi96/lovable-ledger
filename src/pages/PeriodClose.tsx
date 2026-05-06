import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, AlertTriangle, Clock, Lock, Download, FileSpreadsheet } from "lucide-react";
import { useJournals } from "@/lib/journalStore";
import { chartOfAccounts, financialKPIs, fmtCurrency } from "@/lib/mockData";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { format } from "date-fns";

const PeriodClose = () => {
  const { entries, audit } = useJournals();

  const draftEntries = entries.filter((e) => e.status === "DRAFT");
  const unapprovedManual = entries.filter((e) => e.source === "Manual" && e.status === "POSTED" && !e.approved);
  const reversedOpen = entries.filter((e) => e.status === "REVERSED" && !entries.some((x) => x.reverses === e.id));

  const inventoryRec = financialKPIs.inventoryGL === financialKPIs.inventoryCalculated;
  const reserveRec = financialKPIs.reserveGL === financialKPIs.reserveCalculated;

  const items = [
    { id: "ap", task: "AP subledger reconciles to GL 2300", done: true, blocking: true, detail: "" },
    { id: "ar", task: "AR subledger reconciles to GL 1100", done: true, blocking: true, detail: "" },
    { id: "inv", task: "Inventory subledger reconciles to GL 1200", done: inventoryRec, blocking: true, detail: inventoryRec ? "" : "Variance with ExpirySmart" },
    { id: "reserve", task: "Markdown reserve reconciles to GL 1210", done: reserveRec, blocking: true, detail: "" },
    { id: "drafts", task: "All journal entries posted (no DRAFTs)", done: draftEntries.length === 0, blocking: true, detail: draftEntries.length > 0 ? `${draftEntries.length} draft entr${draftEntries.length === 1 ? "y" : "ies"} pending` : "" },
    { id: "approve", task: "Manual entries reviewed & approved", done: unapprovedManual.length === 0, blocking: true, detail: unapprovedManual.length > 0 ? `${unapprovedManual.length} awaiting approval` : "" },
    { id: "recurring", task: "Auto-post recurring entries (rent, depreciation)", done: true, blocking: false, detail: "" },
    { id: "depr", task: "Calculate & post monthly depreciation", done: false, blocking: true, detail: "Run from Fixed Assets module" },
    { id: "bank", task: "Reconcile bank feed to GL 1000", done: false, blocking: true, detail: "3 unapplied items in AR" },
    { id: "tax", task: "Tax payable reconciliation per jurisdiction", done: false, blocking: false, detail: "" },
    { id: "signoff", task: "CFO sign-off on financial statements", done: false, blocking: true, detail: "" },
  ];

  const blockers = items.filter((i) => i.blocking && !i.done);
  const completed = items.filter((i) => i.done).length;
  const pct = Math.round((completed / items.length) * 100);
  const canClose = blockers.length === 0;

  const exportPackage = () => {
    const wb = XLSX.utils.book_new();

    // 1. Cover / Status
    const cover = [
      ["Month-End Close Package"],
      ["Period", "May 2026"],
      ["Generated", format(new Date(), "PPpp")],
      ["Status", canClose ? "READY TO CLOSE" : "BLOCKED"],
      ["Progress", `${pct}%`],
      [],
      ["Checklist Status"],
      ["Task", "Status", "Blocking", "Detail"],
      ...items.map((i) => [i.task, i.done ? "DONE" : "PENDING", i.blocking ? "Yes" : "No", i.detail || ""]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cover), "1. Checklist");

    // 2. Trial Balance
    const tb: (string | number)[][] = [["Code", "Account", "Type", "Debit", "Credit"]];
    chartOfAccounts.forEach((a) => {
      const isDr = a.balance >= 0 && (a.normal === "Debit");
      const dr = a.normal === "Debit" ? Math.max(a.balance, 0) : Math.max(-a.balance, 0);
      const cr = a.normal === "Credit" ? Math.max(-a.balance, 0) : Math.max(0, 0);
      tb.push([a.code, a.name, a.type, dr || "", cr || ""]);
      void isDr;
    });
    const totalDr = chartOfAccounts.reduce((s, a) => s + (a.normal === "Debit" ? Math.max(a.balance, 0) : 0), 0);
    const totalCr = chartOfAccounts.reduce((s, a) => s + (a.normal === "Credit" ? Math.max(-a.balance, 0) : 0), 0);
    tb.push(["", "TOTALS", "", totalDr, totalCr]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tb), "2. Trial Balance");

    // 3. Journals
    const jh: (string | number)[][] = [["Entry ID", "Date", "Source", "Reference", "Description", "Status", "Approved", "Account", "Account Name", "Debit", "Credit", "Posted By"]];
    entries.forEach((e) => {
      e.lines.forEach((l) => {
        jh.push([e.id, e.date, e.source, e.reference, e.description, e.status, e.approved ? "Y" : "N", l.account, l.accountName, l.debit || "", l.credit || "", e.postedBy]);
      });
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(jh), "3. Journals");

    // 4. Reconciliations
    const rec = [
      ["Reconciliation", "GL Balance", "Calculated", "Variance", "Status"],
      ["Inventory (1200)", financialKPIs.inventoryGL, financialKPIs.inventoryCalculated, financialKPIs.inventoryGL - financialKPIs.inventoryCalculated, inventoryRec ? "RECONCILED" : "VARIANCE"],
      ["Markdown Reserve (1210)", financialKPIs.reserveGL, financialKPIs.reserveCalculated, financialKPIs.reserveGL - financialKPIs.reserveCalculated, reserveRec ? "RECONCILED" : "VARIANCE"],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rec), "4. Reconciliations");

    // 5. Audit Trail
    const at: (string | number)[][] = [["Timestamp", "Entry ID", "Action", "User", "Details"]];
    audit.forEach((a) => at.push([a.timestamp, a.entryId, a.action, a.user, a.details ?? ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(at), "5. Audit Trail");

    XLSX.writeFile(wb, `CoreAccounting-Close-May2026.xlsx`);
    toast.success("Close package exported", { description: "5 sheets: Checklist, TB, Journals, Reconciliations, Audit." });
  };

  return (
    <>
      <PageHeader
        title="Period Close"
        description="May 2026 month-end close · 13-period calendar supported · target close: 3 business days."
        actions={
          <>
            <Button variant="outline" onClick={exportPackage}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Close Package
            </Button>
            <Button
              disabled={!canClose}
              onClick={() => {
                if (!canClose) {
                  toast.error("Cannot close period", { description: `${blockers.length} blocking item${blockers.length === 1 ? "" : "s"} pending.` });
                  return;
                }
                toast.success("Period closed", { description: "May 2026 has been locked. Year-end roll-forward queued." });
              }}
            >
              <Lock className="h-4 w-4 mr-2" /> {canClose ? "Close Period" : `Blocked (${blockers.length})`}
            </Button>
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
            {canClose ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span className="text-2xl font-bold text-success">Ready</span>
              </>
            ) : (
              <>
                <Clock className="h-5 w-5 text-warning" />
                <span className="text-2xl font-bold text-warning">Blocked</span>
              </>
            )}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {blockers.length} blocking item{blockers.length === 1 ? "" : "s"} pending
          </div>
        </div>
      </div>

      {blockers.length > 0 && (
        <Card className="p-5 mb-6 border-l-4 border-l-warning bg-warning/5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Period close blocked — resolve the following:</h3>
              <ul className="space-y-1 text-sm">
                {blockers.map((b) => (
                  <li key={b.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                    <span>{b.task}</span>
                    {b.detail && <span className="text-xs text-muted-foreground">— {b.detail}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Close Checklist</h3>
        <div className="space-y-2">
          {items.map((c) => (
            <div
              key={c.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                c.done
                  ? "border-success/20 bg-success/5"
                  : c.blocking
                  ? "border-warning/30 bg-warning/5"
                  : "border-border"
              }`}
            >
              {c.done ? (
                <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
              ) : c.blocking ? (
                <AlertTriangle className="h-5 w-5 text-warning shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <div className="flex-1">
                <div className={`text-sm ${c.done ? "text-muted-foreground line-through" : "font-medium"}`}>
                  {c.task}
                </div>
                {c.detail && !c.done && (
                  <div className="text-xs text-muted-foreground mt-0.5">{c.detail}</div>
                )}
              </div>
              {!c.done && (
                <Badge variant={c.blocking ? "destructive" : "outline"} className="text-[10px]">
                  {c.blocking ? "Blocking" : "Pending"}
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
