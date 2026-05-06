import { useState } from "react";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { chartOfAccounts } from "@/lib/mockData";
import { Paperclip, Plus, Trash2, AlertCircle, FileCheck2 } from "lucide-react";

interface DraftLine { account: string; debit: string; credit: string }

const lineSchema = z.object({
  account: z.string().min(1, "Account required"),
  debit: z.coerce.number().min(0),
  credit: z.coerce.number().min(0),
});

const entrySchema = z.object({
  description: z
    .string()
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  reference: z.string().trim().max(80).optional(),
  lines: z
    .array(lineSchema)
    .min(2, "At least two lines required (debit and credit)"),
  attachments: z.array(z.any()).min(1, "At least one audit attachment is required"),
});

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  // create mode
  onPosted?: (entry: { description: string; reference: string; lines: { account: string; debit: number; credit: number }[]; files: File[] }) => void;
  // edit mode
  mode?: "create" | "edit";
  initial?: {
    description: string;
    reference: string;
    lines: { account: string; debit: number; credit: number }[];
  };
  onEdited?: (entry: { description: string; reference: string; lines: { account: string; debit: number; credit: number }[] }) => void;
}

const ManualJournalDialog = ({ open, onOpenChange, onPosted, mode = "create", initial, onEdited }: Props) => {
  const [description, setDescription] = useState(initial?.description ?? "");
  const [reference, setReference] = useState(initial?.reference ?? "");
  const [lines, setLines] = useState<DraftLine[]>(
    initial?.lines.map((l) => ({ account: l.account, debit: l.debit ? String(l.debit) : "", credit: l.credit ? String(l.credit) : "" }))
      ?? [{ account: "", debit: "", credit: "" }, { account: "", debit: "", credit: "" }]
  );
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalDr = lines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
  const totalCr = lines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
  const balanced = totalDr === totalCr && totalDr > 0;

  const reset = () => {
    if (mode === "edit") return;
    setDescription(""); setReference("");
    setLines([{ account: "", debit: "", credit: "" }, { account: "", debit: "", credit: "" }]);
    setFiles([]); setErrors({});
  };

  const updateLine = (i: number, k: keyof DraftLine, v: string) => {
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [k]: v } : l)));
  };

  const addLine = () => setLines([...lines, { account: "", debit: "", credit: "" }]);
  const removeLine = (i: number) => lines.length > 2 && setLines(lines.filter((_, idx) => idx !== i));

  const handleFiles = (fl: FileList | null) => {
    if (!fl) return;
    const accepted = Array.from(fl).filter((f) => {
      if (f.size > 10 * 1024 * 1024) {
        toast.error(`${f.name} is larger than 10MB and was skipped`);
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...accepted]);
  };

  const handlePost = () => {
    const lineObjs = lines.map((l) => ({ account: l.account, debit: Number(l.debit) || 0, credit: Number(l.credit) || 0 }));
    const e: Record<string, string> = {};

    const baseSchema = z.object({
      description: z.string().trim().min(10, "Description must be at least 10 characters").max(500),
      lines: z.array(lineSchema).min(2, "At least two lines required"),
    });
    const parsed = baseSchema.safeParse({ description, lines: lineObjs });
    if (!parsed.success) {
      parsed.error.issues.forEach((i) => { e[i.path.join(".") || "form"] = i.message; });
    }
    if (mode === "create" && files.length === 0) e.attachments = "At least one audit attachment is required";
    if (!balanced) e.balance = "Debits and credits must balance and be greater than zero";
    lines.forEach((l, i) => {
      if (!l.account) e[`lines.${i}.account`] = "Account required";
      const dr = Number(l.debit) || 0; const cr = Number(l.credit) || 0;
      if (dr === 0 && cr === 0) e[`lines.${i}.amount`] = "Enter a debit or credit";
      if (dr > 0 && cr > 0) e[`lines.${i}.amount`] = "Use only debit OR credit per line";
    });

    if (Object.keys(e).length > 0) {
      setErrors(e);
      toast.error("Entry has validation errors", { description: "Resolve highlighted fields before posting." });
      return;
    }

    if (mode === "edit") {
      onEdited?.({ description: description.trim(), reference: reference.trim(), lines: lineObjs });
      toast.success("Entry updated", { description: "Audit trail recorded." });
    } else {
      onPosted?.({
        description: description.trim(),
        reference: reference.trim() || `MJE-${Date.now()}`,
        lines: lineObjs,
        files,
      });
      toast.success("Journal entry posted", {
        description: `Balanced entry · ${files.length} attachment${files.length !== 1 ? "s" : ""} attached for audit.`,
      });
    }
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Journal Entry" : "New Manual Journal Entry"}</DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Edits are permitted only before approval. All changes are logged in the audit trail."
              : "Description and at least one audit attachment are required before posting. Entry must balance."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="desc">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors({ ...errors, description: "" });
              }}
              placeholder="e.g., Month-end accrual for May utilities — vendor estimate received"
              maxLength={500}
              className={errors.description ? "border-destructive" : ""}
            />
            <div className="flex items-center justify-between mt-1">
              {errors.description ? (
                <span className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.description}
                </span>
              ) : (
                <span className="text-xs text-muted-foreground">Min 10 chars · audit-tracked</span>
              )}
              <span className="text-xs text-muted-foreground">{description.length}/500</span>
            </div>
          </div>

          <div>
            <Label htmlFor="ref">Reference</Label>
            <Input
              id="ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="ADJ-MAY-001 (optional)"
              maxLength={80}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Lines</Label>
              <Button size="sm" variant="outline" type="button" onClick={addLine}>
                <Plus className="h-3 w-3 mr-1" /> Add line
              </Button>
            </div>
            <div className="space-y-2">
              {lines.map((l, i) => {
                const lineErr =
                  errors[`lines.${i}.account`] || errors[`lines.${i}.amount`];
                return (
                  <div key={i} className="grid grid-cols-12 gap-2 items-start">
                    <div className="col-span-6">
                      <Select
                        value={l.account}
                        onValueChange={(v) => updateLine(i, "account", v)}
                      >
                        <SelectTrigger className={errors[`lines.${i}.account`] ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select account…" />
                        </SelectTrigger>
                        <SelectContent>
                          {chartOfAccounts.map((a) => (
                            <SelectItem key={a.code} value={a.code}>
                              <span className="font-mono text-xs">{a.code}</span> · {a.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Input
                      className="col-span-2 text-right font-mono tabular-nums"
                      placeholder="DR"
                      type="number"
                      step="0.01"
                      value={l.debit}
                      onChange={(e) => updateLine(i, "debit", e.target.value)}
                    />
                    <Input
                      className="col-span-2 text-right font-mono tabular-nums"
                      placeholder="CR"
                      type="number"
                      step="0.01"
                      value={l.credit}
                      onChange={(e) => updateLine(i, "credit", e.target.value)}
                    />
                    <div className="col-span-2 flex items-center">
                      {lines.length > 2 && (
                        <Button size="icon" variant="ghost" type="button" onClick={() => removeLine(i)}>
                          <Trash2 className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                    {lineErr && (
                      <div className="col-span-12 text-xs text-destructive flex items-center gap-1 -mt-1">
                        <AlertCircle className="h-3 w-3" /> {lineErr}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-3 flex items-center justify-end gap-6 text-sm border-t border-border pt-3">
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider mr-2">Total DR</span>
                <span className="font-mono tabular-nums font-semibold">${totalDr.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-muted-foreground text-xs uppercase tracking-wider mr-2">Total CR</span>
                <span className="font-mono tabular-nums font-semibold">${totalCr.toFixed(2)}</span>
              </div>
              <Badge variant={balanced ? "default" : "destructive"}>
                {balanced ? "Balanced" : "Out of balance"}
              </Badge>
            </div>
            {errors.balance && (
              <div className="text-xs text-destructive mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.balance}
              </div>
            )}
          </div>

          {mode === "create" && (
            <div>
              <Label>
                Audit Attachments <span className="text-destructive">*</span>
              </Label>
              <label
                htmlFor="files"
                className={`mt-1 flex flex-col items-center justify-center px-4 py-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors ${
                  errors.attachments
                    ? "border-destructive bg-destructive/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/40"
                }`}
              >
                <Paperclip className="h-5 w-5 text-muted-foreground mb-2" />
                <span className="text-sm font-medium">Click to attach audit evidence</span>
                <span className="text-xs text-muted-foreground mt-0.5">PDF, image, or document · max 10MB each</span>
                <input
                  id="files"
                  type="file"
                  multiple
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.xls,.xlsx,.txt"
                  onChange={(e) => {
                    handleFiles(e.target.files);
                    if (errors.attachments) setErrors({ ...errors, attachments: "" });
                  }}
                />
              </label>
              {errors.attachments && (
                <div className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.attachments}
                </div>
              )}
              {files.length > 0 && (
                <div className="mt-2 space-y-1">
                  {files.map((f, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 border border-border text-sm"
                    >
                      <FileCheck2 className="h-4 w-4 text-success shrink-0" />
                      <span className="truncate flex-1">{f.name}</span>
                      <span className="text-xs text-muted-foreground shrink-0">
                        {(f.size / 1024).toFixed(1)} KB
                      </span>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6"
                        onClick={() => setFiles(files.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handlePost}
            disabled={!balanced || !description.trim() || (mode === "create" && files.length === 0)}
          >
            {mode === "edit" ? "Save Changes" : "Post Entry"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualJournalDialog;
