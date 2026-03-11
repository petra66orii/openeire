import toast, { ToastOptions } from "react-hot-toast";

export const toastInfo = (
  message: string,
  options?: Omit<ToastOptions, "icon">,
): string => {
  return toast(message, {
    ...options,
    icon: "i",
  });
};
