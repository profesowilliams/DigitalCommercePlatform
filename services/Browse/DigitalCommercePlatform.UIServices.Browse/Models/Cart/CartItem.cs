using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    [ExcludeFromCodeCoverage]
    public class CartItem
    {
        public long Id { get; set; }
        public IList<CartProductItem> Products { get;set; } = new List<CartProductItem>();
    }
}

