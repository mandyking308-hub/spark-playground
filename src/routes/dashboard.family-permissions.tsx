import { Link, createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock3, Loader2, LockKeyhole, ShieldCheck, XCircle } from "lucide-react";
import { useEffect, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  listFamilyPermissionRequestsFn,
  recordGuardianDecisionFn,
  type FamilyPermissionRequest,
} from "@/functions/permissions";

export const Route = createFileRoute("/dashboard/family-permissions")({
  head: () => ({ meta: [{ title: "Family permissions — Aurelia" }] }),
  component: FamilyPermissions,
});

function labelForRequest(request: FamilyPermissionRequest) {
  if (request.requestType === "publish_external" && request.resourceKind === "project") {
    return "Share a child project with an approved wider audience";
  }
  if (request.requestType === "join_club") return "Join a verified club";
  if (request.requestType === "enter_challenge") return "Enter an approved challenge";
  if (request.requestType === "share_portfolio") return "Share a Passport item";
  return "Aurelia permission request";
}

function FamilyPermissions() {
  const [requests, setRequests] = useState<FamilyPermissionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try {
      setRequests(await listFamilyPermissionRequestsFn());
      setError(null);
    } catch {
      setError("The family permission queue could not be loaded right now.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function decide(requestId: string, approved: boolean) {
    setActingId(requestId);
    setError(null);
    setMessage(null);
    try {
      await recordGuardianDecisionFn({ data: { requestId, approved } });
      setMessage(
        approved
          ? "Guardian approval recorded. The request remains inside Aurelia until the remaining safety and moderation checks are complete."
          : "The request was declined. The project remains private.",
      );
      await refresh();
    } catch {
      setError("That decision could not be recorded. Only a verified guardian linked to the child can decide this request.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified guardian workflow"
        title="Family permissions"
        description="Review real requests made by your linked child. Approval adds one required decision to the safety chain; it does not make the parent account an owner of the child's work or private space."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Parent", to: "/dashboard/parent" }, { label: "Family permissions" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Verified guardian only</Badge>
        <Badge variant="outline">Own linked child only</Badge>
        <Badge variant="outline">Audited decisions</Badge>
      </div>

      {message ? <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm">{message}</div> : null}
      {error ? <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">{error}</div> : null}

      <section className="grid gap-4 lg:grid-cols-[1.35fr_1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2"><Clock3 className="size-5 text-primary" /><CardTitle>Approval queue</CardTitle></div>
            <CardDescription>Requests begin with the child. Required safety and moderation checks stay independent of the guardian decision.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" /> Loading requests…</div>
            ) : requests.length === 0 ? (
              <p className="rounded-xl border border-dashed p-5 text-sm text-muted-foreground">Nothing is waiting for your approval.</p>
            ) : (
              requests.map((request) => {
                const decided = request.guardianDecision !== null;
                return (
                  <div key={request.id} className="rounded-xl border p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="capitalize">{request.resourceKind}</Badge>
                          <Badge variant="secondary" className="capitalize">
                            {request.guardianDecision ? `Guardian ${request.guardianDecision}` : request.state}
                          </Badge>
                        </div>
                        <p className="mt-3 font-medium">{labelForRequest(request)}</p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Requested {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      {!decided && request.state === "pending" ? (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => void decide(request.id, false)} disabled={actingId === request.id}>
                            <XCircle className="mr-1 size-4" />Decline
                          </Button>
                          <Button size="sm" onClick={() => void decide(request.id, true)} disabled={actingId === request.id}>
                            {actingId === request.id ? <Loader2 className="mr-1 size-4 animate-spin" /> : <CheckCircle2 className="mr-1 size-4" />}Approve
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>What approval means</CardTitle></div></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="rounded-lg bg-muted/40 p-3">✓ You can approve or decline a request from your verified linked child.</p>
              <p className="rounded-lg bg-muted/40 p-3">✓ Your decision is recorded in the live permission workflow.</p>
              <p className="rounded-lg bg-muted/40 p-3">✕ Approval alone does not publish the child's work.</p>
              <p className="rounded-lg bg-muted/40 p-3">✕ Guardian status does not reveal private drafts.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><div className="flex items-center gap-2"><LockKeyhole className="size-5 text-primary" /><CardTitle>Privacy controls</CardTitle></div><CardDescription>See the wider jurisdiction and privacy defaults that sit above individual approvals.</CardDescription></CardHeader>
            <CardContent><Button asChild variant="outline"><Link to="/dashboard/privacy">Privacy & consent</Link></Button></CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
