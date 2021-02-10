using System;
using System.Collections.Generic;
using System.Text;

namespace DigitalFoundation.App.Services.Quote.DTO.Common
{
    /// <summary>
    /// Simple return object, to be used when only one item is requested OR having total / pagination info is not useful
    /// </summary>
    /// <typeparam name="T"></typeparam>
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