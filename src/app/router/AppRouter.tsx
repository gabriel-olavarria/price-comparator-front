import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    HydrateFallback: () => <div>Cargando aplicación...</div>,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (
            await import("../../features/product-search/pages/ProductSearchPage")
          ).ProductSearchPage,
        }),
      },
      {
        path: "comparar",
        lazy: async () => ({
          Component: (
            await import("../../features/product-search/pages/ProductSearchPage")
          ).ProductSearchPage,
        }),
      },
      {
        path: "carrito",
        lazy: async () => ({
          Component: (
            await import("../../features/smart-cart/pages/SmartCartPage")
          ).SmartCartPage,
        }),
      },
    ],
  },
]);
