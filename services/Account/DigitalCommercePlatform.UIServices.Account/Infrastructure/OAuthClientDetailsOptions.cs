using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure
{
    [ExcludeFromCodeCoverage]

    public class OAuthClientDetailsOptions
    {
        public const string OAuthClientDetails = "OAuthClientDetails";
        public string ClientId { get; set; }
        public string ClientSecret { get; set; }
    }
}
