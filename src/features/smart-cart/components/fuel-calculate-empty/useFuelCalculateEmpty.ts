import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { FuelCalculateEmptyProps } from "./FuelCalculateEmpty.tsx";

export function useFuelCalculateEmpty(props: FuelCalculateEmptyProps) {
  const { selectedLocationMap } = props;

   const navigate = useNavigate();

  const addConfigurate = () => {
    navigate("/comparar");
  };

  useEffect(() => {
 
  }, [selectedLocationMap]);

  return {
    addConfigurate,
  };
}
