import styles from "./alert.module.css";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import clsx from "clsx";

type AlertProps = {
  iconLeft?: LucideIcon;
  children: ReactNode;
  day?: string; // "2026-03-17" ISO
  variant?: "default" | "warning" | "error";
};
export const Alert = ({
  iconLeft: IconLeft,
  children,
  day,
  variant = "default",
}: AlertProps) => {
  const alertClasses = clsx(
    styles.alertContainer,
    {
      [styles.alertContainerWarning]: variant === "warning",
      [styles.alertContainerError]: variant === "error",
    }
  );

  const alertIconClasses = clsx(  
    styles.alertIcon,
    {
      [styles.alertIconWarning]: variant === "warning",
      [styles.alertIconError]: variant === "error",
    }
  );

  const alertTextClasses = clsx(
    styles.alertText,
    {
      [styles.alertTextWarning]: variant === "warning",
      [styles.alertTextError]: variant === "error",
    }
  );

  return (
    <div className={alertClasses}>
      {IconLeft && (
        <IconLeft
          size={18}
          className={alertIconClasses}
        />
      )}
      <div className={alertTextClasses}>
        {children} {day && <strong>{day}</strong>}
      </div>
    </div>
  );
};