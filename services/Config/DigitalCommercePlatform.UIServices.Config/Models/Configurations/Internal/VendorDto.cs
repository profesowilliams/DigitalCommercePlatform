//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class VendorDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string VendorsTDName { get; set; }
        public string VendorsTDNumber { get; set; }
    }
}
