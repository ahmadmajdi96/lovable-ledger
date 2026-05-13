const standards = [
  { name: "US GAAP", desc: "Generally Accepted Accounting Principles" },
  { name: "IFRS", desc: "International Financial Reporting Standards" },
  { name: "SOX 404", desc: "Internal Controls over Financial Reporting" },
  { name: "ASC 606", desc: "Revenue Recognition" },
  { name: "ASC 842", desc: "Lease Accounting" },
  { name: "ASC 326", desc: "Credit Loss (CECL)" },
  { name: "IFRS 16", desc: "Lease Liabilities" },
  { name: "PCAOB", desc: "Public Company Audit Standards" },
  { name: "SOC 1 / 2", desc: "Service Organization Controls" },
  { name: "ISO 27001", desc: "Information Security Management" },
];

const IndustryStandards = () => (
  <section className="py-16 sm:py-24 px-4 sm:px-6 border-t pp-border">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="section-title mb-4">Industry Standards Compliance</h2>
        <p className="section-subtitle mx-auto">
          Built to meet the requirements your CFO, controller and external auditor expect.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        {standards.map((std) => (
          <div key={std.name} className="data-card text-center">
            <div className="font-mono font-bold pp-gradient-text text-lg mb-1">{std.name}</div>
            <div className="text-xs pp-muted-text">{std.desc}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default IndustryStandards;
