import { List, Panel, FeatureErrorBoundary, EmptyState, Button, Modal, Input, Alert, ErrorInline } from "@/shared/components/ui";
import { useGetOffers, useCreateOffer, useUpdateOffer, useDeleteOffer  } from "@/features/offers/hooks/useOffer";
import { OfferServiceCard } from "../OfferServiceCard/OfferCard";
import { Scissors, Plus, AlertCircle } from "lucide-react";
import { Suspense, useState } from "react";
import type { CreateOfferDTO} from "@business/shared";
import { ApiError, HttpError, ErrorCode } from "@business/shared/errors";
import { ERROR_MESSAGES } from "@/shared/constants/error.messages";

//Es un tipo solo para manejar el formulario
type OfferFormData = Omit<CreateOfferDTO, 'price' | 'duration'> & {
  price: string | number;
  duration: string | number;
};

const validateOfferData = (data: { title: string; price: number; duration: number }): ErrorCode | null => {
  const trimmedTitle = data.title.trim();

  if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
    return ErrorCode.OFFER_INVALID_TITLE;
  }
  
  // No permitir que sea solo números
  if (/^\d+$/.test(trimmedTitle)) {
    return ErrorCode.OFFER_INVALID_TITLE;
  }
  
  if (isNaN(data.price) || data.price < 0) {
    return ErrorCode.OFFER_INVALID_PRICE;
  }

  if (!Number.isInteger(data.duration) || data.duration < 1) {
    return ErrorCode.OFFER_INVALID_DURATION;
  }

  return null;
};

const OfferManagerContent = () => {
  const { offers, isError, error: getError, refetch } = useGetOffers();
  const {mutate: createOffer, error: createOfferError, isError: isCreateOfferError, isPending: isCreateOfferPending} = useCreateOffer();
  const {mutate: updateOffer, error: updateOfferError, isError: isUpdateOfferError, isPending: isUpdateOfferPending} = useUpdateOffer();
  const {mutate: deleteOffer} = useDeleteOffer();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const initialData = { title: "", price: "", duration: "", description: "" };
  
  const [formData, setFormData] = useState<OfferFormData>(initialData);

  const handleOpenCreateModal = () => {
    setIsEditing(false);
    setSelectedOfferId(null);
    setFormData(initialData);
    setIsModalOpen(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type} = e.target;

    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const rawValue = formData.price.toString();
    let cleanValue = rawValue.replace(/\./g, '').replace(',', '.');
    const finalPrice = Number(cleanValue);
    const finalDuration = Number(formData.duration);

    const validationError = validateOfferData({
      title: formData.title,
      price: finalPrice,
      duration: finalDuration
    });

    if (validationError) {
      return (
        <ErrorInline iconLeft={AlertCircle}>
              {ERROR_MESSAGES[validationError] || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR]}
        </ErrorInline>
      );
    }

    const finalOffer: CreateOfferDTO = {
      title: formData.title,
      price: finalPrice,
      duration: finalDuration,
      description: formData.description || null,
    };

    if (isEditing && selectedOfferId) {
      updateOffer({ idOffer: selectedOfferId, updateOfferDto: finalOffer }, {
        onSuccess: () => setIsModalOpen(false)
      });
    } else {
      createOffer(finalOffer, {
        onSuccess: () => setIsModalOpen(false)
      });
    }
  };

  const handleEditOffer = (id: string) => {
    const offerToEdit = offers.find(o => o.id === id);
    if (!offerToEdit) return;

    setIsEditing(true);
    setSelectedOfferId(id);
    setFormData({
      title: offerToEdit.title,
      price: offerToEdit.price,
      duration: offerToEdit.duration,
      description: offerToEdit.description || ""
    });
    setIsModalOpen(true);
  }

  const handleDeleteOffer = (id: string) => {
    deleteOffer(id);
  }

  const handleToggleActive = (id: string, isActive: boolean) => {
    console.log("Toggle active offering", id, isActive);
  }

  if (isCreateOfferError) {
    // Si queremos hacer algo en error a nivel UI se puede aquí, pero el toast ya lo manejó
  }

  if (isError) {
    return (
      <Alert variant="error" iconLeft={AlertCircle} onRetry={refetch}>
        {getError instanceof ApiError || getError instanceof HttpError 
          ? getError.message 
          : "Error al cargar los servicios."}
      </Alert>
    );
  }

  const mutationError = isEditing ? updateOfferError : createOfferError;
  const isMutationError = isEditing ? isUpdateOfferError : isCreateOfferError;
  const isMutationPending = isEditing ? isUpdateOfferPending : isCreateOfferPending;

  return (
    <>
      <Panel 
        title="Mis servicios" 
        subtitle="Selecciona los servicios que ofreces" 
        icon={Scissors} 
        button={
          <Button variant="primary" size="md" onClick={handleOpenCreateModal}><Plus size={16}/> Agregar </Button>
        }>
        <List
          items={offers}
          renderItem={(service) => (
            <OfferServiceCard 
              key={service.id} 
              service={service} 
              onEdit={() => handleEditOffer(service.id)}
              onDelete={() => handleDeleteOffer(service.id)}
              onToggleActive={(id, isActive) => handleToggleActive(id, isActive)}
            />
          )}
          emptyComponent={<EmptyState text="Aún no tienes servicios" />}
        />
      </Panel>
      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          text={isEditing ? "Editar Servicio" : "Agregar Servicio"}
        >
        <form onSubmit={handleSubmit}>

          <Input 
            name="title"
            label="Nombre"
            value={formData.title}
            onChange={handleChange}
            required 
          />
          
          <Input 
            name="price"
            label="Precio"
            type="text"
            inputMode="decimal"
            placeholder="Ej: 15000"
            value={formData.price}
            onChange={handleChange}
            required
          />
          
          <Input
            name="duration" 
            label="Duración (minutos)"
            type="text"
            inputMode="numeric"
            placeholder="Ej: 60"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <Button variant="primary" type="submit" disabled={formData.title === initialData.title || formData.price === initialData.price || formData.duration === initialData.duration}>
            {isMutationPending ? "Guardando..." : (isEditing ? "Guardar cambios" : "Agregar")}
          </Button>
        </form>

      </Modal>
    )}
    </>
  );
};

export const OfferManager = () => (
  <FeatureErrorBoundary featureName="Offers">
    <Suspense fallback={<div>Cargando servicios...</div>}>
      <OfferManagerContent />
    </Suspense>
  </FeatureErrorBoundary>
);

