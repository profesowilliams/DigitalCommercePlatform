using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class GetConfigurationsForModel
    {
        public IList<GetConfigurationsForItem> Items { get; set; }
        public int TotalNumberOfConfigurationsItems { get; internal set; }

    }

    [ExcludeFromCodeCoverage]
    public class GetConfigurationsForItem
    {
        public long Id { get; set; }
        public string Name { get; set; }

    }
}
