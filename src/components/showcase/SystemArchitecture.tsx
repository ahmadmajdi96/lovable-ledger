import { BookOpen, Layers, Brain, Bot, ArrowRight } from "lucide-react";

const layers = [
  {
    title: "Ledger Layer",
    subtitle: "Single source of financial truth",
    systems: [
      { name: "GL Engine", desc: "Double-entry GL, period close, audit trail", icon: BookOpen, colorVar: "--gl-color" },
      { name: "Subledgers", desc: "AP, AR, Inventory, Markdown, FA, Tax — all reconciled", icon: Layers, colorVar: "--sub-color" },
    ],
  },
  {
    title: "Intelligence Layer",
    subtitle: "AI-native automation & insight",
    systems: [
      { name: "AI Suite", desc: "Period-Close Copilot · CFO Insights Assistant", icon: Brain, colorVar: "--ai-color" },
      { name: "Persona Apps", desc: "CFO, Controller, AP, AR & Auditor workspaces", icon: Bot, colorVar: "--persona-color" },
    ],
  },
];

const SystemArchitecture = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="section-title mb-4">System Architecture</h2>
        <p className="section-subtitle mx-auto">
          Built on a single ledger backbone with an intelligence layer on top — every event posts
          once, reconciles automatically, and is auditable end-to-end.
        </p>
      </div>

      <div className="space-y-8">
        {layers.map((layer, idx) => (
          <div key={layer.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-border" />
              <div className="px-4 py-1.5 rounded-full border pp-border text-sm font-medium pp-muted-text" style={{ background: "hsl(220 22% 11% / 0.6)" }}>
                {layer.title}
              </div>
              <div className="h-px flex-1 bg-border" />
            </div>
            <p className="text-center text-sm pp-muted-text mb-6">{layer.subtitle}</p>

            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {layer.systems.map((sys) => (
                <div key={sys.name} className="data-card flex items-start gap-4">
                  <div
                    className="p-3 rounded-lg shrink-0"
                    style={{
                      background: `hsl(var(${sys.colorVar}) / 0.1)`,
                      border: `1px solid hsl(var(${sys.colorVar}) / 0.25)`,
                    }}
                  >
                    <sys.icon className="w-6 h-6" style={{ color: `hsl(var(${sys.colorVar}))` }} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{sys.name}</h3>
                    <p className="text-sm pp-muted-text">{sys.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {idx === 0 && (
              <div className="flex justify-center my-6">
                <div className="flex flex-col items-center gap-1 pp-muted-text/40">
                  <ArrowRight className="w-5 h-5 rotate-90" />
                  <span className="text-xs uppercase tracking-wider">Data Flow</span>
                  <ArrowRight className="w-5 h-5 rotate-90" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default SystemArchitecture;
