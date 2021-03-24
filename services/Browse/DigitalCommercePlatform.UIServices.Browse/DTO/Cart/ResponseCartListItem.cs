using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class ResponseCartListItem
    {
        public long Id { get; set; }
        public IList<ResponseCartProductListItem> Products { get; } = new List<ResponseCartProductListItem>();
    }
}
