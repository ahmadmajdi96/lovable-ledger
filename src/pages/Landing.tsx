import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Brain, Wand2, FileSearch, Bot, TrendingUp, ShieldCheck,
  Plug, Lock, Zap, BarChart3, CheckCircle2, ArrowRight, Sparkles,
  LayoutDashboard, Receipt, Tag, Menu, X,
} from "lucide-react";
import cortaLogo from "@/assets/corta-logo.png";
import heroFactory from "@/assets/hero-factory.jpg";
import cmsImg from "@/assets/cms-dashboard.jpg";
import mesImg from "@/assets/mes-dashboard.jpg";
import qmsImg from "@/assets/qms-dashboard.jpg";

const navItems = [
  { label: "AI Suite", href: "#ai", icon: Brain },
  { label: "Modules", href: "#modules", icon: LayoutDashboard },
  { label: "Integrations", href: "#integrations", icon: Plug },
  { label: "Benefits", href: "#benefits", icon: ShieldCheck },
];

const aiFeatures = [
  { icon: Brain, title: "AI Period-Close Copilot", desc: "Drafts the close checklist, detects unposted journals, proposes accruals and depreciation entries — review, approve, post." },
  { icon: Bot, title: "CFO Conversational Insights", desc: "Ask plain-English questions and drill straight into the journals, markdowns and reconciliations behind the answer." },
  { icon: Wand2, title: "Smart 3-Way Match", desc: "ML matches POs · GRNs · invoices across fuzzy variations. Routes only true exceptions with confidence scores." },
  { icon: FileSearch, title: "Anomaly Detection", desc: "Continuous learning across journal patterns, vendors and markdown spikes flags fraud, errors, and duplicates instantly." },
  { icon: TrendingUp, title: "Predictive Markdown ROI", desc: "Forecast lift vs. shrink for every SKU/store, recommend the optimal discount curve, post the GL impact automatically." },
  { icon: ShieldCheck, title: "Audit-Ready Explanations", desc: "Every AI suggestion ships with rationale, source rows and a tamper-evident audit trail — auditors approve, not interrogate." },
];

const modules = [
  { img: mesImg, name: "GL & Period Close", desc: "Double-entry GL, journal automation, AI-assisted month-end close with blocking validations." },
  { img: cmsImg, name: "Markdown Intelligence", desc: "Real-time markdown ROI, shrink avoided, gross-margin attribution by store and SKU." },
  { img: qmsImg, name: "AP / AR Subledgers", desc: "3-way match, exception queue, AR aging and collections — fully reconciled to the GL." },
];

const integrations = [
  { name: "CoreERP", desc: "Master data, vendors, customers" },
  { name: "ExpirySmart", desc: "Markdown & shrink events" },
  { name: "PriceAI", desc: "Optimized pricing decisions" },
  { name: "SmartPOS", desc: "Real-time sales & taxes" },
];

const benefits = [
  { icon: Zap, t: "Close in days, not weeks", d: "AI checklist blocks the close until everything reconciles." },
  { icon: BarChart3, t: "CFO-grade dashboards", d: "Markdown ROI, AP aging, trial balance — live, not exported." },
  { icon: Lock, t: "Role-based controls", d: "CFO/Controller approvals, segregation of duties, full audit trail." },
  { icon: CheckCircle2, t: "Audit-ready exports", d: "PDF + Excel close packages with attachments and approvals." },
  { icon: Receipt, t: "Auto-posted journals", d: "Every POS sale, markdown and GRN flows in as a balanced entry." },
  { icon: Tag, t: "Markdown reserve accuracy", d: "Reserve true-ups posted nightly, reconciled to the cent." },
];

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pp-dark min-h-screen">
      {/* Nav */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-xl border-b pp-border" : ""
        }`}
        style={scrolled ? { background: "hsl(220 25% 7% / 0.8)" } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5">
            <img src={cortaLogo} alt="CORTA" className="h-8 w-auto" />
            <span className="font-bold text-lg tracking-tight">CORTA Accounting</span>
          </a>
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium pp-muted-text hover:text-white transition-colors"
              >
                <item.icon className="h-4 w-4" /> {item.label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/login" className="hidden sm:inline-flex text-sm px-3 py-2 pp-muted-text hover:text-white">Sign in</Link>
            <Link
              to="/login"
              className="text-sm px-4 py-2 rounded-lg text-white font-semibold shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(243 80% 66%), hsl(174 72% 50%))" }}
            >
              Launch app
            </Link>
            <button
              className="md:hidden p-2 rounded-lg pp-muted-text hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-b pp-border px-4 py-3 space-y-1" style={{ background: "hsl(220 25% 7% / 0.95)" }}>
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium pp-muted-text hover:text-white"
              >
                <item.icon className="w-4 h-4" /> {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroFactory} alt="" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(220 25% 7% / 0.85), hsl(220 25% 7% / 0.7), hsl(220 25% 7%))" }} />
          <div className="absolute inset-0 pp-hero-gradient" />
        </div>
        <div className="absolute inset-0 pp-grid-pattern opacity-30" />

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border pp-border backdrop-blur-sm mb-6 sm:mb-8" style={{ background: "hsl(220 22% 11% / 0.5)" }}>
            <span className="pp-pulse-dot" />
            <span className="text-xs sm:text-sm font-medium pp-muted-text">AI-Native Financial Engine for Retail</span>
          </div>

          <div className="flex justify-center mb-6">
            <img src={cortaLogo} alt="CORTA Accounting" className="h-20 sm:h-24 md:h-28 w-auto" />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
            <span className="pp-gradient-text">CORTA Accounting</span>
            <br />
            <span>Close faster. Decide smarter.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl pp-muted-text max-w-3xl mx-auto mb-10 leading-relaxed">
            The first accounting platform with embedded AI for retail and manufacturing —
            automating the close, surfacing anomalies, and giving your CFO conversational
            answers instead of static reports.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-14">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-lg"
              style={{ background: "linear-gradient(135deg, hsl(243 80% 66%), hsl(174 72% 50%))" }}
            >
              Try the demo <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="#ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border pp-border font-medium hover:border-white/30"
              style={{ background: "hsl(220 22% 11% / 0.6)" }}
            >
              See AI features
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 max-w-4xl mx-auto">
            {[
              { v: "70%", l: "Faster month-end close" },
              { v: "92%", l: "Auto-matched invoices" },
              { v: "24/7", l: "Anomaly monitoring" },
              { v: "4", l: "Connected systems" },
            ].map((s) => (
              <div key={s.l} className="pp-card text-center backdrop-blur-sm p-4 sm:p-6">
                <div className="pp-metric pp-gradient-text text-2xl sm:text-4xl">{s.v}</div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest pp-muted-text mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features */}
      <section id="ai" className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 pp-hero-gradient opacity-50" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border pp-border mb-4" style={{ background: "hsl(220 22% 11% / 0.6)" }}>
              <Brain className="h-3.5 w-3.5" style={{ color: "hsl(243 80% 66%)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest pp-muted-text">AI capabilities</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Accounting that <span className="pp-gradient-text">thinks ahead</span>
            </h2>
            <p className="pp-muted-text max-w-2xl mx-auto">
              CORTA embeds AI at every layer — from journal validation to CFO insights — so
              your team focuses on decisions, not data entry.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {aiFeatures.map((f) => (
              <div key={f.title} className="pp-card p-6 group">
                <div
                  className="h-11 w-11 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg"
                  style={{ background: "linear-gradient(135deg, hsl(243 80% 66%), hsl(174 72% 50%))" }}
                >
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm pp-muted-text leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section id="modules" className="py-20 sm:py-28 px-4 sm:px-6 border-t pp-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
              One platform. Every <span className="pp-gradient-text">finance workflow</span>.
            </h2>
            <p className="pp-muted-text max-w-2xl mx-auto">
              GL, AP, AR, inventory, markdowns, fixed assets and tax — unified under a single ledger.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {modules.map((m) => (
              <div key={m.name} className="pp-card overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={m.img} alt={m.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-lg mb-1.5">{m.name}</h3>
                  <p className="text-sm pp-muted-text leading-relaxed">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section id="integrations" className="py-20 sm:py-24 px-4 sm:px-6 border-t pp-border" style={{ background: "hsl(220 22% 9%)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border pp-border mb-4" style={{ background: "hsl(220 22% 11% / 0.6)" }}>
              <Plug className="h-3.5 w-3.5" style={{ color: "hsl(174 72% 50%)" }} />
              <span className="text-xs font-semibold uppercase tracking-widest pp-muted-text">Connected ecosystem</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">One ledger, every system</h2>
            <p className="pp-muted-text max-w-2xl mx-auto">
              CORTA connects natively to the systems running your business — events flow in
              real time, journals post automatically.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {integrations.map((i) => (
              <div key={i.name} className="pp-card text-center p-6">
                <div className="pp-metric pp-gradient-text text-2xl mb-1">{i.name}</div>
                <div className="text-xs pp-muted-text">{i.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="benefits" className="py-20 sm:py-28 px-4 sm:px-6 relative">
        <div className="absolute inset-0 pp-hero-gradient opacity-40" />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-3">
              Built for <span className="pp-gradient-text">finance leaders</span>
            </h2>
            <p className="pp-muted-text max-w-2xl mx-auto">Measurable impact on your close timeline and your audit posture.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {benefits.map((b) => (
              <div key={b.t} className="pp-card p-6">
                <div className="p-2.5 rounded-lg w-fit mb-4 border pp-border" style={{ background: "hsl(243 80% 66% / 0.1)" }}>
                  <b.icon className="w-5 h-5" style={{ color: "hsl(243 80% 66%)" }} />
                </div>
                <h3 className="font-semibold mb-2">{b.t}</h3>
                <p className="text-sm pp-muted-text leading-relaxed">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6">
        <div
          className="max-w-4xl mx-auto rounded-2xl p-10 md:p-14 text-center text-white relative overflow-hidden border pp-border"
          style={{ background: "linear-gradient(135deg, hsl(243 80% 66%) 0%, hsl(174 72% 50%) 100%)" }}
        >
          <Sparkles className="h-8 w-8 mx-auto mb-4 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-3">See CORTA in action</h2>
          <p className="text-white/85 mb-6 max-w-xl mx-auto">
            Sign in with a demo account and explore the AI-powered accounting workspace.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white font-semibold shadow-lg"
            style={{ color: "hsl(243 80% 40%)" }}
          >
            Launch demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 border-t pp-border">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src={cortaLogo} alt="CORTA Accounting" className="h-10 w-auto" />
            <span className="font-bold text-xl tracking-tight">CORTA Accounting</span>
          </div>
          <p className="pp-muted-text max-w-lg mx-auto mb-6 text-sm">
            AI-native financial engine — close faster, decide smarter.
          </p>
          <div className="flex items-center justify-center gap-6 text-xs pp-muted-text mb-6">
            <span>GL</span><span className="w-1 h-1 rounded-full pp-border bg-white/20" />
            <span>AP / AR</span><span className="w-1 h-1 rounded-full pp-border bg-white/20" />
            <span>Markdowns</span><span className="w-1 h-1 rounded-full pp-border bg-white/20" />
            <span>Tax</span>
          </div>
          <div className="text-xs pp-muted-text/60">© 2026 CORTA Accounting. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
