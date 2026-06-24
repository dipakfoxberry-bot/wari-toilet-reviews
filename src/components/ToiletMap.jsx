
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import toilets from "../data/toilets";

const ToiletMap = ({ ratings }) => {
  const getAvg = (id) => {
    const toiletRatings = ratings.filter(
      (x) => x.toiletId === id
    );

    if (!toiletRatings.length) return 0;

    return (
      toiletRatings.reduce(
        (a, b) => a + b.overall,
        0
      ) / toiletRatings.length
    );
  };

  return (
    <MapContainer
      center={[18.5204, 73.8567]}
      zoom={11}
      style={{
        height: "500px",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {toilets.map((toilet) => {
        const avg = getAvg(
          toilet.uniqueId
        );

        return (
          <Marker
            key={toilet.uniqueId}
            position={[
              toilet.latitude,
              toilet.longitude,
            ]}
          >
            <Popup>
              <b>{toilet.name}</b>
              <br />
              सरासरी रेटिंग :
              {avg.toFixed(1)}
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default ToiletMap;