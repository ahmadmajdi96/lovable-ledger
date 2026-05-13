import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Brain, CheckCircle2, Circle, AlertTriangle, FileText, ShieldCheck, ChevronRight, Wand2, Lock, History, Bot, ThumbsUp, FilePlus2 } from "lucide-react";
import { format } from "date-fns";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useJournals } from "@/lib/journalStore";
import { useRole, roleLabel } from "@/lib/roleStore";
import { financialKPIs, fmtCurrency } from "@/lib/mockData";
import { toast } from "sonner";

interface ChecklistItem {
  id: string;
  task: string;
  rationale: string;
  blocking: boolean;
  done: boolean;
}

interface SuggestedEntry {
  id: string;
  description: string;
  rationale: string;
  confidence: number;
  lines: { account: string; accountName: string; debit: number; credit: number }[];
  source: string;
}

const CloseCopilot = () => {
  const { entries, postManual } = useJournals();
  const { user, can } = useRole();
  const navigate = useNavigate();
  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [approved, setApproved] = useState<Set<string>>(new Set());
  const [posted, setPosted] = useState<Set<string>>(new Set());

  type CopilotEvent = {
    id: string;
    ts: string;
    kind: "GENERATED" | "APPROVED" | "UNAPPROVED" | "POSTED" | "CHECK";
    actor: string;
    title: string;
    detail?: string;
    entryId?: string;
  };
  const [timeline, setTimeline] = useState<CopilotEvent[]>([]);
  const logEvent = (e: Omit<CopilotEvent, "id" | "ts" | "actor">) =>
    setTimeline((t) => [
      { id: `EV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, ts: new Date().toISOString(), actor: user.email, ...e },
      ...t,
    ]);

  const draftCount = entries.filter((e) => e.status === "DRAFT").length;
  const unapproved = entries.filter((e) => e.source === "Manual" && e.status === "POSTED" && !e.approved).length;
  const invVar = financialKPIs.inventoryGL - financialKPIs.inventoryCalculated;

  const checklist = useMemo<ChecklistItem[]>(() => [
    { id: "ck1", task: "Post all queued ExpirySmart disposal events", rationale: "3 unposted batch disposals detected — required to clear inventory variance.", blocking: true, done: false },
    { id: "ck2", task: "Approve pending manual journal entries", rationale: `${unapproved} posted manual entries waiting on CFO/Controller approval.`, blocking: unapproved > 0, done: unapproved === 0 },
    { id: "ck3", task: "Run monthly depreciation calculation", rationale: "Recurring schedule due May 31 — copilot drafted entry below.", blocking: true, done: false },
    { id: "ck4", task: "Post rent and recurring accruals", rationale: "Standard monthly recurring entries — copilot drafted entries below.", blocking: false, done: false },
    { id: "ck5", task: "Reconcile bank feed to GL 1000", rationale: "3 unapplied items in AR — needs human review.", blocking: true, done: false },
    { id: "ck6", task: "True-up markdown reserve to PriceAI plans", rationale: `Reserve variance ${fmtCurrency(financialKPIs.reserveGL - financialKPIs.reserveCalculated)} — copilot drafted true-up.`, blocking: false, done: false },
    { id: "ck7", task: "CFO sign-off on financial statements", rationale: "Required final step before close lock.", blocking: true, done: false },
  ], [unapproved]);

  const suggested = useMemo<SuggestedEntry[]>(() => [
    {
      id: "AI-DEP-MAY", description: "Monthly depreciation — May 2026",
      rationale: "Straight-line depreciation across 47 fixed assets. Calculated from FA register (useful life × cost basis). High confidence — recurring monthly schedule with no asset additions/disposals this period.",
      confidence: 98, source: "Fixed Assets register",
      lines: [
        { account: "5300", accountName: "Depreciation Expense", debit: 14_833.33, credit: 0 },
        { account: "1510", accountName: "Accumulated Depreciation", debit: 0, credit: 14_833.33 },
      ],
    },
    {
      id: "AI-RENT-MAY", description: "Monthly rent accrual — May 2026 (4 stores)",
      rationale: "Standard rent schedule from lease contracts in CoreERP. Auto-calculated from active lease terms. High confidence.",
      confidence: 99, source: "CoreERP lease module",
      lines: [
        { account: "5400", accountName: "Rent Expense", debit: 28_500.00, credit: 0 },
        { account: "2300", accountName: "Accounts Payable", debit: 0, credit: 28_500.00 },
      ],
    },
    {
      id: "AI-MDR-MAY", description: "Markdown reserve true-up — May 2026",
      rationale: `Reserve variance ${fmtCurrency(financialKPIs.reserveGL - financialKPIs.reserveCalculated)} between GL 1210 and PriceAI forecasted markdowns. Suggested adjustment to align reserve with active markdown plans. Medium confidence — review variance driver before posting.`,
      confidence: 82, source: "PriceAI markdown plans",
      lines: [
        { account: "5200", accountName: "Markdown Expense", debit: Math.max(0, financialKPIs.reserveCalculated - financialKPIs.reserveGL), credit: 0 },
        { account: "1210", accountName: "Inventory Reserve for Markdown", debit: 0, credit: Math.max(0, financialKPIs.reserveCalculated - financialKPIs.reserveGL) },
      ],
    },
    {
      id: "AI-INV-VAR", description: `Inventory variance write-off — ${fmtCurrency(invVar)}`,
      rationale: `Variance between GL 1200 ${fmtCurrency(financialKPIs.inventoryGL)} and ExpirySmart valuation ${fmtCurrency(financialKPIs.inventoryCalculated)}. Most likely cause: unposted disposal events from BATCH-001 and BATCH-074. Lower confidence — recommend posting source events first instead of writing off.`,
      confidence: 64, source: "Inventory subledger reconciliation",
      lines: [
        { account: "5210", accountName: "Inventory Waste/Shrinkage Expense", debit: Math.max(0, invVar), credit: 0 },
        { account: "1200", accountName: "Inventory - Finished Goods", debit: 0, credit: Math.max(0, invVar) },
      ],
    },
  ], [invVar]);

  const generate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(true);
      setGenerating(false);
      logEvent({
        kind: "GENERATED",
        title: "AI Copilot generated close draft",
        detail: `${checklist.length} checklist tasks · ${suggested.length} suggested journal entries · avg confidence ${Math.round(suggested.reduce((s, e) => s + e.confidence, 0) / suggested.length)}%.`,
      });
      toast.success("AI copilot draft ready", {
        description: `${checklist.length} checklist tasks · ${suggested.length} suggested journal entries with audit-ready explanations.`,
      });
    }, 1100);
  };

  const toggleApprove = (id: string) => {
    const entry = suggested.find((s) => s.id === id);
    setApproved((s) => {
      const next = new Set(s);
      if (next.has(id)) {
        next.delete(id);
        logEvent({ kind: "UNAPPROVED", title: `Approval revoked — ${entry?.description ?? id}`, entryId: id });
      } else {
        next.add(id);
        logEvent({ kind: "APPROVED", title: `Approved for posting — ${entry?.description ?? id}`, entryId: id, detail: `Confidence ${entry?.confidence}% · source: ${entry?.source}` });
      }
      return next;
    });
  };

  const postEntry = (e: SuggestedEntry) => {
    if (!can("post_journal")) {
      toast.error("Permission denied", { description: `${roleLabel[user.role]} cannot post journals.` });
      return;
    }
    postManual(
      {
        description: `[AI Copilot] ${e.description}`,
        reference: e.id,
        lines: e.lines,
        files: [],
      },
      user.email,
    );
    setPosted((s) => new Set(s).add(e.id));
    logEvent({
      kind: "POSTED",
      title: `Posted journal — ${e.description}`,
      entryId: e.id,
      detail: `Audit-ready rationale recorded: ${e.rationale.slice(0, 140)}${e.rationale.length > 140 ? "…" : ""}`,
    });
    toast.success("Entry posted with audit trail", { description: `${e.description} · rationale recorded.` });
  };

  const totalApproved = approved.size;
  const totalPosted = posted.size;

  return (
    <>
      <PageHeader
        title="AI Period-Close Copilot"
        description="Generates a draft close checklist and suggested journal entries from your live ledger. Review, approve, and post — every action is captured in the audit trail."
        actions={
          <Badge variant="outline" className="gap-1.5">
            <ShieldCheck className="h-3 w-3" /> {user.name} · {roleLabel[user.role]}
          </Badge>
        }
      />

      {!generated ? (
        <Card className="p-10 text-center">
          <div
            className="h-16 w-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white shadow-lg"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Brain className="h-8 w-8" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Generate your May 2026 close draft</h3>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            The copilot will scan {entries.length} journal entries, all open subledger reconciliations, recurring
            schedules, and your fixed-asset register to draft a complete close checklist plus suggested journal entries
            with audit-ready rationale.
          </p>
          <Button size="lg" onClick={generate} disabled={generating}>
            {generating ? (
              <><Sparkles className="h-4 w-4 mr-2 animate-pulse" /> Analyzing ledger…</>
            ) : (
              <><Wand2 className="h-4 w-4 mr-2" /> Generate close draft</>
            )}
          </Button>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card">
              <div className="stat-label">Checklist tasks</div>
              <div className="mt-2 text-2xl font-bold tabular-nums">{checklist.length}</div>
              <div className="text-xs text-muted-foreground mt-1">{checklist.filter((c) => c.blocking).length} blocking</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Suggested entries</div>
              <div className="mt-2 text-2xl font-bold tabular-nums">{suggested.length}</div>
              <div className="text-xs text-muted-foreground mt-1">Avg confidence {Math.round(suggested.reduce((s, e) => s + e.confidence, 0) / suggested.length)}%</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Approved</div>
              <div className="mt-2 text-2xl font-bold tabular-nums text-success">{totalApproved}</div>
              <div className="text-xs text-muted-foreground mt-1">of {suggested.length} suggested</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Posted</div>
              <div className="mt-2 text-2xl font-bold tabular-nums" style={{ color: "hsl(243 75% 58%)" }}>{totalPosted}</div>
              <div className="text-xs text-muted-foreground mt-1">with full audit trail</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            <Card className="p-5 lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">AI-drafted checklist</h3>
              </div>
              <div className="space-y-2">
                {checklist.map((c) => (
                  <div
                    key={c.id}
                    className={`p-3 rounded-lg border ${
                      c.done
                        ? "border-success/20 bg-success/5"
                        : c.blocking
                        ? "border-warning/30 bg-warning/5"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      {c.done ? (
                        <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                      ) : c.blocking ? (
                        <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      ) : (
                        <Circle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{c.task}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.rationale}</div>
                      </div>
                      {c.blocking && !c.done && (
                        <Badge variant="destructive" className="text-[9px] shrink-0">Blocking</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate("/period-close")}>
                Open Period Close <ChevronRight className="h-3 w-3 ml-1" />
              </Button>
            </Card>

            <Card className="p-5 lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Wand2 className="h-4 w-4 text-primary" />
                  <h3 className="font-semibold">Suggested journal entries</h3>
                </div>
                {!can("post_journal") && (
                  <Badge variant="outline" className="text-[10px] gap-1">
                    <Lock className="h-3 w-3" /> Read-only role
                  </Badge>
                )}
              </div>
              <div className="space-y-3">
                {suggested.map((e) => {
                  const total = e.lines.reduce((s, l) => s + l.debit, 0);
                  const isApproved = approved.has(e.id);
                  const isPosted = posted.has(e.id);
                  return (
                    <div key={e.id} className="rounded-lg border border-border bg-card overflow-hidden">
                      <div className="p-4 border-b border-border bg-muted/20">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            checked={isApproved}
                            onCheckedChange={() => toggleApprove(e.id)}
                            disabled={isPosted}
                            className="mt-1"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold">{e.description}</span>
                              <Badge
                                variant="outline"
                                className={`text-[10px] ${
                                  e.confidence >= 90 ? "border-success/40 text-success" :
                                  e.confidence >= 75 ? "border-primary/40 text-primary" :
                                  "border-warning/40 text-warning"
                                }`}
                              >
                                {e.confidence}% confidence
                              </Badge>
                              {isPosted && <Badge className="text-[10px] bg-success">POSTED</Badge>}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                              <span className="font-semibold text-foreground/80">Rationale: </span>{e.rationale}
                            </div>
                            <div className="text-[10px] text-muted-foreground mt-1 font-mono">{e.id} · source: {e.source}</div>
                          </div>
                        </div>
                      </div>
                      <table className="w-full text-xs">
                        <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          <tr className="border-b border-border">
                            <th className="text-left px-4 py-2">Account</th>
                            <th className="text-right px-4 py-2">Debit</th>
                            <th className="text-right px-4 py-2">Credit</th>
                          </tr>
                        </thead>
                        <tbody>
                          {e.lines.map((l, i) => (
                            <tr key={i} className="border-b border-border last:border-0">
                              <td className="px-4 py-2"><span className="font-mono text-muted-foreground">{l.account}</span> {l.accountName}</td>
                              <td className="text-right px-4 py-2 font-mono">{l.debit ? fmtCurrency(l.debit) : "—"}</td>
                              <td className="text-right px-4 py-2 font-mono">{l.credit ? fmtCurrency(l.credit) : "—"}</td>
                            </tr>
                          ))}
                          <tr className="bg-muted/30 font-semibold">
                            <td className="px-4 py-2">Total</td>
                            <td className="text-right px-4 py-2 font-mono">{fmtCurrency(total)}</td>
                            <td className="text-right px-4 py-2 font-mono">{fmtCurrency(total)}</td>
                          </tr>
                        </tbody>
                      </table>
                      <div className="p-3 border-t border-border flex items-center justify-end gap-2 bg-muted/10">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleApprove(e.id)}
                          disabled={isPosted}
                        >
                          {isApproved ? "Approved" : "Approve"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => postEntry(e)}
                          disabled={!isApproved || isPosted || !can("post_journal")}
                        >
                          <FileText className="h-3 w-3 mr-1" /> {isPosted ? "Posted" : "Post entry"}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </>
      )}
    </>
  );
};

export default CloseCopilot;
