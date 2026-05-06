import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { integrations } from "@/lib/mockData";
import { ExternalLink, Webhook, Database, FileCode, ArrowRight } from "lucide-react";

const sample = `POST /api/v1/accounting/journal/goods-receipt
{
  "eventId": "GR-20260506-00001",
  "purchaseOrderNumber": "PO-2026-05001",
  "supplierId": "SUP-015",
  "lines": [{
    "sku": "MILK-001",
    "batchNumber": "B20260506",
    "quantityReceived": 500,
    "unitCost": 1.50,
    "totalLineValue": 750.00,
    "glAccountDebit": "1200",
    "glAccountCredit": "2300"
  }]
}`;

const writeOff = `POST /api/v1/accounting/transactions/write-off-confirm
{
  "batchId": "BATCH-001",
  "batchNumber": "B20260420",
  "sku": "MILK-001",
  "quantityDisposed": 25,
  "fullBookValue": 37.50,
  "existingReserveAmount": 12.50,
  "confirmationUser": "warehouse.op1@retailco.com",
  "confirmedAt": "2026-05-06T09:00:00Z"
}`;

const Integrations = () => {
  const tone = (s: string) =>
    s === "HEALTHY" ? "bg-success/10 text-success border-success/20" :
    s === "DEGRADED" ? "bg-warning/10 text-warning border-warning/20" :
    "bg-destructive/10 text-destructive border-destructive/20";

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Live event ingestion across CoreERP, ExpirySmart, PriceAI and SmartPOS — the financial engine's nervous system."
      />

      <Card className="p-0 overflow-hidden mb-6">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Integration</th>
              <th className="px-5 py-3 font-semibold">System</th>
              <th className="px-5 py-3 font-semibold">Direction</th>
              <th className="px-5 py-3 font-semibold">Protocol</th>
              <th className="px-5 py-3 font-semibold">Cadence</th>
              <th className="px-5 py-3 font-semibold text-right">Events Today</th>
              <th className="px-5 py-3 font-semibold">Last Sync</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {integrations.map((i) => (
              <tr key={i.name} className="table-row-hover border-t border-border">
                <td className="px-5 py-3 font-medium">{i.name}</td>
                <td className="px-5 py-3 text-xs">
                  <Badge variant="outline" className="text-[10px]">{i.system}</Badge>
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{i.direction}</td>
                <td className="px-5 py-3 text-xs">{i.protocol}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{i.cadence}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{i.eventsToday}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{i.lastSync}</td>
                <td className="px-5 py-3">
                  <span className={`pill ${tone(i.status)}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${i.status === "HEALTHY" ? "bg-success" : "bg-warning"}`} />
                    {i.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Webhook className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">CoreERP → CoreAccounting</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Goods receipt event triggers automatic GL posting</p>
          <pre className="bg-muted/40 rounded-lg p-3 text-[11px] font-mono overflow-x-auto leading-relaxed">
            {sample}
          </pre>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <Badge variant="default" className="text-[10px]">DR 1200 Inventory</Badge>
            <ArrowRight className="h-3 w-3" />
            <Badge variant="default" className="text-[10px]">CR 2310 AP Accrued</Badge>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Database className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">ExpirySmart → CoreAccounting</h3>
          </div>
          <p className="text-xs text-muted-foreground mb-4">Disposal confirmation finalizes write-off journal</p>
          <pre className="bg-muted/40 rounded-lg p-3 text-[11px] font-mono overflow-x-auto leading-relaxed">
            {writeOff}
          </pre>
          <div className="mt-3 flex items-center gap-2 text-xs flex-wrap">
            <Badge variant="default" className="text-[10px]">DR 1210 Reserve</Badge>
            <Badge variant="default" className="text-[10px]">DR 5210 Waste</Badge>
            <ArrowRight className="h-3 w-3" />
            <Badge variant="default" className="text-[10px]">CR 1200 Inventory</Badge>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <FileCode className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Connected Systems</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { name: "CoreERP", desc: "Transactions, POs, sales", url: "—" },
            { name: "ExpirySmart WMS", desc: "Batch tracking, disposals", url: "—" },
            { name: "PriceAI Optimizer", desc: "Markdown plans, ML feedback", url: "—" },
            { name: "SmartPOS", desc: "Indirect via CoreERP", url: "—" },
          ].map((s) => (
            <div key={s.name} className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="font-semibold text-sm">{s.name}</div>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">{s.desc}</div>
              <span className="pill bg-success/10 text-success border-success/20 mt-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-dot" />
                Connected
              </span>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

export default Integrations;
