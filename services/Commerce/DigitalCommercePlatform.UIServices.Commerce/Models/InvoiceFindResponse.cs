//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    public class InvoiceFindResponse
    {
        public int PageNumber { get; set; }
        public int? TotalPages { get; set; }
        public int PageSize { get; set; }
        public long? TotalRecords { get; set; }
        public IList<InvoiceModel> Data { get; set; }
    }
}
