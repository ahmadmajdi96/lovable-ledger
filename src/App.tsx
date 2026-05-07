import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import AppLayout from "@/components/AppLayout";
import { JournalProvider } from "@/lib/journalStore";
import { RoleProvider } from "@/lib/roleStore";
import { AuthProvider, useAuth } from "@/lib/authStore";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
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

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { authedEmail } = useAuth();
  if (!authedEmail) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RoleProvider>
            <JournalProvider>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/app" element={<Protected><Dashboard /></Protected>} />
                <Route path="/cfo-markdowns" element={<Protected><CFOMarkdowns /></Protected>} />
                <Route path="/chart-of-accounts" element={<Protected><ChartOfAccounts /></Protected>} />
                <Route path="/journal-entries" element={<Protected><JournalEntries /></Protected>} />
                <Route path="/period-close" element={<Protected><PeriodClose /></Protected>} />
                <Route path="/accounts-payable" element={<Protected><AccountsPayable /></Protected>} />
                <Route path="/three-way-match" element={<Protected><ThreeWayMatch /></Protected>} />
                <Route path="/accounts-receivable" element={<Protected><AccountsReceivable /></Protected>} />
                <Route path="/inventory-accounting" element={<Protected><InventoryAccounting /></Protected>} />
                <Route path="/markdown-lifecycle" element={<Protected><MarkdownLifecycle /></Protected>} />
                <Route path="/fixed-assets" element={<Protected><FixedAssets /></Protected>} />
                <Route path="/tax" element={<Protected><Tax /></Protected>} />
                <Route path="/integrations" element={<Protected><Integrations /></Protected>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </JournalProvider>
          </RoleProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
