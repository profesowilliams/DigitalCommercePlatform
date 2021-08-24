//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Globalization;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    public class CartResponse : CartRequest
    {
        public IList<CartItemResponse> Items { get; set; } = new List<CartItemResponse>();
        public decimal SubTotal { get; set; }
        public bool IsTaxIncludedInProductPrice { get; set; }
        public decimal Discount { get; set; }
        public decimal? TaxAmount { get; set; }
        public string SubTotalString { get { return SubTotal.ToString("C", CultureInfo.GetCultureInfo(CultureName)); } }
        public string DiscountString { get { return Discount.ToString("C", CultureInfo.GetCultureInfo(CultureName)); } }
        public string TaxAmountString
        {
            get
            {
                return TaxAmount.HasValue ? TaxAmount.Value.ToString("C", CultureInfo.GetCultureInfo(CultureName)) : "-";
            }
        }
        public decimal OrderTotal
        {
            get { return SubTotal + (TaxAmount ?? 0) - Discount; }
        }
        public string OrderTotalString { get { return OrderTotal.ToString("C", CultureInfo.GetCultureInfo(CultureName)); } }
        public bool IsActiveCart { get; set; }
    }
}
