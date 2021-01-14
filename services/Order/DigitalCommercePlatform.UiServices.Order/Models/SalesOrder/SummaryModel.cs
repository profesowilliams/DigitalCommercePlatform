using DigitalCommercePlatform.UIServices.Order.Enums;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal;
using DigitalFoundation.Common.MongoDb.Models;
using System;

namespace DigitalCommercePlatform.UIServices.Order.Models.SalesOrder
{
    public class SummaryModel
    {
        public Source Source { get; set; }
        public AddressPartyModel Customer { get; set; }
        public AddressPartyModel ShipTo { get; set; }
        public QuoteLinkModel Quote { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public string Contract { get; set; }
        public decimal? Price { get; set; }
        public Status Status { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public DateTime? PoDate { get; set; }
    }
}