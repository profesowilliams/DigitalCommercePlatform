//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContextDto
    {
        public string Consumer { get; set; }
        public string Site { get; set; }
        public string SalesOrganization { get; set; }
        public string Location { get; set; }
    }
}
