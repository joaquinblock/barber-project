import styles from "./error-inline.module.css";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type ErrorInlineProps = {
  iconLeft?: LucideIcon;
  children: ReactNode;
};

export const ErrorInline = ({
  iconLeft: IconLeft,
  children,
}: ErrorInlineProps) => {
  return (
    <div className={styles.errorInlineContainer}>
      {IconLeft && (
        <IconLeft
          size={16}
          className={styles.errorInlineIcon}
        />
      )}
      <span>
        {children}
      </span>
    </div>
  );
};
