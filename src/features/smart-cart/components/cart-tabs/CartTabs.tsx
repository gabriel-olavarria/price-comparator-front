import "./CartTabs.css";

export type CartTab = "cart" | "optimization" | "summary";

interface CartTabsProps {
  activeTab: CartTab;
  onTabChange: (tab: CartTab) => void;
}

const tabs: { id: CartTab; label: string }[] = [
  {
    id: "cart",
    label: "Mi carrito",
  },

  {
    id: "summary",
    label: "Mi resumen",
  },
];

export function CartTabs({ activeTab, onTabChange }: CartTabsProps) {
  return (
    <nav className="cart-tabs" aria-label="Navegación del carrito inteligente">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`cart-tab ${activeTab === tab.id ? "active" : ""}`}
          aria-current={activeTab === tab.id ? "page" : undefined}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="cart-tab-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
