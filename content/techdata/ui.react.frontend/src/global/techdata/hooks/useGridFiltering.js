import { useRef } from "react";
import { usPost } from "../../../utils/api";

// hook for extend base grid with filtering functionality
export default function useGridFiltering() {
  const filter = useRef(null);
  const resetCallback = useRef(null);
  const willDoPostRequest = useRef(null);
  

  function onAfterGridInit(config) {
    resetCallback.current = () => {
      
      config.gridResetRequest();
    };
  }

  function onQueryChanged(query, options = {filterStrategy:'get'} ) {
    if (options.filterStrategy === 'post') willDoPostRequest.current = true;
    

    query ? (filter.current = query.queryString) : (filter.current = null);
    if (resetCallback.current) {
      resetCallback.current();
    }
  }

  async function requestInterceptor(request) {
    try {      
      if (willDoPostRequest.current){
        const postData = JSON.parse(filter.current);
        const response = await usPost(request.url, postData );
        return response;
      }
      const url = filter?.current ? request.url + filter.current : request.url;
      let response = await request.get(url);
      return response;
    } catch (error) {
      console.error(error);
      return []; // in case of error default value to show the no row message
    }
  }

  return { onAfterGridInit, onQueryChanged, requestInterceptor };
}
