//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal
{
    [ExcludeFromCodeCoverage]
    public class Product
    {
        public string Type { get; set; }
        public string Name { get; set; }
        public string Manufacturer { get; set; }
        public string Id { get; set; }
        public string LocalManufacturer { get; set; }         
        
    }
}
