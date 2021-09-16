//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class CategoryBreadcrumbDto
    {
        public string Type { get; set; }
        public string Id { get; set; }
        public string Name { get; set; }
        public CategoryBreadcrumbDto ChildCategory { get; set; }
    }
}
