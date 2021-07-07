using System.Diagnostics.CodeAnalysis;
using System.Net;

namespace DigitalCommercePlatform.UIServices.Content.Models.Cart.Internal
{
    [ExcludeFromCodeCoverage]
    public class ReplaceCartModel
    {
        public HttpStatusCode StatusCode { get; set; }
        public string ErrorMessage { get; set; }
    }
}
