import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  CheckCircle2, Circle, AlertTriangle, Clock, Lock, FileSpreadsheet, FileText, ChevronRight, ShieldAlert,
} from "lucide-react";
import { useJournals } from "@/lib/journalStore";
import { useRole } from "@/lib/roleStore";
import { chartOfAccounts, financialKPIs, fmtCurrency } from "@/lib/mockData";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface DrillItem {
  type: "JOURNAL" | "RECON" | "TASK";
  id: string;
  primary: string;
  secondary?: string;
  amount?: number;
}

const PeriodClose = () => {
  const { entries, audit } = useJournals();
  const { user, can } = useRole();
  const [drill, setDrill] = useState<{ title: string; description: string; items: DrillItem[] } | null>(null);

  const draftEntries = entries.filter((e) => e.status === "DRAFT");
  const unapprovedManual = entries.filter((e) => e.source === "Manual" && e.status === "POSTED" && !e.approved);

  const inventoryRec = financialKPIs.inventoryGL === financialKPIs.inventoryCalculated;
  const reserveRec = financialKPIs.reserveGL === financialKPIs.reserveCalculated;

  const items = [
    { id: "ap", task: "AP subledger reconciles to GL 2300", done: true, blocking: true, detail: "" },
    { id: "ar", task: "AR subledger reconciles to GL 1100", done: true, blocking: true, detail: "" },
    {
      id: "inv",
      task: "Inventory subledger reconciles to GL 1200",
      done: inventoryRec,
      blocking: true,
      detail: inventoryRec ? "" : "Variance with ExpirySmart",
      drill: !inventoryRec
        ? {
            title: "Inventory Reconciliation — Pending Records",
            description: "GL 1200 vs ExpirySmart batch valuation. Resolve before close.",
            items: [
              { type: "RECON" as const, id: "GL-1200", primary: "GL 1200 Inventory", secondary: "Per General Ledger", amount: financialKPIs.inventoryGL },
              { type: "RECON" as const, id: "ES-CALC", primary: "ExpirySmart valuation", secondary: "Per batch system", amount: financialKPIs.inventoryCalculated },
              { type: "RECON" as const, id: "VAR", primary: "Variance", secondary: "Action: investigate batches", amount: financialKPIs.inventoryGL - financialKPIs.inventoryCalculated },
            ],
          }
        : null,
    },
    { id: "reserve", task: "Markdown reserve reconciles to GL 1210", done: reserveRec, blocking: true, detail: "" },
    {
      id: "drafts",
      task: "All journal entries posted (no DRAFTs)",
      done: draftEntries.length === 0,
      blocking: true,
      detail: draftEntries.length > 0 ? `${draftEntries.length} draft entr${draftEntries.length === 1 ? "y" : "ies"} pending` : "",
      drill:
        draftEntries.length > 0
          ? {
              title: "Draft Journal Entries — Pending Posting",
              description: "These entries must be posted before period close.",
              items: draftEntries.map((e) => ({
                type: "JOURNAL" as const,
                id: e.id,
                primary: e.description,
                secondary: `${e.source} · ${e.reference} · ${format(new Date(e.date), "PPp")}`,
                amount: e.lines.reduce((s, l) => s + l.debit, 0),
              })),
            }
          : null,
    },
    {
      id: "approve",
      task: "Manual entries reviewed & approved",
      done: unapprovedManual.length === 0,
      blocking: true,
      detail: unapprovedManual.length > 0 ? `${unapprovedManual.length} awaiting approval` : "",
      drill:
        unapprovedManual.length > 0
          ? {
              title: "Manual Journals — Awaiting Approval",
              description: "Posted manual entries pending CFO/Controller approval.",
              items: unapprovedManual.map((e) => ({
                type: "JOURNAL" as const,
                id: e.id,
                primary: e.description,
                secondary: `Posted by ${e.postedBy} · ${format(new Date(e.date), "PPp")}`,
                amount: e.lines.reduce((s, l) => s + l.debit, 0),
              })),
            }
          : null,
    },
    { id: "recurring", task: "Auto-post recurring entries (rent, depreciation)", done: true, blocking: false, detail: "" },
    { id: "depr", task: "Calculate & post monthly depreciation", done: false, blocking: true, detail: "Run from Fixed Assets module" },
    { id: "bank", task: "Reconcile bank feed to GL 1000", done: false, blocking: true, detail: "3 unapplied items in AR" },
    { id: "tax", task: "Tax payable reconciliation per jurisdiction", done: false, blocking: false, detail: "" },
    { id: "signoff", task: "CFO sign-off on financial statements", done: false, blocking: true, detail: "" },
  ] as const;

  const blockers = items.filter((i) => i.blocking && !i.done);
  const completed = items.filter((i) => i.done).length;
  const pct = Math.round((completed / items.length) * 100);
  const canClose = blockers.length === 0;
  const canCloseRole = can("close_period");

  // ---------- Excel export ----------
  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const cover = [
      ["Month-End Close Package"],
      ["Period", "May 2026"],
      ["Generated", format(new Date(), "PPpp")],
      ["Generated By", user.email, user.role],
      ["Status", canClose ? "READY TO CLOSE" : "BLOCKED"],
      ["Progress", `${pct}%`],
      [],
      ["Checklist Status"],
      ["Task", "Status", "Blocking", "Detail"],
      ...items.map((i) => [i.task, i.done ? "DONE" : "PENDING", i.blocking ? "Yes" : "No", i.detail || ""]),
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(cover), "1. Checklist");

    const tb: (string | number)[][] = [["Code", "Account", "Type", "Debit", "Credit"]];
    chartOfAccounts.forEach((a) => {
      const dr = a.normal === "Debit" ? Math.max(a.balance, 0) : 0;
      const cr = a.normal === "Credit" ? Math.max(-a.balance, 0) : 0;
      tb.push([a.code, a.name, a.type, dr || "", cr || ""]);
    });
    const totalDr = chartOfAccounts.reduce((s, a) => s + (a.normal === "Debit" ? Math.max(a.balance, 0) : 0), 0);
    const totalCr = chartOfAccounts.reduce((s, a) => s + (a.normal === "Credit" ? Math.max(-a.balance, 0) : 0), 0);
    tb.push(["", "TOTALS", "", totalDr, totalCr]);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(tb), "2. Trial Balance");

    const jh: (string | number)[][] = [["Entry ID", "Date", "Source", "Reference", "Description", "Status", "Approved", "Approved By", "Approved At", "Account", "Account Name", "Debit", "Credit", "Posted By"]];
    entries.forEach((e) => {
      e.lines.forEach((l) => {
        jh.push([e.id, e.date, e.source, e.reference, e.description, e.status, e.approved ? "Y" : "N", e.approvedBy ?? "", e.approvedAt ?? "", l.account, l.accountName, l.debit || "", l.credit || "", e.postedBy]);
      });
    });
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(jh), "3. Journals");

    const rec = [
      ["Reconciliation", "GL Balance", "Calculated", "Variance", "Status"],
      ["Inventory (1200)", financialKPIs.inventoryGL, financialKPIs.inventoryCalculated, financialKPIs.inventoryGL - financialKPIs.inventoryCalculated, inventoryRec ? "RECONCILED" : "VARIANCE"],
      ["Markdown Reserve (1210)", financialKPIs.reserveGL, financialKPIs.reserveCalculated, financialKPIs.reserveGL - financialKPIs.reserveCalculated, reserveRec ? "RECONCILED" : "VARIANCE"],
    ];
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rec), "4. Reconciliations");

    const at: (string | number)[][] = [["Timestamp", "Entry ID", "Action", "User", "Details"]];
    audit.forEach((a) => at.push([a.timestamp, a.entryId, a.action, a.user, a.details ?? ""]));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(at), "5. Audit Trail");

    XLSX.writeFile(wb, `CoreAccounting-Close-May2026.xlsx`);
    toast.success("Excel close package exported", { description: "5 sheets: Checklist, TB, Journals, Reconciliations, Audit." });
  };

  // ---------- PDF export ----------
  const exportPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setTextColor(67, 56, 202);
    doc.text("Month-End Close Package — CFO Review", 40, 50);

    doc.setFontSize(10);
    doc.setTextColor(80);
    doc.text(`Period: May 2026`, 40, 70);
    doc.text(`Generated: ${format(new Date(), "PPpp")}`, 40, 84);
    doc.text(`Generated by: ${user.email} (${user.role})`, 40, 98);
    doc.setTextColor(canClose ? 22 : 217, canClose ? 163 : 119, canClose ? 74 : 6);
    doc.text(`Status: ${canClose ? "READY TO CLOSE" : `BLOCKED — ${blockers.length} item(s) pending`}`, w - 220, 70);
    doc.setTextColor(80);
    doc.text(`Progress: ${pct}%`, w - 220, 84);

    autoTable(doc, {
      startY: 120,
      head: [["Task", "Status", "Blocking", "Detail"]],
      body: items.map((i) => [i.task, i.done ? "✓ DONE" : "PENDING", i.blocking ? "Yes" : "No", i.detail || "—"]),
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 9 },
    });

    doc.addPage();
    doc.setFontSize(14); doc.setTextColor(67, 56, 202);
    doc.text("Trial Balance", 40, 40);
    autoTable(doc, {
      startY: 60,
      head: [["Code", "Account", "Type", "Debit", "Credit"]],
      body: chartOfAccounts.map((a) => {
        const dr = a.normal === "Debit" ? Math.max(a.balance, 0) : 0;
        const cr = a.normal === "Credit" ? Math.max(-a.balance, 0) : 0;
        return [a.code, a.name, a.type, dr ? fmtCurrency(dr) : "—", cr ? fmtCurrency(cr) : "—"];
      }),
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 9 },
      columnStyles: { 3: { halign: "right" }, 4: { halign: "right" } },
    });

    doc.addPage();
    doc.setFontSize(14); doc.setTextColor(67, 56, 202);
    doc.text("Subledger Reconciliations", 40, 40);
    autoTable(doc, {
      startY: 60,
      head: [["Reconciliation", "GL", "Calculated", "Variance", "Status"]],
      body: [
        ["Inventory (1200)", fmtCurrency(financialKPIs.inventoryGL), fmtCurrency(financialKPIs.inventoryCalculated), fmtCurrency(financialKPIs.inventoryGL - financialKPIs.inventoryCalculated), inventoryRec ? "RECONCILED" : "VARIANCE"],
        ["Markdown Reserve (1210)", fmtCurrency(financialKPIs.reserveGL), fmtCurrency(financialKPIs.reserveCalculated), fmtCurrency(financialKPIs.reserveGL - financialKPIs.reserveCalculated), reserveRec ? "RECONCILED" : "VARIANCE"],
      ],
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 9 },
    });

    doc.addPage();
    doc.setFontSize(14); doc.setTextColor(67, 56, 202);
    doc.text("Journal Entries", 40, 40);
    autoTable(doc, {
      startY: 60,
      head: [["ID", "Date", "Source", "Description", "Status", "Approved", "Total"]],
      body: entries.map((e) => [
        e.id,
        format(new Date(e.date), "yyyy-MM-dd"),
        e.source,
        e.description.length > 60 ? e.description.slice(0, 60) + "…" : e.description,
        e.status,
        e.approved ? `Y · ${e.approvedBy ?? ""}` : "N",
        fmtCurrency(e.lines.reduce((s, l) => s + l.debit, 0)),
      ]),
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 8 },
      columnStyles: { 6: { halign: "right" } },
    });

    doc.addPage();
    doc.setFontSize(14); doc.setTextColor(67, 56, 202);
    doc.text("Audit Trail", 40, 40);
    autoTable(doc, {
      startY: 60,
      head: [["Timestamp", "Entry", "Action", "User", "Details"]],
      body: audit.map((a) => [format(new Date(a.timestamp), "yyyy-MM-dd HH:mm"), a.entryId, a.action, a.user, a.details ?? ""]),
      headStyles: { fillColor: [67, 56, 202] },
      styles: { fontSize: 8 },
    });

    doc.save(`CoreAccounting-Close-May2026.pdf`);
    toast.success("PDF close package exported", { description: "5 sections delivered for CFO review." });
  };

  return (
    <>
      <PageHeader
        title="Period Close"
        description="May 2026 month-end close · 13-period calendar supported · target close: 3 business days."
        actions={
          <>
            <Button variant="outline" onClick={exportPDF}>
              <FileText className="h-4 w-4 mr-2" /> Export PDF
            </Button>
            <Button variant="outline" onClick={exportExcel}>
              <FileSpreadsheet className="h-4 w-4 mr-2" /> Export Excel
            </Button>
            <Button
              disabled={!canClose || !canCloseRole}
              onClick={() => {
                if (!canCloseRole) {
                  toast.error("Permission denied", { description: `${user.role} cannot close periods. Requires CFO/Controller.` });
                  return;
                }
                if (!canClose) {
                  toast.error("Cannot close period", { description: `${blockers.length} blocking item(s) pending.` });
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

      {!canCloseRole && (
        <Card className="p-3 mb-4 border-l-4 border-l-muted-foreground/40 bg-muted/30 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldAlert className="h-4 w-4" /> Read-only — only CFO / Controller roles can execute period close. Current role: <strong>{user.role}</strong>.
        </Card>
      )}

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
                {blockers.map((b: any) => (
                  <li key={b.id} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-warning shrink-0" />
                    <span>{b.task}</span>
                    {b.detail && <span className="text-xs text-muted-foreground">— {b.detail}</span>}
                    {b.drill && (
                      <button
                        onClick={() => setDrill(b.drill)}
                        className="ml-auto text-xs text-primary hover:underline inline-flex items-center gap-0.5"
                      >
                        View pending records <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
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
          {items.map((c: any) => (
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
              {!c.done && c.drill && (
                <Button size="sm" variant="ghost" onClick={() => setDrill(c.drill)}>
                  Drill down <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
              {!c.done && (
                <Badge variant={c.blocking ? "destructive" : "outline"} className="text-[10px]">
                  {c.blocking ? "Blocking" : "Pending"}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Drill-down dialog */}
      <Dialog open={!!drill} onOpenChange={(v) => !v && setDrill(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{drill?.title}</DialogTitle>
            <DialogDescription>{drill?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {drill?.items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border bg-card">
                <Badge variant="outline" className="text-[10px] font-mono shrink-0">{it.type}</Badge>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium truncate">{it.primary}</div>
                  {it.secondary && <div className="text-xs text-muted-foreground truncate">{it.secondary}</div>}
                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{it.id}</div>
                </div>
                {typeof it.amount === "number" && (
                  <div className="text-sm font-mono tabular-nums shrink-0">{fmtCurrency(it.amount)}</div>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PeriodClose;
