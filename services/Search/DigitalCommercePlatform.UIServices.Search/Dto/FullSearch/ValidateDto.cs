//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Models;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch
{
    [ExcludeFromCodeCoverage]
    public class ValidateDto
    {
        public Source Source { get; set; }
        public string Restriction { get; set; }
    }
}
