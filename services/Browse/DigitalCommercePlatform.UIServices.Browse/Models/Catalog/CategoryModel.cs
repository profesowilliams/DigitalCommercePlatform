//2022 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalFoundation.Common.Features.Contexts.Models;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Catalog
{
    [ExcludeFromCodeCoverage]
    public class CatalogModel
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public long? DocCount { get; set; }
        public List<CatalogResponse> Catalogs { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class CatalogDto
    {
        public List<Catalog> Catalogs { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class Catalog
    {
        public Source Source { get; set; }
        public List<CategoryModel> Categories { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class CategoryModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public long? ProductCount { get; set; }
        public List<CategoryModel> Children { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class CatalogResponse
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public long? DocCount { get; set; }
        public List<CatalogResponse> Children { get; set; }
    }
}