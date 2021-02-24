using MediatR;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    [ExcludeFromCodeCoverage]

    public class GetUserQuery : IRequest<GetUserResponse>
    {
        public string ApplicationName { get; }
        public string SessionId { get; }


        public GetUserQuery(string applicationName, string sessionId)
        {
            ApplicationName = applicationName;
            SessionId = sessionId;
        }
    }
}
