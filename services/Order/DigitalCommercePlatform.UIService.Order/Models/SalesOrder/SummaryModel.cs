using DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal;
using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Order.Enums;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder
{
    [ExcludeFromCodeCoverage]
    public class SummaryModel
    {
        public Source Source { get; set; }
        public ContactPartyModel SuperSalesArea { get; set; }
        public ContactPartyModel SalesArea { get; set; }
        public ContactPartyModel SalesTeam { get; set; }
        public AddressPartyModel Customer { get; set; }
        public AddressPartyModel ShipTo { get; set; }
        public QuoteLinkModel Quote { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public string Contract { get; set; }
        public PayerModel Payer { get; set; }
        public decimal? Price { get; set; }
        public Status Status { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public DateTime? PoDate { get; set; }
    }
}