import { useRef } from "react";
import { usPost } from "../../../utils/api";
import { fromExceptionToErrorObject } from '../../../utils/utils';

// hook for extend base grid with filtering functionality
export default function useGridFiltering() {
    const filter = useRef(null);
    const resetCallback = useRef(null);
    const willDoPostRequest = useRef(null);


    function onAfterGridInit(config) {
        resetCallback.current = config.gridResetRequest;
    }

    function onQueryChanged(query, options = { filterStrategy: 'get' }) {
        willDoPostRequest.current = false;
        if (options.filterStrategy === 'post') willDoPostRequest.current = true;
        query ? (filter.current = query.queryString) : (filter.current = null);
        if (resetCallback.current) {
            resetCallback.current();
        }
    }

    function stripCreatedToParamDates(url) {
        const Filter = filter.current.toLowerCase();
        if (Filter.includes("createdfrom") || Filter.includes("createdto")) {
            let urlToSplit = ''
            if (url.includes('&createdFrom')) {
                urlToSplit = url.split('&createdFrom')[0]

            } else if (url.includes('&createdTo')) {
                urlToSplit = url.split('&createdTo')[0]
            }
            const responseNew = urlToSplit + filter.current;
            return responseNew;
        }
        else {
            return url + filter.current;
        }
    }

    async function requestInterceptor(request) {
        try {   
            if (willDoPostRequest.current) {
                const postData = JSON.parse(filter.current);
                const response = await usPost(request.url, postData);
                willDoPostRequest.current = false;
                filter.current = null;
                return response;
            }

            const url = filter?.current
                ? stripCreatedToParamDates(request.url)
                : request.url;          
            let response = await request.get(url);
            return response;
        } catch (error) {
            console.error(error);
            return fromExceptionToErrorObject(error);
        }
    }

    return { onAfterGridInit, onQueryChanged, requestInterceptor };
}
