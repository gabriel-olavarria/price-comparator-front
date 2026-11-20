import { useState } from "react";
import type { CartTab } from "../components/cart-tabs/CartTabs";

export function useSmartCartPage() {
  const [activeTab, setActiveTab] = useState<CartTab>("cart");

  return {
    activeTab,
    setActiveTab,
  };
}
