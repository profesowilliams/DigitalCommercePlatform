//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Internal
{
    [ExcludeFromCodeCoverage]
    public class MarginModel
    {
        public MarginType TypeMargin { get; set; }
        public decimal Amount { get; set; }
        public decimal Percent { get; set; }
    }
}
