//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class TypeAheadResultGroup
    {
        public string Group { get; set; }
        public List<TypeAheadModel> Results { get; set; }
    }
}
