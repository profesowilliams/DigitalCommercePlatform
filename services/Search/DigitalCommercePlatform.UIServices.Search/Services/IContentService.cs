//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions;
using DigitalCommercePlatform.UIServices.Search.Actions.CreateCartByQuote;
using DigitalCommercePlatform.UIServices.Search.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Search.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Search.Models.Cart;
using DigitalCommercePlatform.UIServices.Search.Models.Search;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Search.Services
{
    public interface IContentService
    {
        public Task<SavedCartDetailsModel> GetSavedCartDetails(GetSavedCartDetails.Request request);
        public Task<IEnumerable<TypeAheadSuggestion>> GetTypeAhead(TypeAheadSearch.Request request);
        public Task<ActiveCartModel> GetActiveCartDetails();
        Task<AddCartItem.Response> AddItemCart(AddCartItem.Request request);
        Task<GetCreateCartByQuote.Response> CreateCartByQuote(string QuoteId);
    }
}
