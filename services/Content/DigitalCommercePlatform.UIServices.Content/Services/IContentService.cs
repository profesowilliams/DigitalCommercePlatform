using DigitalCommercePlatform.UIServices.Content.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Content.Services
{
    public interface IContentService
    {
        public Task<CartModel> GetCartDetails(GetCart.Request request);
        public Task<TypeAheadSearch.Response> GetTypeAhead(TypeAheadSearch.Request request);
    }
}
