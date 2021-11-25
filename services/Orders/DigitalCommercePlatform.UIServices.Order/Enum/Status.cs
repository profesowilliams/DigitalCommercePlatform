//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;

namespace DigitalCommercePlatform.UIServices.Order.Enum
{
    public enum Status
    {
        // deprecated
        [Obsolete("This status is obsolete. Do not use it", true)]
        UNDEFINED = 0,

        [Obsolete("This status is obsolete. Do not use it", true)]
        PROCESSING = 'B',

        [Obsolete("This status is obsolete. Do not use it", true)]
        COMPLETED = 'C',

        [Obsolete("This status is obsolete. Do not use it", true)]
        MAY_NOT_OCCUR = ' ',

        [Obsolete("This status is obsolete. Do not use it", true)]
        NOT_HOLD,

        [Obsolete("This status is obsolete. Do not use it", true)]
        HOLD,
        // new ones
        OPEN,
        CANCELLED,
        ON_HOLD,
        SHIPPED,
        IN_PROCESS
    };
}
