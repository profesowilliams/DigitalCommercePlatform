using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class TdQuoteIdDetails
    {
        public string Id { get; set; }
        public string Line { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public string Created { get; set; }
        public string Status { get; set; }
    }
}
