
export type SocialProviderConfig = {
  id: AuthProvider;
  label: string;
  icon: string;
  variant: AuthProvider; // Usamos el mismo tipo para el CSS
};

export type AuthProvider = 'google' | 'facebook' | 'github'; // Por ahora solo estos, pero se pueden agregar más en el futuro.

