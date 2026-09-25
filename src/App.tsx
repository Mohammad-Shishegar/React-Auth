import { RouterProvider } from "react-router-dom";
import AuthProvider from "./providers/AuthProvider";
import { router } from "./routes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeManager from "@/common/ThemeManager";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeManager />
      <AuthProvider>
        {" "}
        <RouterProvider router={router} />{" "}
      </AuthProvider>
    </QueryClientProvider>
  );
};
export default App;
