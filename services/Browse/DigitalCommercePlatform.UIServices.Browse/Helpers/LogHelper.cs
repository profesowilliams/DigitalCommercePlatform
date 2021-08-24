//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Microsoft.AspNetCore.Http;
using Serilog.Events;
using System;

namespace DigitalCommercePlatform.UIServices.Order.Helpers
{
    /// <summary>
    /// Helper for filtering out Serilog request logging
    /// https://andrewlock.net/using-serilog-aspnetcore-in-asp-net-core-3-excluding-health-check-endpoints-from-serilog-request-logging/
    /// </summary>
    ///
    public static class LogHelper
    {
        private static bool IsHealthCheckEndpoint(HttpContext ctx)
        {
            var endpoint = ctx.GetEndpoint();
            if (endpoint is object) // same as !(endpoint is null)
            {
                return string.Equals(
                    endpoint.DisplayName,
                    "Health checks",
                    StringComparison.Ordinal);
            }
            // No endpoint, so not a health check endpoint
            return false;
        }

        public static LogEventLevel ExcludeHealthChecks(HttpContext ctx, double _, Exception ex)
        {
            if (ex != null || ctx.Response.StatusCode > 499)
                return LogEventLevel.Error;

            return IsHealthCheckEndpoint(ctx) ? LogEventLevel.Verbose : LogEventLevel.Information;
        }
    }
}
