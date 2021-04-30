using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote
{
    [ExcludeFromCodeCoverage]
    public class QuoteDetailModel
    {
        public Address[] ShipAddresses { get; set; }
        public Address[] EndUserAddresses { get; set; }
        public QuoteGeneralInformation GeneralInformation { get; set; }
        public string Notes { get; set; }
        public List<Line> LineItems { get; set; }
        public string QuoteNumber { get; set; }
        public string OrderNumber { get; set; }
        public string PONumber { get; set; }
        public string EndUserPO { get; set; }
        public string PODate { get; set; }
    }
}
