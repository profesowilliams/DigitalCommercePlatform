//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal.Product
{
    [ExcludeFromCodeCoverage]
    public class ProductData
    {
        public ProductsModel[] Data { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class ProductsModel
    {
        public SourceModel Source { get; set; }
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Description { get; set; }
        public string ShortDescription { get; set; }
        public string GlobalManufacturer { get; set; }
        public string ManufacturerPartNumber { get; set; }
    }
}

