import styles from "./button.module.css";
import clsx from "clsx";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "selectable" | "trash" | "danger" ;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSelected?: boolean; // Para el estado seleccionado en el caso de "selectable"
};

export const Button = ({
  variant = "secondary",
  size = "md",
  children,
  isSelected = false,
  ...props
}: ButtonProps) => {
  
  const buttonClass = clsx(
    styles.btn,
    styles[variant],
    styles[size],
    {
      [styles.selected]: isSelected && variant === "selectable",
    },
    props.className
  );

  return (
    <button className={buttonClass} {...props} aria-disabled={props.disabled}>
      {children}
    </button>
  );
};
