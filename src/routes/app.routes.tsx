import { type RouteObject } from "react-router-dom";
import Home from "../pages/Home/Home";
import ProtectedRoute from "./ProtectRoutes";
export const appRoutes: RouteObject[] = [
  { element: <ProtectedRoute />, children: [{ path: "/", element: <Home /> }] },
];
