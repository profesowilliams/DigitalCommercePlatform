using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configuration
{
    [ExcludeFromCodeCoverage]
    public class FindModel
    {
        public string CustomerId { get; set; }
        public string UserId { get; set; }
        public string SortBy { get; set; }
        public string AuthToken { get; set; }
        public string SortDirection { get; set; }
    }
}
