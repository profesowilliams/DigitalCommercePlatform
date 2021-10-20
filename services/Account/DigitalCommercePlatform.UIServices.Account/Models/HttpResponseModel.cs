//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;
using System.Net;

namespace DigitalCommercePlatform.UIServices.Account.Models
{
    [ExcludeFromCodeCoverage]
    public class HttpResponseModel
    {
        public HttpStatusCode StatusCode { get; set; }
        public string ErrorMessage { get; set; }
    }
}
