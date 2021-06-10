using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Catalogue
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
        public class ProductCatalog
    {
        public int Level { get; set; }
        public bool ShortenSubcategories { get; set; }
        public string CultureName { get; set; }
        public string CorporateCode { get; set; }
        public string Id { get; set; }
    }
}
