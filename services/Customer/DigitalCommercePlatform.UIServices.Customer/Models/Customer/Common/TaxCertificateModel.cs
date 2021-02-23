using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Customer.Models.Customer.Common
{
    [ExcludeFromCodeCoverage]
    public class TaxCertificateModel
    {
        public string CertificateNumber { get; set; }
        public string Jurisdiction { get; set; }
        public string Active { get; set; }
    }
}