using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
using MediatR;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Browse.GetBrowse
{
    public class GetBrowseRequest : IRequest<GetBrowseResponse>
    {        public string Id { get; set; }
    }
}
