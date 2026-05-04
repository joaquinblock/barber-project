import styles from "./auth-header.module.css";
import { useBarbershop } from "@/shared/hooks/useBarbershop";

/*Al entrar a una URL como /:slug/login, el AuthHeader disparará automáticamente 
la búsqueda de la barbería. Si el slug es válido, verás los datos reales; si no existe,
 el FeatureErrorBoundary capturará el error 404*/ 
export const AuthHeader = () => {
  const { barbershop } = useBarbershop();
  
  const title = barbershop?.name || "Cargando...";
  const subtitle =  "Reserva tu turno para una descarga de flow";
  const logo = barbershop?.photoUrl;

  return (
    <>
      <div className={styles.authHeader}>
        <div className={styles.authBanner}></div>
        <div className={styles.authLogo}>
          {logo && <img src={logo} alt={title} className={styles.logoImage} />}
        </div>
      </div>
      <div className={styles.authTitle}>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </>
  );
};
