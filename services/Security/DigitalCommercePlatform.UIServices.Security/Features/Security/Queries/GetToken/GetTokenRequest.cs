using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken
{
    [ExcludeFromCodeCoverage]

    public class GetTokenRequest
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
        public string SessionId { get; set; }
        public bool WithUserData { get; set; }

    }
}
