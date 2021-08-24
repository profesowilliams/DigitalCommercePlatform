//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Cart
{
    [ExcludeFromCodeCoverage]
    public class ActiveCartModel
    {
        public ActiveSourceModel Source { get; set; }
        public string QuoteNumber { get; set; }
        public string EndUserId { get; set; }
        public IReadOnlyList<ActiveCartLineModel> Items { get; set; }
        public int? TotalQuantity { get; set; }
    }
    public class ActiveSourceModel
    {
        public string SalesOrg { get; set; }
        public string System { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class ActiveCartLineModel
    {
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public string ItemId { get; set; }
        public long ParentItemId { get; set; }
        public string AgreementNumber { get; set; }
        public string AgreementVersion { get; set; }
        public string AgreementBookToDate { get; set; }
        public int AgreementMinQuantity { get; set; }
        public int AgreementMaxQuantity { get; set; }
        public string ShippingCondition { get; set; }
        public IList<ActiveCartAppliedUanModel> AppliedUANs { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class ActiveCartAppliedUanModel
    {
        public string PricingOption { get; set; }
        public string UANNumber { get; set; }
        public string VendorAgreementNumber { get; set; }
    }
}
