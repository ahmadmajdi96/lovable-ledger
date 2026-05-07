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
  approvedBy?: string;
  approvedAt?: string;
  reversedBy?: string; // id of reversal entry
  reverses?: string;
}

interface Ctx {
  entries: ExtJournalEntry[];
  audit: AuditEvent[];
  postManual: (e: { description: string; reference: string; lines: { account: string; debit: number; credit: number }[]; files: File[] }, user: string) => string;
  editEntry: (id: string, e: { description: string; reference: string; lines: { account: string; debit: number; credit: number }[] }, user: string) => void;
  reverseEntry: (id: string, reason: string, user: string) => void;
  approveEntry: (id: string, user: string) => void;
  addAttachments: (id: string, files: File[], user: string) => void;
}

const JournalCtx = createContext<Ctx | null>(null);

const now = () => new Date().toISOString();
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const filesToAttachments = (files: File[], user: string): Attachment[] =>
  files.map((f) => ({
    id: uid("AT"),
    name: f.name,
    size: f.size,
    type: f.type || "application/octet-stream",
    url: URL.createObjectURL(f),
    uploadedAt: now(),
    uploadedBy: user,
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
  approvedBy: e.source !== "Manual" ? "system" : undefined,
  approvedAt: e.source !== "Manual" ? e.date : undefined,
}));

const initialAudit: AuditEvent[] = seed.map((e) => ({
  id: uid("AE"), entryId: e.id, action: "POSTED", user: e.postedBy, timestamp: e.date,
  details: `Auto-posted from ${e.source}`,
}));

export const JournalProvider = ({ children }: { children: ReactNode }) => {
  const [entries, setEntries] = useState<ExtJournalEntry[]>(initial);
  const [audit, setAudit] = useState<AuditEvent[]>(initialAudit);

  const log = (entryId: string, action: AuditEvent["action"], user: string, details?: string) =>
    setAudit((a) => [{ id: uid("AE"), entryId, action, user, timestamp: now(), details }, ...a]);

  const postManual: Ctx["postManual"] = useCallback((e, user) => {
    const id = `JE-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-M${Math.floor(Math.random() * 9000 + 1000)}`;
    const newEntry: ExtJournalEntry = {
      id,
      date: now(),
      source: "Manual",
      reference: e.reference,
      description: e.description,
      status: "POSTED",
      postedBy: user,
      attachments: filesToAttachments(e.files, user),
      approved: false,
      lines: e.lines.map((l) => ({
        account: l.account,
        accountName: chartOfAccounts.find((a) => a.code === l.account)?.name ?? l.account,
        debit: l.debit, credit: l.credit,
      })),
    };
    setEntries((p) => [newEntry, ...p]);
    log(id, "POSTED", user, `Manual entry posted with ${e.files.length} attachment(s)`);
    return id;
  }, []);

  const editEntry: Ctx["editEntry"] = useCallback((id, e, user) => {
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
    log(id, "EDITED", user, "Entry edited prior to approval");
  }, []);

  const reverseEntry: Ctx["reverseEntry"] = useCallback((id, reason, user) => {
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
        approvedBy: undefined,
        approvedAt: undefined,
        reverses: orig.id,
        attachments: [],
        postedBy: user,
        lines: orig.lines.map((l) => ({ ...l, debit: l.credit, credit: l.debit })),
      };
      return [reversal, ...p.map((x) => (x.id === id ? { ...x, status: "REVERSED" as const, reversedBy: revId } : x))];
    });
    log(id, "REVERSED", user, reason);
  }, []);

  const approveEntry: Ctx["approveEntry"] = useCallback((id, user) => {
    const at = now();
    setEntries((p) => p.map((x) => (x.id === id ? { ...x, approved: true, approvedBy: user, approvedAt: at } : x)));
    log(id, "APPROVED", user, `Approved by ${user}`);
  }, []);

  const addAttachments: Ctx["addAttachments"] = useCallback((id, files, user) => {
    const atts = filesToAttachments(files, user);
    setEntries((p) => p.map((x) => (x.id === id ? { ...x, attachments: [...x.attachments, ...atts] } : x)));
    log(id, "ATTACHMENT_ADDED", user, `${atts.length} file(s) added`);
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
