using DigitalCommercePlatform.UIServices.Security.Models;
using DigitalFoundation.Common.Security.Messages;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken
{
    public class GetTokenResponse
    {
        //public string AccessToken { get; set; }
        //public string RefreshToken { get; set; }
        //public string IdentityToken { get; set; }
        //public string TokenType { get; set; }
        //public int ExpiresIn { get; set; }
        //public virtual bool IsError { get; set; }
        //public string ErrorCode { get; set; }
        //public SecurityResponseErrorType ErrorType { get; set; }
        //public string ErrorDescription { get; set; }

        public string Message { get; set; }
        public User User { get; set; }
    }
}
