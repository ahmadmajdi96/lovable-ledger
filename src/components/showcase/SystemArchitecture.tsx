import {
  BookOpen, Layers, Brain, Bot, ArrowRight, ArrowDown,
  Boxes, Tag, Receipt, CreditCard, Building2, Percent,
  Database, FileBarChart2, Sparkles,
} from "lucide-react";

const sourceSystems = [
  { name: "CoreERP", desc: "Master data, POs, GRNs, inventory movements", icon: Database, colorVar: "--sub-color" },
  { name: "ExpirySmart", desc: "Batch-level expiry, shrink & disposal events", icon: Boxes, colorVar: "--sub-color" },
  { name: "PriceAI", desc: "Markdown plans, ROI forecasts, reserve true-ups", icon: Tag, colorVar: "--ai-color" },
];

const subledgers = [
  { name: "AP", icon: CreditCard }, { name: "AR", icon: Receipt },
  { name: "Inventory", icon: Boxes }, { name: "Markdown", icon: Tag },
  { name: "Fixed Assets", icon: Building2 }, { name: "Tax", icon: Percent },
];

const reportingOutputs = [
  { name: "Trial Balance / P&L / BS", icon: FileBarChart2 },
  { name: "Close Package & Audit Trail", icon: BookOpen },
  { name: "CFO Insights & Persona Apps", icon: Bot },
];

const Pill = ({ label, colorVar = "--pp-border" }: { label: string; colorVar?: string }) => (
  <div
    className="px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold uppercase tracking-wider"
    style={{
      background: `hsl(var(${colorVar}) / 0.08)`,
      color: `hsl(var(${colorVar}))`,
      borderColor: `hsl(var(${colorVar}) / 0.3)`,
    }}
  >
    {label}
  </div>
);

const FlowArrow = () => (
  <div className="flex justify-center my-4">
    <div className="flex flex-col items-center gap-1 pp-muted-text">
      <ArrowDown className="w-5 h-5 opacity-60" />
      <span className="text-[10px] uppercase tracking-widest opacity-70">Real-time event stream</span>
    </div>
  </div>
);

const SystemArchitecture = () => (
  <section id="architecture" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="section-title mb-4">System Architecture</h2>
        <p className="section-subtitle mx-auto">
          A single ledger backbone fed by CoreERP, ExpirySmart and PriceAI — every event posts
          once into the right subledger, reconciles into the GL, and surfaces in CFO-grade
          reporting and AI-powered persona apps.
        </p>
      </div>

      {/* Layer 1: Source systems */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="Source Systems → CoreERP" colorVar="--sub-color" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {sourceSystems.map((s) => (
          <div key={s.name} className="data-card flex items-start gap-4">
            <div
              className="p-3 rounded-lg shrink-0"
              style={{
                background: `hsl(var(${s.colorVar}) / 0.1)`,
                border: `1px solid hsl(var(${s.colorVar}) / 0.25)`,
              }}
            >
              <s.icon className="w-6 h-6" style={{ color: `hsl(var(${s.colorVar}))` }} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">{s.name}</h3>
              <p className="text-sm pp-muted-text">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <FlowArrow />

      {/* Layer 2: CoreAccounting (Subledgers + GL) */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="CoreAccounting — Subledgers → GL" colorVar="--gl-color" />
        <div className="h-px flex-1 bg-border" />
      </div>

      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: "hsl(var(--pp-card))",
          borderColor: "hsl(var(--gl-color) / 0.25)",
          boxShadow: "0 0 32px hsl(var(--gl-color) / 0.08)",
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {subledgers.map((s) => (
            <div
              key={s.name}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border pp-border"
              style={{ background: "hsl(var(--sub-color) / 0.06)" }}
            >
              <s.icon className="w-5 h-5" style={{ color: "hsl(var(--sub-color))" }} />
              <span className="text-xs font-semibold">{s.name}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center mb-5">
          <ArrowDown className="w-5 h-5 pp-muted-text opacity-60" />
        </div>

        <div className="flex items-center gap-4 p-4 rounded-xl border"
          style={{
            background: "linear-gradient(135deg, hsl(var(--gl-color) / 0.12), hsl(var(--ai-color) / 0.08))",
            borderColor: "hsl(var(--gl-color) / 0.35)",
          }}
        >
          <div
            className="p-3 rounded-lg shrink-0"
            style={{
              background: "hsl(var(--gl-color) / 0.18)",
              border: "1px solid hsl(var(--gl-color) / 0.35)",
            }}
          >
            <BookOpen className="w-6 h-6" style={{ color: "hsl(var(--gl-color))" }} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">GL Engine</h3>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border pp-border pp-muted-text">
                Single source of truth
              </span>
            </div>
            <p className="text-sm pp-muted-text">
              Every subledger entry posts here in real time, with double-entry validation,
              role-based approvals, and a tamper-evident audit trail.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1 pp-muted-text">
            <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--ai-color))" }} />
            <span className="text-xs">AI Copilot embedded</span>
          </div>
        </div>
      </div>

      <FlowArrow />

      {/* Layer 3: Reporting & Intelligence */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="Reporting & Intelligence" colorVar="--ai-color" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-10">
        {reportingOutputs.map((r) => (
          <div key={r.name} className="data-card flex items-center gap-3">
            <div
              className="p-2.5 rounded-lg shrink-0"
              style={{
                background: "hsl(var(--ai-color) / 0.1)",
                border: "1px solid hsl(var(--ai-color) / 0.25)",
              }}
            >
              <r.icon className="w-5 h-5" style={{ color: "hsl(var(--ai-color))" }} />
            </div>
            <span className="text-sm font-semibold">{r.name}</span>
          </div>
        ))}
      </div>

      {/* Intelligence overlay strip */}
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="Intelligence Overlay" colorVar="--persona-color" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="data-card flex items-start gap-4">
          <div
            className="p-3 rounded-lg shrink-0"
            style={{
              background: "hsl(var(--ai-color) / 0.1)",
              border: "1px solid hsl(var(--ai-color) / 0.25)",
            }}
          >
            <Brain className="w-6 h-6" style={{ color: "hsl(var(--ai-color))" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">AI Suite</h3>
            <p className="text-sm pp-muted-text">
              Period-Close Copilot drafts checklists & journals; CFO Insights answers in plain English with drill-down.
            </p>
          </div>
        </div>
        <div className="data-card flex items-start gap-4">
          <div
            className="p-3 rounded-lg shrink-0"
            style={{
              background: "hsl(var(--persona-color) / 0.1)",
              border: "1px solid hsl(var(--persona-color) / 0.25)",
            }}
          >
            <Bot className="w-6 h-6" style={{ color: "hsl(var(--persona-color))" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">Persona Apps</h3>
            <p className="text-sm pp-muted-text">
              Role-locked workspaces for CFO, Controller, AP, AR & Auditor — masked, approval-aware, audit-ready.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 pp-muted-text text-xs">
        <Layers className="w-3.5 h-3.5" />
        <span>Every layer reconciled · Every event auditable · Every role appropriately masked</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </div>
  </section>
);

export default SystemArchitecture;
