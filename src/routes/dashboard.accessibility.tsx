import { createFileRoute } from "@tanstack/react-router";
import { Captions, Eye, Languages, Move, ShieldCheck, TextCursorInput } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPPORTED_LOCALES } from "@/config/locales";

export const Route = createFileRoute("/dashboard/accessibility")({
  head: () => ({ meta: [{ title: "Language & accessibility — Aurelia" }] }),
  component: AccessibilitySettings,
});

const preferences = [
  { title: "Text size", value: "Default", description: "Support larger text without clipping or hiding controls.", icon: TextCursorInput },
  { title: "Reduced motion", value: "Follow device", description: "Animations reduce automatically when the device requests it.", icon: Move },
  { title: "Contrast", value: "System", description: "Core interfaces must remain understandable without colour alone.", icon: Eye },
  { title: "Captions & transcripts", value: "Preferred", description: "Media should expose captions/transcripts whenever available.", icon: Captions },
];

function AccessibilitySettings() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Global access foundation"
        title="Language & accessibility"
        description="Language, reading and motion preferences adapt presentation. They never determine a child's legal jurisdiction, consent rules or safeguarding policy."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Language & accessibility" }]}
      />

      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary">Keyboard first</Badge>
        <Badge variant="outline">RTL ready</Badge>
        <Badge variant="outline">Reduced motion</Badge>
        <Badge variant="outline">Captions preferred</Badge>
      </div>

      <section className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader><div className="flex items-center gap-2"><Languages className="size-5 text-primary" /><CardTitle>Language foundation</CardTitle></div><CardDescription>English (UK) is the current complete interface pack. Other locales are registered so translation can be added without redesigning direction, fallback or policy behaviour.</CardDescription></CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {SUPPORTED_LOCALES.map((locale) => (
              <div key={locale.code} className="rounded-xl border p-4">
                <div className="flex items-center justify-between gap-2"><p className="font-medium" dir={locale.direction}>{locale.nativeLabel}</p><Badge variant={locale.translationState === "ready" ? "secondary" : "outline"}>{locale.direction.toUpperCase()}</Badge></div>
                <p className="mt-1 text-xs text-muted-foreground">{locale.code} · {locale.translationState === "ready" ? "interface ready" : "translation foundation"}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><div className="flex items-center gap-2"><ShieldCheck className="size-5 text-primary" /><CardTitle>Policy separation</CardTitle></div></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="rounded-lg bg-muted/40 p-3">✓ Language changes presentation only.</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Jurisdiction comes from separately verified account/school policy data.</p>
            <p className="rounded-lg bg-muted/40 p-3">✓ Unknown locale uses a safe translation fallback.</p>
            <p className="rounded-lg bg-muted/40 p-3">✕ Arabic language selection does not imply UAE jurisdiction, for example.</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {preferences.map((preference) => (
          <Card key={preference.title}>
            <CardHeader><preference.icon className="size-5 text-primary" /><CardTitle className="text-base">{preference.title}</CardTitle><CardDescription>{preference.description}</CardDescription></CardHeader>
            <CardContent><Button variant="outline" className="w-full" disabled>{preference.value}</Button></CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardHeader><CardTitle>Accessibility acceptance criteria</CardTitle><CardDescription>Every interactive release should remain usable by keyboard, expose visible focus, preserve semantic labels/statuses, support zoom/reflow, honour reduced motion and avoid relying on colour alone.</CardDescription></CardHeader>
      </Card>
    </div>
  );
}
