import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
  const location = useLocation();

  const scroll = () => {
    const hash = window.location.hash;

    if (!hash) return;

    requestAnimationFrame(() => {
      const element = document.querySelector(hash);

      if (element) {
        const y =
          element.getBoundingClientRect().top +
          window.pageYOffset -
          120; 

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    });
  };

  useEffect(() => {
    scroll();
  }, [location.pathname]);

  useEffect(() => {
    window.addEventListener("hashchange", scroll);
    return () => window.removeEventListener("hashchange", scroll);
  }, []);

  return null;
}
