using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    public class CartItem
    {
        public long Id { get; set; }
        public IList<CartProductItem> Products { get; } = new List<CartProductItem>();
    }
}

