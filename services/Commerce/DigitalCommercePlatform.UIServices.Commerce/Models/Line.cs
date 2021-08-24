//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate;
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
        public Discount[] Discounts { get; set; }
        public ContractDto Contract { get; set; }
        //added details
        public string ShortDescription { get; set; }
        public string MFRNumber { get; set; }
        public string TDNumber { get; set; }
        public string UPCNumber { get; set; }
        public string UnitListPrice { get; set; }
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
        public string DisplayLineNumber { get { return Id; } }
    }
}
