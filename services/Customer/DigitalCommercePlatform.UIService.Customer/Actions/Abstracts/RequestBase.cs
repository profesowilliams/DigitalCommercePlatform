using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.Actions.Abstracts
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
