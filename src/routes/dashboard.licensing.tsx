import { createFileRoute } from "@tanstack/react-router";
import { Building2, CreditCard, Users } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/dashboard/licensing")({
  component: LicensingPage,
});

const schools = [
  { name: "Mayfair School", active: 356, licensed: 420 },
  { name: "City School", active: 512, licensed: 600 },
  { name: "International School", active: 438, licensed: 500 },
];

function LicensingPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Enterprise"
        title="Licensing & billing"
        description="Group-level licence utilisation, school allocation and renewal controls. Billing provider integration will attach behind this view."
        crumbs={[{ label: "Dashboards", to: "/dashboard" }, { label: "Licensing & billing" }]}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CreditCard className="size-4" /> Group Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge>Active</Badge>
            <p className="mt-3 text-2xl font-semibold">2,500 learner licences</p>
            <p className="text-sm text-muted-foreground">Preview contract configuration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="size-4" /> Learner utilisation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">1,940 / 2,500</p>
            <Progress value={78} className="mt-3" />
            <p className="mt-2 text-sm text-muted-foreground">78% active allocation</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="size-4" /> School allocation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">8 / 10</p>
            <Progress value={80} className="mt-3" />
            <p className="mt-2 text-sm text-muted-foreground">Two school slots available</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">School licence allocation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {schools.map((school) => {
            const percent = Math.round((school.active / school.licensed) * 100);
            return (
              <div key={school.name}>
                <div className="mb-2 flex items-center justify-between gap-4 text-sm">
                  <span className="font-medium">{school.name}</span>
                  <span className="text-muted-foreground">
                    {school.active} / {school.licensed}
                  </span>
                </div>
                <Progress value={percent} />
              </div>
            );
          })}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Preview data only. Live invoicing, contract terms and payment-provider details are intentionally not connected yet.
      </p>
    </div>
  );
}
