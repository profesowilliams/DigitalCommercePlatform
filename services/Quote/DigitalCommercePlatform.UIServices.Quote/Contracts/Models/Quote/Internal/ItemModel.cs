using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.AppServices.Quote.Models.Quote.Internal
{
    [ExcludeFromCodeCoverage]
    public class ItemModel
    {
        public string Id { get; set; }
        public string Group { get; set; }
        public string Solution { get; set; }
        public string Parent { get; set; }
        public List<ProductModel> Product { get; set; }
        public decimal Quantity { get; set; }
        public decimal ConfirmedQuantity { get; set; }
        public string ContractNumber { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public List<ReferenceModel> References { get; set; }
        public string Status { get; set; }
        public string StatusNotes { get; set; }
        public DateTime Updated { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal UnitListPrice { get; set; }
        public decimal ExtendedListPrice { get; set; }
        public List<MarginModel> Margins { get; set; }
        public DateTime Requested { get; set; }
        public string ShippingCondition { get; set; }
        public string ShipFrom { get; set; }
        public EndUserModel EndUser { get; set; }
        public DirectorModel Director { get; set; }
        public DivisionManagerModel DivisionManager { get; set; }
        public BusinessManagerModel BusinessManager { get; set; }
    }
}