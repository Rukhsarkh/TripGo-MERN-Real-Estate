import { useEffect, useRef, useState } from "react";

const LazyLoadWrapper = ({ children }) => {
  const ref = useRef(null);
  const [isVisible, setIsvisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsvisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return <div ref={ref}>{isVisible ? children : null}</div>;
};

export default LazyLoadWrapper;
