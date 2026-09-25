import { type RouteObject } from "react-router-dom";

import Home from "../pages/Home/Home";
import ProtectedRoute from "./ProtectRoutes";
import AppLayout from "@/layout/AppLayout";

export const appRoutes: RouteObject[] = [
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
    ],
  },
];
