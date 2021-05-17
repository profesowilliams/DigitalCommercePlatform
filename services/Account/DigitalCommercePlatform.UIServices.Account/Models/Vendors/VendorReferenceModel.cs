using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Vendors
{
    [ExcludeFromCodeCoverage]
    public class VendorReferenceModel
    {
        public string Vendor { get; set; }
        public bool IsConnected { get; set; }
        public string ConnectionDate { get; set; }
        public bool IsValidRefreshToken { get; set; }
    }
}
