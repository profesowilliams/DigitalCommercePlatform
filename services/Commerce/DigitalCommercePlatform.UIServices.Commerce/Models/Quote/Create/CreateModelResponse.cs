using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create
{
    [ExcludeFromCodeCoverage]
    public class CreateModelResponse
    {
        public string Id { get; set; }
        public string Confirmation { get; set; }
        public IEnumerable<MessageModel> Messages { get; set; }
    }
}
