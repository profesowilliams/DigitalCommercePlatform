using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Carts
{
    [ExcludeFromCodeCoverage]
   
    public class SavedCartDetailsModel
    {
        public SourceModel Source { get; set; }
        public string Name { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SavedCartsResponse
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SourceModel
    {
        public string Id { get; set; }
    }
}
