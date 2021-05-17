using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Common.Product.Models
{
    public class ProductDetailDto
    {
        public IReadOnlyCollection<string> Id { get; set; }
        public bool Details { get; set; }
    }
}
