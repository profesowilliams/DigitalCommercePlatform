using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationsSummaryModel
    {
        public int Quoted { get; set; }
        public int UnQuoted { get; set; }
        public int OldConfigurations { get; set; }
    }
}
