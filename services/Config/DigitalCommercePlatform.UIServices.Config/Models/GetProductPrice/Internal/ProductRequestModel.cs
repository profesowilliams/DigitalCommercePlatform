//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.GetProductPrice.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductRequestModel
    {
        public string BillingFreq { get; set; }
        public decimal? Cost { get; set; }
        public string ElementNo { get; set; }
        public string EndUser { get; set; }
        public string LineId { get; set; }
        public decimal? List { get; set; }
        public string PricingAgreement { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public string ServiceType { get; set; }
        public string UAN { get; set; }
        public string Vendor { get; set; }
        public decimal ListPrice { get; set; } //Is this the same as 'List' above?

        public ProductRequestModel()
        {
            //default value from requirements
            Quantity = 1;
        }
    }
}
