using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Services
{
    public interface ICartService
    {
        Task<ActiveCartModel> GetActiveCart();
        Task<SavedCartDetailsModel> GetSavedCartDetails(string cartId);
    }
}
