import React from 'react'
import { useRenewalGridState } from '../../RenewalsGrid/store/RenewalsStore'

function useIsTDSynnexClass() {
    const isTDSynnex = useRenewalGridState( state => state.isTDSynnex || false);
    const computeClassName = (className) => isTDSynnex ? `${className} td-synnex` : className;
    return { computeClassName, isTDSynnex };
}

export default useIsTDSynnexClass