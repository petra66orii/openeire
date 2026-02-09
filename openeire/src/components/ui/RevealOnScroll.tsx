import React, { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // Delay in ms (for staggered grids)
  threshold?: number; // How much of the item must be visible (0 to 1)
}

const RevealOnScroll: React.FC<RevealProps> = ({
  children,
  delay = 0,
  threshold = 0.1,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once visible, set state and stop observing (trigger only once)
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before it hits bottom
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, [threshold]);

  // The CSS classes for the transition
  const baseClasses = "transition-all duration-1000 ease-out transform";
  const visibleClasses = "opacity-100 translate-y-0";
  const hiddenClasses = "opacity-0 translate-y-12"; // Start 12 units down

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${isVisible ? visibleClasses : hiddenClasses}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
