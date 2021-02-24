using DigitalCommercePlatform.UIServices.Security.Models;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    [ExcludeFromCodeCoverage]
    public class GetUserResponse
    {
        public User User { get; set; }
        //public virtual bool IsError { get; set; }
        //public int ExpiresIn { get; set; }
        //public string ErrorCode { get; set; }
        //public SecurityResponseErrorType ErrorType { get; set; }
        //public string ErrorDescription { get; set; }
    }
}
