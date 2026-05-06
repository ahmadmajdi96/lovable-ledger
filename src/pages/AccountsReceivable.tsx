import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { arInvoices, fmtCurrency } from "@/lib/mockData";

const variant = (s: string) =>
  s === "PAID" ? "default" : s === "OVERDUE" ? "destructive" : s === "PARTIAL" ? "secondary" : "outline";

const AccountsReceivable = () => {
  const open = arInvoices.reduce((s, i) => s + i.outstanding, 0);
  const overdue = arInvoices.filter((i) => i.status === "OVERDUE").reduce((s, i) => s + i.outstanding, 0);

  return (
    <>
      <PageHeader
        title="Accounts Receivable"
        description="B2B / wholesale invoicing. Auto-generated on shipment confirmation from CoreERP."
        actions={<Button>Apply Cash from Bank Feed</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-label">Total Outstanding</div>
          <div className="mt-2 stat-value tabular-nums">{fmtCurrency(open)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Overdue</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-destructive">{fmtCurrency(overdue)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unapplied Cash</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-warning">{fmtCurrency(2_140)}</div>
          <div className="text-xs text-muted-foreground mt-1">3 bank items pending review</div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Invoice</th>
              <th className="px-5 py-3 font-semibold">Customer</th>
              <th className="px-5 py-3 font-semibold text-right">Amount</th>
              <th className="px-5 py-3 font-semibold text-right">Outstanding</th>
              <th className="px-5 py-3 font-semibold">Due</th>
              <th className="px-5 py-3 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {arInvoices.map((i) => (
              <tr key={i.id} className="table-row-hover border-t border-border">
                <td className="px-5 py-3 font-mono text-xs">{i.id}</td>
                <td className="px-5 py-3 font-medium">{i.customer}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{fmtCurrency(i.amount)}</td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{fmtCurrency(i.outstanding)}</td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{i.dueDate}</td>
                <td className="px-5 py-3">
                  <Badge variant={variant(i.status) as any} className="text-[10px]">
                    {i.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default AccountsReceivable;
