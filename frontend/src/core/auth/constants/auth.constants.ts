import type { SocialProviderConfig} from "../types";
import googleIcon from "@/assets/google.svg";
import facebookIcon from "@/assets/facebook.svg";

export const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    id: 'google',
    label: 'Continuar con Google',
    icon: googleIcon,
    variant: 'google'
  },
  {
    id: 'facebook',
    label: 'Continuar con Facebook',
    icon: facebookIcon,
    variant: 'facebook' 
  }
];

export const LOGIN_UI_TEXT = {
  title: "Focus Barber Studio",
  subtitle: "Reservá tu corte en segundos"
}