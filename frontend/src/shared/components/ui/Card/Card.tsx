import styles from "./card.module.css";
import clsx from "clsx";

type CardProps = {
  children: React.ReactNode;
  isActive?: boolean; // Para que el borde cambie a verde
  variant?: "primary" | "selectable" | "indicated" | "striped"; //La que tiene la barrita es indicated
  onClick?: () => void;
};

export const Card = ({ children, isActive = false, variant = "selectable", onClick }: CardProps) => {
  
  const classes = clsx(
  styles.cardContainer,
  {
    [styles.cardPrimary]: variant === "primary",
    [styles.cardSelectable]: variant === "selectable",
    [styles.cardIndicated]: variant === "indicated",
    [styles.cardStriped]: variant === "striped",

    // 👇 SOLO aplica si es selectable
    [styles.active]: variant === "selectable" && isActive,
    [styles.disabled]: variant === "selectable" && !isActive,
  }
);

  return (
    <div
      className={classes}
      onClick={onClick}
      style={onClick ? { cursor: "pointer" } : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {children}
    </div>
  );
};