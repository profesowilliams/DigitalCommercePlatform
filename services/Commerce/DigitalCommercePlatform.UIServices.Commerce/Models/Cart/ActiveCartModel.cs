using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Cart
{
    [ExcludeFromCodeCoverage]
    public class ActiveCartModel
    {
         public ActiveSourceModel Source { get; set; }
         public IList<CartLineModel> Lines { get; set; }
        public int? TotalQuantity { get; set; }
    }
    public class ActiveSourceModel
    {
        public string SalesOrg { get; set; }
        public string System { get; set; }
    }
    public class CartLineModel
    {
        public string LineNo { get; set; }
        public string ParentLineNo { get; set; }
        public string ProductId { get; set; }
        public int? Quantity { get; set; }
    }
}
