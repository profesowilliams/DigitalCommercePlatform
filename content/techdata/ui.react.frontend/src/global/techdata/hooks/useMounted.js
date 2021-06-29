import { useState, useEffect, useRef } from "react";

// hook for checking if component is mounted
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
