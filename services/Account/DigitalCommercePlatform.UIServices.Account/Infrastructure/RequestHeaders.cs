using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public class RequestHeaders
    {
        [FromHeader]
        public string Consumer { get; set; }
        [FromHeader]
        public string TraceId { get; set; }
        [FromHeader(Name = "Accept-Language")]
        public string Language { get; set; }
    }
}
