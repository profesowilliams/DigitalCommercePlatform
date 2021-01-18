using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.AppServices.Quote.Models.Summary.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderModel
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
    }
}