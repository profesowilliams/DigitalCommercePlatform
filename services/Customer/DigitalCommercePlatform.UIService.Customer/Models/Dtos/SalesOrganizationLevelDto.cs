using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.Models.Dtos
{
    [ExcludeFromCodeCoverage]
    public class SalesOrganizationLevelDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int? SystemId { get; set; }
    }
}
