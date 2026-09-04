import { useEffect, useState, type ReactNode } from "react";
import { usePost } from "../hooks/api/usePost";
import { useAuthStore } from "../store/auth.store";
import { useGet } from "../hooks/api/useGet";

interface AuthProviderProps {
  children: ReactNode;
}
const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isInitializing, setIsInitializing] = useState(true);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInformation = useAuthStore((state) => state.setUserData);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  const {
    data: userData,
    isLoading: userLoading,
    refetch: getCurrentUser,
  } = useGet("/auth/me", ["current-user"], false);

  const refresh = usePost("/auth/refresh", undefined, {
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      getCurrentUser();
    },
    onError: () => {
      clearAuth();
      setIsInitializing(false);
    },
  });

  useEffect(() => {
    refresh.mutate({});
  }, []);

  useEffect(() => {
    if (!userLoading && userData) {
      setUserInformation(userData);
      setIsInitializing(false);
    }
  }, [userData, userLoading, setUserInformation]);

  if (isInitializing) {
    return <div>Loading...</div>;
  }

  return children;
};
export default AuthProvider;
