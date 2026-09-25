import { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";
import { Button } from "@/components/ui/button";

const Home = () => {
  const userData = useAuthStore((state) => state.clearAuth);

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <div className="text-amber-300 text-8xl">
      Home
      <Button>Test</Button>
    </div>
  );
};
export default Home;
