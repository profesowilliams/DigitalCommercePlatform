using DigitalFoundation.App.Services.Quote.Models.Quote.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.Models.Create
{
    [ExcludeFromCodeCoverage]
    public class ItemModel
    {
        public string Id { get; set; }
        public string Parent { get; set; }
        public List<ProductModel> Product { get; set; }
        public decimal Quantity { get; set; }
        public string ContractNumber { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public List<ReferenceModel> References { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal UnitListPrice { get; set; }
        public decimal ExtendedListPrice { get; set; }
        public EndUserModel EndUser { get; set; }

    }
}
