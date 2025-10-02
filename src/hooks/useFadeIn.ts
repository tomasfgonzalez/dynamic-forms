// src/hooks/useFadeIn.ts
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export function useFadeIn(): boolean {
  const [fadeIn, setFadeIn] = useState<boolean>(false);
  const location = useLocation();

  useEffect(() => {
    
    setFadeIn(false); // reset before fade-in
    const timeout = setTimeout(() => setFadeIn(true), 10);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return fadeIn;
}
