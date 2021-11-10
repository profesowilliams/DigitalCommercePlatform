//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Models.Configurations
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationsSummaryModel
    {
        public int Quoted { get; set; }
        public int UnQuoted { get; set; }
        public int OldConfigurations { get; set; }
        public string CurrencyCode { get; set; }
       
    }

    [ExcludeFromCodeCoverage]
    public class Response
    {
        public int Unquoted { get; set; }
        public int Quoted { get; set; }
        public int Inactive { get; set; }
    }
}
