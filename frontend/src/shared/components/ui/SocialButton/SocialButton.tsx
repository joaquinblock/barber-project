import type { AuthProvider } from '@/core/auth/types';
import styles from './social-button.module.css';

type SocialButtonProps = {
  variant: AuthProvider; // 'google' | 'facebook' | 'github'
  icon: string; // Ruta al icono o componente SVG
  label: string; // Texto del botón
  onClick: () => void;
};

export const SocialButton = ({ onClick, icon, label, variant }: SocialButtonProps) => {
  return (
    <button className={`${styles.btnSocial} ${styles[variant]}`} onClick={onClick}>
      <img src={icon} alt="" className={styles.icon} aria-hidden="true" />
      <span className={styles.text}>{label}</span>
    </button>
  );
};