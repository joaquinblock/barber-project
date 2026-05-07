import { Button, EmptyState, List, Modal, Panel, FeatureErrorBoundary } from "@/shared/components/ui";
import type { Exception } from "@barber/shared/types";
import { Calendar, Plus } from "lucide-react";
import styles from "./excl-manager.module.css";
import { Suspense, useState } from "react";
import { ExclCard, ExclModal } from "@/features/exceptions/components";
import { useExcl } from "@/features/exceptions/hooks/useExcl";

type ExclManagerProps = {
   barbershopId: string;
   barberId: string;
};

const ExclManagerContent = ({ barbershopId, barberId }: ExclManagerProps) => {

  const { data: exceptions, addException, deleteException } = useExcl(barbershopId, barberId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddException = (newException: Exception) => {
    addException(newException);
    setIsModalOpen(false);
  };

  return (
    <>
      <Panel
        title="Excepciones"
        subtitle="Agrega dias o periodos donde no trabajas, independiente de tu horario habitual"
        icon={Calendar}
      >
        <div className={styles.exclManagerContent}>
          <List
            items={exceptions}
            renderItem={(exception) => <ExclCard key={exception.id} exception={exception} onDelete={(id) => deleteException(id)} />}
            emptyComponent={
              <EmptyState text="No hay excepciones registradas" />
            }
          />
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> <span>Agregar Excepción</span>
          </Button>
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

export const ExclManager = (props: ExclManagerProps) => (
  <FeatureErrorBoundary featureName="Exclusions">
    <Suspense fallback={<div>Cargando exclusiones...</div>}>
      <ExclManagerContent {...props} />
    </Suspense>
  </FeatureErrorBoundary>
);

