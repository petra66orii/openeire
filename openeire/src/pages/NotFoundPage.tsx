import { Link } from "react-router-dom";
import ErrorPageLayout from "../components/ErrorPageLayout";

const NotFoundPage = () => {
  return (
    <ErrorPageLayout
      statusCode="404"
      title="Page Not Found"
      message="The page you requested does not exist or may have been moved."
      actions={
        <>
          <Link
            to="/gallery"
            className="inline-flex min-w-[180px] justify-center rounded-xl bg-brand-500 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-white"
          >
            Browse Gallery
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

export default NotFoundPage;
