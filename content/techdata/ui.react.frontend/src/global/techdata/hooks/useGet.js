import { useState, useEffect } from "react";
import { get } from '../../../utils/api';

export function useGet(url) {
  const [response, setResponse] = useState(null);
  // hook for getting data from API, checks if component is mounted before call
  useEffect(() => {
    let isMounted = true;
    get(url)
      .then(result => {
        if (isMounted) {
          setResponse(result.data);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);
  return response;
}
