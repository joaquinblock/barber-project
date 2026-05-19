import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthContext } from "../context/auth.context";
import { AuthService } from "../services/auth.service";
import { AUTH_STORAGE_KEYS } from "../constants/auth.constants";
import { UserRole } from "@business/shared/types";
import type { AuthResponseDTO, LoginResponseDTO } from "@business/shared/types";
import type { LoginCredentials } from "../types";

export const useAuthActions = () => {
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: ({ credentials, slug }: { credentials: LoginCredentials; slug: string }) => 
      AuthService.login(credentials, slug),
    onSuccess: (data: LoginResponseDTO) => {
      localStorage.setItem(AUTH_STORAGE_KEYS.TOKEN, data.token);
      localStorage.setItem(AUTH_STORAGE_KEYS.BUSINESS_ID, data.businessId);
      
      queryClient.setQueryData(['auth', 'session'], {
        user: data.user,
        businessId: data.businessId
      });
    },
    onError: () => {
      localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
      queryClient.setQueryData(['auth', 'session'], null);
    }
  });

  const logout = () => {
    localStorage.clear(); 
    queryClient.setQueryData(['auth', 'session'], null);
    queryClient.removeQueries({ queryKey: ['auth'] });
  };

  return { loginMutation, logout };
};

export const useAuthSession = () => {
  return useQuery({
    queryKey: ['auth', 'session'],
    queryFn: async (): Promise<AuthResponseDTO | null> => {
      const token = localStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);
      if (!token) return null;
      
      try {
        const response = await AuthService.getProfile(token);
        return {
            user: response.user,
            businessId: response.businessId,
        };
      } catch (error) {
        localStorage.removeItem(AUTH_STORAGE_KEYS.TOKEN);
        return null;
      }
    },
    staleTime: Infinity,
  });
};


export const useAuth = () => {
  const context = useAuthContext();

  const { user } = context;

  const roles: UserRole[] = user?.roles ?? [];

  const isAdmin = roles.includes(UserRole.ADMIN);
  const isProfessional = roles.includes(UserRole.PROFESSIONAL);
  const isAdminProfessional = isAdmin && isProfessional;
  const isCustomer = roles.includes(UserRole.CUSTOMER);

  return {
    ...context,
    
    // Roles
    isAdmin,
    isProfessional,
    isAdminProfessional,
    isCustomer,

    // Atajos
    professionalId: isProfessional ? user?.professional?.id : null,
    userName: user?.fullName ?? "Invitado",
  };
};
