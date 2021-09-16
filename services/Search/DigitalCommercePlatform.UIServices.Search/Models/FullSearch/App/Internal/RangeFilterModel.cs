//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.App.Internal
{
    [ExcludeFromCodeCoverage]
    public class RangeFilterModel
    {
        public string Id { get; set; }
        public decimal Min { get; set; }
        public decimal Max { get; set; }
    }
}
