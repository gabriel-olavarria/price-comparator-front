import {
  Modal,
  Select,
  Radio,
  NumberInput,
  Button,
  Alert,
  Loader, Center,
} from "@mantine/core";

import {
  CarFront,
  Bike,
  Truck,
  Footprints,
  Check,
  AlertCircle,
  X,
} from "lucide-react";

import type {
  VehiclePickerModalProps,
  VehicleType
} from "../../models/vehicle.models";

import { useVehiclePicker } from "./useVehiclePicker";

import "./VehiclePickerModal.css";

const vehicleOptions = [
  {
    value: "car",
    label: "Automóvil",
    description: "Sedán, hatchback o SUV",
    icon: CarFront,
  },
  {
    value: "motorcycle",
    label: "Motocicleta",
    description: "Moto o scooter",
    icon: Bike,
  },
  {
    value: "truck",
    label: "Camioneta",
    description: "Pickup o utilitario",
    icon: Truck,
  },
  {
    value: "walking",
    label: "Sin vehículo",
    description: "A pie o bicicleta",
    icon: Footprints,
  },
] as const;


export default function VehiclePickerModal({
  opened,
  onClose,
  onConfirm,
}: VehiclePickerModalProps) {
  const {
    vehicleType,
    selectedBrand,
    selectedModel,
    selectedLabel,
    fuelType,
    efficiency,
    catalogLabels,
    catalogBrands,
    catalogModels,
    loadingCatalog,
    errorCatalog,
    isValid,
    handleVehicleTypeChange,
    handleBrandChange,
    setSelectedModel,
    setEfficiency,
    handleConfirm,
    loadingVehicle,
    handleLabelChange,
  } = useVehiclePicker(opened, onConfirm);

  const handleSave = () => {
    if (!isValid) return;

    handleConfirm();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size="lg"
      radius={12}
      withCloseButton={false}
      title={null}
      classNames={{
        content: "vehicle-modal-content",
        body: "vehicle-modal-body",
      }}
    >
      <div className="vehicle-modal-layout">
        {/* ========================================
            ENCABEZADO FIJO
        ======================================== */}
        <header className="vehicle-modal-header">
          <div className="vehicle-modal-heading">
            <div className="vehicle-modal-heading-icon">
              <CarFront size={26} strokeWidth={1.8} aria-hidden="true" />
            </div>

            <div className="vehicle-modal-heading-text">
              <h2>Configurar mi vehículo</h2>

              <p>Personaliza el costo de tus recorridos</p>
            </div>
          </div>

          <button
            type="button"
            className="vehicle-modal-close"
            aria-label="Cerrar configuración del vehículo"
            onClick={onClose}
          >
            <X size={24} strokeWidth={1.8} />
          </button>
        </header>

        {loadingCatalog || loadingVehicle ? (
          <Center mih={300}>
            <Loader size={36} color="violet" type="dots" />
          </Center>
        ) : (
          <>
            <div className="vehicle-modal-main">
              {/* TIPO DE VEHÍCULO */}

              <section className="vehicle-modal-section">
                <h3>¿Cómo realizas tus compras?</h3>

                <Radio.Group value={vehicleType} onChange={(value) => 
                  handleVehicleTypeChange(value as VehicleType)
                  }>
                  <div className="vehicle-type-grid">
                    {vehicleOptions.map((option) => {
                      const Icon = option.icon;
                      const selected = vehicleType === option.value;

                      return (
                        <label
                          key={option.value}
                          className={["vehicle-type-card", selected ? "vehicle-type-card--selected" : "",]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          <div className="vehicle-type-card-top">
                            <Icon size={26} strokeWidth={1.8} aria-hidden="true" />
                            <Radio value={option.value} color="violet" />
                          </div>

                          <strong>{option.label}</strong>
                          <span>{option.description}</span>
                        </label>
                      );
                    })}
                  </div>
                </Radio.Group>
              </section>

              {vehicleType !== "walking" && (
                <>
                  {/* ========================================
                  INFORMACIÓN DEL VEHÍCULO
              ======================================== */}

                  <section className="vehicle-modal-section">
                    <h3>Información del vehículo</h3>

                    {errorCatalog && (
                      <Alert color="red" variant="light" icon={<AlertCircle size={18} />} mb="md">
                        {errorCatalog}
                      </Alert>
                    )}

                    <div className="vehicle-form-grid">
                      <Select
                        label="Marca"
                        placeholder={loadingCatalog ? "Cargando marcas..." : "Seleccionar marca"}
                        data={catalogBrands}
                        value={selectedBrand}
                        onChange={handleBrandChange}
                        disabled={loadingCatalog}
                        searchable
                        nothingFoundMessage="No se encontraron marcas"
                        radius="md"
                        comboboxProps={{ withinPortal: true, zIndex: 1000, }}
                      />

                      <Select
                        label="Modelo"
                        placeholder={!selectedBrand ? "Primero selecciona una marca" : "Seleccionar modelo"}
                        data={catalogModels}
                        value={selectedModel}
                        onChange={setSelectedModel}
                        disabled={!selectedBrand || loadingCatalog}
                        searchable
                        nothingFoundMessage="No se encontraron modelos"
                        radius="md"
                        comboboxProps={{ withinPortal: true, zIndex: 1000, }}
                      />
                    </div>
                    <Select
                      label="Combustión del Vehiculo"
                      placeholder="Seleccionar Combustion del Vehiculo"
                      data={catalogLabels}
                      value={selectedLabel}
                      onChange={handleLabelChange}
                      clearable
                      searchable
                      radius="md"
                      comboboxProps={{ withinPortal: true, zIndex: 1000, }}
                    />
                  </section>

                  {/* ========================================
                  CONSUMO Y COMBUSTIBLE
              ======================================== */}

                  <section className="vehicle-modal-section">
                    <h3>Rendimiento</h3>

                    <div className="vehicle-form-grid">
                      <NumberInput
                        label={fuelType === "electric" ? "Consumo (kWh/100 km)" : "Rendimiento (km/L)"}
                        value={efficiency}
                        onChange={setEfficiency}
                        min={0.1}
                        decimalScale={2}
                        radius="md"
                      />
                    </div>
                  </section>
                </>
              )}
            </div>

            <footer className="vehicle-modal-actions">
              <Button variant="default" radius="md" onClick={onClose}>
                Cancelar
              </Button>

              <Button color="violet" radius="md" leftSection={<Check size={17} />} disabled={!isValid} onClick={handleSave}>
                Confirmar vehículo
              </Button>
            </footer>
          </>
        )}
      </div>
    </Modal>
  );
}
