using MediatR;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken
{
    [ExcludeFromCodeCoverage]

    public class GetTokenQuery : IRequest<GetTokenResponse>
    {
        public string Code { get; }
        public string RedirectUri { get; }
        public string SessionId { get; }
        public bool? WithUserData { get; }



        public GetTokenQuery(string code, string redirectUri,string sessionId, bool? withUserData)
        {
            Code = code;
            RedirectUri = redirectUri;
            SessionId = sessionId;
            WithUserData = withUserData;
        }
    }
}
