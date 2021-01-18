using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
using MediatR;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Request
{
    public class GetBrowseRequest : IRequest<GetBrowseResponse>
    {
        public string Id { get; set; }
        public string SalesOrganization { get; set; }
        public string Country { get; set; }
        public string Language { get; set; }
    }
}