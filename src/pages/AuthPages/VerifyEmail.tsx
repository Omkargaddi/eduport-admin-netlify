
import VerifyEmailForm from "../../components/auth/VerifyEmailForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function VerifyEmail() {
  return (
    <>
      <PageMeta
        title="Eduport Admin | Verify Email"
        description="This is React.js SignIn Tables Dashboard page for Eduport - React.js Tailwind CSS Admin Dashboard"
      />
      <AuthLayout>
        <VerifyEmailForm />
      </AuthLayout>
    </>
  );
}
