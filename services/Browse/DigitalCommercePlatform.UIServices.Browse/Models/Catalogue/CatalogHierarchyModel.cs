using System.Collections.Generic;
using DigitalCommercePlatform.UIService.Browse.Models.Catalogue.Internal;

namespace DigitalCommercePlatform.UIService.Browse.Models.Catalogue
{
    public class CatalogHierarchyModel
    {
        public SourceModel Source { get; set; }
        public Dictionary<string, List<NodeModel>> Localizations { get; set; }
    }
}
