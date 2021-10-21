//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class ItemModelBase
    {
        public string Id { get; set; }
        public string Parent { get; set; }
        public List<ProductModel> Product { get; set; }
        public decimal? Quantity { get; set; }
        public string ContractNumber { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public List<ReferenceModel> References { get; set; }
        public decimal UnitPrice { get; set; }
        public string UnitPriceCurrency { get; set; }
        public decimal UnitCost { get; set; }
        public string UnitCostCurrency { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal UnitListPrice { get; set; }
        public string UnitListPriceCurrency { get; set; }
        public decimal ExtendedListPrice { get; set; }
        public EndUserModel EndUser { get; set; }
        public string DealRegNumber { get; set; }
        public decimal? ReinstatementFeeCost { get; set; }
        public decimal? ReinstatementFeeSell { get; set; }
        public string Instance { get; set; }
        public List<DiscountModel> Discounts { get; set; }
        public ContractModel Contract { get; set; }
    }
}
