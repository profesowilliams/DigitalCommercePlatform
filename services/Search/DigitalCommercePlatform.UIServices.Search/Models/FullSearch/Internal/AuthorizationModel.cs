//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal
{
    [ExcludeFromCodeCoverage]
    public class AuthorizationModel
    {
        public bool CanOrder { get; set; }
        public bool CanViewPrice { get; set; }
    }
}
