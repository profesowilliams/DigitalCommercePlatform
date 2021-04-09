using DigitalCommercePlatform.UIServices.Customer.Models.Customer.Internal;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Customer.Models.Customer.Common
{
    [ExcludeFromCodeCoverage]
    public class SalesStructureModel
    {
        public TeamModel Team { get; set; }
        public SalesAreaModel SalesArea { get; set; }
        public SuperSalesAreaModel SuperSalesArea { get; set; }
    }
}
