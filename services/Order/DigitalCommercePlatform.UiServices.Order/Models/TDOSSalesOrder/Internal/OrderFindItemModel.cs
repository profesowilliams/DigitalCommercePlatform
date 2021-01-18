using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.Models.TDOSSalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderFindItemModel
    {
        public string Line { get; set; }
        public string Product { get; set; }
        public double OrderedQuantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal FEMPercent { get; set; }
        public decimal POMPercent { get; set; }
        public decimal SAMPercent { get; set; }
        public decimal NSMPercent { get; set; }
        public string BPCCD { get; set; }
        public string SalesTeamName { get; set; }
    }
}