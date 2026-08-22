import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { PublicIntakeForm } from "@/components/public/public-intake-form";
import { PublicPage } from "@/components/public/public-page";
import { PageHero, Section } from "@/components/public/sections";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact-enquiry")({
  head: () => ({
    meta: [
      { title: "Send an enquiry — Aurelia" },
      {
        name: "description",
        content: "Send a privacy-minimal enquiry to Aurelia about families, schools, education groups, organisations or press.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ContactEnquiryPage,
});

function ContactEnquiryPage() {
  return (
    <PublicPage>
      <PageHero
        eyebrow="Contact Aurelia"
        title="Tell us what you need"
        description="Use this route for general, family, school, education-group, organisation or press enquiries. Please do not include personal information about a child here; safeguarding concerns have their own restricted route."
        actions={
          <Button asChild variant="outline" size="lg">
            <Link to="/contact"><ArrowLeft className="mr-2 size-4" /> Back to contact routes</Link>
          </Button>
        }
      />
      <Section>
        <div className="mx-auto max-w-3xl">
          <PublicIntakeForm mode="enquiry" />
          <div className="mt-6 flex gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-accent-foreground" aria-hidden="true" />
            <p>
              If your message concerns a child's safety, content involving a child, or conduct towards a child, use the safeguarding route instead so it enters the restricted concern queue.
            </p>
          </div>
        </div>
      </Section>
    </PublicPage>
  );
}
