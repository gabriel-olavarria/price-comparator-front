import { ArrowRight, MapPin, Pencil, Route } from "lucide-react";
import { lazy, Suspense } from "react";

const LocationPickerModal = lazy(
  () => import("../location-picker/LocationPickerModal"),
);
import {
  useSupermarketRoute,
  type SupermarketRouteProps,
} from "./useSupermarketRoute";
import "./SupermarketRoute.css";
import { RoutePoint } from "./RoutePoint.tsx";
import { Center, Loader } from "@mantine/core";

 

export function SupermarketRoute(props: SupermarketRouteProps) {
  
  const {
    route,
    formatDistance,
    location,
    locationModalOpened,
    locationLabel,
    loadingSupermarkets,
    errorSupermarkets,
    openLocationModal,
    closeLocationModal,
    handleConfirmLocation,
  } = useSupermarketRoute(props);
 
  return (
    <>
      <section className="supermarket-route">
        <header className="summary-header">
          <div className="summary-heading">
            <div className="summary-heading-icon">
              <Route />
            </div>
            <h3>Recorrido por supermercados</h3>
          </div>
          <div className="route-location-control">
            <div className="route-current-location">
              <MapPin size={21} strokeWidth={2} aria-hidden="true" />
              <div>
                <span>Ubicación actual</span>
                <strong title={locationLabel}>{locationLabel}</strong>
              </div>
            </div>
            <button type="button" className="route-change" onClick={openLocationModal}>
              <Pencil size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </div>
        </header>

        {!location && (
          <div className="api-status" role="status">
            Selecciona tu ubicación para calcular las distancias del recorrido.
          </div>
        )}
        
        {errorSupermarkets && (
          <p className="supermarket-route-status supermarket-route-status--error" role="alert">
            {errorSupermarkets}
          </p>
        )}
        
        
        {loadingSupermarkets ? (
          <Center mih={300}>
            <Loader size={36} color="violet" type="dots" />
          </Center>
        ) : (
          <div className="supermarket-route-list">
            {route.map((segment, index) => (
              <div
                key={`${segment.from.id}-${segment.to.id}-${index}`}
                className="supermarket-route-step"
              >
                <div className="supermarket-route-step-indicator">
                  <span className="supermarket-route-step-number">
                    {index + 1}
                  </span>
                </div>

                <div className="supermarket-route-segment">
                  <div className="supermarket-route-locations">
                    <RoutePoint location={segment.from} />
                    <ArrowRight
                      className="supermarket-route-arrow"
                      size={23}
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />
                    <RoutePoint location={segment.to} />
                  </div>

                  <span
                    className="supermarket-route-distance"
                    title="Distancia aproximada en línea recta"
                  >
                    {formatDistance(segment.distanceKm)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        

      </section>

      {locationModalOpened && (
        <Suspense fallback={null}>
          <LocationPickerModal
            opened={locationModalOpened}
            onClose={closeLocationModal}
            onConfirm={handleConfirmLocation}
            initialLocation={location}
            title="Seleccionar ubicación de origen"
          />
        </Suspense>
      )}
    </>
  );
}
