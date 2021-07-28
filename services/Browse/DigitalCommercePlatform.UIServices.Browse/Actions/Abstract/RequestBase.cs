using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class RequestBase
    {
        public string AccessToken { get; private set; }
        protected RequestBase(string accessToken)
        {
            AccessToken = accessToken;
        }
    }
}
