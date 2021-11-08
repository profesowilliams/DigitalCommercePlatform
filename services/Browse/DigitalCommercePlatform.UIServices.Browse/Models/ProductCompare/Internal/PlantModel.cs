//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Models.Product.ProductCompare.Internal;

namespace DigitalCommercePlatform.UIServices.Browse.Models.ProductCompare.Internal
{
    public class PlantModel
    {
        public string Name { get; set; }
        public int Quantity { get; set; }
        public OnOrderModel OnOrder { get; set; }
    }
}