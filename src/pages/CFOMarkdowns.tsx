import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { markdownPerformance, financialKPIs, fmtCurrency, fmtPct } from "@/lib/mockData";
import { Download, Presentation, TrendingDown, ShieldCheck, DollarSign, Percent } from "lucide-react";

const CFOMarkdowns = () => {
  return (
    <>
      <PageHeader
        title="Markdown Financial Performance"
        description="Executive view of expiry & discount operations · MTD."
        actions={
          <>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" /> Export
            </Button>
            <Button>
              <Presentation className="h-4 w-4 mr-2" /> Board Pack
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">Markdowns Taken</div>
              <div className="mt-2 stat-value tabular-nums">{fmtCurrency(financialKPIs.totalMarkdowns)}</div>
            </div>
            <div className="h-11 w-11 rounded-lg flex items-center justify-center bg-warning/10 text-warning">
              <TrendingDown className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">Waste Avoided</div>
              <div className="mt-2 stat-value tabular-nums text-success">
                {fmtCurrency(financialKPIs.wasteAvoided)}
              </div>
            </div>
            <div className="h-11 w-11 rounded-lg flex items-center justify-center bg-success/10 text-success">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">Net Revenue Recovered</div>
              <div className="mt-2 stat-value-gradient tabular-nums">
                {fmtCurrency(financialKPIs.netRevenueRecovered)}
              </div>
            </div>
            <div className="h-11 w-11 rounded-lg flex items-center justify-center bg-primary/10 text-primary">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div>
              <div className="stat-label">Gross Margin (post-MD)</div>
              <div className="mt-2 stat-value tabular-nums">
                {fmtPct(financialKPIs.grossMarginAfterMarkdown)}
              </div>
            </div>
            <div className="h-11 w-11 rounded-lg flex items-center justify-center bg-accent/10 text-accent">
              <Percent className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      <Card className="p-5 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="dairy">Dairy</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="produce">Produce</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-40"><SelectValue placeholder="Store" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="014">Store 014</SelectItem>
              <SelectItem value="022">Store 022</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="mtd">
            <SelectTrigger className="w-40"><SelectValue placeholder="Period" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="mtd">This Month</SelectItem>
              <SelectItem value="qtd">This Quarter</SelectItem>
              <SelectItem value="ytd">YTD</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="outline" className="ml-auto">Live data · synced 2 min ago</Badge>
        </div>

        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-semibold">SKU</th>
              <th className="px-3 py-2 font-semibold">Product</th>
              <th className="px-3 py-2 font-semibold text-right">Qty Sold</th>
              <th className="px-3 py-2 font-semibold text-right">Avg. Discount</th>
              <th className="px-3 py-2 font-semibold text-right">Recovered Rev.</th>
              <th className="px-3 py-2 font-semibold text-right">Would-be Waste</th>
              <th className="px-3 py-2 font-semibold text-right">Net Win</th>
            </tr>
          </thead>
          <tbody>
            {markdownPerformance.map((m) => {
              const win = m.recoveredRevenue;
              return (
                <tr key={m.sku} className="table-row-hover border-t border-border">
                  <td className="px-3 py-2.5 font-mono text-xs">{m.sku}</td>
                  <td className="px-3 py-2.5 font-medium">{m.productName}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{m.qtySold.toLocaleString()}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums text-warning">{fmtPct(m.avgDiscount)}</td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums">
                    {fmtCurrency(m.recoveredRevenue)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums text-muted-foreground">
                    {fmtCurrency(m.wouldBeWaste)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-mono tabular-nums font-semibold text-success">
                    +{fmtCurrency(win)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-1">Daily Markdown Trend vs Waste</h3>
        <p className="text-xs text-muted-foreground mb-5">Last 15 days · all stores</p>
        <DualBars />
      </Card>
    </>
  );
};

const DualBars = () => {
  const data = [
    { d: "May 1", md: 1200, w: 420 }, { d: "May 2", md: 980, w: 380 }, { d: "May 3", md: 1450, w: 510 },
    { d: "May 4", md: 1620, w: 580 }, { d: "May 5", md: 1380, w: 440 }, { d: "May 6", md: 1820, w: 620 },
    { d: "May 7", md: 2050, w: 690 }, { d: "May 8", md: 1740, w: 540 }, { d: "May 9", md: 1310, w: 420 },
    { d: "May 10", md: 1490, w: 470 }, { d: "May 11", md: 1660, w: 510 }, { d: "May 12", md: 1980, w: 660 },
    { d: "May 13", md: 1530, w: 470 }, { d: "May 14", md: 1880, w: 590 }, { d: "May 15", md: 2150, w: 710 },
  ];
  const max = Math.max(...data.map((d) => d.md));
  return (
    <div>
      <div className="flex items-end gap-2 h-48">
        {data.map((d) => (
          <div key={d.d} className="flex-1 flex items-end justify-center gap-0.5">
            <div
              className="w-1/2 rounded-t-sm transition-all hover:opacity-80"
              style={{ height: `${(d.md / max) * 100}%`, background: "var(--gradient-primary)" }}
              title={`${d.d}: $${d.md} markdowns`}
            />
            <div
              className="w-1/2 rounded-t-sm bg-warning/70 transition-all hover:opacity-80"
              style={{ height: `${(d.w / max) * 100}%` }}
              title={`${d.d}: $${d.w} waste`}
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1 mt-2">
        {data.map((d) => (
          <div key={d.d} className="flex-1 text-[9px] text-center text-muted-foreground">{d.d.split(" ")[1]}</div>
        ))}
      </div>
      <div className="flex items-center gap-5 mt-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm" style={{ background: "var(--gradient-primary)" }} />
          <span>Markdowns</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm bg-warning/70" />
          <span>Would-be waste</span>
        </div>
      </div>
    </div>
  );
};

export default CFOMarkdowns;
