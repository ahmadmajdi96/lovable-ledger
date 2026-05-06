import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { taxJurisdictions, fmtCurrency, fmtPct } from "@/lib/mockData";

const Tax = () => {
  const totalCollected = taxJurisdictions.reduce((s, j) => s + j.taxCollected, 0);
  const totalGross = taxJurisdictions.reduce((s, j) => s + j.grossSales, 0);
  const totalMd = taxJurisdictions.reduce((s, j) => s + j.markdowns, 0);

  return (
    <>
      <PageHeader
        title="Tax Management"
        description="Multi-jurisdiction tax engine. Markdown rule: tax recalculated on net selling price."
        actions={<Button>Generate Filing Pack</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-label">Tax Collected MTD</div>
          <div className="mt-2 stat-value tabular-nums">{fmtCurrency(totalCollected)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Gross Sales</div>
          <div className="mt-2 stat-value tabular-nums">{fmtCurrency(totalGross)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Markdown Adjustments</div>
          <div className="mt-2 stat-value tabular-nums text-warning">{fmtCurrency(totalMd)}</div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h3 className="font-semibold">Jurisdiction Breakdown</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pre-filled tax return. Drillable by store and product.
          </p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Code</th>
              <th className="px-5 py-3 font-semibold">Jurisdiction</th>
              <th className="px-5 py-3 font-semibold text-right">Rate</th>
              <th className="px-5 py-3 font-semibold text-right">Gross Sales</th>
              <th className="px-5 py-3 font-semibold text-right">Markdowns</th>
              <th className="px-5 py-3 font-semibold text-right">Taxable Sales</th>
              <th className="px-5 py-3 font-semibold text-right">Tax Collected</th>
            </tr>
          </thead>
          <tbody>
            {taxJurisdictions.map((j) => (
              <tr key={j.code} className="table-row-hover border-t border-border">
                <td className="px-5 py-3">
                  <Badge variant="outline" className="font-mono text-[10px]">{j.code}</Badge>
                </td>
                <td className="px-5 py-3 font-medium">{j.name}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{fmtPct(j.rate)}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{fmtCurrency(j.grossSales)}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums text-warning">
                  -{fmtCurrency(j.markdowns)}
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{fmtCurrency(j.taxableSales)}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums font-semibold">
                  {fmtCurrency(j.taxCollected)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default Tax;
