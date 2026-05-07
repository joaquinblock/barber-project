import { AuthHeader } from "../../components/AuthHeader/AuthHeader";
import { SocialProviderList } from "../SocialProviderList/SocialProviderList";
import { LoginForm } from "../LoginForm/LoginForm";
import styles from "./login-manager.module.css";
import type { LoginCredentials } from "@/core/auth/types";
import { Suspense, useState } from "react";
import { useAuth } from "@/core/auth/context/auth.context";
import { useParams } from "react-router-dom";
import { FeatureErrorBoundary } from "@/shared/components/ui";
import { ApiError, HttpError } from "@barber/shared/errors";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";
import { ErrorCode } from "@barber/shared/errors";

const LoginManagerContent = () => {
  const { login, isLoading } = useAuth();
  const { slug } = useParams<{ slug: string }>();
  const [error, setError] = useState<string | null>(null);
  
  function handelSelectProvider(providerId: string) {
    console.log(`Selected provider: ${providerId}`);
  }

  const handleLogin = async (credentials: LoginCredentials) => {
    if (!slug) {
      console.error("No se encontró el slug de la barbería en la URL");
      return;
    }
    
    try {
      await login(credentials, slug);
    } catch (e) {
      let msg = '';
      if (e instanceof ApiError) {
        // Error de lógica: el backend contestó con un code semántico
        msg = ERROR_MESSAGES[e.code as ErrorCode] ?? e.message;
      } else if (e instanceof HttpError) {
        // Error de infraestructura: sin internet, servidor caído
        msg = ERROR_MESSAGES[ErrorCode.SERVER_ERROR] ?? e.message;
      } else {
        msg = ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR] ?? 'Ocurrió un error inesperado.';
      }
      setError(msg);
    }
  }

  return (
    <div>
      <AuthHeader></AuthHeader>
      <div className={styles.loginContainer}>
        <LoginForm onLogin={handleLogin} errorMsg={error} isLoading={isLoading}></LoginForm>
        <SocialProviderList
          onSelect={handelSelectProvider}
        ></SocialProviderList>
      </div>
    </div>
  );
};

export const LoginManager = () => (
  <FeatureErrorBoundary featureName="Login">
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginManagerContent />
    </Suspense>
  </FeatureErrorBoundary>
);

