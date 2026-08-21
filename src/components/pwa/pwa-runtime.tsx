import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function PwaRuntime() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateNetworkState = () => setIsOnline(navigator.onLine);
    updateNetworkState();

    window.addEventListener("online", updateNetworkState);
    window.addEventListener("offline", updateNetworkState);

    if ("serviceWorker" in navigator && window.location.protocol === "https:") {
      navigator.serviceWorker.register("/sw.js").catch((error) => {
        console.warn("Service worker registration failed", error);
      });
    }

    return () => {
      window.removeEventListener("online", updateNetworkState);
      window.removeEventListener("offline", updateNetworkState);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto flex max-w-xl items-start gap-3 rounded-xl border bg-background p-4 shadow-lg"
    >
      <WifiOff className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <p className="font-medium">You’re offline</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Protected actions are read-only until you reconnect. Aurelia will not silently queue sensitive changes to send later.
        </p>
      </div>
    </div>
  );
}
