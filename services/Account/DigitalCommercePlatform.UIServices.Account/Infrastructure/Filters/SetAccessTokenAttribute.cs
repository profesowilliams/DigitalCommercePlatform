using DigitalFoundation.Common.Contexts;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Account.Infrastructure.Filters
{
    [ExcludeFromCodeCoverage]
    public class SetAccessTokenAttribute : TypeFilterAttribute
    {
        public SetAccessTokenAttribute() : base(typeof(SetAccessTokenFilter))
        {
        }
    }

    [ExcludeFromCodeCoverage]
    public class SetAccessTokenFilter : IAsyncActionFilter
    {
        private readonly IUIContext _uiContext;

        public SetAccessTokenFilter(IUIContext uiContext)
        {
            _uiContext = uiContext ?? throw new ArgumentNullException(nameof(uiContext));
            if (uiContext.User == null) { throw new ArgumentException("User is missing from the context!"); }
            if (string.IsNullOrWhiteSpace(uiContext.User.AccessToken)) { throw new ArgumentException("AccessToken is missing from the context!"); }
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            _uiContext.SetAccessToken(_uiContext.User.AccessToken);
            await next();
        }
    }
}
