import { usePost } from "../../hooks/api/usePost";
import { useAuthStore } from "../../store/auth.store";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../store/theme.store";

const Login = () => {
  const toggleTheme = useThemeStore();

  const navigate = useNavigate();
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserInformation = useAuthStore((state) => state.setUserData);
  const { mutate } = usePost("/auth/login", undefined, {
    onSuccess: (data) => {
      console.log(data);
      setAccessToken(data?.data?.accessToken);
      setUserInformation(data?.data?.user);
      navigate("/");
    },
    onError: (er) => {
      console.log(er);
    },
  });

  const handleLogin = () => {
    const userData = {
      email: "mohammad@test.com",
      password: "123456",
    };
    mutate(userData);
  };
  return (
    <>
      login
      <button onClick={() => handleLogin()}>Login</button>
      <button onClick={() => toggleTheme.toggleTheme()}>change</button>
    </>
  );
};

export default Login;
