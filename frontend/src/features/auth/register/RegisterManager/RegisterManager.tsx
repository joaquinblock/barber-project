import { Suspense } from "react";
import { AuthHeader } from "../../components/AuthHeader/AuthHeader";
import { RegisterForm } from "../RegisterForm/RegisterForm";
import { FeatureErrorBoundary } from "@/shared/components/ui";

const RegisterManagerContent = () => {
    return (
        <div>
            <AuthHeader></AuthHeader>
            <RegisterForm></RegisterForm>
        </div>
    )
}

export const RegisterManager = () => (
  <FeatureErrorBoundary featureName="Register">
    <Suspense fallback={<div>Cargando...</div>}>
      <RegisterManagerContent />
    </Suspense>
  </FeatureErrorBoundary>
);