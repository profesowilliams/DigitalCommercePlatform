using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.DTO.Response
{
    public class QuoteSummaryResponse
    {
        public string QuoteId { get; set; }
        public string VendorReference { get; set; }
        public string EndUserName { get; set; }
    }
}
