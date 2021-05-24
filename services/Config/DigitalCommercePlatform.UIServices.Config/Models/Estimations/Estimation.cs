using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Estimations
{
    [ExcludeFromCodeCoverage]
    public class Estimation
    {
        public string ConfigId { get; set; }
        public string ConfigurationType { get; set; }
        public string Vendor { get; set; }
    }
}
