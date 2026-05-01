import { type LucideIcon } from "lucide-react";
import styles from "./panel.module.css";
import { Title } from "../Title/Title";
type PanelProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: LucideIcon;
};

export const Panel = ({
  children,
  title,
  subtitle,
  icon: Icon,
}: PanelProps) => {
  return (
    <div className={styles.panel}>
        <Title textTitle={title} textSubtitle={subtitle} icon={Icon} />
        {children}
    </div>
  );
};
