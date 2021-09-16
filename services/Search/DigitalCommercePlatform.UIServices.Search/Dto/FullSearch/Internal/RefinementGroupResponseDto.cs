//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementGroupResponseDto
    {
        public string Group { get; set; }
        public List<RefinementDto> Refinements { get; set; }
    }
}
