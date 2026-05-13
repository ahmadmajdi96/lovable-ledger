import { useMemo, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Send, Bot, User, Sparkles, FileText, TrendingDown, BookOpen, ShieldCheck, ArrowRight } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useJournals } from "@/lib/journalStore";
import { useRole, roleLabel } from "@/lib/roleStore";
import { financialKPIs, fmtCurrency } from "@/lib/mockData";

type Source = { kind: "JOURNAL" | "MARKDOWN" | "RECON"; id: string; label: string; to: string };
type Msg = { role: "user" | "assistant"; text: string; sources?: Source[]; ts: string };

const suggested = [
  "Why did markdowns jump in Store 14 last week?",
  "Which journals are still pending for May close?",
  "Show me the inventory reconciliation variance.",
  "What posted manual journals are awaiting approval?",
  "Which vendors have the most 3-way match exceptions?",
];

const AIAssistant = () => {
  const { entries } = useJournals();
  const { user } = useRole();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      ts: new Date().toISOString(),
      text:
        `Hi ${user.name.split(" ")[0]} — I'm your CFO insights assistant. Ask me anything about closes, journals, markdowns, AP exceptions, or reconciliations. Every answer comes with source rows you can drill into.`,
    },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const draft = useMemo(() => entries.filter((e) => e.status === "DRAFT"), [entries]);
  const unapproved = useMemo(
    () => entries.filter((e) => e.source === "Manual" && e.status === "POSTED" && !e.approved),
    [entries],
  );
  const invVariance = financialKPIs.inventoryGL - financialKPIs.inventoryCalculated;

  const respond = (q: string): Msg => {
    const t = q.toLowerCase();
    const ts = new Date().toISOString();
    if (t.includes("markdown") && t.includes("store")) {
      return {
        role: "assistant", ts,
        text:
          `Store 14 markdowns rose 38% week-over-week (${fmtCurrency(18_420)} vs ${fmtCurrency(13_350)}). Driver: dairy near-expiry batches (MILK-001, YOGURT-220) triggered automatic PriceAI markdown plans after a slower-than-forecast sell-through. ` +
          `Net P&L impact is ${fmtCurrency(5_070)} markdown expense, partly offset by ${fmtCurrency(3_180)} waste avoided. Confidence: high.`,
        sources: [
          { kind: "MARKDOWN", id: "MD-S14-W19", label: "Markdown plan — Store 14 Wk19", to: "/markdown-lifecycle" },
          { kind: "JOURNAL", id: "JE-20260506-00002", label: "ExpirySmart disposal journal", to: "/journal-entries" },
          { kind: "MARKDOWN", id: "CFO-MD-VIEW", label: "CFO Markdown Performance", to: "/cfo-markdowns" },
        ],
      };
    }
    if (t.includes("pending") || t.includes("close") || t.includes("checklist")) {
      return {
        role: "assistant", ts,
        text:
          `May 2026 close is currently blocked. Pending items: ${draft.length} draft journal(s) not posted, ${unapproved.length} posted manual journal(s) awaiting CFO/Controller approval, and a ${fmtCurrency(invVariance)} inventory variance vs ExpirySmart. ` +
          `I recommend running the AI Period-Close Copilot to draft the missing accruals and depreciation entries.`,
        sources: [
          { kind: "RECON", id: "PERIOD-CLOSE", label: "Period Close — pending list", to: "/period-close" },
          { kind: "JOURNAL", id: "CLOSE-COPILOT", label: "AI Period-Close Copilot", to: "/close-copilot" },
        ],
      };
    }
    if (t.includes("inventory") || t.includes("variance") || t.includes("reconcil")) {
      return {
        role: "assistant", ts,
        text:
          `GL 1200 Inventory shows ${fmtCurrency(financialKPIs.inventoryGL)}, while ExpirySmart batch valuation is ${fmtCurrency(financialKPIs.inventoryCalculated)} — a variance of ${fmtCurrency(invVariance)}. ` +
          `Likely root cause: 3 unposted disposal events from BATCH-001 and BATCH-074. Suggested action: post the queued ExpirySmart events, then re-run the reconciliation.`,
        sources: [
          { kind: "RECON", id: "INV-1200", label: "Inventory subledger reconciliation", to: "/inventory-accounting" },
          { kind: "JOURNAL", id: "EXPIRY-EVENTS", label: "ExpirySmart pending events", to: "/integrations" },
        ],
      };
    }
    if (t.includes("approve") || t.includes("manual")) {
      return {
        role: "assistant", ts,
        text:
          `${unapproved.length} posted manual journal(s) await approval. Approval is restricted to CFO and Controller roles. Open the journal entries page to review supporting documents and approve in bulk.`,
        sources: unapproved.slice(0, 3).map((e) => ({
          kind: "JOURNAL" as const, id: e.id, label: e.description, to: "/journal-entries",
        })),
      };
    }
    if (t.includes("vendor") || t.includes("3-way") || t.includes("exception")) {
      return {
        role: "assistant", ts,
        text:
          `Top exception drivers (last 30 days): DairyCo (12 price variances, avg ${fmtCurrency(42)}), FreshFarms (7 quantity mismatches), GoodGrocer (4 missing GRNs). 76% are sub-tolerance — suggest auto-approving below ${fmtCurrency(50)}.`,
        sources: [
          { kind: "JOURNAL", id: "AP-EXC", label: "AP 3-Way Match exception queue", to: "/three-way-match" },
        ],
      };
    }
    return {
      role: "assistant", ts,
      text:
        `Here is what I can see across the ledger right now: ${draft.length} draft journals, ${unapproved.length} unapproved manual entries, GL inventory ${fmtCurrency(financialKPIs.inventoryGL)} vs calculated ${fmtCurrency(financialKPIs.inventoryCalculated)} (variance ${fmtCurrency(invVariance)}), markdown reserve ${fmtCurrency(financialKPIs.reserveGL)}. Try one of the suggested questions for a deeper drill-down.`,
      sources: [
        { kind: "RECON", id: "DASH", label: "Open Finance Dashboard", to: "/app" },
      ],
    };
  };

  const send = (q: string) => {
    if (!q.trim() || busy) return;
    const userMsg: Msg = { role: "user", text: q.trim(), ts: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      setMessages((m) => [...m, respond(q)]);
      setBusy(false);
    }, 600);
  };

  const sourceIcon = (k: Source["kind"]) =>
    k === "JOURNAL" ? FileText : k === "MARKDOWN" ? TrendingDown : BookOpen;

  return (
    <>
      <PageHeader
        title="AI Insights Assistant"
        description="Ask plain-English questions about your ledger. Every answer cites the underlying journals, markdowns and reconciliations."
        actions={
          <Badge variant="outline" className="gap-1.5">
            <ShieldCheck className="h-3 w-3" /> Signed in as {user.name} · {roleLabel[user.role]}
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <Card className="lg:col-span-3 flex flex-col h-[calc(100vh-220px)] min-h-[520px]">
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className={`h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0 ${
                    m.role === "user" ? "bg-muted-foreground/40" : ""
                  }`}
                  style={m.role === "assistant" ? { background: "var(--gradient-primary)" } : undefined}
                >
                  {m.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>
                <div className={`max-w-[85%] ${m.role === "user" ? "text-right" : ""}`}>
                  <div
                    className={`inline-block px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-muted/60 text-foreground rounded-tl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                  {m.sources && m.sources.length > 0 && (
                    <div className="mt-2 space-y-1.5">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                        Drill-down sources
                      </div>
                      {m.sources.map((s) => {
                        const Icon = sourceIcon(s.kind);
                        return (
                          <Link
                            key={s.id}
                            to={s.to}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border bg-card hover:border-primary/40 hover:bg-muted/30 transition group"
                          >
                            <Icon className="h-3.5 w-3.5 text-primary shrink-0" />
                            <div className="min-w-0 flex-1 text-left">
                              <div className="text-xs font-medium truncate">{s.label}</div>
                              <div className="text-[10px] font-mono text-muted-foreground truncate">{s.id}</div>
                            </div>
                            <Badge variant="outline" className="text-[9px] shrink-0">{s.kind}</Badge>
                            <ArrowRight className="h-3 w-3 text-muted-foreground group-hover:text-primary shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex gap-3">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-white shrink-0"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted/60 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-3 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about journals, markdowns, reconciliations…"
              className="flex-1 bg-transparent border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary/50"
            />
            <Button type="submit" disabled={busy || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </Card>

        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Suggested questions</h3>
            </div>
            <div className="space-y-1.5">
              {suggested.map((q) => (
                <button
                  key={q}
                  onClick={() => send(q)}
                  disabled={busy}
                  className="text-left w-full text-xs px-3 py-2 rounded-lg border border-border hover:border-primary/40 hover:bg-muted/30 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold text-sm mb-3">Live ledger snapshot</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Draft entries</span><span className="font-mono font-semibold">{draft.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Awaiting approval</span><span className="font-mono font-semibold">{unapproved.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Inventory variance</span><span className="font-mono font-semibold">{fmtCurrency(invVariance)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Markdown reserve</span><span className="font-mono font-semibold">{fmtCurrency(financialKPIs.reserveGL)}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
