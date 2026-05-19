import styles from "./excl-button-box.module.css";
import type { ExceptionType } from "@business/shared";

type ExclButtonBoxProps = {
    selectedType?: ExceptionType;
    onSelect: (type: ExceptionType) => void;
}
export const ExclButtonBox = ({ selectedType, onSelect }: ExclButtonBoxProps) => {
    return (
        <div className={styles.exclButtonBoxContainer}>
            <button 
                className={`${styles.exclButton} ${selectedType === 'full-day' ? styles.exclButtonActive : ""}`} 
                id="button-1" 
                type="button" 
                onClick={() => onSelect("full-day")}
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
