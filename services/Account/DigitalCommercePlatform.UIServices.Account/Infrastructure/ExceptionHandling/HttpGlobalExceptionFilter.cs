using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.ExceptionHandling
{
    [ExcludeFromCodeCoverage]
    public class HttpGlobalExceptionFilter : IExceptionFilter
    {
        private readonly ILogger<HttpGlobalExceptionFilter> _logger;
        private readonly IServiceProvider _serviceProvider;

        public HttpGlobalExceptionFilter(IServiceProvider serviceProvider, ILogger<HttpGlobalExceptionFilter> logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _serviceProvider = serviceProvider;
        }

        public void OnException(ExceptionContext context)
        {
            var uiContext = _serviceProvider.GetService(typeof(IUIContext)) as IUIContext;
            if (context.Exception is ValidationException validationException)
            {
                _logger.LogError(context.Exception, "Validation Exception at: " + nameof(HttpGlobalExceptionFilter));
                var messages = validationException.Errors.Select(e => "UserId : " + uiContext.User.ID + " for TraceId : " + uiContext.TraceId + " " + e.ErrorMessage).ToList();
                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = messages, Code = 400 }
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }
            else if (context.Exception is RemoteServerHttpException remoteServerException)
            {
                _logger.LogError(remoteServerException.Message, "UI Service Exception at: " + nameof(HttpGlobalExceptionFilter));
                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = new List<string> { "UserId : " + uiContext.User.ID + " for TraceId : " + uiContext.TraceId + " " + remoteServerException.Message }, Code = (int)remoteServerException.Code }
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }
            else if (context.Exception is UIServiceException uiServiceException)
            {
                _logger.LogError(context.Exception, "UI Service Exception at: " + nameof(HttpGlobalExceptionFilter));
                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = new List<string> { "UserId : " + uiContext.User.ID + " for TraceId : " + uiContext.TraceId + " " + uiServiceException.Message }, Code = uiServiceException.ErrorCode }
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }
            else
            {
                _logger.LogError(context.Exception, "Exception at: " + nameof(HttpGlobalExceptionFilter));

                context.Result = new ObjectResult(new ResponseBase<object>
                {
                    Error = new ErrorInformation { IsError = true, Messages = new List<string> { "UserId : " + uiContext.User.ID + " for TraceId : " + uiContext.TraceId + " Something went wrong" }, Code = 500 }
                });
                context.HttpContext.Response.StatusCode = (int)HttpStatusCode.OK;
            }

            context.ExceptionHandled = true;
        }
    }
}
