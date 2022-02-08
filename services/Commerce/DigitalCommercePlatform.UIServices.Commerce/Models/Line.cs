//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Product;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    [ExcludeFromCodeCoverage]
    public class Line
    {

        public string Id { get; set; }
        public string Parent { get; set; }
        public string VendorPartNo { get; set; }
        public string Manufacturer { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public string UnitPriceFormatted { get { return string.Format(Constants.MoneyFormat, UnitPrice); } }
        public decimal? TotalPrice { get; set; }
        public string TotalPriceFormatted { get { return string.Format(Constants.MoneyFormat, TotalPrice); } }
        public decimal? MSRP { get; set; }
        public string Invoice { get; set; }
        public List<DateTime?> ShipDates { get; set; }
        public List<InvoiceModel> Invoices { get; set; }
        public List<TrackingDetails> Trackings { get; set; }
        public Discount[] Discounts { get; set; }
        public ContractDto Contract { get; set; }
        //added details
        public string ShortDescription { get; set; }
        public string MFRNumber { get; set; }
        public string TDNumber { get; set; }
        public string UPCNumber { get; set; }
        public string UnitPriceCurrency { get; set; }
        public decimal UnitCost { get; set; }
        public string UnitCostCurrency { get; set; }
        public decimal UnitListPrice { get; set; }
        public string UnitListPriceCurrency { get; set; }
        public decimal ExtendedListPrice { get; set; }
        public string UnitListPriceFormatted { get; set; }
        public string ExtendedPrice { get; set; }
        public string ExtendedPriceFormatted { get { return string.Format(Constants.MoneyFormat, ExtendedPrice); } }
        public string Availability { get; set; }
        public string RebateValue { get; set; }
        public string URLProductImage { get; set; }
        public string URLProductSpecs { get; set; }
        public List<Line> Children { get; set; }
        public List<AgreementModel> Agreements { get; set; }
        public string AncillaryChargesWithTitles { get; set; }
        public Annuity Annuity { get; set; }
        public bool IsSubLine { get { return false; } }
        public string DisplayLineNumber { get; set; }
        public DateTime? LicenseStartDate { get; set; }
        public DateTime? LicenseEndDate { get; set; }
        public DateTime? ContractStartDate { get; set; }
        public DateTime? ContractEndDate { get; set; }
        public List<ServiceContractDetailModel> ServiceContractDetails { get; set; }
        public string ContractNo { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public string Status { get; set; }
        public string VendorStatus { get; set; }
        public string CustomerPOLine { get; set; }
        public string SupplierQuoteRef { get; set; }
        public string ConfigID { get; set; }
        public string LocationID { get; set; }
        public IList<string> Serials { get; set; }
        public IList<string> PAKs { get; set; }
        public IDictionary<string, IEnumerable<ImageModel>> Images { get; set; }
        public IDictionary<string, IEnumerable<LogoModel>> Logos { get; set; }
        public string DisplayName { get; internal set; }
        public AuthorizationModel Authorization { get; set; }
        public string POSType { get; set; } = "";
        public decimal PurchaseCost { get; set; }
    }
}
