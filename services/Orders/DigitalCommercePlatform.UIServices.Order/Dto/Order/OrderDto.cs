//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Order.Dto.Order.Internal;
using DigitalCommercePlatform.UIServices.Order.Enum;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DigitalCommercePlatform.UIServices.Order.Dto.Order
{
    public class OrderDto
    {
        public SourceDto Source { get; set; }
        public string EndUserPO { get; set; }
        public string CustomerPO { get; set; }
        public DateTime? PoDate { get; set; }
        public string PoType { get; set; }
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

        public BlockReason BlockReason { get; set; }
        public List<BlockReason> BlockReasons { get; set; }

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
        public decimal FEMAmount { get; set; }
        public decimal POMAmount { get; set; }
        public decimal SAMAmount { get; set; }
        public bool BlindPackaging { get; set; }
        public string Origin { get; set; }
        public string OriginCategory { get; set; }
        public string ConfirmationNumber { get; set; }
        public string PaymentTerm { get; set; }
        public decimal? TotalCharge { get; set; }
        public string PaymentTermText { get; set; }
        public bool ShipComplete { get; set; }
    }
}
