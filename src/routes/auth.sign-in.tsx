import { createFileRoute } from "@tanstack/react-router";

import { AuthForm } from "@/components/layout/auth-form";

export const Route = createFileRoute("/auth/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — Aurelia" },
      { name: "description", content: "Sign in securely to your verified Aurelia workspace." },
      { property: "og:title", content: "Sign in — Aurelia" },
      { property: "og:description", content: "Sign in to your verified Aurelia workspace." },
    ],
  }),
  component: () => (
    <AuthForm
      mode="sign-in"
      title="Welcome back"
      description="Sign in to your verified Aurelia workspace."
    />
  ),
});
