using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Content.Services
{
    public interface IContentService
    {
        public Task<CartModel> GetCartDetails(GetCart.Request request);
        public Task<IEnumerable<TypeAheadSuggestion>> GetTypeAhead(TypeAheadSearch.Request request);
        public Task<ActiveCartModel> GetActiveCartDetails();
    }
}
