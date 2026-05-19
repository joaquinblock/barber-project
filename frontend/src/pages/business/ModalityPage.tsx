import { AvailManager } from "@/features/availability";
import { Button } from "@/shared/components/ui";
import { useAuth } from "@/core/auth/context/auth.context";
import { OfferManager } from "@/features/offers";
import { ExclManager } from "@/features/exceptions/components/ExclManager/ExclManager";

export const ModalityPage = () => {

  const { logout, businessId, user, isLoading } = useAuth();

  // Si aún está cargando, mostramos un loading
  if (isLoading) return <div>Cargando...</div>;

  // Si no hay IDs, redirigimos o mostramos error (aquí forzamos que no sea null)
  if (!businessId) {
    return <div>No se pudo cargar la configuración del negocio.</div>;
  }
  return (
    <> 
      <div>
        <p>Hola <b>{user?.fullName}</b></p>
      </div>
      <AvailManager/>
      <OfferManager/>
      <ExclManager/>
      <div className="div">
        <Button variant="danger" onClick={logout}>Cerrar sesión</Button>
      </div>
    </>
  );
};
