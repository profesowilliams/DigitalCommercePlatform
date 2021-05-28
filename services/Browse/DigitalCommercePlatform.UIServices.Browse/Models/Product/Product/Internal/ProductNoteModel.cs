using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class ProductNoteModel
    {
        public string Type { get; set; }
        public string Note { get; set; }
        public DateTime Updated { get; set; }
    }
}