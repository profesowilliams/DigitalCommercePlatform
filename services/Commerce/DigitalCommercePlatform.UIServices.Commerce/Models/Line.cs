using DigitalCommercePlatform.UIServices.Commerce.Infrastructure;

namespace DigitalCommercePlatform.UIServices.Commerce.Models
{
    public class Line
    {
        public string Id { get; set; }
        public string Parent { get; set; }
        public string VendorPartNo { get; set; }
        public string Description { get; set; }
        public int Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public string UnitPriceFormatted { get { return string.Format(Constants.MoneyFormat, UnitPrice); } }
        public decimal? TotalPrice { get; set; }
        public string TotalPriceFormatted { get { return string.Format(Constants.MoneyFormat, TotalPrice); } }
        public decimal? MSRP { get; set; }
        public string Invoice { get; set; }
        public Discount[] Discounts { get; set; }
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

    }
}
