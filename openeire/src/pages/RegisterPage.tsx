import AuthForm from "../components/AuthForm";
import SocialLogin from "../components/SocialLogin";
import { Link } from "react-router-dom";

const RegisterPage = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center p-4 pt-20">
      <div className="w-full max-w-md bg-gray-900 border border-white/10 rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Create Account
          </h1>
          <p className="text-gray-400 text-sm">
            Join OpenEire Studios to access exclusive content.
          </p>
        </div>

        <AuthForm />
        <SocialLogin />

        <div className="text-center text-sm text-gray-500 mt-6 pt-6 border-t border-white/10">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-white font-bold hover:text-accent transition-colors"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
