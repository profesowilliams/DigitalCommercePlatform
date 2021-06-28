using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Common.Product.Models.Catalog
{
    class CatalogHierarchyModel
    {
        public SourceModel Source { get; set; }
        public Dictionary<string, List<NodeModel>> Localizations { get; set; }
    }
}
