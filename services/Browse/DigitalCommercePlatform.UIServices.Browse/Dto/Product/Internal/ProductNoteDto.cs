//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Dto.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductNoteDto
    {
        public string Type { get; set; }
        public string Note { get; set; }
        public DateTime Updated { get; set; }
    }
}
