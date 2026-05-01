import { AntSwitch } from "@/shared/components/ui";
import { IOSSwitch } from "@/shared/components/ui";
import styles from "./switch.module.css";

type SwitchProps = {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  variant?: "ios" | "ant"; // Por si querés tener ambos
};

export const Switch = ({ label, checked, onChange, disabled, variant = "ios" }: SwitchProps) => {
  // Aquí podrías elegir cuál renderizar según la variante
  const SelectedSwitch = variant === "ios" ? IOSSwitch : AntSwitch;

  return (
    <div className={`${styles.switchContainer} ${checked ? styles.checked : ""}`}>
        {label && <span className={styles.label}>{label}</span>}
      <SelectedSwitch
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
      />
    </div>
  );
};