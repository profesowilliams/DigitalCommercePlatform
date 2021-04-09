using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Customer.Actions.Abstracts
{
    [ExcludeFromCodeCoverage]
    public abstract class RequestBase
    {
        public string AccessToken { get; set; }

        protected RequestBase() { }

        protected RequestBase(string accessToken)
        {
            AccessToken = accessToken;
        }
    }
}
