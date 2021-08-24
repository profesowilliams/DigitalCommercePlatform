//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Globalization;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    public class CartItemResponse : CartItemRequest
    {
        public decimal Total => Quantity * Price;
        public string PriceString => Price.ToString("C", CultureInfo.GetCultureInfo(CultureName));
        public string TotalString => Total.ToString("C", CultureInfo.GetCultureInfo(CultureName));
        public List<CartMessage> Messages { get; } = new List<CartMessage>();
    }
}
