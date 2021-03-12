using Microsoft.AspNetCore.Mvc;

namespace DigitalCommercePlatform.UIServices.Quote.Infrastructure
{
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
