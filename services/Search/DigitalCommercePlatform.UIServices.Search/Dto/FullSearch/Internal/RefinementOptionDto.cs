//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementOptionDto
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public bool Selected { get; set; }
        public long Count { get; set; }
    }
}
