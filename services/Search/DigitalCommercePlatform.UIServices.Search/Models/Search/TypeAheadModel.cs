//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadModel
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string CategoryName { get; set; }
    }
}
