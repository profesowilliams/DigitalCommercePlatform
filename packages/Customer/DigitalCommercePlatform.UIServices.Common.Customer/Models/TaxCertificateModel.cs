using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Models
{
    [ExcludeFromCodeCoverage]
    public class TaxCertificateModel
    {
        public string CertificateNumber { get; set; }
        public string Jurisdiction { get; set; }
        public string Active { get; set; }
    }
}
