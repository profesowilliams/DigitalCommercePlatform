using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class ContactPartyModel : BasePartyModel
    {
        public ContactModel Contact { get; set; }
    }
}
