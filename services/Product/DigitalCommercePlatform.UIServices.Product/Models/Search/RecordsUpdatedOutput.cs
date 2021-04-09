using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Search
{
    [ExcludeFromCodeCoverage]
    public class RecordsUpdatedOutput
    {
        public int RecordsBefore { get; set; }
        public int RecordsAfter { get; set; }
    }
}