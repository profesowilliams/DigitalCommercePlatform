using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Catalog.Internal
{
    [ExcludeFromCodeCoverage]
    public class NodeDto
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public IList<NodeDto> Children { get; set; }
    }
}
