import { useState, useEffect } from "react";
import { get } from '../../../utils/api';

// hook for getting data from API on component init, checks if component is mounted before call
function useGet(url) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    get(url)
      .then(result => {
        if (isMounted) {
          setLoading(false);
          setResponse(result.data);
        }
      });
    return () => {
      setLoading(false);
      isMounted = false;
    };
  }, []);

  return [loading, response];
}

export default useGet;
