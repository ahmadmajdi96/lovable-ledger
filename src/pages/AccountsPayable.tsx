import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { apInvoices, fmtCurrency } from "@/lib/mockData";
import { Link } from "react-router-dom";

const statusVariant = (s: string) =>
  s === "MATCHED" ? "default" : s === "PAID" ? "secondary" : s === "EXCEPTION" ? "destructive" : "outline";

const AccountsPayable = () => {
  const totalOutstanding = apInvoices
    .filter((i) => i.status !== "PAID")
    .reduce((s, i) => s + i.invoiceTotal, 0);
  const exceptions = apInvoices.filter((i) => i.status === "EXCEPTION").length;

  return (
    <>
      <PageHeader
        title="Accounts Payable"
        description="Procurement-to-payment with automated 3-way match against CoreERP POs and goods receipts."
        actions={
          <>
            <Button variant="outline">Aging Report</Button>
            <Button>Run Payment Proposal</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="stat-card">
          <div className="stat-label">Outstanding</div>
          <div className="mt-2 stat-value tabular-nums">{fmtCurrency(totalOutstanding)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Match Exceptions</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-destructive">{exceptions}</div>
          <Link to="/three-way-match" className="text-xs text-primary hover:underline mt-1 inline-block">
            Resolve now →
          </Link>
        </div>
        <div className="stat-card">
          <div className="stat-label">Discounts Available</div>
          <div className="mt-2 text-3xl font-bold tabular-nums text-success">{fmtCurrency(15.6)}</div>
          <div className="text-xs text-muted-foreground mt-1">2% / 10 net 30 — DairyCo</div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-5 py-3 font-semibold">Invoice</th>
              <th className="px-5 py-3 font-semibold">Supplier</th>
              <th className="px-5 py-3 font-semibold">PO / Receipt</th>
              <th className="px-5 py-3 font-semibold text-right">Amount</th>
              <th className="px-5 py-3 font-semibold text-right">Variance</th>
              <th className="px-5 py-3 font-semibold">Due</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {apInvoices.map((inv) => (
              <tr key={inv.id} className="table-row-hover border-t border-border">
                <td className="px-5 py-3 font-mono text-xs">{inv.id}</td>
                <td className="px-5 py-3 font-medium">{inv.supplier}</td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">
                  {inv.po}
                  <br />
                  {inv.receipt}
                </td>
                <td className="px-5 py-3 text-right font-mono tabular-nums">{fmtCurrency(inv.invoiceTotal)}</td>
                <td
                  className={`px-5 py-3 text-right font-mono tabular-nums ${
                    inv.variance > 0 ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {inv.variance > 0 ? `+${fmtCurrency(inv.variance)}` : "—"}
                </td>
                <td className="px-5 py-3 text-xs text-muted-foreground">{inv.dueDate}</td>
                <td className="px-5 py-3">
                  <Badge variant={statusVariant(inv.status) as any} className="text-[10px]">
                    {inv.status}
                  </Badge>
                </td>
                <td className="px-5 py-3 text-right">
                  {inv.status === "EXCEPTION" && (
                    <Link to="/three-way-match" className="text-xs text-primary hover:underline font-medium">
                      Resolve →
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
};

export default AccountsPayable;
