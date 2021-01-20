using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public class OrderEndPointsOptions
    {
        public const string OrderEndPoints = "OrderEndPoints";
        public string Validate { get; set; }
    }
}
