import { Link, createFileRoute } from "@tanstack/react-router";

import { PublicPage } from "@/components/public/public-page";
import { LegalPage } from "@/components/public/sections";

export const Route = createFileRoute("/privacy-for-children")({
  head: () => ({
    meta: [
      { title: "Privacy For Children — Aurelia" },
      {
        name: "description",
        content:
          "A simple, plain-language explanation of privacy on Aurelia, written for young people to read and understand.",
      },
      { property: "og:title", content: "Privacy For Children — Aurelia" },
      {
        property: "og:description",
        content:
          "What Aurelia knows about you, who can see your work, and how to ask for help — explained simply.",
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
        updated="August 2026"
        intro="This page tells you, in plain words, what we know about you on Aurelia and how you stay in control."
      >
        <h2>What we know about you</h2>
        <p>
          We know your name, your age, and who your parent or guardian is. We also keep the
          things you make — your stories, art, films, podcasts and other work — so you can find
          them again and keep building on them.
        </p>
        <p>
          We do not ask you for more than we need. We do not use your information to show you
          adverts.
        </p>

        <h2>Who can see your work</h2>
        <p>
          At first, only you and your parent or guardian can see something you make. If you want
          to share it with your class, a club, or more widely, your parent or guardian has to say
          yes first. Nobody can share your work more widely without that permission.
        </p>
        <p>
          Teachers can see the work you share with them, so they can help you and confirm your
          achievements. Strangers cannot message you or see private parts of your account.
        </p>

        <h2>Who is in charge of your account</h2>
        <p>
          Your parent or guardian is in charge of your account. They set it up, they approve what
          gets shared, and they can see what is happening on it. If you are ever unsure about a
          setting or a decision, they are the best person to ask.
        </p>

        <h2>How to ask for things to be deleted</h2>
        <p>
          If you want something you made removed, or you want your account closed, tell your
          parent or guardian. They can ask us to delete it, and we will, unless we need to keep a
          record for a safety reason. You can also ask a trusted adult to help you make this
          request through our{" "}
          <Link to="/contact" className="font-medium text-foreground underline underline-offset-4">
            contact page
          </Link>
          .
        </p>

        <h2>How to tell someone if you feel unsafe</h2>
        <p>
          If anything on Aurelia makes you feel worried, uncomfortable or unsafe, tell a parent,
          guardian, teacher or another adult you trust straight away. You can also use the report
          button wherever you see it on the platform, or visit our{" "}
          <Link
            to="/safeguarding-and-reporting"
            className="font-medium text-foreground underline underline-offset-4"
          >
            safeguarding and reporting page
          </Link>{" "}
          to find out more. You will not get in trouble for telling someone.
        </p>
      </LegalPage>
    </PublicPage>
  );
}
