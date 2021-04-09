using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Model.Customer
{
    [ExcludeFromCodeCoverage]
    public class FindCriteriaModel
    {
        public string Name { get; set; }
        public int Skip { get; set; }
        public int Count { get; set; } = 50;
    }
}