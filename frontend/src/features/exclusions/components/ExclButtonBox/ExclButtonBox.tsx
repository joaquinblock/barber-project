import type { Exception } from "@/shared/types";
import styles from "./excl-button-box.module.css";
type ExclButtonBoxProps = {
    selectedType?: Exception["type"];
    onSelect: (type: Exception["type"]) => void;
}
export const ExclButtonBox = ({ selectedType, onSelect }: ExclButtonBoxProps) => {
    return (
        <div className={styles.exclButtonBoxContainer}>
            <button 
                className={`${styles.exclButton} ${selectedType === "full_day" ? styles.exclButtonActive : ""}`} 
                id="button-1" 
                type="button" 
                onClick={() => onSelect("full_day")}
            >
                Un solo dia
            </button>
            <button 
                className={`${styles.exclButton} ${selectedType === "range" ? styles.exclButtonActive : ""}`} 
                id="button-2" 
                type="button" 
                onClick={() => onSelect("range")}
            >
                Varios dias
            </button>
        </div>
    );
}
