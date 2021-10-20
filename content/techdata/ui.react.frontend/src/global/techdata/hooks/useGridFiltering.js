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
    console.log('onQueryChanged(request)', query);
    console.log('onQueryChanged filter', filter);
    query ? (filter.current = query.queryString) : (filter.current = null);
    if (resetCallback.current) {
      resetCallback.current();
    }
  }

  async function requestInterceptor(request) {
    console.log('requestInterceptor(request)', request);
    console.log('requestInterceptor filter', filter);
    const url = filter?.current ? request.url + filter.current : request.url;
    console.log('URL', url);
    let response = await request.get(url);
    console.log('Response', response);
    return response;
  }

  async function requestLocalFilter(data) {
    console.log('***************', data);
    // const url = filter?.current ? request.url + filter.current : request.data;
    const response = [];
    response.push(data);
    return response;
  }

  return { onAfterGridInit, onQueryChanged, requestInterceptor, requestLocalFilter };
}
