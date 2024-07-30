import { useEffect, useRef } from 'react';
import { deepEqual } from '../../../OrdersTrackingCommon/Utils/utils';

/**
 * A custom hook that only triggers the effect if the dependencies change deeply.
 * @param {Function} effect - The effect callback.
 * @param {Array} deps - The dependencies array.
 */
function useDeepCompareEffect(effect, deps) {
  const previousDepsRef = useRef();

  if (!deepEqual(previousDepsRef.current, deps)) {
    previousDepsRef.current = deps;
  }

  useEffect(effect, [previousDepsRef.current]);
}

export default useDeepCompareEffect;