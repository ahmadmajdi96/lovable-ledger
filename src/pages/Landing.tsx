import { Link } from "react-router-dom";
import {
  Sparkles, Brain, Zap, ShieldCheck, BarChart3, Bot, Wand2, FileSearch,
  TrendingUp, Lock, Plug, ArrowRight, CheckCircle2,
} from "lucide-react";
import cortaLogo from "@/assets/corta-logo.png";
import heroBg from "@/assets/hero-bg.jpg";

const aiFeatures = [
  {
    icon: Brain,
    title: "AI Period Close Copilot",
    desc: "Automatically detects unposted journals, unreconciled subledgers, and missing accruals — and proposes draft entries for one-click posting.",
  },
  {
    icon: Wand2,
    title: "Smart 3-Way Match",
    desc: "ML matches POs, GRNs, and invoices across fuzzy variations, routes only true exceptions, and recommends resolutions with confidence scores.",
  },
  {
    icon: FileSearch,
    title: "Anomaly Detection",
    desc: "Continuous learning across journal entries, vendor patterns, and markdown spikes flags potential fraud, errors, or duplicate payments instantly.",
  },
  {
    icon: Bot,
    title: "CFO Conversational Insights",
    desc: "Ask plain-English questions: \"Why did markdowns jump in Store 14 last week?\" — get sourced answers with drill-down to the journals.",
  },
  {
    icon: TrendingUp,
    title: "Predictive Markdown ROI",
    desc: "Forecast markdown lift vs. shrink for every SKU/store, recommend the optimal discount curve, and post the resulting GL impact automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Audit-Ready Explanations",
    desc: "Every AI suggestion ships with rationale, source rows, and a tamper-evident audit trail — so your auditors approve, not interrogate.",
  },
];

const integrations = [
  { name: "CoreERP", desc: "Master data, vendors, customers" },
  { name: "ExpirySmart", desc: "Markdown & shrink events" },
  { name: "PriceAI", desc: "Optimized pricing decisions" },
  { name: "SmartPOS", desc: "Real-time sales & taxes" },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={cortaLogo} alt="CORTA" className="h-8 w-auto" />
            <span className="font-bold tracking-tight">CORTA Accounting</span>
          </div>
          <div className="hidden md:flex items-center gap-1 text-sm">
            <a href="#ai" className="px-3 py-2 text-muted-foreground hover:text-foreground rounded-md">AI Features</a>
            <a href="#integrations" className="px-3 py-2 text-muted-foreground hover:text-foreground rounded-md">Integrations</a>
            <a href="#benefits" className="px-3 py-2 text-muted-foreground hover:text-foreground rounded-md">Benefits</a>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="text-sm px-3 py-2 text-muted-foreground hover:text-foreground">Sign in</Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg text-white font-medium shadow-md"
              style={{ background: "var(--gradient-primary)" }}
            >
              Launch app
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-6">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">AI-native financial engine</span>
          </div>
          <div className="flex justify-center mb-6">
            <img src={cortaLogo} alt="CORTA" className="h-20 w-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            <span className="gradient-text">CORTA Accounting</span>
            <br />
            <span className="text-foreground">Close faster. Decide smarter.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            The first accounting platform with embedded AI for retail and manufacturing —
            automating the close, surfacing anomalies, and giving your CFO conversational
            answers instead of static reports.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
              style={{ background: "var(--gradient-primary)" }}
            >
              Try the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-card font-medium hover:border-primary/40"
            >
              See AI features
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
            {[
              { v: "70%", l: "Faster month-end close" },
              { v: "92%", l: "Auto-matched invoices" },
              { v: "24/7", l: "Anomaly monitoring" },
              { v: "4", l: "Connected systems" },
            ].map((s) => (
              <div key={s.l} className="stat-card text-center">
                <div className="stat-value-gradient">{s.v}</div>
                <div className="stat-label mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section id="ai" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/30 bg-accent/5 mb-4">
              <Brain className="h-3.5 w-3.5 text-accent" />
              <span className="text-xs font-semibold uppercase tracking-wider text-accent">AI capabilities</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-3">
              Accounting that <span className="gradient-text">thinks ahead</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CORTA embeds AI at every layer — from journal validation to CFO insights — so
              your team focuses on decisions, not data entry.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiFeatures.map((f) => (
              <div key={f.title} className="stat-card group">
                <div
                  className="h-11 w-11 rounded-lg flex items-center justify-center text-white mb-4 shadow-sm"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-24 px-6 bg-muted/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
              <Plug className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">Connected ecosystem</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight mb-3">One ledger, every system</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              CORTA connects natively to the systems running your business — events flow in
              real time, journals post automatically.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {integrations.map((i) => (
              <div key={i.name} className="stat-card text-center">
                <div className="font-bold text-xl gradient-text mb-1">{i.name}</div>
                <div className="text-xs text-muted-foreground">{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold tracking-tight mb-3">
              Built for <span className="gradient-text">finance leaders</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Zap, t: "Close in days, not weeks", d: "AI checklist blocks the close until everything reconciles." },
              { icon: BarChart3, t: "CFO-grade dashboards", d: "Markdown ROI, AP aging, trial balance — live, not exported." },
              { icon: Lock, t: "Role-based controls", d: "CFO/Controller approvals, segregation of duties, full audit trail." },
              { icon: CheckCircle2, t: "Audit-ready exports", d: "PDF + Excel close packages with attachments and approvals." },
            ].map((b) => (
              <div key={b.t} className="stat-card">
                <b.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1.5">{b.t}</h3>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto rounded-2xl p-10 md:p-14 text-center text-white relative overflow-hidden"
          style={{ background: "var(--gradient-primary)" }}>
          <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">See CORTA in action</h2>
          <p className="text-white/85 mb-6 max-w-xl mx-auto">
            Sign in with a demo account and explore the AI-powered accounting workspace.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-primary font-semibold shadow-lg"
          >
            Launch demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <img src={cortaLogo} alt="CORTA" className="h-7 w-auto" />
            <span className="font-semibold text-foreground">CORTA Accounting</span>
          </div>
          <div>© 2026 CORTA Accounting. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
