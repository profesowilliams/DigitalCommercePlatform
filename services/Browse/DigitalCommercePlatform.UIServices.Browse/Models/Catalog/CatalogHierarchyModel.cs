//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog.Internal;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Catalog
{
    [ExcludeFromCodeCoverage]
    public class CatalogHierarchyModel
    {
        public SourceModel Source { get; set; }
        public Dictionary<string, List<NodeModel>> Localizations { get; set; }
    }
}
