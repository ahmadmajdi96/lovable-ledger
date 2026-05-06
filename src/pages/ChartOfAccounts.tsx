import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { chartOfAccounts, fmtCurrency } from "@/lib/mockData";
import { Search } from "lucide-react";

const ChartOfAccounts = () => {
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      chartOfAccounts.filter(
        (a) =>
          a.code.includes(q) ||
          a.name.toLowerCase().includes(q.toLowerCase()) ||
          a.type.toLowerCase().includes(q.toLowerCase())
      ),
    [q]
  );

  return (
    <>
      <PageHeader
        title="Chart of Accounts"
        description="Multidimensional COA: Company · Department · Store · Product Category."
      />
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search code, name, type…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="pl-9"
            />
          </div>
          <Badge variant="outline" className="ml-auto">{filtered.length} accounts</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="py-2 pr-4 font-semibold">Code</th>
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Type</th>
                <th className="py-2 pr-4 font-semibold">Normal</th>
                <th className="py-2 pr-4 font-semibold text-right">Balance</th>
                <th className="py-2 pr-4 font-semibold">Purpose</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.code} className="table-row-hover border-b border-border last:border-0">
                  <td className="py-2.5 pr-4 font-mono text-xs">{a.code}</td>
                  <td className="py-2.5 pr-4 font-medium">{a.name}</td>
                  <td className="py-2.5 pr-4">
                    <Badge variant="outline" className="text-[10px]">{a.type}</Badge>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground">{a.normal}</td>
                  <td
                    className={`py-2.5 pr-4 text-right font-mono tabular-nums ${
                      a.balance < 0 ? "text-muted-foreground" : ""
                    }`}
                  >
                    {fmtCurrency(a.balance)}
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-muted-foreground">{a.purpose ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
};

export default ChartOfAccounts;
