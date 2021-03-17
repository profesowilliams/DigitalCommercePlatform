using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    public class FindResponse<T>
    {
        public long? Count { get; set; }
        public T Data { get; set; }
    }
}
