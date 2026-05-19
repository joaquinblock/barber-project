import { useAuth } from "@/core/auth/context/auth.context";

export const CustomerPage = () => {
  const { user, logout } = useAuth();
  return (

    <header>
      <h1>Bienvenido, {user?.fullName}</h1>
      <button onClick={logout} style={{ backgroundColor: "red", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px" }}>Cerrar Sesión</button>
      {/* <BookingManager barberConfig={barberConfig} appts={mockAppts}></BookingManager> */}
    </header>
  );
};
