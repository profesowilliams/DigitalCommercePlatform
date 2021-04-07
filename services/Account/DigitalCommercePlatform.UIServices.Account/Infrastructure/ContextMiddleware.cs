using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalFoundation.Common.Contexts;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public class ContextMiddleware
    {
        private readonly RequestDelegate _next;

        public ContextMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IUIContext uiContext)
        {
            var validationErrors = new List<string>();

            if (!context.Request.Headers.TryGetValue("Accept-Language", out StringValues language) || string.IsNullOrWhiteSpace(language))
            {
                validationErrors.Add("The Accept-Language field is required.");
            }

            if (!context.Request.Headers.TryGetValue("Consumer", out StringValues consumer) || string.IsNullOrWhiteSpace(consumer))
            {
                validationErrors.Add("The Consumer field is required.");
            }

            if (!context.Request.Headers.TryGetValue("TraceId", out StringValues traceId) || string.IsNullOrWhiteSpace(traceId))
            {
                validationErrors.Add("The TraceId field is required.");
            }


            if (validationErrors.Any())
            {
                var response = new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = validationErrors, Code = 400 } // to agree about code
                };
                var json = JsonConvert.SerializeObject(response);
                context.Response.ContentType = "application/json"; 
                await context.Response.WriteAsync(json);
            }
            else
            {
                uiContext.SetLanguage(language);
                uiContext.SetConsumer(consumer);
                uiContext.SetTraceId(traceId);

                await _next(context);
            }
        }
    }
}
