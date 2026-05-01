import styles from "./nav-bar.module.css";

type NavBarProps = {
  children: React.ReactNode;
};

export const NavBar = ({ children }: NavBarProps) => {
  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.tabsContainer}>
          {children}
      </div>
    </nav>
  );
};