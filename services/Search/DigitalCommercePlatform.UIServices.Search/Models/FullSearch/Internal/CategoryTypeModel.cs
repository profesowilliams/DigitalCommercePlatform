//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class CategoryTypeModel
    {
        public string Type { get; set; }
        public List<CategoryModel> Matching { get; set; }
    }
}
