using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.TypeAhead.Models
{
    [ExcludeFromCodeCoverage]
    public class RecordsUpdatedOutput
    {
        public int RecordsBefore { get; set; }
        public int RecordsAfter { get; set; }
    }
}