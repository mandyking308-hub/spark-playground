import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "@/components/layout/auth-form";

export const Route = createFileRoute("/auth/sign-up")({
  head: () => ({
    meta: [
      { title: "Create an account — Aurelia" },
      { name: "description", content: "Create an Aurelia account. Placeholder screen for now." },
      { property: "og:title", content: "Create an account — Aurelia" },
      { property: "og:description", content: "Create an Aurelia account." },
    ],
  }),
  component: () => (
    <AuthForm
      mode="sign-up"
      title="Create your account"
      description="Accounts for under-16s are set up with a parent or school."
    />
  ),
});
