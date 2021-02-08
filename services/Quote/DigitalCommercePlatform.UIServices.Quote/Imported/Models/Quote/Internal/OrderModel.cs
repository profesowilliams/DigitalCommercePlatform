using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderModel
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
    }
}