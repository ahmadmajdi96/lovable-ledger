import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowDown, Brain, BookOpen, Layers, Bot, Menu, X, Workflow, Sparkles, ShieldCheck,
  Boxes, Tag, Receipt, CreditCard, Building2, Percent, Database, FileBarChart2,
  Zap, Clock, Eye, Lock, BarChart3, CheckCircle2, Globe, TrendingUp,
} from "lucide-react";
import heroFactory from "@/assets/hero-corta-bg.jpg";
import cortaLogo from "@/assets/corta-logo.png";
import { modulesAr, personaAppsAr, personaAppsHeroImageAr } from "@/components/showcase/ModuleDataAr";
import ImpactCard, { BenefitImpactCard, type BenefitStatement } from "@/components/showcase/ImpactCard";
import { ScreenPreviewGrid } from "@/components/showcase/ScreenPreviewCard";

/* -------------------- Navigation -------------------- */
const navItems = [
  { label: "الهيكل", href: "#architecture", icon: Workflow },
  { label: "محرّك الأستاذ", href: "#gl", icon: BookOpen },
  { label: "الأستاذة الفرعية", href: "#subledgers", icon: Layers },
  { label: "حزمة AI", href: "#ai", icon: Brain },
  { label: "الشخصيات", href: "#personas", icon: Bot },
  { label: "المزايا", href: "#benefits", icon: Sparkles },
  { label: "المعايير", href: "#standards", icon: ShieldCheck },
];

const smoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith("#")) return;
  const el = document.getElementById(href.slice(1));
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", href);
  }
};

const NavigationAr = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "backdrop-blur-xl border-b pp-border" : ""}`}
      style={scrolled ? { background: "hsl(220 25% 7% / 0.8)" } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 sm:gap-3 hover-scale">
          <img src={cortaLogo} alt="شعار CORTA" className="h-7 sm:h-8 w-auto" />
          <span className="font-bold text-base sm:text-lg tracking-tight">CORTA المحاسبة</span>
        </a>
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} onClick={(e) => smoothScroll(e, item.href)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium pp-muted-text hover:text-white transition-colors">
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
          <Link to="/" className="ml-2 text-sm px-3 py-2 rounded-lg border pp-border pp-muted-text hover:text-white">
            EN
          </Link>
          <Link to="/login" className="ml-2 text-sm px-4 py-2 rounded-lg text-white font-semibold shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--gl-color)), hsl(var(--sub-color)))" }}>
            تشغيل التطبيق
          </Link>
        </div>
        <button className="md:hidden p-2 rounded-lg pp-muted-text hover:text-white" onClick={() => setOpen(!open)} aria-label="القائمة">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-b pp-border px-4 py-3 space-y-1" style={{ background: "hsl(220 25% 7% / 0.95)" }}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href}
              onClick={(e) => { smoothScroll(e, item.href); setOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium pp-muted-text hover:text-white">
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
          <Link to="/" onClick={() => setOpen(false)} className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold pp-muted-text border pp-border">
            English
          </Link>
          <Link to="/login" onClick={() => setOpen(false)} className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, hsl(var(--gl-color)), hsl(var(--sub-color)))" }}>
            تشغيل التطبيق
          </Link>
        </div>
      )}
    </nav>
  );
};

/* -------------------- Hero -------------------- */
const HeroAr = () => (
  <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0">
      <img src={heroFactory} alt="غرفة تحكّم العمليات المالية الحديثة" className="w-full h-full object-cover" width={1920} height={800} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(220 25% 7% / 0.9), hsl(220 25% 7% / 0.7), hsl(220 25% 7%))" }} />
      <div className="absolute inset-0 pp-hero-gradient" />
    </div>
    <div className="absolute inset-0 pp-grid-pattern opacity-30" />
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center pt-20 sm:pt-0">
      <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border pp-border backdrop-blur-sm mb-6 sm:mb-8" style={{ background: "hsl(220 22% 11% / 0.5)" }}>
        <span className="pp-pulse-dot" />
        <span className="text-xs sm:text-sm font-medium pp-muted-text">محرّك مالي ذكي للتجزئة والتصنيع</span>
      </div>
      <div className="flex justify-center mb-4 sm:mb-6">
        <img src={cortaLogo} alt="شعار CORTA" className="h-16 sm:h-20 md:h-24 w-auto animate-fade-in" />
      </div>
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-4 sm:mb-6">
        <span className="pp-gradient-text">CORTA للمحاسبة</span>
        <br />
        <span>أقفل أسرع. قرّر أذكى.</span>
      </h1>
      <p className="text-lg sm:text-xl md:text-2xl pp-muted-text max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-2">
        محرّك مالي موحَّد — أستاذ عام، وستة أستاذة فرعية مطابَقة، وحزمة ذكاء اصطناعي مدمجة — مصمَّم لقيادات المالية التي تُقفل في أيام، لا أسابيع.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        <Link to="/login" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold shadow-lg hover-scale"
          style={{ background: "linear-gradient(135deg, hsl(var(--gl-color)), hsl(var(--sub-color)))" }}>
          جرّب العرض التوضيحي
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <a href="#gl" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border pp-border font-medium hover:border-white/30"
          style={{ background: "hsl(220 22% 11% / 0.6)" }}>
          استكشف الوحدات
        </a>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-4xl mx-auto">
        {[
          { value: "3", label: "وحدات أساسية" },
          { value: "6", label: "أستاذة فرعية مطابَقة" },
          { value: "+60", label: "شاشة عمل" },
          { value: "GAAP / IFRS", label: "متوافق" },
        ].map((s) => (
          <div key={s.label} className="data-card text-center backdrop-blur-sm p-4 sm:p-6">
            <div className="pp-metric pp-gradient-text text-xl sm:text-3xl">{s.value}</div>
            <div className="text-[10px] sm:text-xs uppercase tracking-widest pp-muted-text mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-1.5">
        <div className="w-1.5 h-3 rounded-full animate-pulse" style={{ background: "hsl(var(--gl-color))" }} />
      </div>
    </div>
  </section>
);

/* -------------------- Architecture -------------------- */
const sourceSystems = [
  { name: "CoreERP", desc: "بيانات رئيسية، أوامر شراء، استلامات، حركات مخزون", icon: Database, colorVar: "--sub-color" },
  { name: "ExpirySmart", desc: "صلاحية الدفعات والهالك وأحداث الإتلاف", icon: Boxes, colorVar: "--sub-color" },
  { name: "PriceAI", desc: "خطط التخفيض، تنبؤ العائد، تعديلات الاحتياطي", icon: Tag, colorVar: "--ai-color" },
];
const subledgersList = [
  { name: "AP", icon: CreditCard }, { name: "AR", icon: Receipt },
  { name: "المخزون", icon: Boxes }, { name: "التخفيضات", icon: Tag },
  { name: "الأصول الثابتة", icon: Building2 }, { name: "الضرائب", icon: Percent },
];
const reportingOutputs = [
  { name: "ميزان المراجعة / P&L / BS", icon: FileBarChart2 },
  { name: "حزمة الإقفال وسجل التدقيق", icon: BookOpen },
  { name: "رؤى المدير المالي وتطبيقات الشخصيات", icon: Bot },
];
const Pill = ({ label, colorVar = "--pp-border" }: { label: string; colorVar?: string }) => (
  <div className="px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold uppercase tracking-wider"
    style={{ background: `hsl(var(${colorVar}) / 0.08)`, color: `hsl(var(${colorVar}))`, borderColor: `hsl(var(${colorVar}) / 0.3)` }}>
    {label}
  </div>
);
const FlowArrow = () => (
  <div className="flex justify-center my-4">
    <div className="flex flex-col items-center gap-1 pp-muted-text">
      <ArrowDown className="w-5 h-5 opacity-60" />
      <span className="text-[10px] uppercase tracking-widest opacity-70">تدفق أحداث لحظي</span>
    </div>
  </div>
);

const ArchitectureAr = () => (
  <section id="architecture" className="py-16 sm:py-24 px-4 sm:px-6 scroll-mt-20">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <h2 className="section-title mb-4">هيكل النظام</h2>
        <p className="section-subtitle mx-auto">
          ظهر أستاذ واحد يُغذّيه CoreERP و ExpirySmart و PriceAI — كل حدث يُرحَّل مرة واحدة في الأستاذ الفرعي الصحيح، ويُطابق في الأستاذ العام، ويظهر في تقارير المدير المالي وتطبيقات الشخصيات الذكية.
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="أنظمة المصدر ← CoreERP" colorVar="--sub-color" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        {sourceSystems.map((s) => (
          <div key={s.name} className="data-card flex items-start gap-4">
            <div className="p-3 rounded-lg shrink-0"
              style={{ background: `hsl(var(${s.colorVar}) / 0.1)`, border: `1px solid hsl(var(${s.colorVar}) / 0.25)` }}>
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

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="المحاسبة الجوهرية — أستاذة فرعية ← أستاذ عام" colorVar="--gl-color" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="rounded-2xl border p-5 sm:p-6"
        style={{ background: "hsl(var(--pp-card))", borderColor: "hsl(var(--gl-color) / 0.25)", boxShadow: "0 0 32px hsl(var(--gl-color) / 0.08)" }}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-5">
          {subledgersList.map((s) => (
            <div key={s.name} className="flex flex-col items-center justify-center gap-2 p-3 rounded-lg border pp-border"
              style={{ background: "hsl(var(--sub-color) / 0.06)" }}>
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
          }}>
          <div className="p-3 rounded-lg shrink-0"
            style={{ background: "hsl(var(--gl-color) / 0.18)", border: "1px solid hsl(var(--gl-color) / 0.35)" }}>
            <BookOpen className="w-6 h-6" style={{ color: "hsl(var(--gl-color))" }} />
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-foreground">محرّك الأستاذ العام</h3>
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border pp-border pp-muted-text">
                مصدر الحقيقة الوحيد
              </span>
            </div>
            <p className="text-sm pp-muted-text">
              كل قيد من أستاذ فرعي يُرحَّل هنا لحظيًا، مع التحقق المزدوج وموافقات الأدوار وسجل تدقيق غير قابل للتلاعب.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1 pp-muted-text">
            <Sparkles className="w-4 h-4" style={{ color: "hsl(var(--ai-color))" }} />
            <span className="text-xs">مساعد AI مدمج</span>
          </div>
        </div>
      </div>

      <FlowArrow />

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="التقارير والذكاء" colorVar="--ai-color" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-10">
        {reportingOutputs.map((r) => (
          <div key={r.name} className="data-card flex items-center gap-3">
            <div className="p-2.5 rounded-lg shrink-0"
              style={{ background: "hsl(var(--ai-color) / 0.1)", border: "1px solid hsl(var(--ai-color) / 0.25)" }}>
              <r.icon className="w-5 h-5" style={{ color: "hsl(var(--ai-color))" }} />
            </div>
            <span className="text-sm font-semibold">{r.name}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1 bg-border" />
        <Pill label="طبقة الذكاء" colorVar="--persona-color" />
        <div className="h-px flex-1 bg-border" />
      </div>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div className="data-card flex items-start gap-4">
          <div className="p-3 rounded-lg shrink-0"
            style={{ background: "hsl(var(--ai-color) / 0.1)", border: "1px solid hsl(var(--ai-color) / 0.25)" }}>
            <Brain className="w-6 h-6" style={{ color: "hsl(var(--ai-color))" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">حزمة الذكاء الاصطناعي</h3>
            <p className="text-sm pp-muted-text">
              مساعد إقفال الفترة يصوغ القوائم والقيود؛ مساعد المدير المالي يُجيب بلغة طبيعية مع تعمّق.
            </p>
          </div>
        </div>
        <div className="data-card flex items-start gap-4">
          <div className="p-3 rounded-lg shrink-0"
            style={{ background: "hsl(var(--persona-color) / 0.1)", border: "1px solid hsl(var(--persona-color) / 0.25)" }}>
            <Bot className="w-6 h-6" style={{ color: "hsl(var(--persona-color))" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">تطبيقات الشخصيات</h3>
            <p className="text-sm pp-muted-text">
              مساحات عمل مقفلة بالدور للمدير المالي والمراقب و AP و AR والمدقق — مقنّعة وواعية بالاعتماد وجاهزة للتدقيق.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 pp-muted-text text-xs">
        <Layers className="w-3.5 h-3.5" />
        <span>كل طبقة مطابَقة · كل حدث قابل للتدقيق · كل دور بقناع مناسب</span>
      </div>
    </div>
  </section>
);

/* -------------------- Modules + Personas -------------------- */
const ModuleShowcaseAr = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="section-title mb-4">وحدات المنصّة</h2>
        <p className="section-subtitle mx-auto">
          كل وحدة تطبيق متكامل — يمكن نشرها مستقلة أو كحزمة موحَّدة.
        </p>
      </div>

      <div className="space-y-32">
        {modulesAr.map((mod, idx) => (
          <div key={mod.id} id={mod.id} className="scroll-mt-20">
            <div className={`flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-10 items-center mb-12`}>
              <div className="lg:w-3/5">
                <div className="module-card overflow-hidden">
                  <div className="p-1">
                    <img src={mod.image} alt={`لوحة ${mod.title}`} className="w-full rounded-lg" loading="lazy" />
                  </div>
                </div>
              </div>
              <div className="lg:w-2/5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{
                    background: `hsl(var(${mod.colorVar}) / 0.1)`,
                    color: `hsl(var(${mod.colorVar}))`,
                    border: `1px solid hsl(var(${mod.colorVar}) / 0.25)`,
                  }}>
                  {mod.subtitle}
                </div>
                <h3 className="text-3xl font-bold mb-4">{mod.title}</h3>
                <p className="pp-muted-text leading-relaxed mb-6">{mod.description}</p>
                <div className="flex items-center gap-2 text-sm pp-muted-text">
                  <span className="font-mono font-semibold text-foreground">+{mod.screens.length}</span> شاشة ·
                  <span className="font-mono font-semibold text-foreground">{mod.features.length}</span> مجال وظيفي
                </div>
              </div>
            </div>

            <ImpactCard metrics={mod.impact} colorVar={mod.colorVar} />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {mod.features.map((feat) => (
                <div key={feat.title} className="benefit-card group">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-md shrink-0" style={{ background: `hsl(var(${mod.colorVar}) / 0.1)` }}>
                      <feat.icon className="w-5 h-5" style={{ color: `hsl(var(${mod.colorVar}))` }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">{feat.title}</h4>
                      <p className="text-xs pp-muted-text leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-sm font-semibold uppercase tracking-wider pp-muted-text">معاينات شاشات حية</h4>
                <span className="text-xs pp-muted-text">انقر أي شاشة لفتحها مباشرة</span>
              </div>
              <ScreenPreviewGrid previews={mod.previewScreens} colorVar={mod.colorVar} />
            </div>

            <div className="data-card">
              <h4 className="text-sm font-semibold uppercase tracking-wider pp-muted-text mb-4">الشاشات المتاحة</h4>
              <div className="flex flex-wrap gap-2">
                {mod.screens.map((screen) => (
                  <span key={screen} className="px-3 py-1.5 rounded-md text-xs font-medium border pp-border" style={{ background: "hsl(220 22% 13% / 0.6)" }}>
                    {screen}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div id="personas" className="scroll-mt-20 mt-32">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4">حزمة تطبيقات الشخصيات</h2>
          <p className="section-subtitle mx-auto">
            مساحات عمل مصمَّمة للمدير المالي والمراقب وفِرَق AP و AR والمدققين — كل دور مقفل ومُقنَّع بشكل مناسب وموصول بنفس الأستاذ الواحد.
          </p>
        </div>

        <div className="mb-12">
          <div className="module-card overflow-hidden max-w-4xl mx-auto">
            <div className="p-1">
              <img src={personaAppsHeroImageAr} alt="تطبيقات الشخصيات عبر أدوار المالية" className="w-full rounded-lg" loading="lazy" />
            </div>
          </div>
        </div>

        <div className="space-y-16">
          {personaAppsAr.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-border" />
                <div className="px-4 py-1.5 rounded-full text-sm font-semibold"
                  style={{
                    background: `hsl(var(${group.colorVar}) / 0.1)`,
                    color: `hsl(var(${group.colorVar}))`,
                    border: `1px solid hsl(var(${group.colorVar}) / 0.25)`,
                  }}>
                  {group.category}
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>

              <ImpactCard metrics={group.impact} colorVar={group.colorVar} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {group.apps.map((app) => (
                  <div key={app.title} className="benefit-card group">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-md shrink-0" style={{ background: `hsl(var(${group.colorVar}) / 0.1)` }}>
                        <app.icon className="w-5 h-5" style={{ color: `hsl(var(${group.colorVar}))` }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{app.title}</h4>
                        <p className="text-xs pp-muted-text leading-relaxed">{app.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <h4 className="text-xs font-semibold uppercase tracking-wider pp-muted-text mb-4">شاشات الشخصيات الحية</h4>
                <ScreenPreviewGrid previews={group.previewScreens} colorVar={group.colorVar} />
              </div>

              <div className="data-card">
                <h4 className="text-sm font-semibold uppercase tracking-wider pp-muted-text mb-4">
                  الشاشات ({group.screens.length})
                </h4>
                <div className="flex flex-wrap gap-2">
                  {group.screens.map((screen) => (
                    <span key={screen} className="px-3 py-1.5 rounded-md text-xs font-medium border pp-border" style={{ background: "hsl(220 22% 13% / 0.6)" }}>
                      {screen}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* -------------------- Benefits -------------------- */
const benefitsAr: BenefitStatement[] = [
  { icon: Clock, title: "أقفل في أيام لا أسابيع", description: "قائمة AI مع قيود مُرحَّلة تلقائيًا تختصر الإقفال من أسبوعين إلى 3 أيام عمل.", colorVar: "--gl-color" },
  { icon: ShieldCheck, title: "جاهز للتدقيق كل فترة", description: "حزمة إقفال مُجهَّزة بالمرفقات والاعتمادات ومبررات AI — المدققون يعتمدون لا يستجوبون.", colorVar: "--gl-color" },
  { icon: Eye, title: "تعمّق 100%", description: "كل مؤشر وكل سطر في ميزان المراجعة يصل إلى قيده المصدر بنقرة.", colorVar: "--sub-color" },
  { icon: Layers, title: "ست أستاذة فرعية مطابَقة", description: "AP و AR والمخزون والتخفيضات والأصول والضرائب تتطابق مع الأستاذ — الإقفال يُمنع حتى تتطابق.", colorVar: "--sub-color" },
  { icon: Lock, title: "وصول وتقنيع بالأدوار", description: "اعتمادات CFO/Controller، حلّ الاستثناءات لـ AP فقط، وتقنيع تلقائي للأدوار غير المالية.", colorVar: "--persona-color" },
  { icon: BarChart3, title: "تحليلات بمستوى المدير المالي", description: "عائد التخفيضات، أعمار AP، ميزان المراجعة وتغذية الشذوذ — حية لا مُصدَّرة.", colorVar: "--ai-color" },
  { icon: Zap, title: "ذكاء اصطناعي في كل مكان", description: "مساعد الإقفال، الرؤى التحاورية، المطابقة الذكية وكشف الشذوذ في منصة واحدة.", colorVar: "--ai-color" },
  { icon: CheckCircle2, title: "سجل تدقيق مقاوم للتلاعب", description: "كل ترحيل وتعديل وعكس واعتماد واقتراح AI مع الفاعل والوقت والمبرّر.", colorVar: "--gl-color" },
  { icon: TrendingUp, title: "دقة احتياطي التخفيض", description: "تعديلات يومية مدفوعة بـ PriceAI تُلغي تشوّهات الهامش.", colorVar: "--ai-color" },
  { icon: Globe, title: "متعدد الكيانات والعملات", description: "استبعادات بين الشركات، إعادة تقييم العملة، وتوحيد عبر الكيانات القانونية.", colorVar: "--sub-color" },
];

const BenefitsAr = () => (
  <section id="benefits" className="py-16 sm:py-24 px-4 sm:px-6 relative scroll-mt-20">
    <div className="absolute inset-0 pp-hero-gradient opacity-50" />
    <div className="relative max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="section-title mb-4">
          لماذا <span className="pp-gradient-text">CORTA للمحاسبة</span>؟
        </h2>
        <p className="section-subtitle mx-auto">أثر قابل للقياس على جدول إقفالك ووضعك التدقيقي من اليوم الأول.</p>
      </div>
      <BenefitImpactCard items={benefitsAr} />
    </div>
  </section>
);

/* -------------------- Standards -------------------- */
const standardsAr = [
  { name: "US GAAP", desc: "مبادئ المحاسبة الأمريكية" },
  { name: "IFRS", desc: "المعايير الدولية للتقارير المالية" },
  { name: "SOX 404", desc: "ضوابط داخلية على التقارير" },
  { name: "ASC 606", desc: "الاعتراف بالإيراد" },
  { name: "ASC 842", desc: "محاسبة الإيجارات" },
  { name: "ASC 326", desc: "خسائر الائتمان (CECL)" },
  { name: "IFRS 16", desc: "التزامات الإيجار" },
  { name: "PCAOB", desc: "معايير تدقيق الشركات العامة" },
  { name: "SOC 1 / 2", desc: "ضوابط مزوّدي الخدمة" },
  { name: "ISO 27001", desc: "إدارة أمن المعلومات" },
];

const StandardsAr = () => (
  <section id="standards" className="py-16 sm:py-24 px-4 sm:px-6 border-t pp-border scroll-mt-20">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="section-title mb-4">التوافق مع المعايير</h2>
        <p className="section-subtitle mx-auto">
          مبني ليلبّي ما يتوقّعه مديرك المالي ومراقبك ومدققك الخارجي.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {standardsAr.map((std) => (
          <div key={std.name} className="data-card text-center">
            <div className="font-mono font-bold pp-gradient-text text-lg mb-1">{std.name}</div>
            <div className="text-xs pp-muted-text">{std.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* -------------------- Footer -------------------- */
const FooterAr = () => (
  <footer id="footer" className="py-12 sm:py-16 px-4 sm:px-6 border-t pp-border scroll-mt-20">
    <div className="max-w-6xl mx-auto text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <img src={cortaLogo} alt="شعار CORTA" className="h-10 w-auto" loading="lazy" />
        <span className="font-bold text-2xl tracking-tight">CORTA للمحاسبة</span>
      </div>
      <p className="pp-muted-text max-w-lg mx-auto mb-8">
        محرّك مالي ذكي للتجزئة والتصنيع — من حدث نقطة البيع إلى توقيع المدير المالي، كل ريال محسوب وكل قيد مُفسَّر.
      </p>
      <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6 text-sm pp-muted-text mb-10">
        <span>محرّك الأستاذ</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>الأستاذة الفرعية</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>حزمة AI</span>
        <span className="w-1 h-1 rounded-full bg-white/20" />
        <span>تطبيقات الشخصيات</span>
      </div>
      <a href="https://cortanexai.com" target="_blank" rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border pp-border backdrop-blur-sm hover-scale"
        style={{ background: "hsl(var(--gl-color) / 0.08)" }}>
        <Sparkles className="w-4 h-4 animate-pulse" style={{ color: "hsl(var(--gl-color))" }} />
        <span className="text-sm font-medium pp-muted-text">
          مدعوم من <span className="pp-gradient-text font-semibold tracking-tight">CortaneX AI</span>
        </span>
      </a>
      <div className="mt-8 text-xs pp-muted-text/60">
        © 2026 CORTA للمحاسبة. جميع الحقوق محفوظة.
      </div>
    </div>
  </footer>
);

/* -------------------- Page -------------------- */
const LandingAr = () => {
  useEffect(() => {
    const prevDir = document.documentElement.getAttribute("dir");
    const prevLang = document.documentElement.getAttribute("lang");
    const prevTitle = document.title;
    document.documentElement.setAttribute("dir", "rtl");
    document.documentElement.setAttribute("lang", "ar");
    document.title = "CORTA للمحاسبة — أقفل أسرع. قرّر أذكى.";
    return () => {
      document.documentElement.setAttribute("dir", prevDir ?? "ltr");
      document.documentElement.setAttribute("lang", prevLang ?? "en");
      document.title = prevTitle;
    };
  }, []);

  return (
    <div dir="rtl" lang="ar" className="pp-dark min-h-screen text-foreground">
      <NavigationAr />
      <HeroAr />
      <ArchitectureAr />
      <ModuleShowcaseAr />
      <BenefitsAr />
      <StandardsAr />
      <FooterAr />
    </div>
  );
};

export default LandingAr;
