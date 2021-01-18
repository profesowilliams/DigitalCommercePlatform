using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Security.Infrastructure
{
    public class HttpGlobalExceptionFilter : IExceptionFilter
    {
        private readonly IWebHostEnvironment _env;
        private readonly ILogger<HttpGlobalExceptionFilter> _logger;

        public HttpGlobalExceptionFilter(IWebHostEnvironment env, ILogger<HttpGlobalExceptionFilter> logger)
        {
            _env = env;
            _logger = logger;
        }

        public void OnException(ExceptionContext context)
        {
            //_logger.LogError(new EventId(context.Exception.HResult),
            //    context.Exception,
            //    context.Exception.Message);

            //if (context.Exception.GetType() == typeof(Exception))
            //{
            //    var problemDetails = new ValidationProblemDetails()
            //    {
            //        Instance = context.HttpContext.Request.Path,
            //        Status = StatusCodes.Status400BadRequest,
            //        Detail = "Please refer to the errors property for additional details."
            //    };

            //    problemDetails.Errors.Add("Validations", new string[] { context.Exception.Message.ToString() });

            //    context.Result = new BadRequestObjectResult(problemDetails);
            //    context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //}
            //else
            //{
            //    var json = new JsonErrorResponse
            //    {
            //        Messages = new[] { "An error occur.Try it again." }
            //    };

            //    if (_env.IsDevelopment())
            //    {
            //        json.DeveloperMessage = context.Exception;
            //    }

            //    context.Result = new ObjectResult(json) { StatusCode = 500 }; 
            //    context.HttpContext.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            //}

            //context.HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            //context.ExceptionHandled = true;
        }

        //private class JsonErrorResponse
        //{
        //    public string[] Messages { get; set; }

        //    public object DeveloperMessage { get; set; }
        //}
    }

    
}
