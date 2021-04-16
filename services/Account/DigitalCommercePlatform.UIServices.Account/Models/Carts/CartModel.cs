using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Carts
{
    [ExcludeFromCodeCoverage]
    public class CartModel
    {
        public UserSavedCartsModel UserSavedCarts { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SavedCart
    {
        public long Id { get; set; }
        public string Name { get; set; }
        
    }

    [ExcludeFromCodeCoverage]
    public class UserSavedCartsModel
    {
        public IList<SavedCart> Items { get; set; }
        public int TotalNumberOfSavedCarts { get; internal set; }
       
    }
}
