import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import type { Coordinates } from "../../models/location.models";

import "leaflet/dist/leaflet.css";
import "./LocationMap.css";

interface Props {
  coordinates: Coordinates;
  onChange: (coordinates: Coordinates) => void;
}

const markerIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIconRetinaUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapEvents({ onChange }: Pick<Props, "onChange">) {
  useMapEvents({
    click(event) {
      onChange({
        latitude: event.latlng.lat,
        longitude: event.latlng.lng,
      });
    },
  });

  return null;
}

function MapController({ coordinates }: { coordinates: Coordinates }) {
  const map = useMap();

  useEffect(() => {
    map.setView([coordinates.latitude, coordinates.longitude], map.getZoom(), {
      animate: false,
    });
  }, [coordinates.latitude, coordinates.longitude, map]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [map]);

  return null;
}

export default function LocationMap({ coordinates, onChange }: Props) {
  return (
    <div className="location-map">
      <MapContainer
        center={[coordinates.latitude, coordinates.longitude]}
        zoom={15}
        scrollWheelZoom
        className="location-map__container"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={[coordinates.latitude, coordinates.longitude]}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend(event) {
              const position = event.target.getLatLng();

              onChange({
                latitude: position.lat,
                longitude: position.lng,
              });
            },
          }}
        />

        <MapEvents onChange={onChange} />

        <MapController coordinates={coordinates} />
      </MapContainer>
    </div>
  );
}
