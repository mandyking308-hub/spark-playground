import { createFileRoute } from "@tanstack/react-router";
import { FileCheck2, LockKeyhole, MapPinOff, ScanSearch } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/dashboard/upload-safety")({
  head: () => ({ meta: [{ title: "Upload safety — Aurelia" }] }),
  component: UploadSafetyPage,
});

const steps = [
  ["1", "Private quarantine", "The original file lands in non-public storage under a random server key."],
  ["2", "Verify the real file type", "Server-side signature detection must match the allowed image/audio/video format; filename and extension are not trusted."],
  ["3", "Scan and sanitize", "Malware/content checks run, precise location/EXIF metadata is removed, and scanner failure keeps the file blocked."],
  ["4", "Create a safe derivative", "A sanitized copy becomes the only candidate for project use. The original upload is never a publication asset."],
  ["5", "Publication workflow", "The sanitized copy still stays private until age/jurisdiction checks, approvals and moderation permit wider sharing."],
] as const;

function UploadSafetyPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Creator safety"
        title="How media uploads are protected"
        description="Uploading a file does not make it public. Aurelia separates ingestion safety from publication permission and fails closed when a required safety check cannot complete."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Creator", to: "/dashboard/creator" }, { label: "Upload safety" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Private quarantine</Badge>
        <Badge variant="outline">No executable/active child uploads</Badge>
        <Badge variant="outline">No GPS/EXIF publication</Badge>
        <Badge variant="outline">Original file never public</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map(([number, title, detail]) => (
          <Card key={title}>
            <CardHeader><CardTitle className="flex items-center gap-2"><span className="flex size-7 items-center justify-center rounded-full bg-muted text-xs">{number}</span>{title}</CardTitle><CardDescription>{detail}</CardDescription></CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader><LockKeyhole className="size-5 text-primary" /><CardTitle>Storage boundary</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Originals and sanitized derivatives remain private unless the separate publishing workflow explicitly releases the derivative.</CardContent></Card>
        <Card><CardHeader><MapPinOff className="size-5 text-primary" /><CardTitle>Metadata privacy</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Precise location and camera metadata are stripped instead of being carried into shared media.</CardContent></Card>
        <Card><CardHeader><ScanSearch className="size-5 text-primary" /><CardTitle>Fail closed</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">Pending, review, blocked or errored scans stay quarantined. Only a clear scan plus a sanitized derivative can leave ingestion quarantine.</CardContent></Card>
      </div>

      <Card>
        <CardHeader><div className="flex items-center gap-2"><FileCheck2 className="size-5 text-primary" /><CardTitle>Backend status</CardTitle></div></CardHeader>
        <CardContent className="text-sm text-muted-foreground">This is the enforced contract for the future dedicated storage/scanning backend. Upload controls remain non-live until that backend exists; the prototype does not accept real child media into an unprotected bucket.</CardContent>
      </Card>
    </div>
  );
}
