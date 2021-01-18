using DigitalCommercePlatform.UIService.Browse.DTO;
using DigitalFoundation.Core.Models.DTO.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

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
