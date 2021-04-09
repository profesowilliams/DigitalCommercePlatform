using DigitalFoundation.Common.Contexts;

namespace DigitalCommercePlatform.UIServices.Quote.Infrastructure
{
    public static class UIContextExtension
    {
        public static void SetContextFromRequest(this IUIContext context, RequestHeaders headers)
        {
            context.SetAccessToken(context?.User?.AccessToken);
            context.SetConsumer(headers?.Consumer);
            context.SetLanguage(headers?.Language);
            context.SetTraceId(headers?.TraceId);
        }
    }
}
