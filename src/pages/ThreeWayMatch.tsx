import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { apInvoices, fmtCurrency } from "@/lib/mockData";
import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

const ThreeWayMatch = () => {
  const exceptions = apInvoices.filter((i) => i.status === "EXCEPTION");
  const [active, setActive] = useState(exceptions[0]?.id);
  const [resolution, setResolution] = useState("ppv");
  const inv = exceptions.find((i) => i.id === active)!;

  return (
    <>
      <PageHeader
        title="3-Way Match Resolution"
        description="Automated matching of supplier invoice ↔ PO ↔ goods receipt. Variances outside tolerance routed here."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-4 lg:col-span-1">
          <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
            Exception Queue
          </h3>
          <div className="space-y-2">
            {exceptions.map((e) => (
              <button
                key={e.id}
                onClick={() => setActive(e.id)}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  active === e.id
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
                  <span className="font-mono text-xs">{e.id}</span>
                </div>
                <div className="font-medium text-sm">{e.supplier}</div>
                <div className="text-xs text-muted-foreground">
                  Variance: <span className="text-destructive font-medium">{fmtCurrency(e.variance)}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-start justify-between mb-5 pb-5 border-b border-border">
            <div>
              <h2 className="font-bold text-lg">Invoice Match Exception</h2>
              <p className="text-sm text-muted-foreground font-mono mt-0.5">#{inv.id}</p>
            </div>
            <Badge variant="destructive">EXCEEDED TOLERANCE</Badge>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Vendor</div>
              <div className="font-semibold">{inv.supplier}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">PO</div>
              <div className="font-mono">{inv.po}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Invoice Total</div>
              <div className="font-mono tabular-nums text-lg">{fmtCurrency(inv.invoiceTotal)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expected Total</div>
              <div className="font-mono tabular-nums text-lg">{fmtCurrency(inv.expectedTotal)}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Variance</div>
              <div className="font-mono tabular-nums text-lg text-destructive">
                +{fmtCurrency(inv.variance)} (
                {((inv.variance / inv.expectedTotal) * 100).toFixed(1)}%)
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tolerance</div>
              <div className="font-mono tabular-nums">{(inv.tolerance * 100).toFixed(1)}%</div>
            </div>
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
                        <span className="inline-flex items-center gap-1 text-xs">
                          {qtyOk ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-destructive" />
                          )}
                          Qty
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs ml-2">
                          {priceOk ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 text-destructive" />
                          )}
                          Price
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="border-t border-border pt-5">
            <h3 className="font-semibold text-sm mb-3">Resolution</h3>
            <RadioGroup value={resolution} onValueChange={setResolution} className="space-y-2 mb-4">
              <div className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-primary/30">
                <RadioGroupItem value="ppv" id="ppv" className="mt-0.5" />
                <Label htmlFor="ppv" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Accept Variance — Book to PPV</div>
                  <div className="text-xs text-muted-foreground">
                    Posts: Debit 5300 Purchase Price Variance / Credit 2310 AP Accrued
                  </div>
                </Label>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-primary/30">
                <RadioGroupItem value="reject" id="reject" className="mt-0.5" />
                <Label htmlFor="reject" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Reject Invoice</div>
                  <div className="text-xs text-muted-foreground">Send back to supplier for correction</div>
                </Label>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-lg border border-border hover:border-primary/30">
                <RadioGroupItem value="hold" id="hold" className="mt-0.5" />
                <Label htmlFor="hold" className="flex-1 cursor-pointer">
                  <div className="font-medium text-sm">Hold for Pricing Confirmation</div>
                  <div className="text-xs text-muted-foreground">Pause and request manual approval</div>
                </Label>
              </div>
            </RadioGroup>

            <Textarea placeholder="Resolution notes…" className="mb-3" />
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button>Submit Resolution</Button>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default ThreeWayMatch;
