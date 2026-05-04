import { AuthHeader } from "../../components/AuthHeader/AuthHeader";
import { SocialProviderList } from "../SocialProviderList/SocialProviderList";
import { LoginForm } from "../LoginForm/LoginForm";
import styles from "./login-manager.module.css";
import type { LoginCredentials } from "@/core/auth/types";
import { Suspense, useState } from "react";
import { useAuth } from "@/core/auth/context/auth.context";
import { useParams } from "react-router-dom";
import { FeatureErrorBoundary } from "@/shared/components/ui";
import { AuthError } from "@/core/auth/errors/auth.error";

const LoginManagerContent = () => {
  const { login, isLoading } = useAuth(); // Obtenemos el método de login y el error del contexto
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
       if(e instanceof AuthError) {
        console.log(e.message);
        setError(e.message);
       }else{
        console.log(e);
        setError("Ocurrió un error inesperado, intenta más tarde.");
       }
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

