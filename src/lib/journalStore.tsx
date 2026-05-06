import { createContext, useCallback, useContext, useMemo, useState, ReactNode } from "react";
import { journalEntries as seed, JournalEntry, chartOfAccounts } from "./mockData";

export interface Attachment {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string; // blob URL
  uploadedAt: string;
  uploadedBy: string;
}

export interface AuditEvent {
  id: string;
  entryId: string;
  action: "POSTED" | "EDITED" | "REVERSED" | "APPROVED" | "ATTACHMENT_ADDED";
  user: string;
  timestamp: string;
  details?: string;
}

export interface ExtJournalEntry extends JournalEntry {
  attachments: Attachment[];
  approved: boolean;
  reversedBy?: string; // id of reversal entry
  reverses?: string;
}

interface Ctx {
  entries: ExtJournalEntry[];
  audit: AuditEvent[];
  postManual: (e: { description: string; reference: string; lines: { account: string; debit: number; credit: number }[]; files: File[] }) => string;
  editEntry: (id: string, e: { description: string; reference: string; lines: { account: string; debit: number; credit: number }[] }) => void;
  reverseEntry: (id: string, reason: string) => void;
  approveEntry: (id: string) => void;
  addAttachments: (id: string, files: File[]) => void;
}

const JournalCtx = createContext<Ctx | null>(null);

const USER = "cfo@retailco.com";
const now = () => new Date().toISOString();
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const filesToAttachments = (files: File[]): Attachment[] =>
  files.map((f) => ({
    id: uid("AT"),
    name: f.name,
    size: f.size,
    type: f.type || "application/octet-stream",
    url: URL.createObjectURL(f),
    uploadedAt: now(),
    uploadedBy: USER,
  }));

const initial: ExtJournalEntry[] = seed.map((e) => ({
  ...e,
  attachments: e.source === "Manual"
    ? [{
        id: uid("AT"), name: "vendor-estimate.pdf", size: 184_320, type: "application/pdf",
        url: "#", uploadedAt: e.date, uploadedBy: e.postedBy,
      }]
    : [],
  approved: e.source !== "Manual" || e.status !== "DRAFT",
}));

const initialAudit: AuditEvent[] = seed.map((e) => ({
  id: uid("AE"), entryId: e.id, action: "POSTED", user: e.postedBy, timestamp: e.date,
  details: `Auto-posted from ${e.source}`,
}));

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<ExtJournalEntry[]>(initial);
  const [audit, setAudit] = useState<AuditEvent[]>(initialAudit);

  const log = (entryId: string, action: AuditEvent["action"], details?: string) =>
    setAudit((a) => [{ id: uid("AE"), entryId, action, user: USER, timestamp: now(), details }, ...a]);

  const postManual: Ctx["postManual"] = useCallback((e) => {
    const id = `JE-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-M${Math.floor(Math.random() * 9000 + 1000)}`;
    const newEntry: ExtJournalEntry = {
      id,
      date: now(),
      source: "Manual",
      reference: e.reference,
      description: e.description,
      status: "POSTED",
      postedBy: USER,
      attachments: filesToAttachments(e.files),
      approved: false,
      lines: e.lines.map((l) => ({
        account: l.account,
        accountName: chartOfAccounts.find((a) => a.code === l.account)?.name ?? l.account,
        debit: l.debit, credit: l.credit,
      })),
    };
    setEntries((p) => [newEntry, ...p]);
    log(id, "POSTED", `Manual entry posted with ${e.files.length} attachment(s)`);
    return id;
  }, []);

  const editEntry: Ctx["editEntry"] = useCallback((id, e) => {
    setEntries((p) =>
      p.map((x) =>
        x.id === id
          ? {
              ...x,
              description: e.description,
              reference: e.reference,
              lines: e.lines.map((l) => ({
                account: l.account,
                accountName: chartOfAccounts.find((a) => a.code === l.account)?.name ?? l.account,
                debit: l.debit, credit: l.credit,
              })),
            }
          : x
      )
    );
    log(id, "EDITED", "Entry edited prior to approval");
  }, []);

  const reverseEntry: Ctx["reverseEntry"] = useCallback((id, reason) => {
    setEntries((p) => {
      const orig = p.find((x) => x.id === id);
      if (!orig) return p;
      const revId = `JE-REV-${Math.floor(Math.random() * 90000 + 10000)}`;
      const reversal: ExtJournalEntry = {
        ...orig,
        id: revId,
        date: now(),
        reference: `Reversal of ${orig.id}`,
        description: `[REVERSAL] ${orig.description} — ${reason}`,
        status: "POSTED",
        approved: false,
        reverses: orig.id,
        attachments: [],
        lines: orig.lines.map((l) => ({ ...l, debit: l.credit, credit: l.debit })),
      };
      return [reversal, ...p.map((x) => (x.id === id ? { ...x, status: "REVERSED" as const, reversedBy: revId } : x))];
    });
    log(id, "REVERSED", reason);
  }, []);

  const approveEntry: Ctx["approveEntry"] = useCallback((id) => {
    setEntries((p) => p.map((x) => (x.id === id ? { ...x, approved: true } : x)));
    log(id, "APPROVED", "Approved by controller");
  }, []);

  const addAttachments: Ctx["addAttachments"] = useCallback((id, files) => {
    const atts = filesToAttachments(files);
    setEntries((p) => p.map((x) => (x.id === id ? { ...x, attachments: [...x.attachments, ...atts] } : x)));
    log(id, "ATTACHMENT_ADDED", `${atts.length} file(s) added`);
  }, []);

  const value = useMemo(
    () => ({ entries, audit, postManual, editEntry, reverseEntry, approveEntry, addAttachments }),
    [entries, audit, postManual, editEntry, reverseEntry, approveEntry, addAttachments]
  );
  return <JournalCtx.Provider value={value}>{children}</JournalCtx.Provider>;
};

export const useJournals = () => {
  const ctx = useContext(JournalCtx);
  if (!ctx) throw new Error("useJournals must be used within JournalProvider");
  return ctx;
};
