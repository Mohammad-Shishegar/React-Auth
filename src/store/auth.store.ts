import { create } from "zustand";

interface UserInformation {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}
interface AuthState {
  accessToken: string | null;
  userInformation: UserInformation | null;
  setAccessToken: (accessToken: string | null) => void;
  setUserData: (data: UserInformation) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userInformation: null,
  setUserData: (userInformation) => {
    set({ userInformation });
  },
  setAccessToken: (accessToken) => {
    set({ accessToken });
  },
  clearAuth: () => set({ accessToken: null, userInformation: null }),
}));
