//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class AgreementModel
    {
        public string Id { get; set; }
        public string Version { get; set; }
        public string VendorId { get; set; }
        public string SelectionFlag { get; set; }
    }
}
