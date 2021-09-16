//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementOptionModel
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public bool Selected { get; set; }
        public long Count { get; set; }
    }
}
