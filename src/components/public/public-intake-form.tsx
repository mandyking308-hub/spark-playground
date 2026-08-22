import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitPublicIntakeFn } from "@/functions/public-intake";

type Audience = "family" | "school" | "education_group" | "organisation" | "press" | "general";

const audienceOptions: { value: Audience; label: string }[] = [
  { value: "family", label: "Family / parent or guardian" },
  { value: "school", label: "School" },
  { value: "education_group", label: "Education group" },
  { value: "organisation", label: "Organisation / partner" },
  { value: "press", label: "Press / media" },
  { value: "general", label: "General enquiry" },
];

export function PublicIntakeForm({ mode }: { mode: "enquiry" | "safeguarding" }) {
  const submitIntake = useServerFn(submitPublicIntakeFn);
  const isSafeguarding = mode === "safeguarding";
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  if (reference) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8" role="status">
        <CheckCircle2 className="size-8 text-accent-foreground" aria-hidden="true" />
        <h2 className="mt-4 font-display text-2xl tracking-tight">
          {isSafeguarding ? "Your concern has been recorded" : "Your enquiry has been recorded"}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Keep this reference if you need to identify the submission later: <strong className="text-foreground">{reference}</strong>.
        </p>
        {isSafeguarding ? (
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            If a child is in immediate danger, contact local emergency services now. An Aurelia report does not replace emergency or statutory child-protection services.
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <form
      className="brand-card rounded-2xl border border-border/70 bg-card p-6 sm:p-8"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setPending(true);

        const form = new FormData(event.currentTarget);
        const email = String(form.get("email") ?? "").trim();
        const name = String(form.get("name") ?? "").trim();
        const organisation = String(form.get("organisation") ?? "").trim();
        const message = String(form.get("message") ?? "").trim();
        const website = String(form.get("website") ?? "");
        const audience = isSafeguarding ? "general" : String(form.get("audience") ?? "general") as Audience;
        const contactPermitted = form.get("contactPermitted") === "on";

        try {
          const result = await submitIntake({
            data: {
              kind: mode,
              audience,
              ...(name ? { name } : {}),
              ...(email ? { email } : {}),
              ...(organisation ? { organisation } : {}),
              message,
              contactPermitted,
              ...(website ? { website } : {}),
            },
          });

          if (!result.ok) {
            setError(result.error);
            return;
          }

          setReference(result.reference);
        } catch {
          setError("We couldn't record that submission right now. Please try again.");
        } finally {
          setPending(false);
        }
      }}
    >
      <div className="mb-6 flex items-start gap-3">
        {isSafeguarding ? (
          <ShieldAlert className="mt-1 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
        ) : null}
        <div>
          <h2 className="font-display text-2xl tracking-tight">
            {isSafeguarding ? "Report a safeguarding concern" : "Send an enquiry"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {isSafeguarding
              ? "You may report without giving your name or email. Include only the personal information needed to understand and locate the concern."
              : "Tell us what you are looking for and how to respond. Do not include personal information about a child in a general enquiry."}
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {!isSafeguarding ? (
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor={`${mode}-audience`}>I am contacting Aurelia as</Label>
            <select
              id={`${mode}-audience`}
              name="audience"
              defaultValue="general"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              disabled={pending}
            >
              {audienceOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor={`${mode}-name`}>Name {isSafeguarding ? "(optional)" : ""}</Label>
          <Input
            id={`${mode}-name`}
            name="name"
            autoComplete="name"
            maxLength={120}
            disabled={pending}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`${mode}-email`}>Email {isSafeguarding ? "(optional)" : ""}</Label>
          <Input
            id={`${mode}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={254}
            required={!isSafeguarding}
            disabled={pending}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${mode}-organisation`}>School / organisation (optional)</Label>
          <Input
            id={`${mode}-organisation`}
            name="organisation"
            autoComplete="organization"
            maxLength={160}
            disabled={pending}
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor={`${mode}-message`}>
            {isSafeguarding ? "What happened or what are you worried about?" : "How can we help?"}
          </Label>
          <textarea
            id={`${mode}-message`}
            name="message"
            required
            minLength={20}
            maxLength={isSafeguarding ? 8000 : 4000}
            rows={isSafeguarding ? 9 : 6}
            className="w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            disabled={pending}
          />
        </div>

        <div className="sr-only" aria-hidden="true">
          <Label htmlFor={`${mode}-website`}>Website</Label>
          <Input id={`${mode}-website`} name="website" tabIndex={-1} autoComplete="off" />
        </div>

        <label className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:col-span-2">
          <input
            type="checkbox"
            name="contactPermitted"
            className="mt-1 size-4 rounded border-input"
            required={!isSafeguarding}
            disabled={pending}
          />
          <span>
            {isSafeguarding
              ? "Aurelia may contact me about this report if I supplied an email address."
              : "Aurelia may use the email above to respond to this enquiry."}
          </span>
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <Button type="submit" size="lg" className="mt-6" disabled={pending}>
        {pending ? "Submitting…" : isSafeguarding ? "Submit concern securely" : "Send enquiry"}
      </Button>

      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
        This form is for Aurelia-related matters. It does not replace emergency services. Submission data is kept in a restricted intake store and is not used for advertising or child profiling.
      </p>
    </form>
  );
}
