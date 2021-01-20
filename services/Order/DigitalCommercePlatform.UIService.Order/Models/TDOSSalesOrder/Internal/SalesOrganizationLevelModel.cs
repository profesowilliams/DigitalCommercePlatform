using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.TDOSSalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class SalesOrganizationLevelModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int? SystemId { get; set; }
    }
}