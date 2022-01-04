//2022 (c) Tech Data Corporation - All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class IndicatorFlags
    {
        public bool New { get; set; }

        public bool Returnable { get; set; }

        public bool EndUserRequired { get; set; }

        public bool Refurbished { get; set; }

        public bool DropShip { get; set; }

        public bool Warehouse { get; set; }

        public bool Virtual { get; set; }
        public bool FreeShipping { get; set; }
        public string FreeShippingLabel { get; set; }
    }
}