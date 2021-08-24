//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Cart
{
    [ExcludeFromCodeCoverage]
    public class CartItemModel
    {
        public int ItemId { get; set; }
        public int ParentItemId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
        public string AgreementNumber { get; set; }
        public string AgreementVersion { get; set; }
        public string AgreementBookToDate { get; set; }
        public int AgreementMinQuantity { get; set; }
        public int AgreementMaxQuantity { get; set; }
        public string ShippingCondition { get; set; }
        public List<UAN> AppliedUAN { get; set; }
        public string ManufacturerName { get; set; }
        public string Plant { get; set; }
    }
}
