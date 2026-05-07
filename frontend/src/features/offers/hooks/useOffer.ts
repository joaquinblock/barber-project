import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { OfferService } from "../services/offer.service";
import type { CreateOfferDTO, UpdateOfferDTO } from "@barber/shared/types";
import { toast } from "sonner";
import { ApiError } from "@barber/shared/errors";
import { ErrorCode } from "@barber/shared";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";

/* ------------------------------------------
  GET - Hook para obtener ofertas
-------------------------------------------- */
export const useGetOffers = () => {
  const {data, isLoading, isError, error, refetch} = useQuery({
    queryKey: ["offers"],
    queryFn: () => OfferService.getOffers(), //El error si hay lo agarra el try-catch del queryFn
  });

  return {offers: data ?? [], isLoading, isError, error, refetch};
}

/* ------------------------------------------
  CREATE - Hook para crear ofertas
-------------------------------------------- */
export const useCreateOffer = () => {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (offer: CreateOfferDTO) => OfferService.createOffer(offer),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["offers"] });
      toast.success("Oferta creada exitosamente");
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        if (error.code === ErrorCode.OFFER_OVERLAP){
          toast.error(ERROR_MESSAGES[ErrorCode.OFFER_OVERLAP]);
        } 
      } else {
        toast.error(ERROR_MESSAGES[ErrorCode.SERVER_ERROR]);
      }
    },
  });

  return mutation;
}

/* ------------------------------------------
  UPDATE - Hook para actualizar ofertas
-------------------------------------------- */
export const useUpdateOffer = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async (data: {idOffer: string, updateOfferDto: UpdateOfferDTO}) => {
          await OfferService.updateOffer(data.idOffer, data.updateOfferDto)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast.success("Oferta actualizada exitosamente");
        },
        onError: (error) => {
            if (error instanceof ApiError) {
                switch (error.code) {
                    case ErrorCode.OFFER_NOT_FOUND:
                        toast.error(ERROR_MESSAGES[ErrorCode.OFFER_NOT_FOUND]);
                        break;
                    case ErrorCode.OFFER_OVERLAP:
                        toast.error(ERROR_MESSAGES[ErrorCode.OFFER_OVERLAP]);
                        break;
                    default:
                        toast.error(ERROR_MESSAGES[ErrorCode.SERVER_ERROR]);
                }
            } else {
                toast.error(ERROR_MESSAGES[ErrorCode.SERVER_ERROR]);
            }
        },

    });

    return mutation;
}

/* ------------------------------------------
  DELETE - Hook para eliminar ofertas
-------------------------------------------- */
export const useDeleteOffer = () => {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
        mutationFn: async (idOffer: string) => OfferService.deleteOffer(idOffer),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["offers"] });
            toast.success("Oferta eliminada exitosamente");
        },
        onError: (error) => {
            if (error instanceof ApiError) {
                if (error.code === ErrorCode.OFFER_NOT_FOUND){
                  toast.error(ERROR_MESSAGES[ErrorCode.OFFER_NOT_FOUND]);
                } 
            } else {
                toast.error(ERROR_MESSAGES[ErrorCode.SERVER_ERROR]);
            }
        },
    });

    return mutation;
}