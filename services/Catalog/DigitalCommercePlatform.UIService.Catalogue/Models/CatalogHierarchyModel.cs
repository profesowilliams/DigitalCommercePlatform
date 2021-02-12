using System.Collections.Generic;
using DigitalCommercePlatform.UIService.Catalogue.Models.Internal;

namespace DigitalCommercePlatform.UIService.Catalogue.Models
{
    public class CatalogHierarchyModel
    {
        public SourceModel Source { get; set; }
        public Dictionary<string, List<NodeModel>> Localizations { get; set; }
    }
}
