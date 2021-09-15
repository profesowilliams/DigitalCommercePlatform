import { useState, useEffect } from "react";
import { get } from '../../../utils/api';

// hook for getting data from API on component init, checks if component is mounted before call
// return array of three states = [ response - actual response, 
//                                  isLoading - boolean indicating that loading is in progress, 
//                                  error - actual error, if null, there is no error]
export default function useGet(url) {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    try {
      get(url)
        .then(result => {
          if (isMounted) {
            setResponse(result.data);
            if (result.data?.error?.isError) {
              setError(result.data.error);
            }
            setIsLoading(false);
          }
        }).catch(
          function (error) {
            if (error.response && isMounted) {
              setError(error.response);
              setResponse(null);
              setIsLoading(false);
            }
          }
        );
    } catch (error) {
      if (isMounted) {
        setError(error);
        setResponse(null);
        setIsLoading(false);
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);
  return [response, isLoading, error];
}
