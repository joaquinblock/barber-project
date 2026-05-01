import styles from "./auth-header.module.css";
import { LOGIN_UI_TEXT } from "@/core/auth/constants/auth.constants";

export const AuthHeader = () => {
  const { title, subtitle } = LOGIN_UI_TEXT;
  return (
    <>
      <div className={styles.authHeader}>
        <div className={styles.authBanner}></div>
        <div className={styles.authLogo}></div>
      </div>
      <div className={styles.authTitle}>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>
    </>
  );
};
