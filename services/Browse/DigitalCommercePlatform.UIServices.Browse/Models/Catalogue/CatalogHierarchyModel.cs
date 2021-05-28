using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Browse.Models.Catalog.Internal;

namespace DigitalCommercePlatform.UIService.Browse.Models.Catalog
{
    [ExcludeFromCodeCoverage]
    public class CatalogHierarchyModel
    {
        public SourceModel Source { get; set; }
        public Dictionary<string, List<NodeModel>> Localizations { get; set; }
    }
}
