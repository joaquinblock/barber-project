import { Button, EmptyState, List, Modal, Panel, FeatureErrorBoundary } from "@/shared/components/ui";
import type { CreateExceptionDTO, ExceptionResponseDTO } from "@barber/shared/types";
import { Calendar, Plus } from "lucide-react";
import styles from "./excl-manager.module.css";
import { Suspense, useState } from "react";
import { ExclCard, ExclModal } from "@/features/exceptions/components";
import { useCreateFullDayException, useDeleteException, useGetExclusions } from "../../hooks/useExcl";

const ExclManagerContent = () => {

  const { mutateAsync: createException } = useCreateFullDayException();
  const { mutateAsync: deleteException } = useDeleteException();
  const { exceptions, isLoading } = useGetExclusions();



  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedException, setSelectedException] = useState<ExceptionResponseDTO | null>(null);

  

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
            <ExclModal onSave={handleAddException}></ExclModal>
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

