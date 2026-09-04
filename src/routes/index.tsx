import { createBrowserRouter } from "react-router-dom";
import { authRoutes } from "./auth.routes";
import { appRoutes } from "./app.routes";
export const router = createBrowserRouter([...authRoutes, ...appRoutes]);
