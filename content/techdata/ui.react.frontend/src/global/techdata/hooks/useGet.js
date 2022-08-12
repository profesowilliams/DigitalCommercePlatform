import { useState, useEffect } from "react";
import { get } from '../../../utils/api';
import { useStore } from "../../../utils/useStore"
import { isExtraReloadDisabled, isHttpOnlyEnabled } from "../../../utils/featureFlagUtils";

// hook for getting data from API on component init, checks if component is mounted before call
// return array of three states = [ response - actual response, 
//                                  isLoading - boolean indicating that loading is in progress, 
//                                  error - actual error, if null, there is no error]

export default function useGet(url) {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isLoggedIn = useStore(state => state.isLoggedIn)

  useEffect(() => {
    let isMounted = true;
     try {
      get(url, { withCredentials: isHttpOnlyEnabled() })
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
            if (isMounted && error.response) {
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
  }, [isExtraReloadDisabled(), isLoggedIn]);
  return [response, isLoading, error];
}
