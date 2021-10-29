//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementRequestDto
    {
        public string Id { get; set; }
        public string ValueId { get; set; }
        public RangeDto Range { get; set; }
    }
}