import ForgetPasswordForm from "../../components/auth/ForgetPasswordForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function ForgetPassword() {
  return (
    <>
      <PageMeta
        title="Eduport Admin | Forget Password"
        description="This is React.js SignIn Tables Dashboard page for Eduport - React.js Tailwind CSS Admin Dashboard"
      />
      <AuthLayout>
        <ForgetPasswordForm />
      </AuthLayout>
    </>
  );
}
