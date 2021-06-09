using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class ItemDto
    {
        public string Id { get; set; }
        public string Parent { get; set; }
        public string VendorPartNo { get; set; }
        public string Description { get; set; }
        public decimal Qty { get; set; }
        public decimal PurchaseCost { get; set; }
        public decimal TotalPurchaseCost { get; set; }
        public string PurchaseCostCurrency { get; set; }
        public decimal SellPrice { get; set; }
        public string SellPriceCurrency { get; set; }
        public decimal ListPrice { get; set; }
        public string ListPriceCurrency { get; set; }
        public decimal LateFeeSellPrice { get; set; }
        public string LateFeeSellPriceCurrency { get; set; }
        public decimal LateFeePurchaseCost { get; set; }
        public string LateFeePurchaseCostCurrency { get; set; }
        public decimal LateFeeListPrice { get; set; }
        public string LateFeeListPriceCurrency { get; set; }
        public decimal QuantityRenewed { get; set; }
        public string ProductFamily { get; set; }
        public decimal ReinstatementFeeCost { get; set; }
        public decimal ReinstatementFeeSell { get; set; }
        public string[] SerialNumbers { get; set; }
        public string Instance { get; set; }
        public string Magickey { get; set; }
        public DiscountDto Discounts { get; set; }
        public ContractDto Contract { get; set; }
    }
}