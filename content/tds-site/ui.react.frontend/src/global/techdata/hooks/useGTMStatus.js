import React from 'react';
import { useSyncExternalStore } from 'use-sync-external-store/shim';

// function moved outside hook to prevent rebuilding function
// on re-renders, can be also wrapped with useCallback instead
function subscribe(callback) {
    const observer = new MutationObserver(callback);

    observer.observe(document.querySelector("#intouch-headerhtml"), {
        subtree: true,
        childList: true,
    });
    return () => {
        observer.disconnect()
    };
}

export const useGTMStatus = () => {
    const isGTMReady = useSyncExternalStore(subscribe, () => { return !!window.td?.gtm?.push })

    return { isGTMReady }
}