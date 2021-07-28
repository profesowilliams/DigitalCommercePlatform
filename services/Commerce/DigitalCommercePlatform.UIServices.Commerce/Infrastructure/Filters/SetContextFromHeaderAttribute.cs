using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Services.Actions.Abstract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Filters
{
    [ExcludeFromCodeCoverage]
    public class SetContextFromHeaderAttribute : TypeFilterAttribute
    {
        public SetContextFromHeaderAttribute() : base(typeof(SetContextFromHeaderFilter))
        {
        }
    }

    [ExcludeFromCodeCoverage]
    public class SetContextFromHeaderFilter : IAsyncActionFilter
    {
        private readonly IUIContext _uiContext;

        public SetContextFromHeaderFilter(IUIContext uiContext)
        {
            _uiContext = uiContext ?? throw new ArgumentNullException(nameof(uiContext));
            if (uiContext.User == null) { throw new ArgumentException("User is missing from the context!"); }
            if (string.IsNullOrWhiteSpace(uiContext.User.AccessToken)) { throw new ArgumentException("AccessToken is missing from the context!"); }
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var validationErrors = new List<string>();

            if (!context.HttpContext.Request.Headers.TryGetValue("Accept-Language", out StringValues language) || string.IsNullOrWhiteSpace(language))
            {
                validationErrors.Add("The Accept-Language field is required.");
            }

            if (!context.HttpContext.Request.Headers.TryGetValue("Consumer", out StringValues consumer) || string.IsNullOrWhiteSpace(consumer))
            {
                validationErrors.Add("The Consumer field is required.");
            }

            if (!context.HttpContext.Request.Headers.TryGetValue("TraceId", out StringValues traceId) || string.IsNullOrWhiteSpace(traceId))
            {
                validationErrors.Add("The TraceId field is required.");
            }

            if (validationErrors.Any())
            {
                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = validationErrors, Code = 432121 } // to agree about code
                });
                return;
            }

            _uiContext.SetLanguage(language);
            _uiContext.SetConsumer(consumer);
            _uiContext.SetTraceId(traceId);
            _uiContext.SetCustomerId(_uiContext.User.Customers?.FirstOrDefault());
            _uiContext.SetAccessToken(_uiContext.User.AccessToken);

            await next();
        }
    }
}