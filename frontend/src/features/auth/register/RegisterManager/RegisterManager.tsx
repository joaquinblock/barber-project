import { AuthHeader } from "../../components/AuthHeader/AuthHeader";
import { RegisterForm } from "../RegisterForm/RegisterForm";
export const RegisterManager = () => {
    return (
        <div>
            <AuthHeader></AuthHeader>
            <RegisterForm></RegisterForm>
        </div>
    )
}