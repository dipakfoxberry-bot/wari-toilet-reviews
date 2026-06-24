import { lazy, Suspense } from "react";
import { ClientOnly } from "@tanstack/react-router";
import type { Toilet } from "@/lib/toilets";

const ToiletMap = lazy(() => import("./ToiletMap").then((m) => ({ default: m.ToiletMap })));

interface MapItem {
  toilet: Toilet;
  avgOverall: number;
  count: number;
}

export function ToiletMapLazy({ items }: { items: MapItem[] }) {
  const fallback = <div className="h-[500px] rounded-xl bg-muted animate-pulse" />;
  return (
    <ClientOnly fallback={fallback}>
      <Suspense fallback={fallback}>
        <ToiletMap items={items} />
      </Suspense>
    </ClientOnly>
  );
}
