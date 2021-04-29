using DigitalCommercePlatform.UIServices.Content.Models.Cart.Internal;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Cart
{
    [ExcludeFromCodeCoverage]
    public class CartModel
    {

        public SourceModel source { get; set; }
        public bool Default { get; set; }
        public string customerNo { get; set; }
        public string userId { get; set; }
        public string name { get; set; }
        public string type { get; set; }
        public LineModel[] lines { get; set; }
        public int numberOfLines { get; set; }
        public float totalQuantity { get; set; }
        public string currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
        public string status { get; set; }
        public DateTime expireDate { get; set; }
        public DateTime syncDate { get; set; }
    }
}