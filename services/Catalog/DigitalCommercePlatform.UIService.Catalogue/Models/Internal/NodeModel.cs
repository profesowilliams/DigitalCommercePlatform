using System.Collections.Generic;

namespace DigitalCommercePlatform.UIService.Catalogue.Models.Internal
{
    public class NodeModel
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public List<NodeModel> Children { get; set; }
    }
}
