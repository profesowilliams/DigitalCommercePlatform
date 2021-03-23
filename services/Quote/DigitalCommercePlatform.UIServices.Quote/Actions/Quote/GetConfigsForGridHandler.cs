using MediatR;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public class GetConfigsForGridRequest : IRequest<GetConfigsForGridResponse>
    {
        public string Creator { get; }

        public GetConfigsForGridRequest(string creator)
        {
            Creator = creator;
        }
    }

    public class GetConfigsForGridResponse
    {
        public string Content { get; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public GetConfigsForGridResponse(string json)
        {
            Content = json;
        }
    }

    public class GetConfigsForGridHandler : IRequestHandler<GetConfigsForGridRequest, GetConfigsForGridResponse>
    {
        public GetConfigsForGridHandler()
        {
        }

        public async Task<GetConfigsForGridResponse> Handle(GetConfigsForGridRequest request, CancellationToken cancellationToken)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\Configs.json";
            using (var reader = File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetConfigsForGridResponse(fileContent);
                return result;
            }
        }
    }
}