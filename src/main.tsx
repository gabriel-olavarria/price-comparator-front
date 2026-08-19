import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "./index.css";
import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
 

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider>
            <App />
        </MantineProvider>
    </StrictMode>,
);