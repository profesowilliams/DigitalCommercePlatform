using DigitalCommercePlatform.UIServices.Content.Actions.Abstract;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;

namespace DigitalCommercePlatform.UIServices.Content.Infrastructure.ExceptionHandling
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
                _logger.LogError(context.Exception, "Validation Exception at: " + nameof(HttpGlobalExceptionFilter));
                var messages = validationException.Errors.Select(e => e.ErrorMessage).ToList();

                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = messages, Code = 400 }
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }
            else if (context.Exception is UIServiceException uiServiceException)
            {
                _logger.LogError(context.Exception, "UI Service Exception at: " + nameof(HttpGlobalExceptionFilter));
                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = new List<string> { uiServiceException.Message }, Code = uiServiceException.ErrorCode }
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }
            else
            {
                _logger.LogError(context.Exception, "Exception at: " + nameof(HttpGlobalExceptionFilter));

                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = new List<string> { "Something went wrong" }, Code = 500 }
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }

            context.ExceptionHandled = true;
        }
    }
}
