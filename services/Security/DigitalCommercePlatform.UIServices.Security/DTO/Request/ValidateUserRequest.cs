using DigitalCommercePlatform.UIServices.Security.DTO.Response;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace DigitalCommercePlatform.UIServices.Security.DTO.Request
{
    public class ValidateUserRequest : IRequest<ValidateUserResponse>
    {
        public string ApplicationName { get; set; }

        [FromHeader]
        public string Site { get; set; }

        [FromHeader]
        public string Authorization { get; set; }
        
        [FromHeader]
        public string Consumer { get; set; }

        [FromHeader(Name = "Accept-Language")]
        public string AcceptLanguage { get; set; }
    }
}
