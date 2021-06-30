import { useRef } from "react";

// hook for extend base grid with filtering functionality
export default function useGridFiltering() {
  const filter = useRef(null);
  const resetCallback = useRef(null);

  function onAfterGridInit(config) {
    resetCallback.current = () => {
      config.gridResetRequest();
    };
  }

  function onQueryChanged(query) {
    query ? (filter.current = query.queryString) : (filter.current = null);
    if (resetCallback.current) {
      resetCallback.current();
    }
  }

  async function requestInterceptor(request) {
    const url = filter?.current ? request.url + filter.current : request.url;
    let response = await request.get(url);
    return response;
  }

  return { onAfterGridInit, onQueryChanged, requestInterceptor };
}
