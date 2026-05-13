import {
  Zap, Clock, ShieldCheck, Eye, Layers, Lock,
  BarChart3, CheckCircle2, Globe, TrendingUp,
} from "lucide-react";
import { BenefitImpactCard, type BenefitStatement } from "./ImpactCard";

const benefits: BenefitStatement[] = [
  { icon: Clock, title: "Close in days, not weeks", description: "AI-drafted checklist plus auto-posted journals shrink month-end from 2 weeks to 3 business days.", colorVar: "--gl-color" },
  { icon: ShieldCheck, title: "Audit-ready, every period", description: "Pre-assembled close packages with attachments, approvals and AI rationales — auditors approve, not interrogate.", colorVar: "--gl-color" },
  { icon: Eye, title: "100% drill-down", description: "Every KPI, every line of the trial balance traces back to its source journal in one click.", colorVar: "--sub-color" },
  { icon: Layers, title: "Six reconciled subledgers", description: "AP, AR, Inventory, Markdown, Fixed Assets and Tax all tie to the GL — period close is blocked until they do.", colorVar: "--sub-color" },
  { icon: Lock, title: "Role-based access & masking", description: "CFO/Controller approvals, AP-only exception resolution, and automatic data masking for non-finance roles.", colorVar: "--persona-color" },
  { icon: BarChart3, title: "CFO-grade analytics", description: "Markdown ROI, AP aging, trial balance and anomaly feeds — live, not exported.", colorVar: "--ai-color" },
  { icon: Zap, title: "AI everywhere", description: "Period-close copilot, conversational insights, smart 3-way match and anomaly detection in one platform.", colorVar: "--ai-color" },
  { icon: CheckCircle2, title: "Tamper-evident audit trail", description: "Every post, edit, reversal, approval and AI suggestion captured with actor, timestamp and rationale.", colorVar: "--gl-color" },
  { icon: TrendingUp, title: "Markdown reserve accuracy", description: "PriceAI-driven nightly true-ups eliminate over- and under-reserved margin distortions.", colorVar: "--ai-color" },
  { icon: Globe, title: "Multi-entity, multi-currency", description: "Inter-company eliminations, FX revaluation and consolidated reporting across legal entities.", colorVar: "--sub-color" },
];

const BenefitsSection = () => (
  <section id="benefits" className="py-16 sm:py-24 px-4 sm:px-6 relative scroll-mt-20">
    <div className="absolute inset-0 pp-hero-gradient opacity-50" />
    <div className="relative max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="section-title mb-4">
          Why <span className="pp-gradient-text">CORTA Accounting</span>?
        </h2>
        <p className="section-subtitle mx-auto">Measurable impact on your close timeline and your audit posture from day one.</p>
      </div>

      <BenefitImpactCard items={benefits} />
    </div>
  </section>
);

export default BenefitsSection;
