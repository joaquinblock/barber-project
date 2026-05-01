import { AvailManager } from "@/features/availability";
import { Button} from "@/shared/components/ui";
import { useAuth } from "@/core/auth/context/auth.context";
import { ExclManager } from "@/features/exclusions/components";
import { useBarberConfig } from "@/shared/hooks/useBarberConfig";
import { barberConfigMock as initial} from "@/shared/constants/barber-config.mock-data";
import { OfferManager } from "@/features/offers";

export const BarberConfigPage = () => {
  const config = useBarberConfig({
    ...initial,
  }); 
  const { logout } = useAuth();
  return (
    <> 
      <AvailManager availability={config.availability}/>
      <ExclManager exclusions={config.exceptions}/>
      <OfferManager offers={config.offers}/>
      <div className="div">
        <Button variant="danger" onClick={logout}>Cerrar sesión</Button>
      </div>
    </>
  );
};
