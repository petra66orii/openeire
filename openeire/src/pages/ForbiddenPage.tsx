import { Link } from "react-router-dom";
import ErrorPageLayout from "../components/ErrorPageLayout";

const ForbiddenPage = () => {
  return (
    <ErrorPageLayout
      statusCode="403"
      title="Access Forbidden"
      message="You do not have permission to view this page. Please sign in with an account that has access."
      actions={
        <>
          <Link
            to="/login"
            className="inline-flex min-w-[180px] justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white"
          >
            Log In
          </Link>
          <Link
            to="/"
            className="inline-flex min-w-[180px] justify-center rounded-xl border border-white/20 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Back Home
          </Link>
        </>
      }
    />
  );
};

export default ForbiddenPage;
