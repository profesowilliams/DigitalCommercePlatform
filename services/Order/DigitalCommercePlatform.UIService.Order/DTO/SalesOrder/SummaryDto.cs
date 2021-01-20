using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Enums;
using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Dto.SalesOrder
{
    [ExcludeFromCodeCoverage]
    public class SummaryDto
    {
        public Source Source { get; set; }
        public ContactPartyDto SuperSalesArea { get; set; }
        public ContactPartyDto SalesArea { get; set; }
        public ContactPartyDto SalesTeam { get; set; }
        public AddressPartyDto Customer { get; set; }
        public AddressPartyDto ShipTo { get; set; }
        public QuoteLinkDto Quote { get; set; }
        public string CustomerPO { get; set; }
        public string EndUserPO { get; set; }
        public string Contract { get; set; }
        public PayerDto Payer { get; set; }
        public decimal? Price { get; set; }
        public Status Status { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public DateTime? PoDate { get; set; }
    }
}