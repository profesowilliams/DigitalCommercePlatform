using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class SourceDto
    {
        public string ID { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string Key { get; set; }
    }
}
