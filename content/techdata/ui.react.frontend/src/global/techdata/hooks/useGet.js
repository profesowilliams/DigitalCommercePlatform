import { useState, useEffect } from "react";
import { get } from '../../../utils/api';

// hook for getting data from API on component init, checks if component is mounted before call
export default function useGet(url) {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    get(url)
      .then(result => {
        if (isMounted) {
          setResponse(result.data);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);
  return [response, isLoading];
}
