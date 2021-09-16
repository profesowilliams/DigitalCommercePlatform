//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class AttributeModel
    {
        public string Id { get; set; }
        public string ValueId { get; set; }
        public string Name { get; set; }
        public string Value { get; set; }
        public int DisplayOrder { get; set; }
    }
}
