namespace DigitalCommercePlatform.UIServices.Security.Requests
{
    public class GetTokenRequest
    {
        public string Code { get; set; }
        public string ReturnUrl { get; set; }
        public string SessionId { get; set; }
    }
}
