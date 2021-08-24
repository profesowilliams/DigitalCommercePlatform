//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Content.Models.Cart
{
    [ExcludeFromCodeCoverage]
    public class SavedCartDetailsModel
    {
        public List<SavedCartLineModel> Items { get; set; }
        public SourceModel Source { get; set; }
        public string Name { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class SavedCartLineModel
    {
        public string ItemId { get; set; }
        public string ParentItemId { get; set; }
        public string ProductId { get; set; }
        public int Quantity { get; set; }
    }
    [ExcludeFromCodeCoverage]
    public class SourceModel
    {
        public string Id { get; set; }
        public string System { get; set; }
    }
}
