import { Link } from 'react-router-dom';
import styles from './auth-link.module.css';

type AuthLinkProps = {
  text: string;
  linkText: string;
  to: string;
};

export const AuthLink = ({ text, linkText, to }: AuthLinkProps) => {
  return (
    <p className={styles.authLinkContainer}>
      {text}{' '}
      <Link to={to} className={styles.link}>
        {linkText}
      </Link>
    </p>
  );
};