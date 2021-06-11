using DigitalCommercePlatform.UIServices.Common.Cart.Models.Cart;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Common.Cart.Contracts
{
    public interface ICartService
    {
        Task<ActiveCartModel> GetActiveCartAsync();
        Task<SavedCartDetailsModel> GetSavedCartDetailsAsync(string cartId);
        Task<List<SavedCartDetailsModel>> GetSavedCartListAsync();
    }
}