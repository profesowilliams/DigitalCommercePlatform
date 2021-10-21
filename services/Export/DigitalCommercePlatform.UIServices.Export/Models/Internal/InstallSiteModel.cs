//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class InstallSiteModel
    {
        public string Id { get; set; }
        public string Location { get; set; }
        public bool? Incumbent { get; set; }
    }
}
    
