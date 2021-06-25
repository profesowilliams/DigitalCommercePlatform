import { useState, useEffect } from "react";
import { get } from '../../../utils/api';

export function usePromise(url) {
  const [value, setState] = useState(null);

  useEffect(() => {
    let isMounted = true;
    get(url)
      .then(result => {
        if (isMounted) {
          setState(result.data);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);
  return value;
}
