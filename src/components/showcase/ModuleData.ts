import {
  BookOpen, FileText, ShieldCheck, Calculator, Activity, Layers, Database, ScrollText,
  Receipt, CreditCard, Boxes, Tag, Building2, Percent, FileBarChart2, Truck, Banknote, Coins,
  Bot, Sparkles, Brain, Wand2, FileSearch, TrendingUp, MessageSquare, History,
  TrendingDown, DollarSign, Clock, Target,
  Briefcase, UserCheck, Search, Eye, Bell, ClipboardCheck, Lock, BarChart3,
} from "lucide-react";
import type { ElementType } from "react";

import mesDashboard from "@/assets/mes-dashboard.jpg";
import qmsDashboard from "@/assets/qms-dashboard.jpg";
import cmsDashboard from "@/assets/cms-dashboard.jpg";
import edgeApps from "@/assets/edge-apps.jpg";

import shotCfoDashboard from "@/assets/screen-cfo-dashboard.png";
import shotAiAssistant from "@/assets/screen-ai-assistant.png";
import shotCloseCopilot from "@/assets/screen-close-copilot.png";
import shotPeriodClose from "@/assets/screen-period-close.png";
import shotJournalEntries from "@/assets/screen-journal-entries.png";
import shotChartOfAccounts from "@/assets/screen-chart-of-accounts.png";
import shotAccountsPayable from "@/assets/screen-accounts-payable.png";
import shotThreeWayMatch from "@/assets/screen-three-way-match.png";
import shotAccountsReceivable from "@/assets/screen-accounts-receivable.png";
import shotCfoMarkdowns from "@/assets/screen-cfo-markdowns.png";

import type { ScreenPreview } from "./ScreenPreviewCard";
export type { ScreenPreview } from "./ScreenPreviewCard";

export interface ModuleFeature { icon: ElementType; title: string; desc: string }
export interface ImpactMetric { icon: ElementType; metric: string; label: string; description: string }
export interface ModuleData {
  id: string; title: string; subtitle: string; description: string;
  image: string; colorVar: string;
  features: ModuleFeature[]; screens: string[]; impact: ImpactMetric[];
  previewScreens: ScreenPreview[];
}
export interface PersonaAppGroup {
  category: string; colorVar: string;
  apps: ModuleFeature[]; screens: string[]; impact: ImpactMetric[];
  previewScreens: ScreenPreview[];
}

export const modules: ModuleData[] = [
  {
    id: "gl",
    title: "GL Engine",
    subtitle: "General Ledger & Period Close",
    description:
      "Double-entry general ledger with auto-posted journals from every connected system, AI-assisted month-end close, role-based approvals, and a tamper-evident audit trail. Closes in days, not weeks — with the evidence package already assembled for your auditor.",
    image: shotPeriodClose,
    colorVar: "--gl-color",
    impact: [
      { icon: Clock, metric: "↓ 70%", label: "Faster Month-End", description: "AI-drafted checklist plus auto-posted journals shrink the close from 2 weeks to 3 business days." },
      { icon: Target, metric: "100%", label: "Reconciled Subledgers", description: "Period close is blocked until every subledger ties out — no more last-minute surprises." },
      { icon: ShieldCheck, metric: "↑ 90%", label: "Audit Pass Rate", description: "Pre-assembled close packages with attachments, approvals and rationales make audits a formality." },
      { icon: TrendingDown, metric: "↓ 80%", label: "Manual Journals", description: "Recurring accruals, depreciation and markdown true-ups posted automatically with audit-ready explanations." },
    ],
    features: [
      { icon: BookOpen, title: "Chart of Accounts", desc: "Multi-entity, multi-currency CoA with hierarchical roll-ups, mapping rules, and version history. Supports US GAAP, IFRS, and country-specific localizations." },
      { icon: FileText, title: "Journal Entries", desc: "Auto-posted entries from POS, AP, AR, inventory and markdowns. Manual entries with attachments, line-by-line edit history, and full reversal workflow." },
      { icon: ShieldCheck, title: "Approval Workflows", desc: "Role-based posting and approval. CFO/Controller approvals, segregation of duties, and a full audit timeline for every state change." },
      { icon: Calculator, title: "Period Close Checklist", desc: "Live blocking checklist that prevents close until subledgers reconcile, drafts post, manual entries are approved, and CFO signs off." },
      { icon: Activity, title: "Trial Balance & Financials", desc: "Real-time trial balance, P&L, balance sheet and cash flow — drillable from line item back to source journal in one click." },
      { icon: Layers, title: "Inter-Company & Eliminations", desc: "Auto-generated inter-company entries with built-in eliminations and consolidation across legal entities and reporting currencies." },
      { icon: Database, title: "Audit Trail", desc: "Tamper-evident event log of every journal post, edit, reversal, approval and AI suggestion — with actor, timestamp, and rationale." },
      { icon: ScrollText, title: "Close Package Export", desc: "One-click PDF and Excel close package: trial balance, journals, reconciliations, audit log and checklist status — formatted for your CFO and auditor." },
      { icon: History, title: "Versioning & Reversals", desc: "Reverse or edit only before approval. Every reversal carries the original entry ID, reason, and the user who initiated it." },
      { icon: Bell, title: "Notifications & Reminders", desc: "Approver prompts, blocker alerts, and shift-of-day digests so the close never stalls because someone forgot to click Approve." },
    ],
    screens: [
      "Finance Dashboard", "Chart of Accounts", "Journal Entries", "Manual Journal", "Journal Detail",
      "Period Close", "Close Checklist", "Approval Queue", "Audit Trail", "Trial Balance",
      "P&L Statement", "Balance Sheet", "Cash Flow", "Close Package Export", "Inter-Company",
      "Reversals", "Recurring Schedules", "GL Drilldown", "Journal Reports", "Notifications",
    ],
    previewScreens: [
      { id: "gl-period-close", title: "Period Close — May 2026", caption: "Live blocking checklist with 4 pending items, drill-downs and one-click PDF/Excel export.", image: shotPeriodClose, route: "/period-close", role: "Controller" },
      { id: "gl-journal-entries", title: "Journal Entries Stream", caption: "Auto-posted entries from CoreERP, ExpirySmart, PriceAI & SmartPOS — every line attaches an audit trail.", image: shotJournalEntries, route: "/journal-entries", role: "GL" },
      { id: "gl-chart-of-accounts", title: "Chart of Accounts", caption: "Multi-dimensional CoA across Company · Department · Store · Product Category with live balances.", image: shotChartOfAccounts, route: "/chart-of-accounts", role: "Controller" },
    ],
  },
  {
    id: "subledgers",
    title: "Subledgers",
    subtitle: "AP / AR / Inventory / Markdown / Fixed Assets / Tax",
    description:
      "Six fully-reconciled subledgers feeding the GL in real time. AP 3-way match with an exception queue, AR aging and collections, inventory valuation tied to ExpirySmart, markdown reserve true-ups, fixed-asset depreciation schedules, and per-jurisdiction tax management.",
    image: shotAccountsPayable,
    colorVar: "--sub-color",
    impact: [
      { icon: Target, metric: "↑ 92%", label: "Auto-Matched Invoices", description: "ML-based 3-way match reconciles POs, GRNs and invoices across fuzzy variations — only true exceptions hit the queue." },
      { icon: Clock, metric: "↓ 60%", label: "Days Sales Outstanding", description: "Automated dunning workflows, AR aging insights and cash-application AI cut DSO and free up working capital." },
      { icon: TrendingDown, metric: "↓ 45%", label: "Inventory Variance", description: "Real-time tie-out between GL 1200 and ExpirySmart batch valuation surfaces shrink and unposted disposals immediately." },
      { icon: DollarSign, metric: "↓ 25%", label: "Markdown Leakage", description: "PriceAI-driven markdown reserve true-ups and posting controls eliminate over- and under-reserved margin distortions." },
    ],
    features: [
      { icon: Receipt, title: "Accounts Payable", desc: "Vendor master, invoice intake, scheduled payments, and approval routing tied to spend thresholds and segregation-of-duties rules." },
      { icon: CreditCard, title: "AP 3-Way Match Exceptions", desc: "Live mismatch queue with reason codes (price, quantity, GRN missing), tolerance configuration, and AP-role-only resolution actions." },
      { icon: FileBarChart2, title: "Accounts Receivable", desc: "Customer master, invoicing, aging buckets, automated dunning, AR-Manager-only collection workflows, and cash application." },
      { icon: Boxes, title: "Inventory Accounting", desc: "Batch-level valuation tied to ExpirySmart events, automatic disposal entries, FIFO/Weighted-Average costing and shrink reconciliation." },
      { icon: Tag, title: "Markdown Lifecycle", desc: "Reserve creation, daily true-up to PriceAI plans, GL posting of markdown expense and inventory reserve adjustments." },
      { icon: Building2, title: "Fixed Assets", desc: "Asset register with useful-life schedules, monthly depreciation, disposal and impairment workflows, and CIP capitalization." },
      { icon: Percent, title: "Tax Management", desc: "Per-jurisdiction tax payable reconciliation, sales tax accrual, and audit trail of every taxable transaction tied to its source." },
      { icon: Truck, title: "Vendor & Customer Master", desc: "Single source of truth synced from CoreERP with credit terms, banking, tax IDs, and risk flags." },
      { icon: Banknote, title: "Payments & Cash", desc: "Scheduled vendor payments, payment-run approvals, bank reconciliation against GL 1000, and unapplied-cash workflow." },
      { icon: Coins, title: "Recurring Accruals", desc: "Rent, utilities, insurance and other recurring expenses posted on schedule with rationale captured in the audit log." },
    ],
    screens: [
      "Accounts Payable", "AP Invoice Detail", "3-Way Match Queue", "Match Exception Detail", "Vendor Master",
      "Accounts Receivable", "AR Aging", "Customer Master", "Cash Application",
      "Inventory Accounting", "Inventory Valuation", "Disposal Events",
      "Markdown Lifecycle", "Markdown Reserve", "CFO Markdown View",
      "Fixed Assets", "Asset Detail", "Depreciation Schedule",
      "Tax Management", "Tax Reconciliation",
    ],
    previewScreens: [
      { id: "sub-ap", title: "Accounts Payable", caption: "Procurement-to-payment with auto 3-way match, variance flags, payment proposals & supplier discounts.", image: shotAccountsPayable, route: "/accounts-payable", role: "AP Manager" },
      { id: "sub-3wm", title: "3-Way Match Exceptions", caption: "Mismatches routed by reason code with tolerance config — only AP roles can resolve, with full audit history.", image: shotThreeWayMatch, route: "/three-way-match", role: "AP" },
      { id: "sub-ar", title: "Accounts Receivable", caption: "B2B aging, dunning queue & cash application — AR Manager scope-locked write-offs and collections.", image: shotAccountsReceivable, route: "/accounts-receivable", role: "AR Manager" },
    ],
  },
  {
    id: "ai",
    title: "AI Suite",
    subtitle: "AI Period-Close Copilot · CFO Conversational Insights",
    description:
      "Embedded AI at every layer of the close. The Period-Close Copilot drafts the checklist and proposes balanced journal entries with audit-ready rationale. The CFO Insights Assistant answers plain-English questions and drills you straight into the source rows.",
    image: shotCloseCopilot,
    colorVar: "--ai-color",
    impact: [
      { icon: Brain, metric: "≥ 90%", label: "AI Draft Accuracy", description: "Suggested entries (depreciation, rent, markdown true-ups) ship with confidence scores and source references — most post on the first review." },
      { icon: Clock, metric: "↓ 85%", label: "Time to Insight", description: "Ask in plain English instead of pulling reports — answers come back in seconds with drill-down links." },
      { icon: ShieldCheck, metric: "100%", label: "Auditable AI", description: "Every AI suggestion carries rationale, source rows, confidence and a tamper-evident event in the audit trail." },
      { icon: Eye, metric: "24/7", label: "Anomaly Monitoring", description: "Continuous learning across journal patterns, vendors and markdown spikes flags fraud, errors and duplicates instantly." },
    ],
    features: [
      { icon: Sparkles, title: "Period-Close Copilot", desc: "One-click draft of the close checklist plus suggested journal entries (depreciation, accruals, markdown true-ups) with confidence scores and source citations." },
      { icon: Bot, title: "CFO Insights Assistant", desc: "Plain-English chat over the live ledger. Every answer cites the journals, markdowns or reconciliation rows behind it — one click to drill in." },
      { icon: Wand2, title: "Smart 3-Way Match", desc: "ML matches POs, GRNs and invoices across fuzzy variations and routes only the real exceptions to the AP queue with confidence scoring." },
      { icon: FileSearch, title: "Anomaly Detection", desc: "Continuous monitoring of journal patterns, vendor behavior and markdown spikes. Flags duplicates, fraud signals and out-of-policy entries in real time." },
      { icon: TrendingUp, title: "Predictive Markdown ROI", desc: "Forecasts lift vs. shrink for every SKU/store, recommends optimal discount curves, and posts the GL impact automatically." },
      { icon: MessageSquare, title: "Audit-Ready Explanations", desc: "Every AI action emits a human-readable rationale, the source records used, and the actor/timestamp into the immutable audit trail." },
      { icon: History, title: "Copilot Audit Timeline", desc: "Per-period timeline of every copilot generation, approval, un-approval and posting — exportable as part of the close package." },
      { icon: Brain, title: "Confidence-Scored Suggestions", desc: "Every suggestion shows a confidence percentage and source. High-confidence entries auto-route for one-tap approval." },
    ],
    screens: [
      "AI Insights Assistant", "Period-Close Copilot", "Copilot Audit Trail",
      "Suggested Entries", "Anomaly Inbox", "Markdown ROI Forecast",
      "Smart Match Queue", "Confidence Scoring", "AI Explanations",
      "CFO Drill-down", "Conversational Source Links", "Copilot Status",
    ],
    previewScreens: [
      { id: "ai-copilot", title: "Period-Close Copilot", caption: "AI-drafted checklist plus suggested entries with confidence scores and rationale — review, approve, post.", image: shotCloseCopilot, route: "/close-copilot", role: "CFO" },
      { id: "ai-assistant", title: "CFO Insights Assistant", caption: "Plain-English chat over the live ledger. Every answer cites journals, markdowns and reconciliations.", image: shotAiAssistant, route: "/ai-assistant", role: "CFO" },
      { id: "ai-markdowns", title: "AI Markdown Performance", caption: "PriceAI-driven recovery, waste-avoided and net-win analytics with daily true-ups posted to the GL.", image: shotCfoMarkdowns, route: "/cfo-markdowns", role: "CFO" },
    ],
  },
];

export const personaApps: PersonaAppGroup[] = [
  {
    category: "Finance Leadership Apps",
    colorVar: "--gl-color",
    impact: [
      { icon: Clock, metric: "↓ 75%", label: "Time in Reports", description: "CFOs and Controllers ask the assistant instead of pulling exports — every answer carries a drill-down link." },
      { icon: ShieldCheck, metric: "100%", label: "Approver Coverage", description: "Notifications and a status dashboard prompt the right approver the moment a blocking item appears." },
    ],
    apps: [
      { icon: Briefcase, title: "PA1: CFO Workspace", desc: "Live finance dashboard with masked/unmasked KPIs, period-close status, AI insights chat, drill-downs, and one-click close package export to PDF and Excel." },
      { icon: ClipboardCheck, title: "PA2: Controller Workbench", desc: "Approval queue for manual journals, reconciliation tie-outs, blocking checklist, recurring schedule manager, and AI Copilot review surface." },
      { icon: Bell, title: "PA3: Approver Notifications", desc: "Email + in-app prompts when blocking items appear: drafts unposted, manual entries awaiting approval, subledger out-of-balance, sign-off pending." },
    ],
    screens: [
      "PA1: CFO Dashboard", "PA1: Insights Chat", "PA1: Close Package Export",
      "PA2: Approval Queue", "PA2: Reconciliation Tie-Outs", "PA2: Recurring Schedules",
      "PA3: Notification Center", "PA3: Blocking Item Alerts",
    ],
    previewScreens: [
      { id: "pa-cfo", title: "PA1 · CFO Workspace", caption: "Finance dashboard with role banner, masked KPIs, period-close status and AI insights at a glance.", image: shotCfoDashboard, route: "/app", role: "CFO" },
      { id: "pa-controller", title: "PA2 · Controller Workbench", caption: "Period-close blockers, approval queue and recurring schedules — controller-only review surface.", image: shotPeriodClose, route: "/period-close", role: "Controller" },
      { id: "pa-insights", title: "PA1 · Insights Chat", caption: "Conversational drill-down into journals, markdowns and reconciliations with source citations.", image: shotAiAssistant, route: "/ai-assistant", role: "CFO" },
    ],
  },
  {
    category: "Subledger Operator Apps",
    colorVar: "--sub-color",
    impact: [
      { icon: TrendingDown, metric: "↓ 60%", label: "Exception Cycle Time", description: "AP and AR teams resolve mismatches in minutes thanks to ML-prefilled reason codes and one-tap approvals." },
      { icon: Target, metric: "↑ 95%", label: "First-Touch Resolution", description: "Confidence-scored matches and pre-attached evidence let operators clear exceptions on the first review." },
    ],
    apps: [
      { icon: CreditCard, title: "PA4: AP Manager", desc: "3-way match exception queue with reason codes, tolerance overrides (AP_Manager only), payment-run approvals, and vendor risk flags." },
      { icon: Receipt, title: "PA5: AP Clerk", desc: "Invoice intake, line-item matching, attachment capture, and resolve-only access to the exception queue. Cannot approve payments." },
      { icon: FileBarChart2, title: "PA6: AR Manager", desc: "Aging dashboard, dunning workflow, cash-application assistant, and AR-Manager-only collection actions and write-offs." },
    ],
    screens: [
      "PA4: AP Exception Queue", "PA4: Tolerance Override", "PA4: Payment Run Approval",
      "PA5: Invoice Intake", "PA5: Line Match",
      "PA6: AR Aging", "PA6: Dunning Queue", "PA6: Cash Application",
    ],
    previewScreens: [
      { id: "pa-ap-mgr", title: "PA4 · AP Manager", caption: "Exception queue with reason codes, tolerance overrides and payment-run approvals — AP-only.", image: shotThreeWayMatch, route: "/three-way-match", role: "AP Manager" },
      { id: "pa-ap-clerk", title: "PA5 · AP Clerk", caption: "Invoice intake & line-match resolution with read-only access to payment approvals.", image: shotAccountsPayable, route: "/accounts-payable", role: "AP Clerk" },
      { id: "pa-ar-mgr", title: "PA6 · AR Manager", caption: "Aging, dunning and cash application — write-offs and collections scoped to AR Manager.", image: shotAccountsReceivable, route: "/accounts-receivable", role: "AR Manager" },
    ],
  },
  {
    category: "Audit & Read-Only Apps",
    colorVar: "--persona-color",
    impact: [
      { icon: Lock, metric: "100%", label: "Data Masking Coverage", description: "Non-CFO/Controller roles see redacted financial amounts with a clear indicator of what is hidden and why." },
      { icon: BarChart3, metric: "≤ 5 min", label: "Evidence Pull", description: "Auditors pull a full close package — checklist, journals, reconciliations, audit trail — in under five minutes." },
    ],
    apps: [
      { icon: UserCheck, title: "PA7: Auditor Read-Only", desc: "Browse posted journals, attachments and the immutable audit trail. Export-only access — no posting, no editing, no approvals." },
      { icon: Search, title: "PA8: Investigation View", desc: "Drill from any AI-flagged anomaly into the supporting journals, source events and the actor timeline that produced them." },
      { icon: Eye, title: "PA9: Masked Operations View", desc: "Operational role view with sensitive monetary fields redacted, a banner indicating masking, and clear escalation path to request unmasking." },
    ],
    screens: [
      "PA7: Audit Trail", "PA7: Journal Browser", "PA7: Close Package Download",
      "PA8: Anomaly Drill-down", "PA8: Actor Timeline",
      "PA9: Masked KPIs", "PA9: Mask Notice", "PA9: Escalation Request",
    ],
    previewScreens: [
      { id: "pa-auditor", title: "PA7 · Auditor Read-Only", caption: "Browse posted journals, attachments and the immutable audit trail — export only, no posting.", image: shotJournalEntries, route: "/journal-entries", role: "Auditor" },
      { id: "pa-investigation", title: "PA8 · Investigation View", caption: "Drill from any AI-flagged anomaly into supporting journals, source events and actor timelines.", image: shotChartOfAccounts, route: "/chart-of-accounts", role: "Auditor" },
      { id: "pa-masked", title: "PA9 · Masked Operations View", caption: "Operational view with sensitive amounts redacted and a clear escalation path to request unmasking.", image: shotCfoMarkdowns, route: "/cfo-markdowns", role: "Read-Only" },
    ],
  },
];

export const personaAppsHeroImage = edgeApps;
