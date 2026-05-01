import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/core/auth/context/auth.context';
import { AuthService } from '../services/auth.service';
import { beforeEach, vi } from 'vitest';
import { expect, describe, it } from 'vitest';
import type { User } from '../types';

// ---- Mocks ----
vi.mock('../services/auth.service');

const mockUser: User = {
  id: '1',
  email: 'juan@test.com',
  isActive: true,
  fullName: 'Juan Perez',
  roles: ['BARBER'],
  barberId: 'barber-123',
  barbershopId: 'shop-456',
  customerId: undefined,
};

const mockLoginResponse = {
  user: mockUser,
  token: 'fake-jwt-token',
  barbershopId: 'shop-456',
};

// Wrapper para proveer el contexto en cada test
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

// ---- AuthProvider ----
describe('AuthProvider', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('inicia con usuario null y no autenticado', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.barbershopId).toBeNull();
  });

  it('rehidrata el estado desde localStorage', async () => {
    // Simulamos que ya había una sesión guardada
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    localStorage.setItem('auth_token', 'fake-jwt-token');
    localStorage.setItem('auth_barbershop_id', 'shop-456');

    const { result } = renderHook(() => useAuth(), { wrapper });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.barbershopId).toBe('shop-456');
    });
  });
});

// ---- Login ----
describe('login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('setea el usuario y barbershopId tras login exitoso', async () => {
    vi.mocked(AuthService.login).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(
        { email: 'juan@test.com', password: '1234' },
        'mi-barberia'
      );
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.barbershopId).toBe('shop-456');
  });

  it('persiste los datos en localStorage', async () => {
    vi.mocked(AuthService.login).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(
        { email: 'juan@test.com', password: '1234' },
        'mi-barberia'
      );
    });

    expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token');
    expect(localStorage.getItem('auth_barbershop_id')).toBe('shop-456');
    expect(JSON.parse(localStorage.getItem('auth_user')!)).toEqual(mockUser);
  });

  it('limpia el estado si el login falla', async () => {
    vi.mocked(AuthService.login).mockRejectedValue(new Error('Credenciales inválidas'));

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(
        { email: 'mal@test.com', password: 'wrong' },
        'mi-barberia'
      ).catch(() => {}); // esperamos el error sin que explote el test
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});

// ---- Logout ----
describe('logout', () => {
  it('limpia el estado y el localStorage', async () => {
    vi.mocked(AuthService.login).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    // Primero logueamos
    await act(async () => {
      await result.current.login(
        { email: 'juan@test.com', password: '1234' },
        'mi-barberia'
      );
    });

    // Luego deslogueamos
    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.barbershopId).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});

// ---- useAuth: roles y atajos ----
describe('useAuth roles', () => {
  it('detecta correctamente el rol BARBER', async () => {
    vi.mocked(AuthService.login).mockResolvedValue(mockLoginResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(
        { email: 'juan@test.com', password: '1234' },
        'mi-barberia'
      );
    });

    expect(result.current.isBarber).toBe(true);
    expect(result.current.isAdmin).toBe(false);
    expect(result.current.isCustomer).toBe(false);
    expect(result.current.barberId).toBe('barber-123');
  });

  it('detecta correctamente el rol ADMIN', async () => {
    vi.mocked(AuthService.login).mockResolvedValue({
      ...mockLoginResponse,
      user: { ...mockUser, roles: ['ADMIN', 'BARBER'] },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login(
        { email: 'admin@test.com', password: '1234' },
        'mi-barberia'
      );
    });

    expect(result.current.isAdmin).toBe(true);
    expect(result.current.isBarberAdminView).toBe(true);
  });
});