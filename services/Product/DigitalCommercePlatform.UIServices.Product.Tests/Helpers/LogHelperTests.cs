//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Order.Helpers;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using System;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Product.Tests.Helpers
{
    public class LogHelperTests
    {
        [Theory]
        [AutoDomainData]
        public void ExcludeHealthChecksReturnsError(HttpContext httpContext)
        {
            //Arrange and Act
            var response = LogHelper.ExcludeHealthChecks(httpContext, 0, new ArgumentException("test exception"));
            //Assert
            response.Should().Be(Serilog.Events.LogEventLevel.Error);
        }

        [Fact]
        public void ExcludeHealthChecksReturnsInformation()
        {
            //Arrange and Act
            var response = LogHelper.ExcludeHealthChecks(new DefaultHttpContext(), 0, null);
            //Assert
            response.Should().Be(Serilog.Events.LogEventLevel.Information);
        }
    }
}