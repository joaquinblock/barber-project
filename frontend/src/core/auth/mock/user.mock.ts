import type {User } from "../types";

export const MOCK_ADMIN: User = {
  id: "admin-001",
  email: "hola@admin.com",
  name: "Laucha Suarez",
  role: "admin",
  barberId: "barber-001", // Este admin también es barbero, por eso tiene barberId
};

export const MOCK_CUSTOMERS: User[] = [
  {
    id: "cust-001",
    email: "hola@customer.com",
    name: "Customer One",
    role: "customer",
  },
  {
    id: "cust-002",
    email: "hola2@customer.com",
    name: "Customer Two",
    role: "customer",
  },
];

export const MOCK_EMPLOYEES: User[] = [
  {
    id: "emp-001",
    email: "employee@barber.com",
    name: "Tomi Ward",
    role: "employee",
    barberId: "barber-002",
  },
];


// Unificamos para que el Hook pueda buscar en una sola lista
export const ALL_MOCK_USERS = [MOCK_ADMIN, ...MOCK_CUSTOMERS, ...MOCK_EMPLOYEES];

