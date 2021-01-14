using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO
{
    [ExcludeFromCodeCoverage]
    public class BrowseLineAgreement
    {
        public string Part { get; set; }
        public string TDUANumber { get; set; }
        public string SelectionIndicator { get; set; }
        public string VendorAgreementNumber { get; set; }
    }
}
