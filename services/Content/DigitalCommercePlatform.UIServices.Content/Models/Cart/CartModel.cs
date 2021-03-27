using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Content.Models.Cart.Internal;

namespace DigitalCommercePlatform.UIServices.Content.Models.Cart
{
    [ExcludeFromCodeCoverage]

    public class Cart123
    {
        public CartModel[] Data { get; set; }
    }
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
    public string status { get; set; }
    public DateTime expireDate { get; set; }
    public DateTime syncDate { get; set; }





    //public SourceModel Source { get; set; }
    //    public bool Default { get; set; }
    //    public string CustomerNo { get; set; }
    //    public string UserId { get; set; }
    //    public string Name { get; set; }
    //    public string Type { get; set; }
    //    public IList<LineModel> Lines { get; set; }
    //    public int NumberOfLines { get; set; }
    //    public decimal TotalQuantity { get; set; }
    //    public string Currency { get; set; }
    //    public string Status { get; set; }
    //    public DateTime ExpireDate { get; set; }
    //    public DateTime SyncDate { get; set; }
    }
}