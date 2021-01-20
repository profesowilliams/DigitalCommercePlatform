using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO
{
    [ExcludeFromCodeCoverage]
    public class Response<T>
    {
        public T ReturnObject { get; set; }
        public List<string> Errors { get; set; }

        public Response()
        { }

        public Response(T returnObject)
        {
            ReturnObject = returnObject;
        }
    }
}