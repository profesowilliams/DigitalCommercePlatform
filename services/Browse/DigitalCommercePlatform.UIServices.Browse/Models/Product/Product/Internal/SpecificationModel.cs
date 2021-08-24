//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class SpecificationModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string ValueId { get; set; }
        public string Value { get; set; }
        public int DisplayOrder { get; set; }
    }
}
