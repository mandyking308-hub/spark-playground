import { createFileRoute } from "@tanstack/react-router";
import { Copy, KeyRound, RefreshCcw, ShieldCheck, UserPlus, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { issueInvitationFn, listInvitationsFn, revokeInvitationFn, type InvitationSummary } from "@/functions/invitations";

export const Route = createFileRoute("/dashboard/invitations")({
  component: InvitationAdministration,
});

type IssuableRole = "child" | "parent" | "teacher";
type AgeBand = "under_9" | "age_9_12" | "age_13_15" | "adult";

function InvitationAdministration() {
  const { actor } = Route.useRouteContext();
  const [items, setItems] = useState<InvitationSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [role, setRole] = useState<IssuableRole>(actor.role === "school_admin" ? "child" : actor.role === "platform_admin" ? "parent" : "child");
  const [ageBand, setAgeBand] = useState<AgeBand>("age_9_12");
  const [ttlHours, setTtlHours] = useState<24 | 72 | 168>(24);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [newExpiry, setNewExpiry] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const allowedRoles = useMemo<IssuableRole[]>(() => {
    if (actor.role === "parent") return ["child"];
    if (actor.role === "school_admin") return ["child", "teacher"];
    return ["parent"];
  }, [actor.role]);

  const schoolId = actor.role === "school_admin" ? actor.schoolIds[0] : undefined;

  async function refresh() {
    setLoading(true);
    setMessage(null);
    try {
      setItems(await listInvitationsFn());
    } catch {
      setMessage("Invitations could not be loaded.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  useEffect(() => {
    if (!allowedRoles.includes(role)) setRole(allowedRoles[0] ?? "child");
  }, [allowedRoles, role]);

  useEffect(() => {
    if (role !== "child") setAgeBand("adult");
    else if (ageBand === "adult") setAgeBand("age_9_12");
  }, [role, ageBand]);

  async function issue() {
    setSubmitting(true);
    setMessage(null);
    setNewToken(null);
    try {
      if (actor.role === "school_admin" && !schoolId) throw new Error("No verified school scope");
      const result = await issueInvitationFn({
        data: {
          intendedRole: role,
          ageBand,
          ...(schoolId ? { schoolId } : {}),
          ttlHours,
        },
      });
      setNewToken(result.invitationToken);
      setNewExpiry(result.expiresAt);
      await refresh();
    } catch {
      setMessage("That invitation could not be issued. Your verified role and scope determine which invitations are allowed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function revoke(invitationId: string) {
    setMessage(null);
    try {
      await revokeInvitationFn({ data: { invitationId } });
      await refresh();
    } catch {
      setMessage("That invitation could not be revoked.");
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Verified access"
        title="Invitations"
        description="Issue governed access without letting anyone choose their own authority. The invitation decides the permitted role and scope; the database verifies it again when claimed."
        crumbs={[{ label: "Dashboard", to: "/dashboard" }, { label: "Invitations" }]}
      />

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.35fr]">
        <Card>
          <CardHeader>
            <div className="mb-2 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <UserPlus className="size-5" />
            </div>
            <CardTitle>Issue an invitation</CardTitle>
            <CardDescription>
              Raw invitation codes are shown once after creation. Aurelia stores only a one-way hash of the code.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="invite-role">Account role</Label>
              <select
                id="invite-role"
                value={role}
                onChange={(event) => setRole(event.target.value as IssuableRole)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                {allowedRoles.map((item) => (
                  <option key={item} value={item}>{item === "child" ? "Child" : item === "teacher" ? "Teacher" : "Parent"}</option>
                ))}
              </select>
            </div>

            {role === "child" ? (
              <div className="space-y-2">
                <Label htmlFor="invite-age">Age band</Label>
                <select
                  id="invite-age"
                  value={ageBand}
                  onChange={(event) => setAgeBand(event.target.value as AgeBand)}
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="under_9">Under 9</option>
                  <option value="age_9_12">Age 9–12</option>
                  <option value="age_13_15">Age 13–15</option>
                </select>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="invite-expiry">Invitation lifetime</Label>
              <select
                id="invite-expiry"
                value={ttlHours}
                onChange={(event) => setTtlHours(Number(event.target.value) as 24 | 72 | 168)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value={24}>24 hours</option>
                <option value={72}>3 days</option>
                <option value={168}>7 days</option>
              </select>
            </div>

            {actor.role === "school_admin" ? (
              <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                <ShieldCheck className="mr-2 inline size-4" />
                This invitation is restricted to your verified school scope.
              </div>
            ) : null}

            <Button className="w-full" onClick={() => void issue()} disabled={submitting}>
              <KeyRound className="mr-2 size-4" />
              {submitting ? "Issuing…" : "Create invitation"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {newToken ? (
            <Card className="border-primary/30 bg-primary/[0.035]">
              <CardHeader>
                <CardTitle className="text-lg">Invitation created — copy this code now</CardTitle>
                <CardDescription>
                  It will not be shown again after you leave or refresh this page. Expires {newExpiry ? new Date(newExpiry).toLocaleString() : "soon"}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 rounded-lg border bg-background p-3">
                  <code className="min-w-0 flex-1 break-all text-xs">{newToken}</code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => void navigator.clipboard.writeText(newToken)}
                  >
                    <Copy className="mr-2 size-4" /> Copy
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : null}

          <Card>
            <CardHeader className="flex-row items-start justify-between gap-4">
              <div>
                <CardTitle>Issued invitations</CardTitle>
                <CardDescription>Only metadata is retained here. The bearer code itself is never recoverable.</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => void refresh()} disabled={loading}>
                <RefreshCcw className="mr-2 size-4" /> Refresh
              </Button>
            </CardHeader>
            <CardContent>
              {message ? <p className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">{message}</p> : null}
              {loading ? (
                <p className="text-sm text-muted-foreground">Loading invitations…</p>
              ) : items.length === 0 ? (
                <p className="text-sm text-muted-foreground">No invitations issued yet.</p>
              ) : (
                <div className="divide-y">
                  {items.map((item) => (
                    <div key={item.id} className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium capitalize">{item.intendedRole.replace("_", " ")}</span>
                          <Badge variant={item.state === "pending" ? "secondary" : "outline"}>{item.state}</Badge>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Issued {new Date(item.createdAt).toLocaleString()} · expires {new Date(item.expiresAt).toLocaleString()}
                        </p>
                      </div>
                      {item.state === "pending" ? (
                        <Button variant="ghost" size="sm" onClick={() => void revoke(item.id)}>
                          <XCircle className="mr-2 size-4" /> Revoke
                        </Button>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
