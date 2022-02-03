//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Catalog
{
    [ExcludeFromCodeCoverage]
    public class CategoryDto
    {
        public string CssName { get; set; }
        public long Id { get; set; }
        public bool IsLeaf { get; set; }
        public string Name { get; set; }
        public CategoryDto[] Subcategories { get; set; }
    }
}
