//2022 (c) Tech Data Corporation - All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Stock
{
    public class LocationModel
    {
        public DateTime? EtaDate { get; set; }
        public string Name { get; set; }
        public int? OnOrder { get; set; }
        public int Quantity { get; set; }
    }
}
