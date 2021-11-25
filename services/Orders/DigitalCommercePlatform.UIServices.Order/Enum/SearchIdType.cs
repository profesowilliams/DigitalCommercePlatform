//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;

namespace DigitalCommercePlatform.UIServices.Order.Enum
{

    /// <summary>
    /// api params
    ///SalesOrder = 1
    ///CustomerPO = 2
    ///SalesOrder | CustomerPO = 3
    ///InvoiceId = 4
    ///SalesOrder | InvoiceId = 5
    ///CustomerPO | InvoiceId = 6
    ///SalesOrder |CustomerPO | InvoiceId = 7
    /// </summary>
    [Flags]
    public enum SearchIdType
    {
        None = 0,
        SalesOrder = 1 << 0,
        CustomerPO = 1 << 1,
        InvoiceId = 1 << 2
    }
}

