import { useEffect } from "react";

import { useThemeStore } from "@/store/theme.store";

const ThemeManager = () => {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return null;
};

export default ThemeManager;
