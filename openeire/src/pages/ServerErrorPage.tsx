import { Link } from "react-router-dom";
import ErrorPageLayout from "../components/ErrorPageLayout";

const ServerErrorPage = () => {
  return (
    <ErrorPageLayout
      statusCode="500"
      title="Something Went Wrong"
      message="An unexpected error occurred. Please try again, or return to the homepage."
      actions={
        <>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-w-[180px] justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white"
          >
            Retry
          </button>
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

export default ServerErrorPage;
