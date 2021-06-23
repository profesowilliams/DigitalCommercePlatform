using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Customer.Models
{
    [ExcludeFromCodeCoverage]
    public class SalesStructureModel
    {
        public TeamModel Team { get; set; }
        public SalesAreaModel SalesArea { get; set; }
        public SuperSalesAreaModel SuperSalesArea { get; set; }
    }
}
