//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Internal;

namespace DigitalCommercePlatform.UIServices.Export.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class Item
    {
        public string ID { get; set; }
        public string Parent { get; set; }
        public int Quantity { get; set; }
        public decimal? TotalPrice { get; set; }
        public string TotalPriceFormatted { get { return string.Format(Constants.MoneyFormat, TotalPrice); } }
        public decimal TotalPurchaseCost { get; set; }
        public decimal? UnitPrice { get; set; }
        public string UnitPriceFormatted { get { return string.Format(Constants.MoneyFormat, UnitPrice); } }
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
        public List<Product> Product { get; set; }
        public List<ShipmentModel> Shipments { get; set; }
        public List<InvoiceModel> Invoices { get; set; }
        public List<OrderLinkModel> PurchaseOrder { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Freight { get; set; }
        public decimal? OtherFees { get; set; }
        public DateTime? LicenseStartDate { get; set; }
        public DateTime? LicenseEndDate { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public List<ServiceContractDetailModel> ServiceContractDetails { get; set; }
        public string ContractNo { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public string VendorStatus { get; set; }
        public string CustomerPOLine { get; set; }
        public string SupplierQuoteRef { get; set; }
        public string ConfigID { get; set; }
        public string LocationID { get; set; }
        public AddressModel EndUser { get; set; }
        public List<string> Serials { get; set; }
        public string Status { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class OrderLinkModel
    {
        public string ID { get; set; }
        public string AltID { get; set; }
        public string Line { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class ServiceContractDetailModel
    {
        public string BillStatus { get; set; }
        public decimal? BillPlanAmount { get; set; }
        public DateTime? BillPlanDate { get; set; }
    }
}
