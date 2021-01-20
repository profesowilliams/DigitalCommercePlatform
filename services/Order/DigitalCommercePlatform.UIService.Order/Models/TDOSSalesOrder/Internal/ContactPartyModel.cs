using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.TDOSSalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactPartyModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public SimpleContactModel Contact { get; set; }
    }
}
