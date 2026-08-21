import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, FileCheck2, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard/teacher-review")({
  head: () => ({ meta: [{ title: "Submission Review — Aurelia" }] }),
  component: TeacherReview,
});

const submissions = [
  { title: "Why bees matter", type: "Podcast", status: "Ready to review" },
  { title: "Recycled city model", type: "Project", status: "Safety cleared" },
  { title: "Five-minute mystery", type: "Story", status: "Ready to review" },
];

function TeacherReview() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Evidence review"
        title="Submission review"
        description="Review work from authorised cohorts, give constructive feedback and decide whether evidence supports a verified Passport achievement. The review is about the work, not comparison between children."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Teacher", to: "/dashboard/teacher" }, { label: "Review Queue" }]}
      />
      <div className="grid gap-4 md:grid-cols-3">
        {submissions.map((item) => (
          <Card key={item.title}>
            <CardHeader><FileCheck2 className="mb-2 size-5 text-primary" /><CardTitle>{item.title}</CardTitle><CardDescription>{item.type}</CardDescription></CardHeader>
            <CardContent className="space-y-3"><Badge variant="secondary">{item.status}</Badge><Button variant="outline" className="w-full" disabled>Open evidence</Button></CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Review notes</CardTitle><CardDescription>Feedback is attached to the submission and visible only to authorised participants.</CardDescription></CardHeader>
        <CardContent className="space-y-3"><Textarea placeholder="Evidence-based feedback..." disabled /><div className="flex flex-wrap gap-2"><Button disabled><CheckCircle2 className="mr-2 size-4" />Verify achievement</Button><Button variant="outline" disabled>Return for revision</Button></div></CardContent>
      </Card>
      <Card><CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Review boundary</CardTitle></div></CardHeader><CardContent className="text-sm text-muted-foreground">Teachers can review only submissions belonging to cohorts in their current authorised assignment. There is no public class ranking or comparative score feed.</CardContent></Card>
    </div>
  );
}
