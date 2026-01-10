import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react";

interface BreadcrumbContextType {
  titles: { [path: string]: string };
  setBreadcrumbTitle: (path: string, title: string) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
  const [titles, setTitles] = useState<{ [path: string]: string }>({});

  const setBreadcrumbTitle = useCallback((path: string, title: string) => {
    setTitles((prev) => {
      if (prev[path] === title) return prev;
      return { ...prev, [path]: title };
    });
  }, []);

  return (
    <BreadcrumbContext.Provider value={{ titles, setBreadcrumbTitle }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumb = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
  }
  return context;
};
