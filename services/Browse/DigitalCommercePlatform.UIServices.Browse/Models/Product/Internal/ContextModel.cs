using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Models.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContextModel
    {
        public string Consumer { get; set; }
        public string Site { get; set; }
        public string SalesOrganization { get; set; }
        public string Location { get; set; }
    }
}