import { useEffect, useState } from "react";

export const useWindowsize = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  useEffect(() => {
    function windowSize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", windowSize);
    windowSize();
    return () => window.removeEventListener("resize", windowSize);
  }, []);

  return windowSize;
};
