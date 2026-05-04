import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { barbershopService } from "../services/barbershop.service";
export const useBarbershop = () => {
  const { slug } = useParams<{ slug: string }>();

  const sanitizedSlug = slug?.trim().toLowerCase();

  const { 
    data: barbershop, 
    isLoading 
  } = useQuery({
    queryKey: ['barbershop', sanitizedSlug],
    queryFn: () => barbershopService.getBySlug(sanitizedSlug!),
    enabled: !!sanitizedSlug && /^[a-z0-9-]+$/.test(sanitizedSlug), //evitar hacer un fetch cuando no hay slug ni cuando no es un slug valido
    retry: false, //si hay un error 404 no reintentar
    throwOnError: true, //lanzar el error para que sea capturado por el error boundary
  });

  return { 
    barbershop, 
    isLoading, 
    slug 
  };
};