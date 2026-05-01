import { useRef, useState } from "react";
import styles from "./input.module.css";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";
import clsx from "clsx";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  variant?: "default" | "inline";
  icon?: LucideIcon;
};

export const Input = ({
  label,
  variant = "default",
  icon: Icon,
  ...props
}: InputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = props.type === "password";

  const inputClasses = clsx(
    styles.inputContainer,
    {
      [styles.inputContainerInline]: variant === "inline",
      [styles.inputContainerDefault]: variant === "default",
      [styles.inputTime]: props.type === "time",
    }
  );
  
  return (
    <div className={inputClasses}>
      {label && <label>{label}</label>}
      <div className={styles.inputWrapper}>
        {Icon && <Icon className={styles.inputIcon} size={20} />}

        <input
          {...props}
          ref={inputRef} // Enganchamos la referencia
          type={isPasswordField && showPassword ? "text" : props.type}
          style={{
            ...props.style,
            ...(props.readOnly
              ? { pointerEvents: "none", cursor: "default" }
              : {}),
          }}
          className={`${Icon ? styles.inputWithIcon : ""}`}
        />

        {/* Botón del ojo (Solo si es password) */}
        {isPasswordField && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1} // Para que no moleste al usar Tab para navegar inputs
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};
