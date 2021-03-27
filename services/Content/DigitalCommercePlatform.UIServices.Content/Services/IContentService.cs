using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Models;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Content.Services
{
    public interface IContentService
    {
        public Task<Rootobject> GetCartDetails(GetCart.Request request);
    }
}
