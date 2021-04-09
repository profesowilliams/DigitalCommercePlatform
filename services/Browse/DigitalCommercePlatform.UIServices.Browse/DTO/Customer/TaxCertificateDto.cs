using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Customer
{
    [ExcludeFromCodeCoverage]
    public class TaxCertificateDto
    {
        public string CertificateNumber { get; set; }
        public string Jurisdiction { get; set; }
        public string Active { get; set; }
    }
}