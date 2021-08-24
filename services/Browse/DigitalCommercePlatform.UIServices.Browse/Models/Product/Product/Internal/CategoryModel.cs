//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Product.Product.Internal
{
    [ExcludeFromCodeCoverage]
    public class CategoryModel
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string Catalog { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }
        public string[] ParentId { get; set; }
    }
}
