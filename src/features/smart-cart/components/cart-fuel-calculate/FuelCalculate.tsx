import { lazy, Suspense } from "react";

import {
  CarFront,
  Fuel,
  Gauge,
  MapPin,
  Navigation,
  Pencil,
  Route,
  Wallet,
} from "lucide-react";

import {
  formatPrice,
  formatNumber,
  formatFuelPrice,
} from "../../../../shared/utils/formatters";

import { useFuelCalculate } from "./useFuelCalculate.ts";
 

import "./FuelCalculate.css";
import type {
  FuelCalculateProps,
} from "../../models/fuelCalculation.models.ts";
import { FuelCalculateEmpty } from "../fuel-calculate-empty/FuelCalculateEmpty.tsx";
import { Center, Loader } from "@mantine/core";

const LocationPickerModal = lazy(
  () => import("../location-picker/LocationPickerModal"),
);

const VehiclePickerModal = lazy(
  () => import("../vehicle-picker/VehiclePickerModal"),
);

 

export function FuelCalculate (props: FuelCalculateProps) {
  const {
    locationUser,
    fuelCalculate,
    // Combustible
    selectedFuelType,
    setSelectedFuelType,

    //Vehiculo
    vehicleUser,

    // Modal de ubicación
    locationModalOpened,
    handleOpenFuelLocationModal,
    handleCloseFuelLocationModal,
    handleConfirmFuelLocation,

    // Modal de vehículo
    vehicleModalOpened,
    handleOpenVehicleModal,
    handleCloseVehicleModal,
    handleConfirmVehicle,

    // Estados de API
    loadingCalculate,
    errorCalculate,

    // Precios

    // Métricas
    distanceKm,
    fuelEfficiency,

    // Estación
    stationName,
    stationAddress,
    stationDistance,
    stationLocation,
    fuels,
    consumption,
  } = useFuelCalculate(props);

 
 

  const nameStationLocation = [stationName, stationAddress].filter(Boolean).join(", ");

 

  const vehicleDescription = vehicleUser
    ? vehicleUser.vehicleType === "walking"
      ? "Sin vehículo"
      : "Vehículo configurado"
    : "Configurar vehículo";

  return (
    <>
      <section className="cart-fuel-distance">
        {/* ENCABEZADO */}
        <header className="summary-header">
          <div className="summary-heading">
            <div className="summary-heading-icon">
              <Fuel size={22} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <div className="cart-fuel-distance-heading-text">
              <h3>Costo de Traslado</h3>
              <p>Estimación del combustible para tu recorrido</p>
            </div>
          </div>
          {vehicleUser && (
            <div className="route-location-control">
              <div className="route-current-location">
                <MapPin size={21} strokeWidth={2} aria-hidden="true" />

                <div>
                  <span>Estación de Servicio</span>

                  <strong title={nameStationLocation}>
                    {nameStationLocation}
                  </strong>
                  {stationDistance !== null && (
                    <span>
                      A {formatNumber(stationDistance)} km de tu ubicación
                    </span>
                  )}
                </div>
              </div>

              <button
                type="button"
                className="route-change"
                onClick={handleOpenFuelLocationModal}
                aria-label="Cambiar estación de servicio"
              >
                <Pencil size={16} strokeWidth={2} aria-hidden="true" />
              </button>
            </div>
          )}
        </header>
        {/* ERROR DE LA API */}
        {errorCalculate && (
          <div className="api-status-error" role="alert">
            {errorCalculate}
          </div>
        )}
        {(locationUser == null || vehicleUser == null) && (
          <FuelCalculateEmpty onOpened={handleOpenVehicleModal} />
        )}
        {loadingCalculate && locationUser != null && vehicleUser != null && (
          <Center mih={300}>
            <Loader size={36} color="violet" type="dots" />
          </Center>
        )}
        {!loadingCalculate &&
          locationUser != null &&
          vehicleUser != null &&
          fuelCalculate !== null && (
          <>
            {/* PRECIOS DE COMBUSTIBLES */}
            <div className="cart-fuel-distance-fuels">
              <div className="cart-fuel-distance-section-heading">
                <h4>Precios de combustibles</h4>
                <span>CLP por litro</span>
              </div>

              <div className="cart-fuel-distance-prices">
                {fuels.map(([type, fuel]) => {
                  const isSelected =
                    selectedFuelType?.combustible != null &&
                    selectedFuelType.combustible === fuel.combustible;

                  return (
                    <button
                      key={type}
                      type="button"
                      className={[
                        "cart-fuel-distance-price-card",
                        isSelected
                          ? "cart-fuel-distance-price-card-active"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => setSelectedFuelType(fuel)}
                      aria-pressed={isSelected}
                    >
                      <span className="cart-fuel-distance-price-label">
                        {fuel.combustible}
                      </span>
                      <strong>{formatFuelPrice(fuel.precioLitro)}</strong>
                      <span className="cart-fuel-distance-price-caption">
                        {isSelected ? "Seleccionado" : "Por litro"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* COSTO Y VEHÍCULO */}
            <div className="cart-fuel-distance-main">
              <div className="cart-fuel-distance-cost">
                <div className="cart-fuel-distance-cost-label">
                  <Wallet size={19} aria-hidden="true" />
                  <span>Costo estimado de combustible</span>
                </div>

                <strong>
                  {loadingCalculate
                    ? "Calculando..."
                    : selectedFuelType?.precioDistancia != null
                      ? formatPrice(selectedFuelType.precioDistancia)
                      : "Pendiente"}
                </strong>

                <span className="cart-fuel-distance-cost-description">
                  Para el recorrido completo
                </span>
              </div>

              {/* VEHÍCULO */}
              <button
                type="button"
                className="cart-fuel-distance-vehicle"
                onClick={handleOpenVehicleModal}
                aria-label="Configurar mi vehículo"
              >
                <span className="cart-fuel-distance-vehicle-icon">
                  <CarFront size={30} strokeWidth={1.7} aria-hidden="true" />
                </span>
                <strong>Mi vehículo</strong>
                <span>{vehicleDescription}</span>
              </button>
            </div>
            {/* MÉTRICAS */}
            <div className="cart-fuel-distance-metrics">
              {/* DISTANCIA */}
              <div className="cart-fuel-distance-metric">
                <div className="cart-fuel-distance-metric-label">
                  <Route size={18} aria-hidden="true" />
                  <span>Distancia total</span>
                </div>
                <strong>
                  {distanceKm != null
                    ? `${formatNumber(distanceKm!)} km`
                    : "Pendiente"}
                </strong>
              </div>

              {/* CONSUMO */}
              <div className="cart-fuel-distance-metric">
                <div className="cart-fuel-distance-metric-label">
                  <Navigation size={18} aria-hidden="true" />
                  <span>Consumo estimado</span>
                </div>
                <strong>
                  {consumption != null ? consumption : "Pendiente"}
                </strong>
              </div>

              {/* RENDIMIENTO */}
              <div className="cart-fuel-distance-metric">
                <div className="cart-fuel-distance-metric-label">
                  <Gauge size={18} aria-hidden="true" />
                  <span>Rendimiento</span>
                </div>
                <strong>
                  {fuelEfficiency != null
                    ? `${formatNumber(fuelEfficiency)} km/L`
                    : "Pendiente"}
                </strong>
              </div>
            </div>
          </>
        )}
      </section>

      {/* MODAL DE UBICACIÓN */}
      {locationModalOpened && (
        <Suspense fallback={null}>
          <LocationPickerModal
            opened={locationModalOpened}
            onClose={handleCloseFuelLocationModal}
            onConfirm={handleConfirmFuelLocation}
            initialLocation={stationLocation}
            title="Seleccionar tu estación de servicio"
          />
        </Suspense>
      )}

      {/* MODAL DE VEHÍCULO */}
      {vehicleModalOpened && (
        <Suspense fallback={null}>
          <VehiclePickerModal
            opened={vehicleModalOpened}
            onClose={handleCloseVehicleModal}
            onConfirm={handleConfirmVehicle}
          />
        </Suspense>
      )}
    </>
  );
}
