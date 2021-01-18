using MediatR;

namespace DigitalCommercePlatform.UIServices.Security.Features.Security.Queries.GetUser
{
    public class GetUserQuery : IRequest<GetUserResponse>
    {
        public string ApplicationName { get; }
        public string Authorization { get; }


        public GetUserQuery(string applicationName, string authorization)
        {
            ApplicationName = applicationName;
            Authorization = authorization;
        }
    }
}
