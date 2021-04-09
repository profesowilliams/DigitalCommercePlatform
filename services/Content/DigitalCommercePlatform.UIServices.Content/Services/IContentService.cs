using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Content.Services
{
    public interface IContentService
    {
        public Task<Actions.GetCartDetails.GetCart.Response> GetCartDetails(Actions.GetCartDetails.GetCart.Request request);
    }
}
