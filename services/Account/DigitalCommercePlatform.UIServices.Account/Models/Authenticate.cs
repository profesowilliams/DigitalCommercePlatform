using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models
{
    [ExcludeFromCodeCoverage]
    public class Authenticate
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
        public string SessionId { get; set; }
        public bool? WithUserData { get; set; }
    }
}
