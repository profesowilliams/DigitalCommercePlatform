//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Content.Actions;
using DigitalCommercePlatform.UIServices.Content.Actions.CreateCartByQuote;
using DigitalCommercePlatform.UIServices.Content.Actions.ReplaceCartQuotes;
using DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails;
using DigitalCommercePlatform.UIServices.Content.Actions.TypeAhead;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Models.Search;
using System.Collections.Generic;
using System.Threading.Tasks;


namespace DigitalCommercePlatform.UIServices.Content.Services
{
    public interface IContentService
    {
        public Task<SavedCartDetailsModel> GetSavedCartDetails(GetSavedCartDetails.Request request);
        public Task<IEnumerable<TypeAheadSuggestion>> GetTypeAhead(TypeAheadSearch.Request request);
        public Task<ActiveCartModel> GetActiveCartDetails();
        Task<AddCartItem.Response> AddItemCart(AddCartItem.Request request);
        Task<GetCreateCartByQuote.Response> CreateCartByQuote(string QuoteId);
        public Task<bool> ReplaceCart(string id);
    }
}
