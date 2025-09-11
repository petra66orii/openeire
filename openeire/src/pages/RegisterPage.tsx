import AuthForm from "../components/AuthForm";

const RegisterPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          Create Your Account
        </h1>
        <AuthForm />
      </div>
    </div>
  );
};

export default RegisterPage;
