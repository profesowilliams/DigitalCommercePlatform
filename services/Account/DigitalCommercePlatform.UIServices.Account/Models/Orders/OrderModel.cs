//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Orders
{
    [ExcludeFromCodeCoverage]
    public class OrderModel
    {
        public decimal Price { get; set; }
        public string Currency { get; set; } = "USD";
        public string CurrencySymbol { get; set; } = "$";
        public ResellerModel Reseller { get; set; }
        public AddressModel ShipTo { get; set; }
    }


    [ExcludeFromCodeCoverage]
    public class OrdersContainer
    {
        public IEnumerable<OrderModel> Data { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class AddressModel
    {
        public string Name { get; set; }        
    }

    [ExcludeFromCodeCoverage]
    public class ResellerModel
    {
        public string Name { get; set; }
    }
}
