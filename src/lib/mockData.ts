// Shared mock data + types for the CoreAccounting demo system.
// In production, all numbers are produced by event ingestion from
// CoreERP / ExpirySmart / PriceAI / SmartPOS via the integration contracts.

export type AccountType = "Asset" | "Liability" | "Equity" | "Revenue" | "Expense" | "Contra-Asset" | "Contra-Revenue";
export interface ChartAccount {
  code: string;
  name: string;
  type: AccountType;
  normal: "Debit" | "Credit";
  balance: number;
  purpose?: string;
}

export const chartOfAccounts: ChartAccount[] = [
  { code: "1000", name: "Cash & Equivalents", type: "Asset", normal: "Debit", balance: 1_245_300 },
  { code: "1100", name: "Accounts Receivable", type: "Asset", normal: "Debit", balance: 312_840 },
  { code: "1200", name: "Inventory - Finished Goods", type: "Asset", normal: "Debit", balance: 475_230, purpose: "Saleable stock from ExpirySmart" },
  { code: "1210", name: "Inventory Reserve for Markdown", type: "Contra-Asset", normal: "Credit", balance: -2_450, purpose: "NRV reserve from PriceAI plans" },
  { code: "1220", name: "Inventory Expired/Obsolete Reserve", type: "Contra-Asset", normal: "Credit", balance: -8_120, purpose: "Pending physical disposal" },
  { code: "1500", name: "Fixed Assets - Equipment", type: "Asset", normal: "Debit", balance: 890_000 },
  { code: "1510", name: "Accumulated Depreciation", type: "Contra-Asset", normal: "Credit", balance: -180_400 },
  { code: "2300", name: "Accounts Payable", type: "Liability", normal: "Credit", balance: -218_600 },
  { code: "2310", name: "AP Accrued (GR/IR)", type: "Liability", normal: "Credit", balance: -42_300 },
  { code: "2400", name: "Sales Tax Payable", type: "Liability", normal: "Credit", balance: -38_200 },
  { code: "3000", name: "Retained Earnings", type: "Equity", normal: "Credit", balance: -1_640_000 },
  { code: "4100", name: "Sales Revenue", type: "Revenue", normal: "Credit", balance: -2_980_400 },
  { code: "4110", name: "Sales Discounts (Markdowns)", type: "Contra-Revenue", normal: "Debit", balance: 88_990 },
  { code: "5100", name: "Cost of Goods Sold", type: "Expense", normal: "Debit", balance: 1_780_550 },
  { code: "5200", name: "Markdown Expense", type: "Expense", normal: "Debit", balance: 23_450.99 },
  { code: "5210", name: "Inventory Waste/Shrinkage Expense", type: "Expense", normal: "Debit", balance: 14_230 },
  { code: "5220", name: "Inventory Write-Off Expense", type: "Expense", normal: "Debit", balance: 4_900 },
];

export interface JournalLine { account: string; accountName: string; debit: number; credit: number }
export interface JournalEntry {
  id: string;
  date: string;
  source: "CoreERP" | "ExpirySmart" | "PriceAI" | "SmartPOS" | "Manual";
  reference: string;
  description: string;
  status: "DRAFT" | "POSTED" | "REVERSED";
  postedBy: string;
  lines: JournalLine[];
}

export const journalEntries: JournalEntry[] = [
  {
    id: "JE-20260506-00001", date: "2026-05-06T11:00:00Z", source: "CoreERP",
    reference: "GR-20260506-00001 / PO-2026-05001", description: "Goods Received — DairyCo (MILK-001 x500)",
    status: "POSTED", postedBy: "system",
    lines: [
      { account: "1200", accountName: "Inventory - Finished Goods", debit: 750.00, credit: 0 },
      { account: "2310", accountName: "AP Accrued (GR/IR)", debit: 0, credit: 750.00 },
    ],
  },
  {
    id: "JE-20260506-00002", date: "2026-05-06T09:00:00Z", source: "ExpirySmart",
    reference: "WO-20260506-001 / BATCH-001", description: "Disposal confirmed — MILK-001 batch B20260420 (25 units)",
    status: "POSTED", postedBy: "warehouse.op1@retailco.com",
    lines: [
      { account: "1210", accountName: "Inventory Reserve for Markdown", debit: 12.50, credit: 0 },
      { account: "5210", accountName: "Inventory Waste Expense", debit: 25.00, credit: 0 },
      { account: "1200", accountName: "Inventory - Finished Goods", debit: 0, credit: 37.50 },
    ],
  },
  {
    id: "JE-20260506-00003", date: "2026-05-06T13:30:00Z", source: "PriceAI",
    reference: "MD-2026-0431", description: "Markdown plan activated — BREAD-02 (30% reduction, 980 units)",
    status: "POSTED", postedBy: "system",
    lines: [
      { account: "5200", accountName: "Markdown Expense", debit: 882.00, credit: 0 },
      { account: "1210", accountName: "Inventory Reserve for Markdown", debit: 0, credit: 882.00 },
    ],
  },
  {
    id: "JE-20260506-00004", date: "2026-05-06T15:00:00Z", source: "SmartPOS",
    reference: "POS-BATCH-20260506-15", description: "POS sales batch — Store 014 (15-min interval)",
    status: "POSTED", postedBy: "system",
    lines: [
      { account: "1000", accountName: "Cash", debit: 14_320.50, credit: 0 },
      { account: "5100", accountName: "Cost of Goods Sold", debit: 8_910.00, credit: 0 },
      { account: "4110", accountName: "Sales Discounts (Markdowns)", debit: 1_640.00, credit: 0 },
      { account: "1200", accountName: "Inventory - Finished Goods", debit: 0, credit: 8_910.00 },
      { account: "4100", accountName: "Sales Revenue", debit: 0, credit: 14_320.50 },
      { account: "2400", accountName: "Sales Tax Payable", debit: 0, credit: 1_640.00 },
    ],
  },
  {
    id: "JE-20260506-00005", date: "2026-05-06T16:10:00Z", source: "Manual",
    reference: "ADJ-MAY-001", description: "Month-end accrual — utilities estimate",
    status: "DRAFT", postedBy: "controller@retailco.com",
    lines: [
      { account: "5210", accountName: "Inventory Waste Expense", debit: 1_200, credit: 0 },
      { account: "2300", accountName: "Accounts Payable", debit: 0, credit: 1_200 },
    ],
  },
];

export interface APInvoice {
  id: string; supplier: string; po: string; receipt: string;
  invoiceTotal: number; expectedTotal: number; variance: number; tolerance: number;
  status: "MATCHED" | "EXCEPTION" | "PAID" | "ON_HOLD";
  dueDate: string; terms: string;
  lines: { sku: string; poQty: number; rcvdQty: number; invQty: number; poPrice: number; invPrice: number }[];
}
export const apInvoices: APInvoice[] = [
  {
    id: "INV-20260506-003", supplier: "DairyCo Ltd.", po: "PO-2026-05001", receipt: "GR-20260506-00001",
    invoiceTotal: 780.00, expectedTotal: 750.00, variance: 30.00, tolerance: 0.02,
    status: "EXCEPTION", dueDate: "2026-06-05", terms: "2% 10, Net 30",
    lines: [{ sku: "MILK-001", poQty: 500, rcvdQty: 500, invQty: 500, poPrice: 1.50, invPrice: 1.56 }],
  },
  {
    id: "INV-20260504-018", supplier: "FreshBake Co.", po: "PO-2026-04982", receipt: "GR-20260504-00012",
    invoiceTotal: 2_940.00, expectedTotal: 2_940.00, variance: 0, tolerance: 0.02,
    status: "MATCHED", dueDate: "2026-06-03", terms: "Net 30",
    lines: [{ sku: "BREAD-02", poQty: 1200, rcvdQty: 1200, invQty: 1200, poPrice: 2.45, invPrice: 2.45 }],
  },
  {
    id: "INV-20260430-077", supplier: "ColdChain Refrigeration", po: "PO-2026-04901", receipt: "GR-20260430-00002",
    invoiceTotal: 18_500.00, expectedTotal: 18_500.00, variance: 0, tolerance: 0.02,
    status: "PAID", dueDate: "2026-05-30", terms: "Net 30",
    lines: [{ sku: "REFR-UNIT-12", poQty: 1, rcvdQty: 1, invQty: 1, poPrice: 18_500, invPrice: 18_500 }],
  },
  {
    id: "INV-20260502-044", supplier: "Greenfield Produce", po: "PO-2026-04955", receipt: "GR-20260502-00008",
    invoiceTotal: 4_205.00, expectedTotal: 4_180.00, variance: 25, tolerance: 0.02,
    status: "EXCEPTION", dueDate: "2026-06-01", terms: "Net 30",
    lines: [{ sku: "VEG-MIX-04", poQty: 250, rcvdQty: 248, invQty: 250, poPrice: 16.72, invPrice: 16.82 }],
  },
];

export interface ARInvoice {
  id: string; customer: string; amount: number; outstanding: number; dueDate: string;
  status: "OPEN" | "PAID" | "OVERDUE" | "PARTIAL";
}
export const arInvoices: ARInvoice[] = [
  { id: "AR-20260501-001", customer: "MetroMart Wholesale", amount: 48_200, outstanding: 48_200, dueDate: "2026-05-31", status: "OPEN" },
  { id: "AR-20260428-009", customer: "QuickStop Chain", amount: 12_840, outstanding: 0, dueDate: "2026-05-28", status: "PAID" },
  { id: "AR-20260415-014", customer: "FoodHub Distributors", amount: 22_500, outstanding: 22_500, dueDate: "2026-05-15", status: "OVERDUE" },
  { id: "AR-20260420-021", customer: "GreenLeaf Cafes", amount: 8_900, outstanding: 4_500, dueDate: "2026-05-20", status: "PARTIAL" },
];

export interface MarkdownPerf {
  sku: string; productName: string; qtySold: number; avgDiscount: number;
  recoveredRevenue: number; wouldBeWaste: number; reserveBalance: number;
}
export const markdownPerformance: MarkdownPerf[] = [
  { sku: "MILK-001", productName: "Whole Milk 1L", qtySold: 1_250, avgDiscount: 0.22, recoveredRevenue: 3_737.50, wouldBeWaste: 4_987.50, reserveBalance: 412 },
  { sku: "BREAD-02", productName: "Sourdough Loaf", qtySold: 980, avgDiscount: 0.30, recoveredRevenue: 1_764.00, wouldBeWaste: 2_940.00, reserveBalance: 882 },
  { sku: "YOG-007", productName: "Greek Yogurt 500g", qtySold: 640, avgDiscount: 0.18, recoveredRevenue: 2_188.80, wouldBeWaste: 2_672.00, reserveBalance: 198 },
  { sku: "VEG-MIX-04", productName: "Salad Mix Bag", qtySold: 410, avgDiscount: 0.35, recoveredRevenue: 887.65, wouldBeWaste: 1_365.00, reserveBalance: 256 },
  { sku: "CHEESE-12", productName: "Aged Cheddar 200g", qtySold: 320, avgDiscount: 0.15, recoveredRevenue: 1_516.80, wouldBeWaste: 1_786.00, reserveBalance: 165 },
];

export interface FixedAsset {
  id: string; name: string; category: string; acquired: string;
  cost: number; accumDepreciation: number; bookValue: number; method: string; usefulLifeMo: number;
}
export const fixedAssets: FixedAsset[] = [
  { id: "FA-001", name: "Walk-in Refrigeration Unit #12", category: "Equipment", acquired: "2024-03-15", cost: 18_500, accumDepreciation: 4_273, bookValue: 14_227, method: "Straight-Line", usefulLifeMo: 84 },
  { id: "FA-002", name: "POS Terminal Set (Store 014)", category: "IT Hardware", acquired: "2025-01-10", cost: 9_800, accumDepreciation: 2_613, bookValue: 7_187, method: "Straight-Line", usefulLifeMo: 36 },
  { id: "FA-003", name: "Leasehold Improvements - HQ", category: "Leasehold", acquired: "2023-06-01", cost: 142_000, accumDepreciation: 41_408, bookValue: 100_592, method: "Straight-Line", usefulLifeMo: 120 },
  { id: "FA-004", name: "Forklift FL-08", category: "Equipment", acquired: "2024-09-22", cost: 28_400, accumDepreciation: 5_206, bookValue: 23_194, method: "Declining Balance", usefulLifeMo: 60 },
];

export interface TaxJurisdiction {
  code: string; name: string; rate: number;
  grossSales: number; markdowns: number; taxableSales: number; taxCollected: number;
}
export const taxJurisdictions: TaxJurisdiction[] = [
  { code: "US-CA", name: "California Sales Tax", rate: 0.0725, grossSales: 1_245_000, markdowns: 12_400, taxableSales: 1_232_600, taxCollected: 89_363.50 },
  { code: "US-NY", name: "New York Sales Tax", rate: 0.0888, grossSales: 982_000, markdowns: 7_800, taxableSales: 974_200, taxCollected: 86_508.96 },
  { code: "US-TX", name: "Texas Sales Tax", rate: 0.0625, grossSales: 753_000, markdowns: 3_250, taxableSales: 749_750, taxCollected: 46_859.38 },
];

export interface IntegrationStatus {
  name: string; system: string; direction: string; protocol: string; cadence: string;
  lastSync: string; status: "HEALTHY" | "DEGRADED" | "DOWN"; eventsToday: number;
}
export const integrations: IntegrationStatus[] = [
  { name: "Receiving-to-GL", system: "CoreERP", direction: "CoreERP → CoreAccounting", protocol: "REST (push)", cadence: "Real-time", lastSync: "2 min ago", status: "HEALTHY", eventsToday: 142 },
  { name: "Invoice Matching", system: "CoreERP", direction: "Bidirectional", protocol: "REST (sync)", cadence: "Real-time", lastSync: "5 min ago", status: "HEALTHY", eventsToday: 38 },
  { name: "POS Sales Sync", system: "SmartPOS via CoreERP", direction: "CoreERP → CoreAccounting", protocol: "SFTP / MQ", cadence: "Every 15 min", lastSync: "8 min ago", status: "HEALTHY", eventsToday: 96 },
  { name: "Markdown Execution", system: "CoreERP", direction: "CoreERP → CoreAccounting", protocol: "Webhook", cadence: "Real-time", lastSync: "12 min ago", status: "HEALTHY", eventsToday: 21 },
  { name: "Write-Off Confirmation", system: "ExpirySmart", direction: "ExpirySmart → CoreAccounting", protocol: "REST (push)", cadence: "Real-time", lastSync: "1 hr ago", status: "HEALTHY", eventsToday: 7 },
  { name: "Markdown Financial Feed", system: "PriceAI", direction: "CoreAccounting → PriceAI", protocol: "REST (data feed)", cadence: "Daily 02:00 UTC", lastSync: "9 hr ago", status: "HEALTHY", eventsToday: 1 },
];

export const financialKPIs = {
  totalMarkdowns: 23_450.99,
  wasteAvoided: 55_000,
  netRevenueRecovered: 88_990,
  grossMarginAfterMarkdown: 0.225,
  inventoryGL: 475_230,
  inventoryCalculated: 475_230,
  reserveGL: -2_450,
  reserveCalculated: -2_450,
};

export const fmtCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n);
export const fmtPct = (n: number) => `${(n * 100).toFixed(1)}%`;
