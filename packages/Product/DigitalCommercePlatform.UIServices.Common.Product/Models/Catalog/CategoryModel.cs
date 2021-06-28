using DigitalFoundation.Common.Models;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Common.Product.Models.Catalog
{
    public class CatalogModel
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public long? DocCount { get; set; }
        public List<CatalogResponse> Catalogs { get; set; }
    }

    public class CatalogDto
    {
        public List<Catalog> Catalogs { get; set; }
    }

    public class Catalog
    {
        public Source Source { get; set; }
        public List<CategoryModel> Categories { get; set; }
    }

    public class CategoryModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public long? ProductCount { get; set; }
        public List<CategoryModel> Children { get; set; }
    }


    public class CatalogResponse
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public long? DocCount { get; set; }
        public List<CatalogResponse> Children { get; set; }
    }

}
