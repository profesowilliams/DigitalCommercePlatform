//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadSuggestion
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
    }
}
