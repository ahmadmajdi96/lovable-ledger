import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fixedAssets, fmtCurrency } from "@/lib/mockData";

const FixedAssets = () => {
  const totalCost = fixedAssets.reduce((s, a) => s + a.cost, 0);
  const totalDep = fixedAssets.reduce((s, a) => s + a.accumDepreciation, 0);
  const totalNBV = fixedAssets.reduce((s, a) => s + a.bookValue, 0);

  return (
    <>
      <PageHeader
        title="Fixed Assets"
        description="Acquisition → depreciation → disposal. Auto-posts monthly depreciation, integrated with CoreERP PO module."
        actions={
          <>
            <Button variant="outline">Run Depreciation</Button>
            <Button>Add Asset</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-label">Total Cost</div>
          <div className="mt-2 stat-value tabular-nums">{fmtCurrency(totalCost)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Accum. Depreciation</div>
          <div className="mt-2 stat-value tabular-nums text-muted-foreground">
            {fmtCurrency(totalDep)}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Net Book Value</div>
          <div className="mt-2 stat-value-gradient tabular-nums">{fmtCurrency(totalNBV)}</div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-semibold">ID</th>
              <th className="px-5 py-3 font-semibold">Asset</th>
              <th className="px-5 py-3 font-semibold">Category</th>
              <th className="px-5 py-3 font-semibold">Acquired</th>
              <th className="px-5 py-3 font-semibold">Method</th>
              <th className="px-5 py-3 font-semibold text-right">Cost</th>
              <th className="px-5 py-3 font-semibold text-right">Accum. Dep.</th>
              <th className="px-5 py-3 font-semibold text-right">NBV</th>
            </tr>
          </thead>
          <tbody>
            {fixedAssets.map((a) => (
              <tr key={a.id} className="table-row-hover border-t border-border">
                <td className="px-5 py-3 font-mono text-xs">{a.id}</td>
                <td className="px-5 py-3 font-medium">{a.name}</td>
                <td className="px-5 py-3">
                  <Badge variant="outline" className="text-[10px]">{a.category}</Badge>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{a.acquired}</td>
                <td className="px-5 py-3 text-xs">{a.method}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{fmtCurrency(a.cost)}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums text-muted-foreground">
                  {fmtCurrency(a.accumDepreciation)}
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums font-semibold">
                  {fmtCurrency(a.bookValue)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default FixedAssets;
