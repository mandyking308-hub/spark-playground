import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "@/components/layout/auth-form";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({
    meta: [
      { title: "Verified access — Aurelia" },
      { name: "description", content: "Aurelia uses verified invitation-based onboarding rather than open self-registration." },
      { property: "og:title", content: "Verified access — Aurelia" },
      { property: "og:description", content: "Use a verified Aurelia invitation to set up an eligible account." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <AuthForm
      mode="sign-up"
      title="Verified access"
      description="Aurelia accounts are provisioned through verified invitation and onboarding workflows."
    />
  ),
});
