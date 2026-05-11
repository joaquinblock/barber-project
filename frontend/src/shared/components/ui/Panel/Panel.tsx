import { type LucideIcon } from "lucide-react";
import styles from "./panel.module.css";
import { Title } from "../Title/Title";
type PanelProps = {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  icon: LucideIcon;
  button?: React.ReactNode;
};

export const Panel = ({
  children,
  title,
  subtitle,
  icon: Icon,
  button
}: PanelProps) => {
  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <Title textTitle={title} textSubtitle={subtitle} icon={Icon} />
        {button}
      </div>
      {children}
    </div>
  );
};
