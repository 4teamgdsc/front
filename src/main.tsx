import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import { Scene } from "./pages/Scene.tsx";
import { Mobile } from "./pages/Mobile.tsx";
import { ResultPage } from "./pages/Result.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "scene",
    element: <Scene />,
  },
  {
    path: "mobile",
    element: <Mobile />,
  },
  {
    path: "result",
    element: <ResultPage />,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
