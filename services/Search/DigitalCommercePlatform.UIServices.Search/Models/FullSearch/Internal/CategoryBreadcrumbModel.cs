//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class CategoryBreadcrumbModel
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public CategoryBreadcrumbModel ChildCategory { get; set; }
    }
}
