using DigitalCommercePlatform.UIServices.Order.Enums;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class ItemModel
    {
        public string ID { get; set; }
        public string Parent { get; set; }
        public List<ProductModel> Product { get; set; }
        public int Quantity { get; set; }
        public decimal? ConfirmedQuantity { get; set; }
        public decimal? ShippedQuantity { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ItemType Type { get; set; }

        public decimal? TotalPrice { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? CostPrice { get; set; }
        public string Currency { get; set; }
        public string ContractNo { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public List<EndUserReferenceModel> References { get; set; }

        public BasePartyModel BusinessManager { get; set; }
        public BasePartyModel Director { get; set; }
        public BasePartyModel DivisionManager { get; set; }

        public AddressPartyModel EndUser { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public ConfirmationStatus ConfirmationStatus { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public DeliveryStatus DeliveryStatus { get; set; }

        public string Status { get; set; }
        public string BlockReason { get; set; }

        public List<string> Serials { get; set; }
        public List<ShipmentModel> Shipments { get; set; }
        public List<InvoiceModel> Invoices { get; set; }
        public List<AgreementModel> Agreements { get; set; }
        public List<DeliveryModel> DeliveryNotes { get; set; }
        public List<OrderLinkModel> PurchaseOrder { get; set; }
        public DateTime? Updated { get; set; }
        public bool TDOSSearchable { get; set; }
        public decimal FEMPercent { get; set; }
        public decimal SAMPercent { get; set; }
        public decimal POMPercent { get; set; }
        public decimal NSMPercent { get; set; }
        public string BPCCode { get; set; }
        public string BackOrderIndicator { get; set; }
        public DateTime? RequestedDate { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? EstimatedShipDate { get; set; }
        public string ShippingCondition { get; set; }
        public string ShippedFrom { get; set; }
        public string PurchaseRequisition { get; set; }
        public int UniqueApprovalNumber { get; set; }
    }
}