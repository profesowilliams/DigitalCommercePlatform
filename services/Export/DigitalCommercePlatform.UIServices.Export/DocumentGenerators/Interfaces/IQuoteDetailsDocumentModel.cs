//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Actions.Quote;
using DigitalCommercePlatform.UIServices.Export.Models;
using DigitalCommercePlatform.UIServices.Export.Models.Internal;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces
{
    public interface IQuoteDetailsDocumentModel : IDocumentModel
    {
        public DownloadQuoteDetails.Request Request { get; set; }

        public Address ShipTo { get; set; }
        public Address EndUser { get; set; }
        public Address Reseller { get; set; }
        public List<VendorReferenceModel> VendorReference { get; set; }
        public List<AttributeModel> Attributes { get; set; }
        public string Notes { get; set; }
        public List<Line> Items { get; set; }
        public string Id { get; set; }
        public List<OrderModel> Orders { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public string QuoteReference { get; set; }
        public string SPAId { get; set; }
        public string Currency { get; set; }
        public decimal SubTotal { get; set; }
        public string SubTotalFormatted { get; set; }
        public string Tier { get; set; }
        public string Created { get; set; }
        public string Expires { get; set; }
    }
}
