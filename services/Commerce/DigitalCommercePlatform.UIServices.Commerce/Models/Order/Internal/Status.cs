using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal
{
    public enum Status { UNDEFINED = 0, OPEN = 'A', PROCESSING = 'B', COMPLETED = 'C', MAY_NOT_OCCUR = ' ' };
}
