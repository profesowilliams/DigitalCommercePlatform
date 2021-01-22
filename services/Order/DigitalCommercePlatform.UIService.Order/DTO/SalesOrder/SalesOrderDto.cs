using DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal;
using DigitalCommercePlatform.UIService.Order.Enums;
using DigitalFoundation.Common.MongoDb.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Dto.SalesOrder
{
    [SuppressMessage("Naming", "CA1707:Identifiers should not contain underscores", Justification = "<Pending>")]
    [ExcludeFromCodeCoverage]
    public class SalesOrderDto
    {
        public Source Source { get; set; }
        public string EndUserPO { get; set; }
        public string CustomerPO { get; set; }
        public DateTime? PoDate { get; set; }
        public string Contract { get; set; }
        public decimal? Price { get; set; }
        public string Contact { get; set; }
        public string Currency { get; set; }
        public string DocType { get; set; }
        public string DocCategory { get; set; }
        public IdValueDto Type { get; set; }
        public IdValueDto Level { get; set; }
        public string Creator { get; set; }
        public QuoteLinkDto Quote { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Status Status { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public BlockReason BlockReason { get; set; }

        public int? VendorSalesRep { get; set; }
        public int? VendorSalesAssociate { get; set; }

        public ContactPartyDto SuperSalesArea { get; set; }
        public ContactPartyDto SalesArea { get; set; }
        public ContactPartyDto SalesTeam { get; set; }
        public AddressPartyDto Reseller { get; set; }
        public AddressPartyDto ShipTo { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ConfirmationStatus ConfirmationStatus { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public DeliveryStatus DeliveryStatus { get; set; }

        public List<ItemDto> Items { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool TDOSSearchable { get; set; }
        public string WorkflowId { get; set; }
        public PayerDto Payer { get; set; }
    }
}