//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorFlags
    {
        // The suffix "Flag" was added to avoid using C# reserved keywords like new, virtual
        public bool NewFlag { get; set; }

        public bool ReturnableFlag { get; set; }
        public bool EndUserRequiredFlag { get; set; }
        public bool RefurbishedFlag { get; set; }
        public bool DropShipFlag { get; set; }
        public bool WarehouseFlag { get; set; }
        public bool VirtualFlag { get; set; }
    }
}