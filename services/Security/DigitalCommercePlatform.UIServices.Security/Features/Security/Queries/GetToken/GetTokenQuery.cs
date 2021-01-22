using MediatR;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetToken
{
    public class GetTokenQuery : IRequest<GetTokenResponse>
    {
        public string Code { get; }
        public string RedirectUri { get; }
        public string SessionId { get; }


        public GetTokenQuery(string code, string redirectUri,string sessionId)
        {
            Code = code;
            RedirectUri = redirectUri;
            SessionId = sessionId;
        }
    }
}
