//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Models.Catalog.Internal
{
    [ExcludeFromCodeCoverage]
    public class NodeModel
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public List<NodeModel> Children { get; set; }
    }
}
