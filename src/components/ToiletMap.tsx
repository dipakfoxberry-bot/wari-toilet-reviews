import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Toilet } from "@/lib/toilets";

interface MapItem {
  toilet: Toilet;
  avgOverall: number;
  count: number;
}

export function ToiletMap({ items }: { items: MapItem[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-[500px] rounded-xl bg-muted animate-pulse" />;

  const color = (avg: number, count: number) => {
    if (count === 0) return "#9ca3af";
    if (avg >= 4) return "#16a34a";
    if (avg >= 3) return "#eab308";
    if (avg >= 2) return "#f97316";
    return "#dc2626";
  };

  return (
    <div className="h-[500px] rounded-xl overflow-hidden border-2 border-orange-200 shadow-lg">
      <MapContainer center={[18.5304, 73.8567]} zoom={12} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {items.map(({ toilet, avgOverall, count }) => (
          <CircleMarker
            key={toilet.uniqueId}
            center={[toilet.latitude, toilet.longitude]}
            radius={count === 0 ? 8 : Math.min(8 + count * 2, 20)}
            pathOptions={{
              color: color(avgOverall, count),
              fillColor: color(avgOverall, count),
              fillOpacity: 0.7,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-sm">
                <strong>{toilet.name}</strong>
                <br />
                {toilet.type === "Male" ? "पुरुष" : "स्त्री"} • {toilet.uniqueId}
                <br />
                {count > 0 ? (
                  <>सरासरी: <strong>{avgOverall.toFixed(1)} ★</strong> ({count} मूल्यांकन)</>
                ) : (
                  <span className="text-gray-500">मूल्यांकन नाही</span>
                )}
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
