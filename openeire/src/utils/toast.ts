import toast, { ToastOptions } from "react-hot-toast";

export const toastInfo = (
  message: string,
  options?: ToastOptions,
): string => {
  return toast(message, {
    icon: "i",
    ...options,
  });
};
