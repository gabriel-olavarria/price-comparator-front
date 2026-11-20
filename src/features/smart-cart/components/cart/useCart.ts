import { useNavigate } from "react-router-dom";

export function useCart() {
  const navigate = useNavigate();

  const addMore = () => {
    navigate("/comparar");
  };

  return {
    addMore,
  };
}
