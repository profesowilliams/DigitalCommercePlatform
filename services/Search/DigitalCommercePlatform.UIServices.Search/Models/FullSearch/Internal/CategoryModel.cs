//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class CategoryModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Level { get; set; }
    }
}
