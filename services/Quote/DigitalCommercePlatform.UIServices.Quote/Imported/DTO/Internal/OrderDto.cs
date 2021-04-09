using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderDto
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
    }
}
