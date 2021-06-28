namespace DigitalCommercePlatform.UIServices.Common.Product.Models.Catalog
{
    class CategoryDto
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
