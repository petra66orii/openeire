export type ErrorRoutePath = "/403" | "/500";

const ERROR_ROUTE_EVENT = "app:error-route";

interface ErrorRouteDetail {
  path: ErrorRoutePath;
}

export const emitErrorRoute = (path: ErrorRoutePath): void => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ErrorRouteDetail>(ERROR_ROUTE_EVENT, {
      detail: { path },
    }),
  );
};

export const subscribeToErrorRoute = (
  listener: (path: ErrorRoutePath) => void,
): (() => void) => {
  if (typeof window === "undefined") return () => undefined;

  const eventListener: EventListener = (event) => {
    const customEvent = event as CustomEvent<ErrorRouteDetail>;
    const path = customEvent.detail?.path;
    if (path === "/403" || path === "/500") {
      listener(path);
    }
  };

  window.addEventListener(ERROR_ROUTE_EVENT, eventListener);
  return () => {
    window.removeEventListener(ERROR_ROUTE_EVENT, eventListener);
  };
};
