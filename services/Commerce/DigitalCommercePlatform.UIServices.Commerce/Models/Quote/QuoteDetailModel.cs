using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    [ExcludeFromCodeCoverage]
    public class QuoteDetailModel
    {
       public QuoteDetails QuoteDetails { get; set; }
    }
    public class QuoteDetails
    {
        public Address ShipTo { get; set; }
        public Address EndUser { get; set; }
        public DetailsForGenInfo GeneralInfo { get; set; }
        public string Notes { get; set; }
        public List<Line> Details { get; set; }
        public string QuoteNumber { get; set; }
        public string OrderNumber { get; set; }
        public string PONumber { get; set; }
        public string EndUserPO { get; set; }
        public string PODate { get; set; }
    }
}
