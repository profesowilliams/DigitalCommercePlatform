//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Order.Infrastructure.Filters
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
            var validationErrors = new Dictionary<string, string[]>();

            if (!context.HttpContext.Request.Headers.TryGetValue("Accept-Language", out StringValues language) || string.IsNullOrWhiteSpace(language))
            {
                validationErrors.Add("Accept-Language", new string[] { "The Accept-Language field is required." });
            }

            if (!context.HttpContext.Request.Headers.TryGetValue("Consumer", out StringValues consumer) || string.IsNullOrWhiteSpace(consumer))
            {
                validationErrors.Add("Consumer", new string[] { "The Consumer field is required." });
            }

            if (!context.HttpContext.Request.Headers.TryGetValue("TraceId", out StringValues traceId) || string.IsNullOrWhiteSpace(traceId))
            {
                validationErrors.Add("TraceId", new string[] { "The TraceId field is required." });
            }

            if (validationErrors.Any())
            {
                var validationProblemDetails = new ValidationProblemDetails(validationErrors);
                context.Result = new BadRequestObjectResult(validationProblemDetails);
                return;
            }

            _uiContext.SetLanguage(language);
            _uiContext.SetConsumer(consumer);
            _uiContext.SetTraceId(traceId);
            _uiContext.SetImpersonatedAccount(_uiContext.User.Customers?.FirstOrDefault());
            _uiContext.SetAccessToken(_uiContext.User.AccessToken);

            await next();
        }
    }
}