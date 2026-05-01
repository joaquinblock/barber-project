import { Button, EmptyState, List, Modal, Panel } from "@/shared/components/ui";
import type { Exception } from "@/shared/types";
import { Calendar, Plus } from "lucide-react";
import styles from "./excl-manager.module.css";
import { useState } from "react";
import { ExclCard, ExclModal } from "@/features/exclusions/components";
import { useExcl } from "@/features/exclusions/hooks/useExcl";

type ExclManagerProps = {
  exclusions: ReturnType<typeof useExcl>;
};
export const ExclManager = ({ exclusions }: ExclManagerProps) => {
  const { exceptions, addException, deleteException } = exclusions;
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
