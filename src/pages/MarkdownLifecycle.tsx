import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { fmtCurrency } from "@/lib/mockData";

const stages = [
  {
    id: 1,
    title: "Receipt",
    source: "CoreERP · Goods Receipt",
    journal: [
      { dr: "1200 Inventory", cr: "2310 AP Accrued", amount: 750 },
    ],
    description: "On receipt of MILK-001 batch B20260420 (500 × $1.50)",
  },
  {
    id: 2,
    title: "Markdown Activated",
    source: "PriceAI / ExpirySmart",
    journal: [
      { dr: "5200 Markdown Expense", cr: "1210 Inventory Reserve", amount: 882 },
    ],
    description: "30% reduction on near-expiry stock — reserve booked to NRV",
  },
  {
    id: 3,
    title: "POS Sale at Markdown Price",
    source: "SmartPOS via CoreERP",
    journal: [
      { dr: "1000 Cash + 4110 Discounts + 5100 COGS", cr: "4100 Sales + 1200 Inventory + 2400 Tax", amount: 1_640 },
    ],
    description: "Sales tax recalculated on net markdown price",
  },
  {
    id: 4,
    title: "Unsold → Expired",
    source: "ExpirySmart · Disposal Confirmed",
    journal: [
      { dr: "1210 Reserve + 5210 Waste Expense", cr: "1200 Inventory", amount: 37.50 },
    ],
    description: "Reserve released, residual cost expensed, disposal physically confirmed",
  },
];

const MarkdownLifecycle = () => (
  <>
    <PageHeader
      title="Markdown Lifecycle Accounting"
      description="Full financial trail from receipt → markdown → sale or disposal. Compliant with LCM/NRV rules (ASC 330 & IFRS)."
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="stat-card">
        <div className="stat-label">Active Reserve (GL 1210)</div>
        <div className="mt-2 stat-value tabular-nums text-warning">{fmtCurrency(2_450)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">YTD Waste Expense (GL 5210)</div>
        <div className="mt-2 stat-value tabular-nums text-destructive">{fmtCurrency(14_230)}</div>
      </div>
    </div>

    <div className="space-y-3">
      {stages.map((s, i) => (
        <Card key={s.id} className="p-5 relative">
          <div className="flex items-start gap-4">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-md"
              style={{ background: "var(--gradient-primary)" }}
            >
              {s.id}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold">{s.title}</h3>
                <Badge variant="outline" className="text-[10px]">{s.source}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{s.description}</p>
              <div className="bg-muted/40 rounded-lg p-3 text-sm font-mono">
                {s.journal.map((j, idx) => (
                  <div key={idx} className="flex items-center gap-2 flex-wrap">
                    <span className="text-success">DR</span> {j.dr}
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-destructive">CR</span> {j.cr}
                    <span className="ml-auto tabular-nums font-semibold">{fmtCurrency(j.amount)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {i < stages.length - 1 && (
            <div className="absolute left-9 -bottom-3 h-3 w-px bg-border" />
          )}
        </Card>
      ))}
    </div>
  </>
);

export default MarkdownLifecycle;
