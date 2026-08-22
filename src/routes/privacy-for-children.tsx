import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/privacy-for-children")({
  head: () => ({
    meta: [
      { title: "Your privacy, explained simply — Aurelia World" },
      {
        name: "description",
        content:
          "A simple explanation for young people of privacy, private drafts, sharing permissions and safety on Aurelia World.",
      },
      { property: "og:title", content: "Your privacy, explained simply — Aurelia World" },
      {
        property: "og:description",
        content:
          "What Aurelia World knows about you, who can see your work, and how to ask for help — explained simply.",
      },
      { property: "og:url", content: "/privacy-for-children" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/privacy-for-children" }],
  }),
  component: PrivacyForChildren,
});

function PrivacyForChildren() {
  return (
    <PublicPage>
      <LegalPage
        title="Your privacy, explained simply"
        updated="22 August 2026"
        intro="Aurelia World is run by Global Solutions Management LLC. This page explains, in plain words, what the platform knows about you, what stays private, and how you can ask for help."
      >
        <h2>What we know about you</h2>
        <p>
          We keep the information we need to give you the right type of account and keep it safe —
          for example your name, age band, country and the verified adult, school or organisation
          connected to your account. We also keep the projects you save so you can come back to them.
        </p>
        <p>
          We try not to collect information we do not need. We do not sell your personal
          information and we do not use it to show you behavioural adverts.
        </p>

        <h2>Your drafts are private</h2>
        <p>
          When you save a draft, it does <strong>not</strong> automatically become visible to your
          parent, teacher, school or anyone else. Your private workspace is protected by the rules
          built into Aurelia World.
        </p>
        <p>
          If you press "Request to share", the platform starts a protected approval journey. Your
          parent or guardian can see the permission request they need to decide, but that does not
          give them a general right to browse all your private drafts.
        </p>

        <h2>What happens if you want to share something</h2>
        <p>
          Work does not become public just because you ask to share it. Sharing can require safety
          checks, your parent or guardian's approval and moderation before it can reach an approved
          audience. A teacher can see work only when the platform rules and permissions allow it.
          Strangers cannot browse your private account or message you through an open child directory.
        </p>

        <h2>Who helps manage your account</h2>
        <p>
          A verified parent, guardian, school or approved organisation may help sponsor or manage
          parts of your account, depending on how you joined Aurelia World. Adults can make the
          decisions their role allows, but they do not automatically get access to everything you
          write or make privately.
        </p>

        <h2>AI tools</h2>
        <p>
          Aurelia World's AI tools are there to help with things like ideas, structure, spelling or
          accessibility. They are not a person or a secret friend, and they can make mistakes. Do
          not tell an AI tool secrets or personal information you would not want shared with the
          adults who help keep the platform safe.
        </p>

        <h2>How to ask for information to be changed or deleted</h2>
        <p>
          You can ask a parent, guardian or another trusted adult to help you ask what information
          we hold, correct something that is wrong, remove a project or close an account. Some
          safety or legal records may need to be kept for longer even after an account is closed.
          You can also ask for help through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          .
        </p>

        <h2>How to tell someone if you feel unsafe</h2>
        <p>
          If anything on Aurelia World makes you worried, uncomfortable or unsafe, tell a parent,
          guardian, teacher or another adult you trust. You can also use the report tools on the
          platform or visit our{" "}
          <Link
            to="/safeguarding-and-reporting"
            className="font-medium text-foreground underline underline-offset-4"
          >
            safeguarding and reporting page
          </Link>
          . You will not get in trouble for asking for help.
        </p>

        <h2>Who runs Aurelia World</h2>
        <p>
          Aurelia World is operated by <strong>Global Solutions Management LLC</strong>. The longer{" "}
          <Link to="/privacy-policy" className="font-medium text-foreground underline underline-offset-4">
            Privacy Policy
          </Link>{" "}
          explains the legal details for parents, schools and other adults.
        </p>
      </LegalPage>
    </PublicPage>
  );
}
