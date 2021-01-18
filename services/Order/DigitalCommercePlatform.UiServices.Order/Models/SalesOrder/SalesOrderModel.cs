using DigitalCommercePlatform.UIServices.Order.Enums;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal;
using DigitalFoundation.Common.MongoDb.Models;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.SalesOrder
{
    [SuppressMessage("Naming", "CA1707:Identifiers should not contain underscores", Justification = "<Pending>")]
    [ExcludeFromCodeCoverage]
    public class SalesOrderModel
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
        public IdValueModel Type { get; set; }
        public IdValueModel Level { get; set; }
        public string Creator { get; set; }
        public QuoteLinkModel Quote { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public Status Status { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public BlockReason BlockReason { get; set; }

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
    }
}