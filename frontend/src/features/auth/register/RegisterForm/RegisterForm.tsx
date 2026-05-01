import { Button, Input } from "@/shared/components/ui"
import { Mail, Lock, User} from 'lucide-react'; 
import styles from "./register-form.module.css"
import { AuthLink } from "../../components/AuthLink/AuthLink";
export const RegisterForm = () => {
    return (
        <form className={styles.registerForm} action="">
            <Input type="text" placeholder="Nombre completo" icon={User}></Input>
            <Input type="email" placeholder="Correo electrónico" icon={Mail}></Input>
            <Input type="password" placeholder="Contraseña" icon={Lock}></Input>
            <Input type="password" placeholder="Confirmar contraseña" icon={Lock}></Input>
                <Button variant="primary" type="submit">Registrarse</Button>
            <AuthLink text="¿Ya tienes una cuenta?" linkText="Iniciar sesión" to="/" />
        </form>
    )
}