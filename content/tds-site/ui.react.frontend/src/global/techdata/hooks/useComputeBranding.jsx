import React from 'react'
import { useRenewalGridState } from '../components/RenewalsGrid/store/RenewalsStore'

function useComputeBranding(store) {
    const branding = store( state => state.branding || '');
    const isTDSynnex = branding === 'td-synnex';
    const computeClassName = (className) => `${className} ${branding}`;
    return { computeClassName, isTDSynnex };
}

export default useComputeBranding