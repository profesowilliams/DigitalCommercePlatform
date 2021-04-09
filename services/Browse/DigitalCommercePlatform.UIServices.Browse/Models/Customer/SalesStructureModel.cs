using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Model.Customer
{
    [ExcludeFromCodeCoverage]
    public class SalesStructureModel
    {
        public TeamModel Team { get; set; }
        public SalesAreaModel SalesArea { get; set; }
        public SuperSalesAreaModel SuperSalesArea { get; set; }
    }
}