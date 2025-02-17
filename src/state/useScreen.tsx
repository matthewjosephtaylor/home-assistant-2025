import { useState, useEffect } from "react";
import type { SCREENS } from "../SCREENS";


export const useScreen = () => {
  const [hash, setHash] = useState<keyof typeof SCREENS>(
    window.location.hash.substring(1)
  );

  useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash.substring(1));
    };

    window.addEventListener("hashchange", handleHashChange);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return hash;
};
