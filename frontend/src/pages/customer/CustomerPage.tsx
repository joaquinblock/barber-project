import { useAuth } from "@/core/auth/context/auth.context";
import { BookingManager } from "@/features/booking/components/BookingManager/BookingManager";
import { useBarberConfig } from "@/shared/hooks/useBarberConfig";
import { barberConfigMock } from "@/shared/constants/barber-config.mock-data";

export const CustomerPage = () => {
  const { user, logout } = useAuth();
  const barberConfig = useBarberConfig(barberConfigMock); 
  return (

    <header>
      <h1>Bienvenido, {user?.name}</h1>
      <button onClick={logout} style={{ backgroundColor: "red", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px" }}>Cerrar Sesión</button>
      <BookingManager barberConfig={barberConfig} appts={mockAppts}></BookingManager>
    </header>
  );
};
