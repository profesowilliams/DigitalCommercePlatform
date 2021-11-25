using System;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Order.Enum;
using DigitalCommercePlatform.UIServices.Order.Models.Order.Internal;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace DigitalCommercePlatform.UIServices.Order.Models.Order
{
    public class OrderModel
    {
        public SourceModel Source { get; set; }
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
        public IdValueModel Type { get; set; }
        public IdValueModel Level { get; set; }
        public string Creator { get; set; }
        public QuoteLinkModel Quote { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Status Status { get; set; }

        public BlockReason BlockReason { get; set; }
        public List<BlockReason> BlockReasons { get; set; }

        public int? VendorSalesRep { get; set; }
        public int? VendorSalesAssociate { get; set; }
        public ContactPartyModel SuperSalesArea { get; set; }
        public ContactPartyModel SalesArea { get; set; }
        public ContactPartyModel SalesTeam { get; set; }
        public AddressPartyModel Reseller { get; set; }
        public AddressPartyModel ShipTo { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ConfirmationStatus ConfirmationStatus { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public DeliveryStatus DeliveryStatus { get; set; }

        public List<ItemModel> Items { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public bool TDOSSearchable { get; set; }
        public string WorkflowId { get; set; }
        public PayerModel Payer { get; set; }
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
