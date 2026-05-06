import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { financialKPIs, fmtCurrency } from "@/lib/mockData";
import { CheckCircle2, AlertCircle } from "lucide-react";

const InventoryAccounting = () => {
  const inventoryRec = financialKPIs.inventoryGL === financialKPIs.inventoryCalculated;
  const reserveRec = financialKPIs.reserveGL === financialKPIs.reserveCalculated;

  const discrepancies = [
    { date: "May 3", glAmount: 470_000, calc: 469_800, variance: 200, status: "INVESTIGATED", note: "Found: PO receipt error" },
    { date: "Apr 28", glAmount: 462_500, calc: 462_500, variance: 0, status: "RECONCILED", note: "—" },
    { date: "Apr 22", glAmount: 458_900, calc: 459_200, variance: -300, status: "INVESTIGATED", note: "Cycle count adj" },
  ];

  return (
    <>
      <PageHeader
        title="Inventory Accounting"
        description="FIFO at batch-level · GAAP ASC 330 / IFRS LCM-NRV compliant · nightly reconciliation to ExpirySmart."
        actions={
          <>
            <Button variant="outline">View Open Transactions</Button>
            <Button>Run Reconciliation Now</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className={`p-6 border-l-4 ${inventoryRec ? "border-l-success" : "border-l-destructive"}`}>
          <div className="flex items-start gap-3">
            {inventoryRec ? (
              <CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-1" />
            ) : (
              <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">GL 1200 — Inventory Finished Goods</h3>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">GL Balance</div>
                  <div className="font-mono tabular-nums text-lg font-semibold">
                    {fmtCurrency(financialKPIs.inventoryGL)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Sum (Qty × UnitCost)</div>
                  <div className="font-mono tabular-nums text-lg font-semibold">
                    {fmtCurrency(financialKPIs.inventoryCalculated)}
                  </div>
                </div>
              </div>
              <Badge variant={inventoryRec ? "default" : "destructive"} className="mt-3">
                {inventoryRec ? "✅ RECONCILED" : "⚠️ DISCREPANCY"}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className={`p-6 border-l-4 ${reserveRec ? "border-l-success" : "border-l-destructive"}`}>
          <div className="flex items-start gap-3">
            {reserveRec ? (
              <CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-1" />
            ) : (
              <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-1" />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">GL 1210 — Reserve for Markdown</h3>
              <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                <div>
                  <div className="text-xs text-muted-foreground">GL Balance</div>
                  <div className="font-mono tabular-nums text-lg font-semibold">
                    {fmtCurrency(financialKPIs.reserveGL)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">PriceAI Active Markdowns</div>
                  <div className="font-mono tabular-nums text-lg font-semibold">
                    {fmtCurrency(financialKPIs.reserveCalculated)}
                  </div>
                </div>
              </div>
              <Badge variant={reserveRec ? "default" : "destructive"} className="mt-3">
                {reserveRec ? "✅ RECONCILED" : "⚠️ DISCREPANCY"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Potential Discrepancies — Last 7 Days</h3>
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase text-muted-foreground">
              <th className="px-3 py-2">Date</th>
              <th className="px-3 py-2 text-right">GL Amount</th>
              <th className="px-3 py-2 text-right">Calc Amount</th>
              <th className="px-3 py-2 text-right">Variance</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Note</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.map((d, i) => (
              <tr key={i} className="border-t border-border">
                <td className="px-3 py-2.5">{d.date}</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">{fmtCurrency(d.glAmount)}</td>
                <td className="px-3 py-2.5 text-right font-mono tabular-nums">{fmtCurrency(d.calc)}</td>
                <td
                  className={`px-3 py-2.5 text-right font-mono tabular-nums ${
                    d.variance !== 0 ? "text-warning" : "text-muted-foreground"
                  }`}
                >
                  {d.variance > 0 ? "+" : ""}
                  {d.variance !== 0 ? fmtCurrency(d.variance) : "—"}
                </td>
                <td className="px-3 py-2.5">
                  <Badge variant="outline" className="text-[10px]">{d.status}</Badge>
                </td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{d.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default InventoryAccounting;
