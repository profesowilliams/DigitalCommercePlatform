using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Customer
{
    [ExcludeFromCodeCoverage]
    public class SalesStructureDto
    {
        public TeamDto Team { get; set; }
        public SalesAreaDto SalesArea { get; set; }
        public SuperSalesAreaDto SuperSalesArea { get; set; }
    }
}