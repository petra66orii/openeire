import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { savePendingDiscountCode } from "../utils/pendingDiscount";

const DiscountDeepLinkCapture: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const discountCode = searchParams.get("discount");
    if (!discountCode) return;

    savePendingDiscountCode(discountCode);
  }, [location.search]);

  return null;
};

export default DiscountDeepLinkCapture;
