import { Database, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { currentPublicRuntimeConfig } from "@/config/runtime";

export function BackendStatus() {
  const config = currentPublicRuntimeConfig();

  if (config.backendConnected) {
    return (
      <Badge variant="outline" className="gap-1.5">
        <ShieldCheck className="size-3.5" />
        Backend connected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="gap-1.5">
      <Database className="size-3.5" />
      Preview data
    </Badge>
  );
}
