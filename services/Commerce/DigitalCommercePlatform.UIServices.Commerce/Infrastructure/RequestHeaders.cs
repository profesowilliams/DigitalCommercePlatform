using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public class RequestHeaders
    {
        [FromHeader]
        [Required]
        public string Consumer { get; set; }
        
        [FromHeader]
        [Required]
        public string TraceId { get; set; }
        
        [FromHeader(Name = "Accept-Language")]
        [Required]
        public string Language { get; set; }
    }
}
