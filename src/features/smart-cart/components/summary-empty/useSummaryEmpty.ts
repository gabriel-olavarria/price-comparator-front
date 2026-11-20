import { useNavigate } from "react-router-dom";

export function useSummaryEmpty() {
  const navigate = useNavigate();

  const addMore = () => {
    navigate("/comparar");
  };

  return {
    addMore,
  };
}
