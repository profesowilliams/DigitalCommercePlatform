using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Common.Product.Models.Catalog
{
    class NodeModel
    {
        public string ID { get; set; }
        public string Name { get; set; }
        public List<NodeModel> Children { get; set; }
    }
}
