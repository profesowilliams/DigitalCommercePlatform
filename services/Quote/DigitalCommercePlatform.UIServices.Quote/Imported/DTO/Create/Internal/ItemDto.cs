using DigitalFoundation.App.Services.Quote.DTO.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO.Create
{
    [ExcludeFromCodeCoverage]
    public class ItemDto
    {
        public string Id { get; set; }
        public string Parent { get; set; }
        public List<ProductDto> Product { get; set; }
        public decimal Quantity { get; set; }
        public string ContractNumber { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public List<ReferenceDto> References { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal UnitListPrice { get; set; }
        public decimal ExtendedListPrice { get; set; }
        public EndUserDto EndUser { get; set; }

    }
}
