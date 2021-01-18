using DigitalCommercePlatform.UIService.Browse.DTO;
using DigitalFoundation.Core.Models.DTO.Common;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.Browses.GetBrowse
{
    public class GetBrowseResponse : Response<BrowseDto>
    {
        public GetBrowseResponse()
        {
        }

        public GetBrowseResponse(BrowseDto model)
        {
            ReturnObject = model;
        }
    }
}