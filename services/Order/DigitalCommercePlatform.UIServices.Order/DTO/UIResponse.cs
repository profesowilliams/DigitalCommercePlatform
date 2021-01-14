using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Order.DTO
{
    public class UIResponse<T>
    {
        public T ReturnObject { get; set; }
        public List<string> Errors { get; set; }
    }
}
