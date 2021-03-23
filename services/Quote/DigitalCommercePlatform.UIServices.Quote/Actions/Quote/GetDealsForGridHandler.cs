using MediatR;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Quote.Actions.Quote
{
    public class GetDealsForGridRequest : IRequest<GetDealsForGridResponse>
    {
        public string Creator { get; }

        public GetDealsForGridRequest(string creator)
        {
            Creator = creator;
        }
    }

    public class GetDealsForGridResponse
    {
        public string Content { get; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public GetDealsForGridResponse(string json)
        {
            Content = json;
        }
    }

    public class GetDealsForGridHandler : IRequestHandler<GetDealsForGridRequest, GetDealsForGridResponse>
    {
        public GetDealsForGridHandler()
        {
        }

        public async Task<GetDealsForGridResponse> Handle(GetDealsForGridRequest request, CancellationToken cancellationToken)
        {
            string dir = System.IO.Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location);
            string filename = dir + @"\Demo\Deals.json";
            using (var reader = File.OpenText(filename))
            {
                var fileContent = await reader.ReadToEndAsync();
                var result = new GetDealsForGridResponse(fileContent);
                return result;
            }
        }
    }
}