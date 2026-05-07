import PageHeader from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { fmtCurrency } from "@/lib/mockData";
import { useJournals, ExtJournalEntry, Attachment } from "@/lib/journalStore";
import {
  ChevronRight, Plus, FileText, Paperclip, Download, Eye, Pencil, RotateCcw,
  CheckCircle2, History, Image as ImageIcon, FileSpreadsheet, FileType,
} from "lucide-react";
import { format } from "date-fns";
import ManualJournalDialog from "@/components/ManualJournalDialog";
import { toast } from "sonner";
import { useRole } from "@/lib/roleStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

const sourceTone: Record<string, string> = {
  CoreERP: "bg-primary/10 text-primary border-primary/20",
  ExpirySmart: "bg-warning/10 text-warning border-warning/20",
  PriceAI: "bg-accent/10 text-accent border-accent/20",
  SmartPOS: "bg-success/10 text-success border-success/20",
  Manual: "bg-muted text-muted-foreground border-border",
};

const fileIcon = (type: string) => {
  if (type.startsWith("image/")) return ImageIcon;
  if (type.includes("sheet") || type.includes("excel")) return FileSpreadsheet;
  return FileType;
};

const AttachmentItem = ({ a }: { a: Attachment }) => {
  const Icon = fileIcon(a.type);
  const isImage = a.type.startsWith("image/");
  const isPdf = a.type === "application/pdf";
  const [preview, setPreview] = useState(false);

  return (
    <>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors">
        <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium truncate">{a.name}</div>
          <div className="text-[11px] text-muted-foreground">
            {(a.size / 1024).toFixed(1)} KB · {a.uploadedBy} · {format(new Date(a.uploadedAt), "PPp")}
          </div>
        </div>
        {(isImage || isPdf) && a.url !== "#" && (
          <Button size="sm" variant="ghost" onClick={() => setPreview(true)}>
            <Eye className="h-3.5 w-3.5 mr-1" /> Preview
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            if (a.url === "#") { toast.info("Demo attachment — no file body to download"); return; }
            const link = document.createElement("a");
            link.href = a.url; link.download = a.name; link.click();
          }}
        >
          <Download className="h-3.5 w-3.5 mr-1" /> Download
        </Button>
      </div>

      <Dialog open={preview} onOpenChange={setPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b border-border">
            <DialogTitle className="text-base">{a.name}</DialogTitle>
            <DialogDescription className="text-xs">
              Uploaded by {a.uploadedBy} · {format(new Date(a.uploadedAt), "PPp")}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 max-h-[70vh] overflow-auto p-4 flex items-center justify-center">
            {isImage && <img src={a.url} alt={a.name} className="max-w-full max-h-[65vh] rounded-lg shadow-soft" />}
            {isPdf && <iframe src={a.url} title={a.name} className="w-full h-[65vh] rounded-lg bg-white" />}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ReverseDialog = ({ entry, open, onOpenChange }: { entry: ExtJournalEntry; open: boolean; onOpenChange: (v: boolean) => void }) => {
  const { reverseEntry } = useJournals();
  const { user } = useRole();
  const [reason, setReason] = useState("");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reverse Journal Entry</DialogTitle>
          <DialogDescription>
            Posts an offsetting entry. Original entry will be marked REVERSED. This action is logged.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>Reason <span className="text-destructive">*</span></Label>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain why this entry is being reversed (min 10 chars)"
            maxLength={300}
          />
          <div className="text-[11px] text-muted-foreground mt-1">{reason.trim().length}/300</div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            variant="destructive"
            disabled={reason.trim().length < 10}
            onClick={() => {
              reverseEntry(entry.id, reason.trim(), user.email);
              toast.success("Entry reversed", { description: "Offsetting entry posted." });
              onOpenChange(false);
              setReason("");
            }}
          >
            Reverse Entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const JournalEntries = () => {
  const { entries, audit, postManual, editEntry, approveEntry, addAttachments } = useJournals();
  const { user, can } = useRole();
  const [open, setOpen] = useState<string | null>(entries[0]?.id ?? null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<ExtJournalEntry | null>(null);
  const [reversing, setReversing] = useState<ExtJournalEntry | null>(null);

  return (
    <>
      <PageHeader
        title="Journal Entries"
        description="Auto-created from CoreERP, ExpirySmart, PriceAI & SmartPOS events. Manual entries require description and audit attachment."
        actions={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" /> New Manual Entry
          </Button>
        }
      />

      <ManualJournalDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onPosted={(e) => {
          const id = postManual(e, user.email);
          setOpen(id);
        }}
      />

      {editing && (
        <ManualJournalDialog
          open
          mode="edit"
          onOpenChange={(v) => !v && setEditing(null)}
          initial={{
            description: editing.description,
            reference: editing.reference,
            lines: editing.lines.map((l) => ({ account: l.account, debit: l.debit, credit: l.credit })),
          }}
          onEdited={(e) => {
            editEntry(editing.id, e, user.email);
            setEditing(null);
          }}
        />
      )}

      {reversing && (
        <ReverseDialog
          entry={reversing}
          open
          onOpenChange={(v) => !v && setReversing(null)}
        />
      )}

      <Card className="p-0 overflow-hidden">
        <div className="divide-y divide-border">
          {entries.map((j) => {
            const totalDr = j.lines.reduce((s, l) => s + l.debit, 0);
            const totalCr = j.lines.reduce((s, l) => s + l.credit, 0);
            const isOpen = open === j.id;
            const entryAudit = audit.filter((a) => a.entryId === j.id);
            const editable = j.source === "Manual" && j.status === "POSTED" && !j.approved;

            return (
              <div key={j.id}>
                <button
                  onClick={() => setOpen(isOpen ? null : j.id)}
                  className="w-full flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors text-left"
                >
                  <ChevronRight
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`}
                  />
                  <span className={`pill ${sourceTone[j.source]}`}>{j.source}</span>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium truncate">{j.description}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">
                      {j.id} · {j.reference}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {j.attachments.length > 0 && (
                      <span className="pill bg-muted text-muted-foreground border-border">
                        <Paperclip className="h-3 w-3" /> {j.attachments.length}
                      </span>
                    )}
                    {j.approved && (
                      <span className="pill bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="h-3 w-3" /> Approved
                      </span>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-mono tabular-nums text-sm">{fmtCurrency(totalDr)}</div>
                    <div className="text-[10px] text-muted-foreground">{format(new Date(j.date), "MMM d, HH:mm")}</div>
                  </div>
                  <Badge
                    variant={
                      j.status === "POSTED" ? "default" : j.status === "DRAFT" ? "secondary" :
                      j.status === "REVERSED" ? "outline" : "outline"
                    }
                    className="text-[10px]"
                  >
                    {j.status}
                  </Badge>
                </button>

                {isOpen && (
                  <div className="bg-muted/30 px-5 py-4 border-t border-border space-y-5">
                    {/* Action bar */}
                    <div className="flex flex-wrap items-center gap-2">
                      {editable && can("edit_journal") && (
                        <Button size="sm" variant="outline" onClick={() => setEditing(j)}>
                          <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
                        </Button>
                      )}
                      {editable && can("approve_journal") && (
                        <Button
                          size="sm"
                          onClick={() => { approveEntry(j.id, user.email); toast.success("Entry approved", { description: `Approved by ${user.email}` }); }}
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Approve
                        </Button>
                      )}
                      {editable && !can("approve_journal") && (
                        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> Approval requires CFO/Controller role
                        </span>
                      )}
                      {j.status === "POSTED" && !j.approved && can("reverse_journal") && (
                        <Button size="sm" variant="outline" onClick={() => setReversing(j)}>
                          <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Reverse
                        </Button>
                      )}
                      {j.status === "POSTED" && j.approved && j.source === "Manual" && (
                        <span className="text-[11px] text-muted-foreground inline-flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> Locked — already approved (reversal disabled)
                        </span>
                      )}
                      <label className="ml-auto cursor-pointer">
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.txt"
                          onChange={(e) => {
                            if (e.target.files && e.target.files.length > 0) {
                              addAttachments(j.id, Array.from(e.target.files), user.email);
                              toast.success("Attachment added");
                              e.target.value = "";
                            }
                          }}
                        />
                        <span className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline cursor-pointer">
                          <Paperclip className="h-3.5 w-3.5" /> Add attachment
                        </span>
                      </label>
                    </div>

                    {j.approved && j.approvedBy && (
                      <Alert className="border-success/30 bg-success/5">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <AlertDescription className="text-xs">
                          Approved by <strong>{j.approvedBy}</strong> on {j.approvedAt ? format(new Date(j.approvedAt), "PPp") : "—"}. Reversal is disabled after approval.
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Lines */}
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
                          <th className="py-2 pr-4 font-semibold">Account</th>
                          <th className="py-2 pr-4 font-semibold">Name</th>
                          <th className="py-2 pr-4 font-semibold text-right">Debit</th>
                          <th className="py-2 pr-4 font-semibold text-right">Credit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {j.lines.map((l, i) => (
                          <tr key={i} className="border-b border-border last:border-0">
                            <td className="py-2 pr-4 font-mono text-xs">{l.account}</td>
                            <td className="py-2 pr-4">{l.accountName}</td>
                            <td className="py-2 pr-4 text-right font-mono tabular-nums">
                              {l.debit > 0 ? fmtCurrency(l.debit) : "—"}
                            </td>
                            <td className="py-2 pr-4 text-right font-mono tabular-nums">
                              {l.credit > 0 ? fmtCurrency(l.credit) : "—"}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-semibold">
                          <td colSpan={2} className="pt-2 text-right text-xs uppercase text-muted-foreground">
                            Totals
                          </td>
                          <td className="pt-2 text-right font-mono tabular-nums">{fmtCurrency(totalDr)}</td>
                          <td className="pt-2 text-right font-mono tabular-nums">{fmtCurrency(totalCr)}</td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3" /> Posted by {j.postedBy}
                      {j.reverses && <span>· Reverses <span className="font-mono">{j.reverses}</span></span>}
                      {j.reversedBy && <span>· Reversed by <span className="font-mono">{j.reversedBy}</span></span>}
                    </div>

                    {/* Attachments */}
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Paperclip className="h-3 w-3" /> Audit Attachments ({j.attachments.length})
                      </div>
                      {j.attachments.length === 0 ? (
                        <div className="text-xs text-muted-foreground italic">No attachments</div>
                      ) : (
                        <div className="space-y-2">
                          {j.attachments.map((a) => (
                            <AttachmentItem key={a.id} a={a} />
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Audit trail */}
                    <div>
                      <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <History className="h-3 w-3" /> Audit Trail
                      </div>
                      <div className="space-y-1.5">
                        {entryAudit.map((a) => (
                          <div key={a.id} className="flex items-center gap-3 text-xs">
                            <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                              {a.action}
                            </Badge>
                            <span className="text-muted-foreground">{a.user}</span>
                            <span className="text-muted-foreground/70">·</span>
                            <span className="text-muted-foreground">{format(new Date(a.timestamp), "PPp")}</span>
                            {a.details && (
                              <span className="text-muted-foreground truncate flex-1">— {a.details}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
};

export default JournalEntries;
