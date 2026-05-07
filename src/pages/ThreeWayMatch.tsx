import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { apInvoices as seedInvoices, fmtCurrency, APInvoice } from "@/lib/mockData";
import { CheckCircle2, XCircle, AlertTriangle, Filter } from "lucide-react";
import { toast } from "sonner";
import { useRole } from "@/lib/roleStore";
import { ShieldAlert } from "lucide-react";

type MismatchReason = "PRICE_VARIANCE" | "QTY_VARIANCE" | "TOLERANCE_EXCEEDED" | "MISSING_RECEIPT" | "TAX_MISMATCH";
type Resolution = "ppv" | "reject" | "hold";

const computeReason = (inv: APInvoice): MismatchReason | null => {
  if (inv.status !== "EXCEPTION") return null;
  const l = inv.lines[0];
  if (l.poQty !== l.rcvdQty || l.rcvdQty !== l.invQty) return "QTY_VARIANCE";
  if (l.poPrice !== l.invPrice) return "PRICE_VARIANCE";
  return "TOLERANCE_EXCEEDED";
};

const reasonLabel: Record<MismatchReason, string> = {
  PRICE_VARIANCE: "Price variance",
  QTY_VARIANCE: "Quantity variance",
  TOLERANCE_EXCEEDED: "Tolerance exceeded",
  MISSING_RECEIPT: "Missing goods receipt",
  TAX_MISMATCH: "Tax / total mismatch",
};

const reasonTone: Record<MismatchReason, string> = {
  PRICE_VARIANCE: "bg-warning/10 text-warning border-warning/20",
  QTY_VARIANCE: "bg-destructive/10 text-destructive border-destructive/20",
  TOLERANCE_EXCEEDED: "bg-warning/10 text-warning border-warning/20",
  MISSING_RECEIPT: "bg-destructive/10 text-destructive border-destructive/20",
  TAX_MISMATCH: "bg-warning/10 text-warning border-warning/20",
};

const ThreeWayMatch = () => {
  const { can, user } = useRole();
  const [invoices, setInvoices] = useState<APInvoice[]>(seedInvoices);
  const [filter, setFilter] = useState<"all" | "EXCEPTION" | "MATCHED">("EXCEPTION");
  const [active, setActive] = useState<string | null>(invoices.find((i) => i.status === "EXCEPTION")?.id ?? null);
  const [resolution, setResolution] = useState<Resolution>("ppv");
  const [notes, setNotes] = useState("");
  const canResolve = can("resolve_ap_exception");
  const canApprovePay = can("approve_ap_payment");

  const visible = useMemo(() => {
    if (filter === "all") return invoices;
    return invoices.filter((i) => i.status === filter);
  }, [invoices, filter]);

  const queue = useMemo(() => invoices.filter((i) => i.status === "EXCEPTION"), [invoices]);
  const matched = useMemo(() => invoices.filter((i) => i.status === "MATCHED"), [invoices]);

  const reasonCounts = useMemo(() => {
    const m: Partial<Record<MismatchReason, number>> = {};
    queue.forEach((i) => {
      const r = computeReason(i);
      if (r) m[r] = (m[r] ?? 0) + 1;
    });
    return m;
  }, [queue]);

  const inv = invoices.find((i) => i.id === active);

  const approveMatched = (id: string) => {
    if (!canApprovePay) {
      toast.error("Permission denied", { description: `${user.role} cannot approve invoices for payment.` });
      return;
    }
    setInvoices((p) => p.map((i) => (i.id === id ? { ...i, status: "PAID" } : i)));
    toast.success("Invoice approved for payment", { description: `${id} sent to payment proposal queue.` });
  };

  const submitResolution = () => {
    if (!inv) return;
    if (!canResolve) {
      toast.error("Permission denied", { description: `${user.role} cannot resolve AP exceptions.` });
      return;
    }
    if (resolution === "ppv") {
      setInvoices((p) => p.map((i) => (i.id === inv.id ? { ...i, status: "MATCHED" } : i)));
      toast.success("Variance booked to PPV", {
        description: "Posted: DR 5300 PPV / CR 2310 AP Accrued",
      });
    } else if (resolution === "reject") {
      setInvoices((p) => p.filter((i) => i.id !== inv.id));
      toast.success("Invoice rejected", { description: "Returned to supplier for correction." });
      setActive(null);
    } else {
      setInvoices((p) => p.map((i) => (i.id === inv.id ? { ...i, status: "ON_HOLD" } : i)));
      toast.success("Invoice placed on hold");
    }
    setNotes("");
  };

  return (
    <>
      <PageHeader
        title="3-Way Match Exceptions Queue"
        description="Automated invoice ↔ PO ↔ goods receipt matching. Mismatches routed here with reason classification."
      />

      {/* Reason summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        <div className="stat-card">
          <div className="stat-label">Open Exceptions</div>
          <div className="mt-1 text-2xl font-bold tabular-nums text-destructive">{queue.length}</div>
        </div>
        {(Object.keys(reasonLabel) as MismatchReason[]).map((r) => (
          <div key={r} className="stat-card">
            <div className="stat-label">{reasonLabel[r]}</div>
            <div className="mt-1 text-2xl font-bold tabular-nums">{reasonCounts[r] ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue */}
        <Card className="p-4 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground flex-1">
              Queue
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-xs bg-transparent border border-border rounded-md px-2 py-1"
            >
              <option value="EXCEPTION">Exceptions</option>
              <option value="MATCHED">Matched (ready to pay)</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="space-y-2">
            {visible.length === 0 && (
              <div className="text-center text-xs text-muted-foreground py-8">No items.</div>
            )}
            {visible.map((e) => {
              const reason = computeReason(e);
              return (
                <div
                  key={e.id}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    active === e.id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border hover:border-primary/30"
                  }`}
                  onClick={() => setActive(e.id)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {e.status === "EXCEPTION" ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                    ) : e.status === "MATCHED" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="font-mono text-xs">{e.id}</span>
                  </div>
                  <div className="font-medium text-sm">{e.supplier}</div>
                  <div className="flex items-center justify-between mt-1.5">
                    <div className="text-xs text-muted-foreground tabular-nums">
                      {fmtCurrency(e.invoiceTotal)}
                    </div>
                    {reason && (
                      <span className={`pill ${reasonTone[reason]} text-[10px]`}>{reasonLabel[reason]}</span>
                    )}
                  </div>
                  {e.status === "MATCHED" && (
                    <Button
                      size="sm"
                      className="w-full mt-2 h-7 text-xs"
                      onClick={(ev) => { ev.stopPropagation(); approveMatched(e.id); }}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Approve for payment
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Detail */}
        <Card className="p-6 lg:col-span-2">
          {!inv ? (
            <div className="text-center text-muted-foreground py-12 text-sm">
              Select an item from the queue.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between mb-5 pb-5 border-b border-border">
                <div>
                  <h2 className="font-bold text-lg">Invoice {inv.status === "EXCEPTION" ? "Match Exception" : "Detail"}</h2>
                  <p className="text-sm text-muted-foreground font-mono mt-0.5">#{inv.id}</p>
                </div>
                <Badge
                  variant={inv.status === "EXCEPTION" ? "destructive" : inv.status === "MATCHED" ? "default" : "outline"}
                >
                  {inv.status}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <Field label="Vendor" value={inv.supplier} />
                <Field label="PO" mono value={inv.po} />
                <Field label="Invoice Total" value={fmtCurrency(inv.invoiceTotal)} />
                <Field label="Expected Total" value={fmtCurrency(inv.expectedTotal)} />
                <Field label="Variance" value={inv.variance > 0 ? `+${fmtCurrency(inv.variance)} (${((inv.variance / inv.expectedTotal) * 100).toFixed(1)}%)` : "—"} tone={inv.variance > 0 ? "destructive" : undefined} />
                <Field label="Tolerance" value={`${(inv.tolerance * 100).toFixed(1)}%`} />
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-sm mb-2">Line Items</h3>
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className="text-left text-xs uppercase text-muted-foreground">
                      <th className="px-3 py-2">SKU</th>
                      <th className="px-3 py-2 text-right">PO Qty</th>
                      <th className="px-3 py-2 text-right">Rcvd Qty</th>
                      <th className="px-3 py-2 text-right">Inv Qty</th>
                      <th className="px-3 py-2 text-right">PO Price</th>
                      <th className="px-3 py-2 text-right">Inv Price</th>
                      <th className="px-3 py-2">Match</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inv.lines.map((l, i) => {
                      const qtyOk = l.poQty === l.rcvdQty && l.rcvdQty === l.invQty;
                      const priceOk = l.poPrice === l.invPrice;
                      return (
                        <tr key={i} className="border-t border-border">
                          <td className="px-3 py-2 font-mono text-xs">{l.sku}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{l.poQty}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{l.rcvdQty}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{l.invQty}</td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums">${l.poPrice.toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono tabular-nums">${l.invPrice.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            <CheckRow ok={qtyOk} label="Qty" />
                            <CheckRow ok={priceOk} label="Price" />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {inv.status === "EXCEPTION" ? (
                <div className="border-t border-border pt-5">
                  <h3 className="font-semibold text-sm mb-3">Resolution</h3>
                  {!canResolve && (
                    <div className="mb-3 px-3 py-2 rounded-lg bg-muted border border-border text-xs flex items-center gap-2 text-muted-foreground">
                      <ShieldAlert className="h-3.5 w-3.5" />
                      <span>Read-only — only AP roles (AP Manager / AP Clerk) can resolve exceptions. Current role: <strong>{user.role}</strong>.</span>
                    </div>
                  )}
                  <RadioGroup value={resolution} onValueChange={(v) => setResolution(v as Resolution)} className="space-y-2 mb-4">
                    <ResOption value="ppv" id="ppv" title="Accept Variance — Book to PPV" sub="Posts: DR 5300 Purchase Price Variance / CR 2310 AP Accrued" />
                    <ResOption value="reject" id="reject" title="Reject Invoice" sub="Send back to supplier for correction" />
                    <ResOption value="hold" id="hold" title="Hold for Pricing Confirmation" sub="Pause and request manual approval" />
                  </RadioGroup>

                  <Textarea
                    placeholder="Resolution notes…"
                    className="mb-3"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    disabled={!canResolve}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => { setNotes(""); }}>Cancel</Button>
                    <Button onClick={submitResolution} disabled={!canResolve}>Submit Resolution</Button>
                  </div>
                </div>
              ) : inv.status === "MATCHED" ? (
                <div className="border-t border-border pt-5 flex justify-end items-center gap-3">
                  {!canApprovePay && (
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <ShieldAlert className="h-3 w-3" /> Requires AP Manager or Controller/CFO
                    </span>
                  )}
                  <Button onClick={() => approveMatched(inv.id)} disabled={!canApprovePay}>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Approve for Payment
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </Card>
      </div>
    </>
  );
};

const Field = ({ label, value, mono, tone }: { label: string; value: string; mono?: boolean; tone?: "destructive" }) => (
  <div>
    <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
    <div className={`text-lg ${mono ? "font-mono" : "font-semibold"} tabular-nums ${tone === "destructive" ? "text-destructive" : ""}`}>{value}</div>
  </div>
);

const CheckRow = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className="inline-flex items-center gap-1 text-xs mr-2">
    {ok ? <CheckCircle2 className="h-3.5 w-3.5 text-success" /> : <XCircle className="h-3.5 w-3.5 text-destructive" />}
    {label}
  </span>
);

const ResOption = ({ value, id, title, sub }: { value: string; id: string; title: string; sub: string }) => (
  <div className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-primary/30">
    <RadioGroupItem value={value} id={id} className="mt-0.5" />
    <Label htmlFor={id} className="flex-1 cursor-pointer">
      <div className="font-medium text-sm">{title}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </Label>
  </div>
);

export default ThreeWayMatch;
