import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import { JournalProvider } from "@/lib/journalStore";
import Dashboard from "./pages/Dashboard";
import ChartOfAccounts from "./pages/ChartOfAccounts";
import JournalEntries from "./pages/JournalEntries";
import PeriodClose from "./pages/PeriodClose";
import AccountsPayable from "./pages/AccountsPayable";
import ThreeWayMatch from "./pages/ThreeWayMatch";
import AccountsReceivable from "./pages/AccountsReceivable";
import InventoryAccounting from "./pages/InventoryAccounting";
import MarkdownLifecycle from "./pages/MarkdownLifecycle";
import FixedAssets from "./pages/FixedAssets";
import Tax from "./pages/Tax";
import CFOMarkdowns from "./pages/CFOMarkdowns";
import Integrations from "./pages/Integrations";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const W = ({ children }: { children: React.ReactNode }) => <AppLayout>{children}</AppLayout>;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <JournalProvider>
          <Routes>
            <Route path="/" element={<W><Dashboard /></W>} />
            <Route path="/cfo-markdowns" element={<W><CFOMarkdowns /></W>} />
            <Route path="/chart-of-accounts" element={<W><ChartOfAccounts /></W>} />
            <Route path="/journal-entries" element={<W><JournalEntries /></W>} />
            <Route path="/period-close" element={<W><PeriodClose /></W>} />
            <Route path="/accounts-payable" element={<W><AccountsPayable /></W>} />
            <Route path="/three-way-match" element={<W><ThreeWayMatch /></W>} />
            <Route path="/accounts-receivable" element={<W><AccountsReceivable /></W>} />
            <Route path="/inventory-accounting" element={<W><InventoryAccounting /></W>} />
            <Route path="/markdown-lifecycle" element={<W><MarkdownLifecycle /></W>} />
            <Route path="/fixed-assets" element={<W><FixedAssets /></W>} />
            <Route path="/tax" element={<W><Tax /></W>} />
            <Route path="/integrations" element={<W><Integrations /></W>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </JournalProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
