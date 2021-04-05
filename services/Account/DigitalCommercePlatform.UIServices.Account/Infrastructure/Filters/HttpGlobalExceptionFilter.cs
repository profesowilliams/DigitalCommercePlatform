using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Filters
{
    [ExcludeFromCodeCoverage]
    public class HttpGlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<HttpGlobalExceptionFilter> _logger;

        public HttpGlobalExceptionFilter(ILogger<HttpGlobalExceptionFilter> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public void OnException(ExceptionContext context)
        {
            if (context.Exception is ValidationException validationException)
            {
                var messages = validationException.Errors.Select(e => e.ErrorMessage).ToList();

                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = messages, Code = 500000000 } // agree about code
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }
            else
            {
                _logger.LogError(context.Exception, "Exception at: " + nameof(HttpGlobalExceptionFilter));

                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = new List<string> { "Something went wrong" }, Code = 500000000 } // we need to agree about message
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }

            context.ExceptionHandled = true;
        }
    }
}
