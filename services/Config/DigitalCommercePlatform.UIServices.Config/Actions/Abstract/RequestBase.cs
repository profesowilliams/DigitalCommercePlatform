using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class RequestBase
    {
        public string AccessToken { get; private set; }

        public RequestBase(string accessToken)
        {
            AccessToken = accessToken;
        }
    }
}
