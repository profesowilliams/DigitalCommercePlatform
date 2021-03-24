using DigitalFoundation.Common.Contexts;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure
{
    [ExcludeFromCodeCoverage]
    public static class UIContextExtension
    {
        public static void SetContextFromRequest(this IContext context, RequestHeaders headers)
        {
            var uiContext = context as IUIContext;

            if(uiContext == null)
            {
                throw new ArgumentException("Context is not of type IUIContext");
            }

            uiContext.SetAccessToken(uiContext?.User?.AccessToken);
            uiContext.SetConsumer(headers?.Consumer);
            uiContext.SetLanguage(headers?.Language);
            uiContext.SetTraceId(headers?.TraceId);
        }
    }
}
