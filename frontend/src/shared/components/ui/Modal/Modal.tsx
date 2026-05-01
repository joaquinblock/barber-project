import styles from "./modal.module.css";
import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import clsx from 'clsx';

type ModalProps = {
  children: React.ReactNode;
  iconLeft?: LucideIcon;
  variant?: "block" | "default";
  text: string;
  onClose: () => void;
};

export const Modal = ({
    children, 
    iconLeft: 
    IconLeft, 
    variant = 
    "default", 
    text,
  onClose
}: ModalProps) => {

  const headerClasses = clsx(
    styles.modalHeader,
    {
      [styles.modalHeaderBlock]: variant === "block",
      [styles.modalHeaderDefault]: variant === "default",
    }
  );

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={headerClasses}>
          <div className={styles.modalHeaderTextIconContainer}>
            {IconLeft && (
              <IconLeft 
                size={18} 
                className={styles.modalIconLeft} />
            )}
            <h3 className={styles.modalTitle}>{text}</h3>
          </div>
          <X
            size={20}
            className={styles.modalCloseIcon}
            onClick={onClose}
          />
        </div>
        <div className={styles.modalContent}>
          {children}
        </div>
      </div>
    </div>
  );
};
