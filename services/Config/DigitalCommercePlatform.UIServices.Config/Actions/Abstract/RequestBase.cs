namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract
{
    public abstract class RequestBase
    {
        public string AccessToken { get; private set; }

        public RequestBase(string accessToken)
        {
            AccessToken = accessToken;
        }
    }
}
