import {
  BookOpen, FileText, ShieldCheck, Calculator, Activity, Layers, Database, ScrollText,
  Receipt, CreditCard, Boxes, Tag, Building2, Percent, FileBarChart2, Truck, Banknote, Coins,
  Bot, Sparkles, Brain, Wand2, FileSearch, TrendingUp, MessageSquare, History,
  TrendingDown, DollarSign, Clock, Target,
  Briefcase, UserCheck, Search, Eye, Bell, ClipboardCheck, Lock, BarChart3,
} from "lucide-react";
import type { ElementType } from "react";

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

export const modulesAr: ModuleData[] = [
  {
    id: "gl",
    title: "محرّك الأستاذ العام",
    subtitle: "الأستاذ العام وإقفال الفترة",
    description:
      "أستاذ عام بالقيد المزدوج، مع قيود تُرحَّل تلقائيًا من كل نظام متصل، ومساعد ذكاء اصطناعي للإقفال الشهري، وموافقات مبنية على الأدوار، وسجل تدقيق غير قابل للتلاعب. أقفل دفاترك في أيام لا أسابيع — مع حزمة الأدلة جاهزة لمراجعك.",
    image: shotPeriodClose,
    colorVar: "--gl-color",
    impact: [
      { icon: Clock, metric: "↓ 70%", label: "إقفال شهري أسرع", description: "قائمة مرجعية يصوغها الذكاء الاصطناعي مع قيود تُرحَّل تلقائيًا تختصر الإقفال من أسبوعين إلى 3 أيام عمل." },
      { icon: Target, metric: "100%", label: "أستاذة فرعية مطابَقة", description: "لا يُغلق إقفال الفترة حتى تتطابق كل الأستاذة الفرعية — لا مفاجآت في اللحظات الأخيرة." },
      { icon: ShieldCheck, metric: "↑ 90%", label: "نسبة اجتياز التدقيق", description: "حِزَم إقفال جاهزة مع المرفقات والموافقات والمبررات تجعل التدقيق إجراءً شكليًا." },
      { icon: TrendingDown, metric: "↓ 80%", label: "قيود يدوية", description: "الاستحقاقات الدورية والإهلاك وتعديلات التخفيضات تُرحَّل تلقائيًا بمبررات جاهزة للتدقيق." },
    ],
    features: [
      { icon: BookOpen, title: "دليل الحسابات", desc: "دليل حسابات متعدد الكيانات والعملات بتجميعات هرمية وقواعد مطابقة وسجل إصدارات. يدعم US GAAP وIFRS والتوطين المحلي." },
      { icon: FileText, title: "القيود اليومية", desc: "قيود مُرحَّلة تلقائيًا من نقاط البيع والذمم والمخزون والتخفيضات، وقيود يدوية بالمرفقات وسجل تعديل سطر-بسطر، ومسار عكس كامل." },
      { icon: ShieldCheck, title: "مسارات الموافقة", desc: "ترحيل وموافقة قائمة على الدور، موافقات المدير المالي والمراقب، فصل المهام، وسجل تدقيق لكل تغيير حالة." },
      { icon: Calculator, title: "قائمة إقفال الفترة", desc: "قائمة مرجعية حية تمنع الإقفال حتى تتطابق الأستاذة الفرعية وتُرحَّل المسوّدات وتُعتمد القيود اليدوية ويوقّع المدير المالي." },
      { icon: Activity, title: "ميزان المراجعة والقوائم المالية", desc: "ميزان مراجعة وقائمة دخل وميزانية وتدفقات نقدية لحظية — قابلة للتعمّق من أي بند إلى مصدره بنقرة واحدة." },
      { icon: Layers, title: "بين الشركات والاستبعادات", desc: "قيود بين الشركات تُولَّد تلقائيًا مع استبعادات وتوحيد عبر الكيانات القانونية وعملات التقرير." },
      { icon: Database, title: "سجل التدقيق", desc: "سجل أحداث غير قابل للتلاعب لكل ترحيل وتعديل وعكس وموافقة واقتراح من الذكاء الاصطناعي — مع المنفّذ والوقت والمبرّر." },
      { icon: ScrollText, title: "تصدير حزمة الإقفال", desc: "حزمة إقفال PDF و Excel بضغطة واحدة: ميزان المراجعة والقيود والمطابقات وسجل التدقيق وحالة القائمة المرجعية." },
      { icon: History, title: "الإصدارات والعكسيات", desc: "العكس أو التعديل قبل الاعتماد فقط. كل عكس يحمل رقم القيد الأصلي والسبب والمستخدم الذي بدأه." },
      { icon: Bell, title: "التنبيهات والتذكيرات", desc: "تنبيهات للمعتمِدين وتحذيرات للمعوّقات وملخصات يومية حتى لا يتعثّر الإقفال لأن أحدًا نسي الاعتماد." },
    ],
    screens: [
      "لوحة المالية", "دليل الحسابات", "القيود اليومية", "قيد يدوي", "تفاصيل القيد",
      "إقفال الفترة", "قائمة الإقفال", "طابور الموافقات", "سجل التدقيق", "ميزان المراجعة",
      "قائمة الدخل", "الميزانية العمومية", "التدفقات النقدية", "تصدير حزمة الإقفال", "بين الشركات",
      "العكسيات", "الجداول الدورية", "التعمّق في الأستاذ", "تقارير القيود", "التنبيهات",
    ],
    previewScreens: [
      { id: "gl-period-close", title: "إقفال الفترة — مايو 2026", caption: "قائمة مرجعية حية بـ 4 بنود معلّقة، مع تعمّق وتصدير PDF/Excel بنقرة.", image: shotPeriodClose, route: "/period-close", role: "مراقب" },
      { id: "gl-journal-entries", title: "تدفق القيود اليومية", caption: "قيود مُرحَّلة تلقائيًا من CoreERP و ExpirySmart و PriceAI و SmartPOS — كل سطر يحمل سجل تدقيق.", image: shotJournalEntries, route: "/journal-entries", role: "أستاذ عام" },
      { id: "gl-chart-of-accounts", title: "دليل الحسابات", caption: "دليل متعدد الأبعاد عبر الشركة · القسم · المتجر · فئة المنتج مع أرصدة لحظية.", image: shotChartOfAccounts, route: "/chart-of-accounts", role: "مراقب" },
    ],
  },
  {
    id: "subledgers",
    title: "الأستاذة الفرعية",
    subtitle: "الذمم الدائنة / المدينة / المخزون / التخفيضات / الأصول الثابتة / الضرائب",
    description:
      "ست أستاذة فرعية مطابَقة بالكامل تُغذّي الأستاذ العام لحظيًا. مطابقة ثلاثية للذمم الدائنة بطابور استثناءات، أعمار الذمم المدينة والتحصيل، تقييم مخزون مرتبط بـ ExpirySmart، تعديلات احتياطي التخفيض، جداول إهلاك الأصول، وإدارة ضرائب لكل ولاية.",
    image: shotAccountsPayable,
    colorVar: "--sub-color",
    impact: [
      { icon: Target, metric: "↑ 92%", label: "فواتير مطابَقة آليًا", description: "مطابقة ثلاثية بالتعلّم الآلي بين أوامر الشراء والاستلام والفواتير — فقط الاستثناءات الحقيقية تصل للطابور." },
      { icon: Clock, metric: "↓ 60%", label: "أيام التحصيل (DSO)", description: "مسارات مطالبة آلية وتحليل أعمار وتطبيق نقدي ذكي يُقلّصان DSO ويحرّران رأس المال العامل." },
      { icon: TrendingDown, metric: "↓ 45%", label: "فروقات المخزون", description: "تطابق لحظي بين الحساب 1200 وتقييم دفعات ExpirySmart يكشف الهالك والإتلاف غير المُرحَّل فورًا." },
      { icon: DollarSign, metric: "↓ 25%", label: "تسرّب التخفيضات", description: "تعديلات احتياطي التخفيض المدفوعة بـ PriceAI وضوابط الترحيل تُلغي التشوّهات في الهامش." },
    ],
    features: [
      { icon: Receipt, title: "الذمم الدائنة", desc: "ملف الموردين، استلام الفواتير، جدولة المدفوعات، وتوجيه الاعتماد المرتبط بحدود الإنفاق وفصل المهام." },
      { icon: CreditCard, title: "استثناءات المطابقة الثلاثية", desc: "طابور استثناءات حي مع رموز الأسباب (سعر، كمية، استلام مفقود) وضبط التسامح، وحلول حصرية لدور AP." },
      { icon: FileBarChart2, title: "الذمم المدينة", desc: "ملف العملاء، الفوترة، شرائح الأعمار، المطالبة الآلية، مسارات تحصيل حصرية لمدير AR، والتطبيق النقدي." },
      { icon: Boxes, title: "محاسبة المخزون", desc: "تقييم على مستوى الدفعة مرتبط بأحداث ExpirySmart، قيود إتلاف تلقائية، تكلفة FIFO/متوسط مرجّح، وتسوية الهالك." },
      { icon: Tag, title: "دورة حياة التخفيضات", desc: "إنشاء الاحتياطي، تعديل يومي وفق خطط PriceAI، ترحيل مصروف التخفيض وتعديلات احتياطي المخزون." },
      { icon: Building2, title: "الأصول الثابتة", desc: "سجل أصول بجداول العمر الإنتاجي، إهلاك شهري، مسارات إتلاف وانخفاض قيمة، ورسملة الأعمال تحت التنفيذ." },
      { icon: Percent, title: "إدارة الضرائب", desc: "تسوية ضريبة مستحقة لكل ولاية، استحقاق ضريبة المبيعات، وسجل تدقيق لكل معاملة خاضعة للضريبة." },
      { icon: Truck, title: "ملفات الموردين والعملاء", desc: "مصدر حقيقة وحيد متزامن مع CoreERP يحمل شروط الائتمان والبنوك والأرقام الضريبية وعلامات المخاطر." },
      { icon: Banknote, title: "المدفوعات والنقد", desc: "مدفوعات موردين مجدولة، اعتمادات تشغيل الدفع، تسوية بنكية مع الحساب 1000، ومسار النقد غير المُطبَّق." },
      { icon: Coins, title: "الاستحقاقات الدورية", desc: "إيجارات ومرافق وتأمين ومصروفات دورية تُرحَّل وفق الجدول مع المبرّر في سجل التدقيق." },
    ],
    screens: [
      "الذمم الدائنة", "تفاصيل فاتورة", "طابور المطابقة الثلاثية", "تفاصيل استثناء", "ملف المورد",
      "الذمم المدينة", "أعمار الذمم", "ملف العميل", "التطبيق النقدي",
      "محاسبة المخزون", "تقييم المخزون", "أحداث الإتلاف",
      "دورة التخفيضات", "احتياطي التخفيض", "عرض المدير المالي للتخفيضات",
      "الأصول الثابتة", "تفاصيل أصل", "جدول الإهلاك",
      "إدارة الضرائب", "تسوية الضريبة",
    ],
    previewScreens: [
      { id: "sub-ap", title: "الذمم الدائنة", caption: "من الشراء إلى الدفع مع مطابقة ثلاثية تلقائية وأعلام انحراف ومقترحات دفع وخصومات موردين.", image: shotAccountsPayable, route: "/accounts-payable", role: "مدير AP" },
      { id: "sub-3wm", title: "استثناءات المطابقة الثلاثية", caption: "استثناءات موجَّهة برموز الأسباب وضبط التسامح — دور AP فقط مع سجل تدقيق كامل.", image: shotThreeWayMatch, route: "/three-way-match", role: "AP" },
      { id: "sub-ar", title: "الذمم المدينة", caption: "أعمار B2B وطابور المطالبة والتطبيق النقدي — صلاحيات الشطب والتحصيل لمدير AR فقط.", image: shotAccountsReceivable, route: "/accounts-receivable", role: "مدير AR" },
    ],
  },
  {
    id: "ai",
    title: "حزمة الذكاء الاصطناعي",
    subtitle: "مساعد إقفال الفترة · رؤى المدير المالي التحاورية",
    description:
      "ذكاء اصطناعي مدمج في كل طبقة من الإقفال. مساعد الإقفال يصوغ القائمة المرجعية ويقترح قيودًا متوازنة بمبررات جاهزة للتدقيق. مساعد رؤى المدير المالي يُجيب بلغة طبيعية ويأخذك مباشرة إلى الصفوف المصدر.",
    image: shotCloseCopilot,
    colorVar: "--ai-color",
    impact: [
      { icon: Brain, metric: "≥ 90%", label: "دقة مسوّدات الذكاء الاصطناعي", description: "القيود المقترحة تأتي بدرجات ثقة ومراجع مصدر — معظمها يُرحَّل من المراجعة الأولى." },
      { icon: Clock, metric: "↓ 85%", label: "وقت الوصول للرؤية", description: "اسأل بلغة طبيعية بدل سحب التقارير — تأتي الإجابات في ثوانٍ بروابط تعمّق." },
      { icon: ShieldCheck, metric: "100%", label: "ذكاء قابل للتدقيق", description: "كل اقتراح يحمل المبرّر والمصدر ودرجة الثقة وحدثًا غير قابل للتلاعب في سجل التدقيق." },
      { icon: Eye, metric: "24/7", label: "كشف الشذوذ", description: "تعلّم مستمر عبر أنماط القيود والموردين وقفزات التخفيض يكشف الاحتيال والأخطاء والتكرار فورًا." },
    ],
    features: [
      { icon: Sparkles, title: "مساعد إقفال الفترة", desc: "صياغة القائمة المرجعية بنقرة مع قيود مقترحة (إهلاك، استحقاقات، تعديلات تخفيضات) بدرجات ثقة ومراجع." },
      { icon: Bot, title: "مساعد رؤى المدير المالي", desc: "محادثة بلغة طبيعية فوق الأستاذ الحي. كل إجابة تستشهد بالقيود والتخفيضات والمطابقات — تعمّق بنقرة." },
      { icon: Wand2, title: "مطابقة ثلاثية ذكية", desc: "تعلّم آلي يطابق POs و GRNs والفواتير عبر الاختلافات ويوجّه الاستثناءات الحقيقية فقط." },
      { icon: FileSearch, title: "كشف الشذوذ", desc: "مراقبة مستمرة لأنماط القيود وسلوك الموردين وقفزات التخفيض وإشارات الاحتيال." },
      { icon: TrendingUp, title: "تنبؤ عائد التخفيضات", desc: "يتنبأ بالرفع مقابل الهالك لكل SKU/متجر، ويوصي بمنحنيات الخصم المثلى ويُرحِّل الأثر تلقائيًا." },
      { icon: MessageSquare, title: "تفسيرات جاهزة للتدقيق", desc: "كل إجراء AI يصدر مبررًا واضحًا ومصادر وفاعل ووقت في سجل التدقيق." },
      { icon: History, title: "خط زمني للمساعد", desc: "خط زمني لكل توليد واعتماد وإلغاء وترحيل — قابل للتصدير ضمن حزمة الإقفال." },
      { icon: Brain, title: "اقتراحات بدرجات ثقة", desc: "كل اقتراح يُظهر نسبة ثقة ومصدرًا، والاعتماد بنقرة للعالية الثقة." },
    ],
    screens: [
      "مساعد الرؤى", "مساعد إقفال الفترة", "سجل المساعد",
      "القيود المقترحة", "صندوق الشذوذ", "تنبؤ عائد التخفيض",
      "طابور المطابقة الذكي", "درجات الثقة", "تفسيرات AI",
      "تعمّق المدير المالي", "روابط مصدر تحاورية", "حالة المساعد",
    ],
    previewScreens: [
      { id: "ai-copilot", title: "مساعد إقفال الفترة", caption: "قائمة مرجعية وقيود مقترحة بدرجات ثقة ومبررات — راجع، اعتمد، رحِّل.", image: shotCloseCopilot, route: "/close-copilot", role: "مدير مالي" },
      { id: "ai-assistant", title: "مساعد رؤى المدير المالي", caption: "محادثة بلغة طبيعية فوق الأستاذ الحي. كل إجابة باستشهادات.", image: shotAiAssistant, route: "/ai-assistant", role: "مدير مالي" },
      { id: "ai-markdowns", title: "أداء التخفيضات بالذكاء الاصطناعي", caption: "تحليلات استرداد وتفادي الهدر وصافي المكسب مع تعديلات يومية تُرحَّل للأستاذ.", image: shotCfoMarkdowns, route: "/cfo-markdowns", role: "مدير مالي" },
    ],
  },
];

export const personaAppsAr: PersonaAppGroup[] = [
  {
    category: "تطبيقات قيادة المالية",
    colorVar: "--gl-color",
    impact: [
      { icon: Clock, metric: "↓ 75%", label: "وقت في التقارير", description: "المدراء الماليون والمراقبون يسألون المساعد بدل سحب التقارير — كل إجابة برابط تعمّق." },
      { icon: ShieldCheck, metric: "100%", label: "تغطية المعتمدين", description: "تنبيهات ولوحة حالة تستدعي المعتمد المناسب لحظة ظهور بند معوِّق." },
    ],
    apps: [
      { icon: Briefcase, title: "PA1: مساحة عمل المدير المالي", desc: "لوحة مالية حية بمؤشرات مقنّعة/مكشوفة، حالة إقفال الفترة، رؤى AI، تعمّق، وتصدير حزمة الإقفال بنقرة." },
      { icon: ClipboardCheck, title: "PA2: مكتب المراقب المالي", desc: "طابور اعتماد القيود اليدوية، مطابقات، قائمة معوّقات، مدير الجداول الدورية، وسطح مراجعة المساعد." },
      { icon: Bell, title: "PA3: تنبيهات المعتمدين", desc: "تنبيهات بريدية وداخلية فور ظهور المعوّقات: مسوّدات غير مُرحَّلة، قيود قيد الاعتماد، اختلال أستاذ فرعي، توقيع معلّق." },
    ],
    screens: [
      "PA1: لوحة المدير المالي", "PA1: محادثة الرؤى", "PA1: تصدير حزمة الإقفال",
      "PA2: طابور الاعتماد", "PA2: مطابقات", "PA2: الجداول الدورية",
      "PA3: مركز التنبيهات", "PA3: تنبيهات المعوّقات",
    ],
    previewScreens: [
      { id: "pa-cfo", title: "PA1 · مساحة المدير المالي", caption: "لوحة مالية بشريط الدور والمؤشرات المقنّعة وحالة الإقفال ورؤى AI.", image: shotCfoDashboard, route: "/app", role: "مدير مالي" },
      { id: "pa-controller", title: "PA2 · مكتب المراقب", caption: "معوّقات الإقفال وطابور الاعتماد والجداول الدورية — للمراقب فقط.", image: shotPeriodClose, route: "/period-close", role: "مراقب" },
      { id: "pa-insights", title: "PA1 · محادثة الرؤى", caption: "تعمّق تحاوري في القيود والتخفيضات والمطابقات مع استشهادات.", image: shotAiAssistant, route: "/ai-assistant", role: "مدير مالي" },
    ],
  },
  {
    category: "تطبيقات مشغّلي الأستاذة الفرعية",
    colorVar: "--sub-color",
    impact: [
      { icon: TrendingDown, metric: "↓ 60%", label: "زمن دورة الاستثناء", description: "فِرَق AP و AR يحلّون الاستثناءات في دقائق بفضل رموز أسباب مُملأة سلفًا واعتماد بنقرة." },
      { icon: Target, metric: "↑ 95%", label: "حلّ من المراجعة الأولى", description: "مطابقات بدرجات ثقة وأدلة مُرفقة سلفًا تُمكّن المشغّل من الإغلاق من المراجعة الأولى." },
    ],
    apps: [
      { icon: CreditCard, title: "PA4: مدير AP", desc: "طابور الاستثناءات بأسباب وتجاوزات تسامح (لمدير AP فقط)، اعتمادات تشغيل الدفع، وعلامات مخاطر الموردين." },
      { icon: Receipt, title: "PA5: محاسب AP", desc: "استلام الفواتير، مطابقة سطر، التقاط مرفقات، وصلاحية حلّ فقط للاستثناءات. لا يعتمد المدفوعات." },
      { icon: FileBarChart2, title: "PA6: مدير AR", desc: "لوحة الأعمار، مسار المطالبة، مساعد التطبيق النقدي، وإجراءات تحصيل وشطب لمدير AR فقط." },
    ],
    screens: [
      "PA4: طابور استثناءات AP", "PA4: تجاوز التسامح", "PA4: اعتماد دفع",
      "PA5: استلام فاتورة", "PA5: مطابقة سطر",
      "PA6: أعمار AR", "PA6: طابور المطالبة", "PA6: التطبيق النقدي",
    ],
    previewScreens: [
      { id: "pa-ap-mgr", title: "PA4 · مدير AP", caption: "طابور استثناءات بأسباب وتجاوزات واعتماد دفع — لـ AP فقط.", image: shotThreeWayMatch, route: "/three-way-match", role: "مدير AP" },
      { id: "pa-ap-clerk", title: "PA5 · محاسب AP", caption: "استلام فواتير ومطابقة سطر مع قراءة فقط لاعتمادات الدفع.", image: shotAccountsPayable, route: "/accounts-payable", role: "محاسب AP" },
      { id: "pa-ar-mgr", title: "PA6 · مدير AR", caption: "أعمار ومطالبة وتطبيق نقدي — شطب وتحصيل لمدير AR.", image: shotAccountsReceivable, route: "/accounts-receivable", role: "مدير AR" },
    ],
  },
  {
    category: "تطبيقات التدقيق والقراءة",
    colorVar: "--persona-color",
    impact: [
      { icon: Lock, metric: "100%", label: "تغطية إخفاء البيانات", description: "الأدوار غير CFO/Controller ترى مبالغ مُقنَّعة مع مؤشر واضح لما هو مخفي ولماذا." },
      { icon: BarChart3, metric: "≤ 5 دقائق", label: "سحب الأدلة", description: "المدققون يسحبون حزمة إقفال كاملة في أقل من خمس دقائق." },
    ],
    apps: [
      { icon: UserCheck, title: "PA7: مدقق قراءة فقط", desc: "تصفّح القيود المُرحَّلة والمرفقات وسجل التدقيق غير القابل للتلاعب. تصدير فقط — لا ترحيل ولا تعديل." },
      { icon: Search, title: "PA8: عرض التحقيق", desc: "تعمّق من أي شذوذ مكتشف بـ AI إلى القيود الداعمة والأحداث المصدر وخط الفاعلين." },
      { icon: Eye, title: "PA9: عرض العمليات المقنّع", desc: "عرض تشغيلي مع تقنيع المبالغ الحساسة وشريط واضح ومسار تصعيد لطلب الكشف." },
    ],
    screens: [
      "PA7: سجل التدقيق", "PA7: متصفّح القيود", "PA7: تنزيل حزمة الإقفال",
      "PA8: تعمّق الشذوذ", "PA8: خط الفاعلين",
      "PA9: مؤشرات مقنّعة", "PA9: إشعار التقنيع", "PA9: طلب تصعيد",
    ],
    previewScreens: [
      { id: "pa-auditor", title: "PA7 · مدقق قراءة فقط", caption: "تصفّح القيود والمرفقات وسجل التدقيق — تصدير فقط.", image: shotJournalEntries, route: "/journal-entries", role: "مدقق" },
      { id: "pa-investigation", title: "PA8 · عرض التحقيق", caption: "تعمّق من شذوذ AI إلى القيود الداعمة وخط الفاعلين.", image: shotChartOfAccounts, route: "/chart-of-accounts", role: "مدقق" },
      { id: "pa-masked", title: "PA9 · عرض مقنّع", caption: "عرض تشغيلي بمبالغ مُقنَّعة ومسار تصعيد للكشف.", image: shotCfoMarkdowns, route: "/cfo-markdowns", role: "قراءة فقط" },
    ],
  },
];

export const personaAppsHeroImageAr = shotCfoDashboard;
