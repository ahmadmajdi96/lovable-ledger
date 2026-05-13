import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Layers, Bot, Menu, X, Workflow, Sparkles, ShieldCheck } from "lucide-react";
import cortaLogo from "@/assets/corta-logo.png";

const navItems = [
  { label: "Architecture", href: "#architecture", icon: Workflow },
  { label: "GL Engine", href: "#gl", icon: BookOpen },
  { label: "Subledgers", href: "#subledgers", icon: Layers },
  { label: "AI Suite", href: "#ai", icon: Brain },
  { label: "Personas", href: "#personas", icon: Bot },
  { label: "Benefits", href: "#benefits", icon: Sparkles },
  { label: "Standards", href: "#standards", icon: ShieldCheck },
];

const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
  if (!href.startsWith("#")) return;
  const id = href.slice(1);
  const el = document.getElementById(id);
  if (el) {
    e.preventDefault();
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", href);
  }
};

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl border-b pp-border" : ""
      }`}
      style={scrolled ? { background: "hsl(220 25% 7% / 0.8)" } : undefined}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 sm:gap-3 hover-scale">
          <img src={cortaLogo} alt="CORTA Accounting" className="h-7 sm:h-8 w-auto" />
          <span className="font-bold text-base sm:text-lg tracking-tight">CORTA Accounting</span>
        </a>

        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium pp-muted-text hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
          <Link
            to="/login"
            className="ml-2 text-sm px-4 py-2 rounded-lg text-white font-semibold shadow-lg"
            style={{ background: "linear-gradient(135deg, hsl(var(--gl-color)), hsl(var(--sub-color)))" }}
          >
            Launch app
          </Link>
        </div>

        <button
          className="md:hidden p-2 rounded-lg pp-muted-text hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-b pp-border px-4 py-3 space-y-1" style={{ background: "hsl(220 25% 7% / 0.95)" }}>
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium pp-muted-text hover:text-white"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
          <Link
            to="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white"
            style={{ background: "linear-gradient(135deg, hsl(var(--gl-color)), hsl(var(--sub-color)))" }}
          >
            Launch app
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
