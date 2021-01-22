using Microsoft.AspNetCore.Mvc;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    public class GetUserRequest
    {
        public string ApplicationName { get; set; }

        [FromHeader]
        public string SessionId { get; set; }
    }
}
