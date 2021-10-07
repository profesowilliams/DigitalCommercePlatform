//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct.Internal
{
    [ExcludeFromCodeCoverage]
    public class MainSpecificationDto
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public bool MatchesParent { get; set; }
    }
}