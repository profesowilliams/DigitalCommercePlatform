using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace DigitalCommercePlatform.UIServices.Account.Models.Carts
{
    public class CartModel
    {
        public SavedCarts SavedCarts { get; set; }
    }
    public class SavedCarts
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public int LineCount { get; set; }
        public List<SavedCartLine> details { get; set; }
    }

    public class SavedCartLine
    {
        public long Id { get; set; }
        public int LineNumber { get; set; }
        public string MaterialId { get; set; }
        public int ParentLineNumber { get; set; }
        [Range(1, 99999)]
        public int Quantity { get; set; }
        public string BestPrice { get; set; }
        public string MSRP { get; set; }
        public string MaterialNumber { get; set; }
    }

    public class UserSavedCartsModel
    {
        public IList<SavedCarts> SavedCarts { get; set; }
        public int TotalNumberOfSavedCarts { get; }
        public string Error { get; set; }
    }
}
