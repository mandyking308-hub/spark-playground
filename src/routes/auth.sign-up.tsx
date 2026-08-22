import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "@/components/layout/auth-form";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({
    meta: [
      { title: "Verified access — Aurelia" },
      {
        name: "description",
        content:
          "Aurelia has no open self-registration. Accounts are created through verified invitation and onboarding workflows.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Verified access — Aurelia" },
      {
        property: "og:description",
        content: "Aurelia accounts are created through verified invitation and onboarding workflows.",
      },
    ],
  }),
  component: () => (
    <AuthForm
      mode="sign-up"
      title="Verified access only"
      description="An under-16 account is sponsored by a verified parent/guardian or a verified school. Adult and institution roles use their own verified onboarding."
    />
  ),
});
