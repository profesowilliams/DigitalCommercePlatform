//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models
{
    [ExcludeFromCodeCoverage]
    public class AuthenticateBodyRequest
    {
        public string Code { get; set; }
        public string RedirectUri { get; set; }
        public string ApplicationName { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class AuthenticateHeaderRequest
    {
        [FromHeader]
        public string TraceId { get; set; }

        [FromHeader]
        public string Site { get; set; }

        [FromHeader(Name = "Accept-Language")]
        public string Language { get; set; }


        [FromHeader]
        public string Consumer { get; set; }

        [FromHeader]
        public string SessionId { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class ActiveCustomerRequest
    {
        public string CustomerNumber { get; set; }
    }
}
