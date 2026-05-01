import styles from  './stepper.module.css';
type StepperProps = {
  step?: number;
  total?: number;
};

function Stepper({ step = 1, total = 4 }: StepperProps) {
  return (
    <div className={styles.barberStepper}>
      <div className={styles.barberStep}>{`Paso ${step} de ${total}`}</div>
      <div className={styles.barberProgress}>
        {Array.from({ length: total }).map((_, idx) => (
          <div
            key={idx}
            className={`${styles.barberProgressBar}${idx < step ? ` ${styles.active}` : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default Stepper;