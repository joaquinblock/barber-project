import styles from './day-button.module.css';

type DayButtonProps = {
  text: string;
  active: boolean;
  hasWork: boolean;
  onClick?: () => void;
};

export const DayButton = ({ text, active, hasWork, onClick }: DayButtonProps) => {
  return (
    <button 
    onClick={onClick}
    className={`${styles.dayBtn} ${active ? styles.dayBtnActive : ""}`}>
        <span className={styles.dayBtnText}>{text}</span>
        <div className={`${styles.dayBtnCircle} ${hasWork ? '' : styles.invisible}`}></div>
    </button>
  )
}