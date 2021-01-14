using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Order.DTO
{
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