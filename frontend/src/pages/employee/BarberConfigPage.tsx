import { AvailManager } from "@/features/availability";
import { Button } from "@/shared/components/ui";
import { useAuth } from "@/core/auth/context/auth.context";
import { OfferManager } from "@/features/offers";
//import { ExclManager } from "@/features/exceptions/components";

export const BarberConfigPage = () => {

  const { logout, barberId, barbershopId, isLoading, user } = useAuth();

  // Si aún está cargando, mostramos un loading
  if (isLoading) return <div>Cargando...</div>;

  // Si no hay IDs, redirigimos o mostramos error (aquí forzamos que no sea null)
  if (!barberId || !barbershopId) {
    return <div>No se pudo cargar la configuración de la barbería.</div>;
  }
  return (
    <> 
      <div>
        <p>Hola <b>{user?.fullName}</b></p>
        <p>Bienvenido a la barberia <b>{barberId}</b></p>
      </div>
      <AvailManager/>
      <OfferManager/>
      {/*<ExclManager exclusions={config.exceptions}/>*/}
      <div className="div">
        <Button variant="danger" onClick={logout}>Cerrar sesión</Button>
      </div>
    </>
  );
};
