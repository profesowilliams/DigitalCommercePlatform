//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class StockDto
    {
        public int Total { get; set; }        
        public int Td { get; set; }
        public int VendorDesignated { get; set; }
    }
}
