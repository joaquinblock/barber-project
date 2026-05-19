import { Button, EmptyState, List, Modal, Panel, FeatureErrorBoundary, Alert, ErrorInline } from "@/shared/components/ui";
import { Calendar, Plus, AlertCircle } from "lucide-react";
import styles from "./excl-manager.module.css";
import { Suspense, useState } from "react";
import { ExclCard, ExclModal } from "@/features/exceptions/components";
import { useCreateFullDayException, useCreateRangeException, useDeleteException, useGetExclusions } from "../../hooks/useExcl";
import { ApiError, HttpError, type CreateExceptionDTO} from "@business/shared";

const ExclManagerContent = () => {
  const createFullDayMutation = useCreateFullDayException();
  const createRangeMutation = useCreateRangeException();
  const { mutate: deleteException } = useDeleteException();
  const { exceptions, isLoading, isError, error, refetch } = useGetExclusions();

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Determinar si hay algún error de creación (unificados para el Alert del Modal)
  const mutationError = createFullDayMutation.error || createRangeMutation.error;
  const isMutationError = createFullDayMutation.isError || createRangeMutation.isError;
  const isMutationPending = createFullDayMutation.isPending || createRangeMutation.isPending;

  if (isError) {
    return (
      <Alert variant="error" iconLeft={AlertCircle} onRetry={refetch}>
        {error instanceof ApiError || error instanceof HttpError 
          ? error?.message 
          : "Error al cargar las exclusiones."}
      </Alert>
    );
  }

  const handleAddException = (data : CreateExceptionDTO) => {

    const options = {
      onSuccess: () => setIsModalOpen(false) 
    };

    if (data.type === 'range' && data.endDate) {
      createRangeMutation.mutate({ 
        startDate: data.startDate, 
        endDate: data.endDate, 
        reason: data.reason 
      }, options);
    } else {
      createFullDayMutation.mutate({ 
        startDate: data.startDate, 
        reason: data.reason 
      }, options);
    }
  }

  return (
    <>
      <Panel
        title="Excepciones"
        subtitle="Agrega dias o periodos donde no trabajarás"
        icon={Calendar}
        button={<Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}><Plus size={16} /> Agregar </Button>}
      >
        <div className={styles.exclManagerContent}>
          {isLoading ? (
            <p>Cargando excepciones...</p>
          ) : exceptions && exceptions.length > 0 ? (
            <List
              items={exceptions}
              renderItem={(exception) => <ExclCard key={exception.id} exception={exception} onDelete={(id) => deleteException(id)} />}
              emptyComponent={<EmptyState text="Aún no tienes excepciones" />}
            />
          ) : (
            <EmptyState text="Aún no tienes excepciones" />
          )}
        </div>
      </Panel>

      {isModalOpen && 
        <Modal
          text="Agregar excepción" 
          onClose={() => setIsModalOpen(false)}>
            {isMutationError && (
              <ErrorInline iconLeft={AlertCircle}>
                {mutationError instanceof ApiError || mutationError instanceof HttpError 
                  ? mutationError.message 
                  : "Ocurrió un error al guardar la excepción."}
              </ErrorInline>
            )}
            <ExclModal onSave={handleAddException} isLoading={isMutationPending}></ExclModal>
        </Modal>}
    </>
  );
};

export const ExclManager = () => (
  <FeatureErrorBoundary featureName="Exclusions">
    <Suspense fallback={<div>Cargando exclusiones...</div>}>
      <ExclManagerContent />
    </Suspense>
  </FeatureErrorBoundary>
);

