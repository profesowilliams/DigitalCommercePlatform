//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Cart.Internal
{
    [ExcludeFromCodeCoverage]
    public class LineModel
    {
        public string LineNo { get; set; }
        public string ProductId { get; set; }
        public decimal Quantity { get; set; }
        public string UAN { get; set; }
        public string Type { get; set; }
        public IList<ExtensionPropertyModel> ExtensionProperties { get; set; }
    }
}
