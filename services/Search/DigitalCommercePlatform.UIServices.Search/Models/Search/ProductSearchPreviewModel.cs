//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class ProductSearchPreviewModel
    {
        public string Id { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string DisplayName { get; set; }
        public string ImageUrl { get; set; }
    }
}
