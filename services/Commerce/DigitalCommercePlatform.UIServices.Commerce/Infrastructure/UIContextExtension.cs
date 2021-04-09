using DigitalFoundation.Common.Contexts;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public static class UIContextExtension
    {
        public static void SetContextFromRequest(this IUIContext context, RequestHeaders headers)
        {
            context.SetAccessToken(context?.User?.AccessToken);
            context.SetConsumer(headers?.Consumer);
            context.SetLanguage(headers?.Language);
            context.SetTraceId(headers?.TraceId);
        }

        public static void SetContext(this IUIContext context, string consumer, string language, string traceId, string accessToken = null)
        {
            context.SetConsumer(consumer);
            context.SetLanguage(language);
            context.SetTraceId(traceId);
            context.SetAccessToken(accessToken);
        }
    }
}
