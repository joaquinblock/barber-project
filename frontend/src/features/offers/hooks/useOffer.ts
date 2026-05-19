import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OfferService } from "../services/offer.service";
import type { CreateOfferDTO, UpdateOfferDTO } from "@business/shared/types";
import { toast } from "sonner";
import { handleMutationError } from "@/shared/utils/error.utils";

/* ------------------------------------------
  GET - Hook para obtener ofertas
-------------------------------------------- */

export const useGetOffers = () => {
  const {data, isLoading, isError, error, refetch} = useQuery({
    queryKey: ["offers"],
    queryFn: () => OfferService.getOffers(),
  });

  return {offers: data ?? [], isLoading, isError, error, refetch};
}


/* ------------------------------------------
  CREATE - Hook para crear ofertas
-------------------------------------------- */

export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (offer: CreateOfferDTO) => OfferService.createOffer(offer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Oferta creada exitosamente");
    },
    // El error se maneja en el componente con un Alert
  });
};

/* ------------------------------------------
  UPDATE - Hook para actualizar ofertas
-------------------------------------------- */

export const useUpdateOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { idOffer: string; updateOfferDto: UpdateOfferDTO }) =>
      OfferService.updateOffer(data.idOffer, data.updateOfferDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Oferta actualizada exitosamente");
    },
    // El error se maneja en el componente con un Alert
  });
};


/* ------------------------------------------
  DELETE - Hook para eliminar ofertas
-------------------------------------------- */

export const useDeleteOffer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (idOffer: string) => OfferService.deleteOffer(idOffer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Oferta eliminada exitosamente");
    },
    onError: handleMutationError, // Delete usa Toast automático
  });
};