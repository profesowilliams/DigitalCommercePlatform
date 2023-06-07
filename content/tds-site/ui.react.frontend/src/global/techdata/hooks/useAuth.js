import React from 'react';
import { useStore } from 'react-redux';
import { isExtraReloadDisabled } from '../../../utils/featureFlagUtils';

function useAuth() {
  const isLoggedIn = useStore( state => state.isLoggedIn);
  const isUserLoggedIn =
    !isExtraReloadDisabled() && localStorage.getItem('sessionId')
      ? true
      : isLoggedIn;

  return { isLoggedIn, isUserLoggedIn };
}

export default useAuth;
