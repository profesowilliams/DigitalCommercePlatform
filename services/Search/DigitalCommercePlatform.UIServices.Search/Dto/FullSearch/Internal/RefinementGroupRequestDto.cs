//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class RefinementGroupRequestDto
    {
        public string Group { get; set; }
        public List<RefinementRequestDto> Refinements { get; set; }
    }
}