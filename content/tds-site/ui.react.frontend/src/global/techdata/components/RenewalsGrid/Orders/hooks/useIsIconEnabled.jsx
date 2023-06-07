import React, { useMemo } from 'react'

function useIsIconEnabled(firstAvailableOrderDate, canPlaceOrder, showOrderingIcon) {

    const isIconEnabled = useMemo(() => {
        const isAfter = new Date(firstAvailableOrderDate || new Date()) > new Date();     
        return showOrderingIcon && !isAfter && canPlaceOrder;
    }, [showOrderingIcon, canPlaceOrder, firstAvailableOrderDate])

    return isIconEnabled
}

export default useIsIconEnabled