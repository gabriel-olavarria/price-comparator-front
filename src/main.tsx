
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import { MantineProvider } from "@mantine/core";

import App from "./app/App";

import "@mantine/core/styles.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <>
    <MantineProvider>
      <App />
    </MantineProvider>

    <Toaster
      position="top-right"
      duration={3000}
      closeButton
      visibleToasts={3}
      toastOptions={{
        style: {
          background: "#F3EEFF",
          color: "#45217A",
          border: "1px solid #DCCBFF",
          borderRadius: "14px",
          boxShadow: "0 8px 24px rgba(87, 45, 145, 0.12)",
          padding: "16px",
          fontFamily: "inherit",
        },
      }}
    />
  </>,
);
