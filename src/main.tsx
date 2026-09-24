import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./app/App";

import {
    createTheme,
    MantineProvider,
} from "@mantine/core";

import "@mantine/core/styles.css";
import "./index.css";

import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/600.css";
import "@fontsource/roboto/700.css";
import "@fontsource/roboto/800.css";
import "@fontsource/roboto/900.css";

import "@fontsource/manrope/400.css";
import "@fontsource/manrope/500.css";
import "@fontsource/manrope/600.css";
import "@fontsource/manrope/700.css";
import "@fontsource/manrope/800.css";

const theme = createTheme({
    fontFamily: "Roboto, sans-serif",

    headings: {
        fontFamily: "Roboto, sans-serif",
    },
});

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <MantineProvider theme={theme}>
            <App />
        </MantineProvider>
    </StrictMode>,
);