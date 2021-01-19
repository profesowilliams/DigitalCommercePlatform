using DigitalCommercePlatform.UIServices.Order.Helpers;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Serilog.Events;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Order.Tests.HelpersTests
{
    public class LogHelperTests
    {
        [Trait("Category", "Exception Test")]
        [Fact(DisplayName = "Execute Health Check with null-httpcontext")]
        public void ExcludeHealthChecksFailTests()
        {
            Action action = () => _ = LogHelper.ExcludeHealthChecks(null, 100, null);
            action.Should().Throw<ArgumentNullException>("HttpContext");
        }

        [Theory(DisplayName = "Execute Health Check"), MemberData(nameof(GetData))]
        public void ExcludeHealthChecksTests(HttpContext context, Exception ex, LogEventLevel expected)
        {
            var result = LogHelper.ExcludeHealthChecks(context, 100, ex);
            result.Should().NotBeNull().And.Be(expected);
        }

        public static TheoryData<HttpContext, Exception, LogEventLevel> GetData()
        {
            var data = new TheoryData<HttpContext, Exception, LogEventLevel>();
            data.Add(GetHttpContext(500, string.Empty), null, LogEventLevel.Error);
            data.Add(GetHttpContext(200, string.Empty), new ArgumentException(nameof(data)), LogEventLevel.Error);
            data.Add(GetHttpContext(200, string.Empty), null, LogEventLevel.Information);
            data.Add(GetHttpContext(200, "Test String"), null, LogEventLevel.Information);
            data.Add(GetHttpContext(200, "Health checks"), null, LogEventLevel.Verbose);
            data.Add(GetHttpContext(200, "Health Checks"), null, LogEventLevel.Information);

            return data;
        }

        private static HttpContext GetHttpContext(int statusCode, string endpointDisplayName)
        {
            var context = new DefaultHttpContext();
            context.Response.StatusCode = statusCode;

            if (!string.IsNullOrWhiteSpace(endpointDisplayName))
            {
                context.SetEndpoint(new Endpoint(null, null, endpointDisplayName));
            }

            return context;
        }
    }
}