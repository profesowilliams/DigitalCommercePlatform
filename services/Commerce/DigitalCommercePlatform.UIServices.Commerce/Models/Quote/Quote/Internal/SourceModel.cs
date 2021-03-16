using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class SourceModel
    {
        public string ID { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string Key { get; set; }
    }
}