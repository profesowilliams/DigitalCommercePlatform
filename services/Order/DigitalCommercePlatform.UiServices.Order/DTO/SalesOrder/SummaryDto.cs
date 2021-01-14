using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder.Internal;
using DigitalCommercePlatform.UIServices.Order.Enums;
using DigitalFoundation.Common.MongoDb.Models;
using System;

namespace DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder
{
    public class SummaryDto
    {
        public Source Source { get; set; }
        public AddressPartyDto Customer { get; set; }
        public AddressPartyDto ShipTo { get; set; }
        public QuoteLinkDto Quote { get; set; }
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