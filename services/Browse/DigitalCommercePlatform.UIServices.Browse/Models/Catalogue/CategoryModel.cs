using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Browse.Models.Catalogue
{
    [ExcludeFromCodeCoverage]
    public class CategoryModel
    {
        public string Key { get; set; }
        public string Name { get; set; }
        public long? DocCount { get; set; }
        public List<CategoryModel> Children { get; set; }
    }
}
