import { SocialButton } from '@/shared/components/ui';
import { SOCIAL_PROVIDERS } from '@/core/auth/constants/auth.constants';
import styles from './social-provider-list.module.css';

type Props = {
  onSelect: (providerId: string) => void;
  isLoading?: boolean;
};

export const SocialProviderList = ({ onSelect}: Props) => {
  return (
    <div className={styles.loginButtons}>
      {SOCIAL_PROVIDERS.map((provider) => (
        <SocialButton
          key={provider.id}
          variant={provider.variant}
          icon={provider.icon}
          label={provider.label}
          onClick={() => onSelect(provider.id)}
        />
      ))}
    </div>
  );
};