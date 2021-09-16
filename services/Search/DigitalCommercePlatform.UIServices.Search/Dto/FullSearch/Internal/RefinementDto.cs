//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Enums;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public RefinementType Type { get; set; } = RefinementType.MultiSelect;
        public RangeDto Range { get; set; }
        public List<RefinementOptionDto> Options { get; set; }
    }
}
