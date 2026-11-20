
import { RouterProvider } from "react-router-dom";
import { appRouter } from "./router/AppRouter";

import "./App.css";

function App() {
    return <RouterProvider router={appRouter} />;
}

export default App;
