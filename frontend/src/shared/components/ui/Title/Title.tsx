import styles from './title.module.css'
import type { LucideIcon } from 'lucide-react'

type TitleProps = {
  icon?: LucideIcon | null;
  textTitle: string;
  textSubtitle?: string;
};
    
export const Title = ({ icon: Icon, textTitle, textSubtitle }: TitleProps) => {
  return (
      <div className={styles.titleContainer}>
        <div className={styles.title}>
          {Icon && <Icon size={20} />} 
          <h2 className={styles.textTitle}>{textTitle}</h2>
        </div>
        {textSubtitle && <p className={styles.textSubtitle}>{textSubtitle}</p>}
      </div>
    
  )
}