import { AuthHeader } from "../../components/AuthHeader/AuthHeader";
import { SocialProviderList } from "../SocialProviderList/SocialProviderList";
import { LoginForm } from "../LoginForm/LoginForm";
import styles from "./login-manager.module.css";
import type { LoginCredentials } from "@/core/auth/types";
import { useState } from "react";
import { useAuth } from "@/core/auth/context/auth.context";
import { useNavigate } from "react-router";
import { AuthError } from "@/core/errors/AuthError";
import { ROUTES_PATH } from "@/core/auth/constants/auth-routes.constants";

export const LoginManager = () => {
  const {login} = useAuth(); // Obtenemos el método de login y el estado de carga del contexto de autenticación
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();
  
  function handelSelectProvider(providerId: string) {
    console.log(`Selected provider: ${providerId}`);
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    setErrorMsg(null);
    try {
      const user = await login(credentials);

      //if(isAdmin) no va porque se produce un stale state, el contexto no se actualiza a tiempo para que isAdmin refleje el nuevo estado. Por eso verificamos el rol directamente con user.role
      
      if (user.role === "admin") {
        console.log("Redirigiendo a admin... " + ROUTES_PATH.ADMIN.ROOT);
        navigate(ROUTES_PATH.ADMIN.ROOT, { replace: true }); // Usamos replace para que no puedan volver al login con el botón de atrás
      } else if (user.role === "employee") {
        navigate(ROUTES_PATH.EMPLOYEE.DASHBOARD, { replace: true });
      } else if (user.role === "customer") {
        navigate(ROUTES_PATH.CUSTOMER.DASHBOARD, { replace: true });
      }
    } catch (error) {
      if(error instanceof AuthError) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      }
    }
  }

  return (
    <div>
      <AuthHeader></AuthHeader>
      <div className={styles.loginContainer}>
        <LoginForm onLogin={handleLogin} errorMsg={errorMsg}></LoginForm>
        <SocialProviderList
          onSelect={handelSelectProvider}
        ></SocialProviderList>
      </div>
    </div>
  );
};
