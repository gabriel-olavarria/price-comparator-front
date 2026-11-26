import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Button, Group, Modal, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { LocateFixed, MapPin } from "lucide-react";

import AddressSearch from "./AddressSearch";
import LocationMap from "./LocationMap";

import { useUserLocation } from "../../hooks/useUserLocation";
import { reverseGeocode } from "../../services/geocoding.service.ts";

import type {
  Coordinates,
  SelectedLocation,
} from "../../models/location.models.ts";

import type { AddressSuggestion } from "../../models/addressSuggestion.models.ts";

import "./LocationPickerModal.css";

interface Props {
  opened: boolean;
  onClose: () => void;
  onConfirm: (location: SelectedLocation) => void;
  initialLocation?: SelectedLocation | null;
  title?: string;
}

export default function LocationPickerModal({
  opened,
  onClose,
  onConfirm,
  initialLocation,
  title = "Seleccionar ubicación",
}: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    location: userLocation,
    loading,
    error,
    getLocation,
  } = useUserLocation();

  const [selected, setSelected] = useState<SelectedLocation | null>(
    initialLocation ?? null,
  );

  const [resolvingAddress, setResolvingAddress] = useState(false);

  const [addressError, setAddressError] = useState<string | null>(null);

  const wasOpened = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const initialLocationRef = useRef(initialLocation);
  const searchValueRef = useRef(initialLocation?.address ?? "");

  initialLocationRef.current = initialLocation;

  const resolveLocation = useCallback(async (coordinates: Coordinates) => {
    controller.current?.abort();

    const request = new AbortController();
    controller.current = request;

    const id = ++requestId.current;

    setSelected({
      ...coordinates,
      address: "Obteniendo dirección...",
      city: "",
      state: "",
    });

    setResolvingAddress(true);
    setAddressError(null);

    try {
      const address = await reverseGeocode(coordinates, request.signal);

      if (request.signal.aborted || id !== requestId.current) {
        return;
      }

      setSelected({
        ...coordinates,
        address: address.address,
        city: address.city,
        state: address.state,
      });
    } catch {
      if (request.signal.aborted || id !== requestId.current) {
        return;
      }

      setSelected({
        ...coordinates,
        address: "Dirección no disponible",
        city: "",
        state: "",
      });

      setAddressError("No fue posible obtener la dirección de este punto.");
    } finally {
      if (!request.signal.aborted && id === requestId.current) {
        setResolvingAddress(false);
      }
    }
  }, []);

  useEffect(() => {
    if (opened && !wasOpened.current) {
      const startingLocation = initialLocationRef.current ?? null;

      setSelected(startingLocation);
      setAddressError(null);

      if (!startingLocation) {
        getLocation();
      }
    }

    if (!opened) {
      controller.current?.abort();
      requestId.current++;

      setResolvingAddress(false);
    }

    wasOpened.current = opened;
  }, [opened, getLocation]);

  useEffect(() => {
    if (
      opened &&
      userLocation &&
      !initialLocationRef.current &&
      !selected
    ) {
      void resolveLocation(userLocation);
    }
  }, [opened, userLocation, selected, resolveLocation]);

  useEffect(() => {
    return () => {
      controller.current?.abort();
      requestId.current++;
    };
  }, []);

  const handleAddressSelect = (suggestion: AddressSuggestion) => {
    controller.current?.abort();
    requestId.current++;

    setResolvingAddress(false);
    setAddressError(null);

    setSelected({
      latitude: suggestion.latitude,
      longitude: suggestion.longitude,
      address: suggestion.formatted,
      city: suggestion.city ?? "",
      state: suggestion.region ?? "",
    });
  };

  const handleMapChange = (coordinates: Coordinates) => {
    void resolveLocation(coordinates);
  };

  const handleCurrentLocation = () => {
    if (userLocation) {
      void resolveLocation(userLocation);
    } else {
      getLocation();
    }
  };

  const handleConfirm = () => {
    if (!selected || resolvingAddress) {
      return;
    }

    onConfirm(selected);
    onClose();
  };

  const address = selected?.address ?? "";
  const addressIsPending =
    address === "Obteniendo dirección..." ||
    address === "Dirección no disponible";

  if (!addressIsPending && searchValueRef.current !== address) {
    searchValueRef.current = address;
  }

  const searchValue = addressIsPending ? searchValueRef.current : address;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      size="850px"
      centered
      radius="lg"
      fullScreen={isMobile}
      className="location-picker-modal"
      overlayProps={{
        backgroundOpacity: 0.5,
        blur: 3,
      }}
    >
      <div className="location-picker">
        <Text size="sm" c="dimmed">
          Busca una dirección o selecciona un punto en el mapa.
        </Text>

        <AddressSearch value={searchValue} onSelect={handleAddressSelect} />

        <Group justify="flex-end">
          <Button
            variant="light"
            color="violet"
            leftSection={<LocateFixed size={17} />}
            loading={loading}
            onClick={handleCurrentLocation}
          >
            Mi ubicación
          </Button>
        </Group>

        {error && <Alert color="orange">{error}</Alert>}

        {addressError && <Alert color="orange">{addressError}</Alert>}

        {selected ? (
          <LocationMap coordinates={selected} onChange={handleMapChange} />
        ) : (
          <div className="location-picker__placeholder">
            <MapPin size={24} />

            <Text size="sm">
              {loading
                ? "Obteniendo ubicación..."
                : "Busca una dirección o permite tu ubicación."}
            </Text>
          </div>
        )}

        {selected && (
          <div className="location-picker__selected">
            <MapPin size={20} />

            <div>
              <Text size="sm" fw={600}>
                Ubicación seleccionada
              </Text>

              <Text size="sm">{selected.address}</Text>

              <Text size="xs" c="dimmed">
                {selected.latitude.toFixed(6)}, {selected.longitude.toFixed(6)}
              </Text>
            </div>
          </div>
        )}

        <Group justify="flex-end" mt="md">
          <Button variant="default" onClick={onClose}>
            Cancelar
          </Button>

          <Button
            disabled={!selected || resolvingAddress}
            loading={resolvingAddress}
            onClick={handleConfirm}
            className="location-picker__primary"
          >
            Confirmar ubicación
          </Button>
        </Group>
      </div>
    </Modal>
  );
}
