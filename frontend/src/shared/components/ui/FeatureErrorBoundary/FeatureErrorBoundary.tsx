import type { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import styles from './feature-error-boundary.module.css';

interface Props {
  children: ReactNode;
  featureName: string;
  fallback?: ReactNode;
}

export const FeatureErrorBoundary = ({ children, featureName, fallback }: Props) => {
  //cuando ocurre un error de red o de fetch en feature, al presionar reintentar, el Error Boundary le avisa a React Query que limpie el cache de errores para esa query especifica y vuelva a intentar la peticion sin refrescar la pagina.
  
  const { reset } = useQueryErrorResetBoundary(); 

  return (
    <ErrorBoundary
      onReset={reset}
      fallbackRender={({ resetErrorBoundary }) => {
        if (fallback) {
          return fallback;
        }

        return (
          <div className={styles.errorContainer}>
            <AlertCircle className={styles.errorIcon} size={48} />
            <h2 className={styles.errorTitle}>Error en la carga de módulo</h2>
            <p className={styles.errorMessage}>
              Hubo un problema al cargar el módulo <strong>{featureName}</strong>. 
              Por favor, intentalo de nuevo más tarde o recargá la página.
            </p>
            <button 
              className={styles.errorButton} 
              onClick={resetErrorBoundary}
            >
              Reintentar
            </button>
          </div>
        );
      }}
    >
      {children}
    </ErrorBoundary>
  );
};
