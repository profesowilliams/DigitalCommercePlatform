//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductNoteModel
    {
        public string Type { get; set; }
        public string Note { get; set; }
        public DateTime Updated { get; set; }
    }
}
