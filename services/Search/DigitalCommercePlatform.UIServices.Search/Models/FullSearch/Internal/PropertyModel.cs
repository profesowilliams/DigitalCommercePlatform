//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class PropertyModel
    {
        public string Id { get; set; }
        public string Description { get; set; }
        public string Value { get; set; }
        public string Group { get; set; }
    }
}
