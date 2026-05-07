import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Calculator, Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { useAuth, DEMO_ACCOUNTS } from "@/lib/authStore";
import { useRole } from "@/lib/roleStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const Login = () => {
  const { authedEmail, login } = useAuth();
  const { setUser } = useRole();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (authedEmail) return <Navigate to="/app" replace />;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = login(email, password);
    setLoading(false);
    if (!res.ok) {
      toast({ title: "Sign-in failed", description: res.error, variant: "destructive" });
      return;
    }
    setUser(email);
    toast({ title: "Welcome back", description: email });
    navigate("/app");
  };

  const quickFill = (acctEmail: string) => {
    setEmail(acctEmail);
    setPassword("demo1234");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: "var(--gradient-hero)" }}>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center text-white shadow-md"
              style={{ background: "var(--gradient-primary)" }}
            >
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg">CORTA Accounting</div>
              <div className="text-xs text-muted-foreground">Financial Engine · v1.0</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight mb-1">Sign in to your workspace</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Use a demo account or your own credentials.
          </p>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  placeholder="you@company.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-8">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Demo accounts (password: demo1234)
              </span>
            </div>
            <div className="grid gap-1.5">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => quickFill(a.email)}
                  className="text-left text-xs px-3 py-2 rounded-md border border-border bg-card hover:border-primary/40 hover:bg-muted/40 transition flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{a.name}</div>
                    <div className="text-muted-foreground">{a.email}</div>
                  </div>
                  <span className="pill border-primary/20 bg-primary/5 text-primary">{a.role}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex relative items-center justify-center overflow-hidden border-l border-border">
        <div className="absolute inset-0" style={{ background: "var(--gradient-primary)", opacity: 0.95 }} />
        <div className="relative z-10 max-w-md text-white p-10">
          <h2 className="text-3xl font-bold leading-tight mb-4">
            AI-powered accounting for retail & manufacturing
          </h2>
          <p className="text-white/85 mb-6">
            CORTA Accounting unifies your GL, AP, AR, inventory, markdowns and tax —
            with AI-assisted close, anomaly detection, and CFO-ready insights.
          </p>
          <ul className="space-y-2 text-sm text-white/90">
            <li>• Automated 3-way match & exception triage</li>
            <li>• AI-driven period close checklist</li>
            <li>• Real-time CFO markdown intelligence</li>
            <li>• Connected to CoreERP, ExpirySmart, PriceAI, SmartPOS</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Login;
