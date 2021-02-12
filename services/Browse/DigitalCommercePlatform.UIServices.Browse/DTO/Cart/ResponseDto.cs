using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class ResponseDto
    {
        public long Id { get; set; }
        public IList<ResponseCartProductListItem> Products { get; set; }
    }
}


