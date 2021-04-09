using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Cart
{
    public class AddProductsRequestModel : List<AddProductsItemRequestModel>
    {
    }

    public class AddProductsItemRequestModel
    {
        public long Product { get; set; }
        public ushort Quantity { get; set; }
    }
}
