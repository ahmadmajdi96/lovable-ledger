import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { journalEntries as seed, fmtCurrency, JournalEntry } from "@/lib/mockData";
import { ChevronRight, Plus, FileText } from "lucide-react";
import { format } from "date-fns";
import ManualJournalDialog from "@/components/ManualJournalDialog";
import { chartOfAccounts } from "@/lib/mockData";

const sourceTone: Record<string, string> = {
  CoreERP: "bg-primary/10 text-primary border-primary/20",
  ExpirySmart: "bg-warning/10 text-warning border-warning/20",
  PriceAI: "bg-accent/10 text-accent border-accent/20",
  SmartPOS: "bg-success/10 text-success border-success/20",
  Manual: "bg-muted text-muted-foreground border-border",
};

const JournalEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>(seed);
  const [open, setOpen] = useState<string | null>(seed[0].id);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handlePosted = (e: { description: string; reference: string; lines: { account: string; debit: string; credit: string }[] }) => {
    const id = `JE-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${String(entries.length + 1).padStart(5, "0")}`;
    const newEntry: JournalEntry = {
      id,
      date: new Date().toISOString(),
      source: "Manual",
      reference: e.reference,
      description: e.description,
      status: "POSTED",
      postedBy: "cfo@retailco.com",
      lines: e.lines.map((l) => ({
        account: l.account,
        accountName: chartOfAccounts.find((a) => a.code === l.account)?.name ?? l.account,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      })),
    };
    setEntries([newEntry, ...entries]);
    setOpen(id);
  };

  return (
    <>
      <PageHeader
        title="Journal Entries"
        description="Auto-created from CoreERP, ExpirySmart, PriceAI & SmartPOS events. Manual entries require description and audit attachment."
        actions={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Manual Entry
          </Button>
        }
      />

      <ManualJournalDialog open={dialogOpen} onOpenChange={setDialogOpen} onPosted={handlePosted} />

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {entries.map((j) => {
            const totalDr = j.lines.reduce((s, l) => s + l.debit, 0);
            const totalCr = j.lines.reduce((s, l) => s + l.credit, 0);
            const isOpen = open === j.id;
            return (
              <div key={j.id}>
                <button
                  onClick={() => setOpen(isOpen ? null : j.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors text-left"
                >
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                  />
                  <span className={`pill ${sourceTone[j.source]}`}>{j.source}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{j.description}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {j.id} · {j.reference}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono tabular-nums text-sm">{fmtCurrency(totalDr)}</div>
                    <div className="text-[10px] text-muted-foreground">{format(new Date(j.date), "MMM d, HH:mm")}</div>
                  </div>
                  <Badge
                    variant={j.status === "POSTED" ? "default" : j.status === "DRAFT" ? "secondary" : "outline"}
                    className="text-[10px]"
                  >
                    {j.status}
                  </Badge>
                </button>
                {isOpen && (
                  <div className="bg-muted/30 px-5 py-4 border-t border-border">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                          <th className="py-2 pr-4 font-semibold">Account</th>
                          <th className="py-2 pr-4 font-semibold">Name</th>
                          <th className="py-2 pr-4 font-semibold text-right">Debit</th>
                          <th className="py-2 pr-4 font-semibold text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {j.lines.map((l, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="py-2 pr-4 font-mono text-xs">{l.account}</td>
                            <td className="py-2 pr-4">{l.accountName}</td>
                            <td className="py-2 pr-4 text-right font-mono tabular-nums">
                              {l.debit > 0 ? fmtCurrency(l.debit) : "—"}
                            </td>
                            <td className="py-2 pr-4 text-right font-mono tabular-nums">
                              {l.credit > 0 ? fmtCurrency(l.credit) : "—"}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-semibold">
                          <td colSpan={2} className="pt-2 text-right text-xs uppercase text-muted-foreground">
                            Totals
                          </td>
                          <td className="pt-2 text-right font-mono tabular-nums">{fmtCurrency(totalDr)}</td>
                          <td className="pt-2 text-right font-mono tabular-nums">{fmtCurrency(totalCr)}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" /> Posted by {j.postedBy}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default JournalEntries;
