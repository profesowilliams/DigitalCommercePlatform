using DigitalFoundation.Common.Security.Messages;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    public class GetUserResponse
    {
        public UserDto User { get; set; }
        public virtual bool IsError { get; set; }
        public int ExpiresIn { get; set; }
        public string ErrorCode { get; set; }
        public SecurityResponseErrorType ErrorType { get; set; }
        public string ErrorDescription { get; set; }
    }
}
