//2022 (c) Tech Data Corporation -. All Rights Reserved.

namespace DigitalCommercePlatform.UIServices.Browse.Models.Catalog
{
    public class ProductCatalogRequest
    {
        public int Level { get; set; }
        public bool ShortenSubcategories { get; set; }
        public string CultureName { get; set; }
        public string CorporateCode { get; set; }
        public string Id { get; set; }
    }
}
