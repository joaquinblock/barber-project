import type { LucideIcon } from "lucide-react";
import styles from "./nav-item.module.css";
import { NavLink } from "react-router-dom";

type NavItemProps = {
    spanText: string;
    icon: LucideIcon;
    to: string;
};

export const NavItem = ({ spanText, icon: Icon, to }: NavItemProps) => {
   return (
        <NavLink
            to={to}
            
            // NavLink nos da 'isActive' en una función dentro de className
            className={({ isActive }) => 
                `${styles.navTabButton} ${isActive ? styles.active : ''}`
            }
        >
            <Icon 
                size={20} 
                className={styles.tabIcon} 
            />
            <span className={styles.tabLabel}>
                {spanText}
            </span>
        </NavLink>
    );
}

