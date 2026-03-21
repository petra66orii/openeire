import React, { Suspense, useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  children: React.ReactNode;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
}

const DeferredSection: React.FC<DeferredSectionProps> = ({
  children,
  className,
  placeholderClassName = "min-h-[320px]",
  rootMargin = "200px",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (shouldRender) return;

    if (typeof IntersectionObserver === "undefined" || !containerRef.current) {
      setShouldRender(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRender(true);
        observer.disconnect();
      },
      { rootMargin },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [rootMargin, shouldRender]);

  return (
    <div ref={containerRef} className={className}>
      {shouldRender ? (
        <Suspense
          fallback={
            <div
              aria-hidden="true"
              className={`animate-pulse rounded-3xl bg-white/5 ${placeholderClassName}`}
            />
          }
        >
          {children}
        </Suspense>
      ) : (
        <div
          aria-hidden="true"
          className={`animate-pulse rounded-3xl bg-white/5 ${placeholderClassName}`}
        />
      )}
    </div>
  );
};

export default DeferredSection;
