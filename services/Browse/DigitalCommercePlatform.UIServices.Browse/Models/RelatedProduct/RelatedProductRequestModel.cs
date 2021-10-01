//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct
{
    [ExcludeFromCodeCoverage]
    public class RelatedProductRequestModel
    {
        public string[] ProductId { get; set; }
        public string[] Type { get; set; }
    }
}
