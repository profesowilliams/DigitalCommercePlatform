//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class QuoteModel
    {
        public SourceModel Source { get; set; }
        public string Status { get; set; }
        public decimal Price { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class Quote
    {
        public List<QuoteModel> Data { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SourceModel
    {
        public string ID { get; set; }
        public string System { get; set; }
        public string SalesOrg { get; set; }
        public string TargetSystem { get; set; }
        public string Key { get; set; }
    }
}
