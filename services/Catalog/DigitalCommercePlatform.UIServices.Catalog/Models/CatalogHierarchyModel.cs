using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIService.Catalog.Models.Internal;

namespace DigitalCommercePlatform.UIService.Catalog.Models
{
    [ExcludeFromCodeCoverage]
    public class CatalogHierarchyModel
    {
        public SourceModel Source { get; set; }
        public Dictionary<string, List<NodeModel>> Localizations { get; set; }
    }
}