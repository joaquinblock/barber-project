import { Input, Button, ErrorInline } from '@/shared/components/ui';
import { Mail, Lock, AlertCircle } from 'lucide-react'; // Tus iconos
import styles from './login-form.module.css';
import { AuthLink } from '../../components/AuthLink/AuthLink';
import type { LoginCredentials } from '@/core/auth/types';
import { useState, type SyntheticEvent } from 'react';

type LoginFormProps = {
  onLogin: (credentials: LoginCredentials) => void;
  isLoading?: boolean; // Para mostrar un spinner o deshabilitar el botón mientras se procesa el login
  errorMsg?: string | null; // Para mostrar mensajes de error específicos de autenticación
};
export const LoginForm = ({onLogin, isLoading, errorMsg}: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    onLogin({ email, password });
  }
  
  return (
    <form className={styles.formLogin} onSubmit={handleSubmit}>
      <Input 
        icon={Mail} 
        type="email"
        placeholder="Correo electrónico" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input 
        icon={Lock} 
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button 
        variant="primary" 
        type="submit" 
        disabled={isLoading} // Deshabilita el botón mientras se procesa el login
        >
          {isLoading ? <span className={styles.spinner}></span> : "Iniciar sesión"}
        </Button>
      {errorMsg && (
        <ErrorInline iconLeft={AlertCircle}>
          {errorMsg}
        </ErrorInline>
      )} {/* Muestra el mensaje de error si existe */}
      <AuthLink text="¿No tienes una cuenta?" linkText="Regístrate" to="/register" />
    </form>
  );
};